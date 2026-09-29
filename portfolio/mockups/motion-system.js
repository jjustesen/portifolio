import * as THREE from './motion-vendor/three.module.js';

// Public tokens: one vocabulary shared by the sequence, material and typography.
export const TOKENS={background:'fog',ringRadius:.42,ringGlow:1,caustics:1,bgPointer:1,grain:.28,grainSize:2.5,pointer:2,dissolve:1,chroma:1,duration:3.2,pointerRadius:.19,pointerLag:7,maxDpr:1.5};
const $=id=>document.getElementById(id), clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let calm=reduced.matches,phase='idle',started=0,w=1,h=1,last=0,scroll=0,velocity=0,raf=0;
const mouse=new THREE.Vector2(-2,-2),target=new THREE.Vector2(-2,-2);
const ink=document.createElement('canvas'),ctx=ink.getContext('2d');
const texture=new THREE.CanvasTexture(ink);texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
// Low-res map of type scale per screen region: small text dissolves lighter than display type.
const sizeMap=document.createElement('canvas'),sctx=sizeMap.getContext('2d');
const sizeTexture=new THREE.CanvasTexture(sizeMap);sizeTexture.minFilter=THREE.LinearFilter;sizeTexture.generateMipmaps=false;
const uniforms={uInk:{value:texture},uSizeMap:{value:sizeTexture},uSize:{value:new THREE.Vector2()},uMouse:{value:mouse},uRadius:{value:TOKENS.pointerRadius},uTime:{value:0},uGrain:{value:TOKENS.grain},uChroma:{value:TOKENS.chroma},uBackground:{value:0},uBgPointer:{value:TOKENS.bgPointer},uRingRadius:{value:TOKENS.ringRadius},uRingGlow:{value:TOKENS.ringGlow},uCaustics:{value:TOKENS.caustics},uPointer:{value:1},uDissolve:{value:1},uVelocity:{value:0},uReading:{value:0}};
const vertex=`varying vec2 uvScreen;void main(){uvScreen=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const fragment=`precision highp float;
varying vec2 uvScreen;uniform sampler2D uInk,uSizeMap;uniform vec2 uSize,uMouse;uniform float uTime,uChroma,uBgPointer,uBackground,uRingRadius,uRingGlow,uCaustics,uPointer,uDissolve,uVelocity,uReading,uRadius;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<4;i++){n+=noise(p)*a;p=p*2.03+7.1;a*=.5;}return n;}
// Thermal ramp for dissolving ink: sparse trail is cool (cyan → blue → violet),
// a dark band separates it from the dense core (red → orange → yellow → white).
vec3 thermal(float d){
 vec3 c=mix(vec3(.30,.95,1.),vec3(.12,.30,1.),smoothstep(0.,.18,d));
 c=mix(c,vec3(.32,.06,.78),smoothstep(.18,.34,d));
 c=mix(c,vec3(.06,.02,.14),smoothstep(.34,.46,d));
 c=mix(c,vec3(.86,.14,.08),smoothstep(.46,.60,d));
 c=mix(c,vec3(1.,.56,.10),smoothstep(.60,.74,d));
 c=mix(c,vec3(1.,.92,.56),smoothstep(.74,.88,d));
 return mix(c,vec3(.94),smoothstep(.88,1.,d));}
void main(){vec2 uv=uvScreen;float aspect=uSize.x/uSize.y;vec2 delta=(uv-uMouse)*vec2(aspect,1.);float local=exp(-dot(delta,delta)/(uRadius*uRadius*.5))*uPointer;
float bg;
// Pointer pull on the background: a lens-like push away from the cursor plus a gentle swirl,
// over twice the radius of the text interference.
float bgLocal=exp(-dot(delta,delta)/(uRadius*uRadius*2.))*uPointer*uBgPointer;
vec2 bgWarp=(delta*.9+vec2(-delta.y,delta.x)*.6)*bgLocal;
if(uBackground<.5){
 // Fog: slow monochrome clouds.
 vec2 field=uv*vec2(aspect,1.)*2.3;field+=vec2(sin(uTime*.09),cos(uTime*.07))*.35;field+=bgWarp*2.3;
 float cloud=fbm(field+fbm(field*.85+uTime*.025));float light=smoothstep(.32,.78,cloud);bg=.015+pow(light,2.)*.42;
}else{
 // Light ring: dark smoke, a luminous double-stranded ring brightest at its upper-left arc,
 // and thin caustic filaments like light refracted through water.
 vec2 p=uv*vec2(aspect,1.)+bgWarp*.45;
 float smoke=fbm(p*1.6+fbm(p*1.1+uTime*.015)+vec2(uTime*.02,-uTime*.012));
 float base=.025+pow(smoothstep(.28,.85,smoke),1.6)*.34;
 vec2 q=p-vec2(aspect*.6,.56)-vec2(sin(uTime*.05),cos(uTime*.04))*.015;
 float ang=atan(q.y,q.x),r=length(q);
 // Wobble sampled on the unit circle (not the raw angle) so there is no seam at ±π.
 float wobble=(fbm(vec2(cos(ang),sin(ang))*1.6+uTime*.05+p*1.4)-.5)*.09;
 float d=r-(uRingRadius+wobble);
 float strands=exp(-pow(d/.022,2.))*.9+exp(-pow((d+.07)/.045,2.))*.55;
 float halo=exp(-abs(d+.03)/.12)*.35;
 float arc=.25+.75*smoothstep(-.3,1.,cos(ang-2.2));
 float hot=pow(max(cos(ang-2.0),0.),40.)*exp(-pow(d/.04,2.))*1.4;
 float ring=((strands+halo)*arc+hot)*(.65+.7*fbm(p*7.+uTime*.02))*uRingGlow;
 // Water caustics: an iterated sin/cos warp whose inverse distance concentrates into a web of thin
 // bright filaments; a slow noise mask lets them surface only in some regions.
 // The inverse-distance term is calibrated for coordinates offset far from the origin.
 vec2 cp=p*3.2+vec2(fbm(p*1.5+uTime*.02),fbm(p*1.5-uTime*.02))*1.2-250.,ci=cp;float cw=1.;
 for(int n=0;n<4;n++){
  float ct=uTime*.12*(1.-3.5/float(n+1));
  ci=cp+vec2(cos(ct-ci.x)+sin(ct+ci.y),sin(ct-ci.y)+cos(ct+ci.x));
  cw+=1./length(vec2(cp.x/(sin(ci.x+ct)/.006),cp.y/(cos(ci.y+ct)/.006)));
 }
 cw=1.17-pow(cw/4.,1.4);
 float mask=smoothstep(.35,.65,fbm(p*.8+7.3+uTime*.01));
 float caustic=clamp(pow(abs(cw),9.),0.,1.2)*mask*uCaustics;
 bg=base+ring*.7+caustic*.5;
}
// Soft light where the cursor is.
bg=min(bg+bgLocal*.06,1.);
// A broad reading window; lower lines lose focus before upper lines do.
float bottom=1.-smoothstep(.04,.52,uv.y);
float top=smoothstep(.80,1.,uv.y);
float edge=max(bottom,top)*uReading*uDissolve;
float amount=clamp(edge+local*.48+abs(uVelocity)*.10,0.,1.5);
// Coherent optical drift, not independent high-frequency glyph tearing.
vec2 sampleUv=uv+delta*local*.006;
// Type scale of this region (1 = display type); trail, lateral spread and drift shrink with it.
float typeScale=texture2D(uSizeMap,uv).r;
float soften=amount*typeScale;
sampleUv.x+=sin(uv.y*9.+uTime*.15)*soften*1.2/uSize.x;
float spread=pow(amount,1.35)*34.*typeScale;
vec2 direction=vec2(.32,1.)/uSize;
float blurred=0.,weightSum=0.;
for(int i=0;i<24;i++){
 float t=float(i)/23.;float weight=exp(-t*t*3.5);
 // Sampling up/right leaves a continuous down/left exposure trail.
 vec2 tap=sampleUv+direction*t*spread;
 float soft=texture2D(uInk,tap).a*.6;
 soft+=texture2D(uInk,tap+vec2(.65*soften/uSize.x,0.)).a*.2;
 soft+=texture2D(uInk,tap-vec2(.65*soften/uSize.x,0.)).a*.2;
 blurred+=soft*weight;weightSum+=weight;
}
float ink=texture2D(uInk,sampleUv).a;
float alpha=mix(ink,blurred/weightSum,smoothstep(0.,.3,soften));
float density=alpha;
// Low-frequency fade preserves whole strokes instead of punching holes.
float fade=1.-smoothstep(.12,1.18,edge);
alpha*=fade*(1.-local*.12);
alpha=clamp(alpha,0.,1.);
vec3 mono=mix(vec3(bg),vec3(.94),alpha);
// Color only inside the pointer interference; scroll and edge dissolve stay monochrome.
float chroma=smoothstep(.08,.7,local)*uChroma;
// Hue follows the trail density before fading (hot core, cool trail); the fade only sets how much shows.
vec3 heat=mix(vec3(bg),thermal(clamp(density*1.25-edge*.3,0.,1.)),smoothstep(0.,.5,alpha));
gl_FragColor=vec4(mix(mono,heat,chroma),1.);}`;
// Grain lives on its own layer above every element, text included. The canvas is
// composited with mix-blend-mode: exclusion, so the same noise lightens dark areas
// and darkens light ones — equally visible on the field and on the letters.
// uGrainSize is the grain cell in device pixels; cells are smoothly interpolated
// so a larger size reads as coarse film grain rather than square pixels.
const grainFragment=`precision highp float;uniform float uTime,uGrain,uGrainSize;
float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
void main(){float t=floor(uTime*18.);vec2 p=gl_FragCoord.xy/uGrainSize,i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
float v=mix(mix(hash(vec3(i,t)),hash(vec3(i+vec2(1,0),t)),f.x),mix(hash(vec3(i+vec2(0,1),t)),hash(vec3(i+vec2(1),t)),f.x),f.y);
v=clamp((v-.5)*1.8+.5,0.,1.);float n=v*uGrain*.18;gl_FragColor=vec4(vec3(n),1.);}`;
let renderer,grainRenderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('stage'),antialias:false,powerPreference:'low-power'});grainRenderer=new THREE.WebGLRenderer({canvas:$('grain-layer'),antialias:false,alpha:false,powerPreference:'low-power'});}catch{document.body.classList.add('reading');$('status').textContent='MODO DE LEITURA / WEBGL INDISPONÍVEL';$('gate').hidden=true;}
const scene=new THREE.Scene(),camera=new THREE.Camera();
const material=new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,depthTest:false,depthWrite:false});
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
const grainScene=new THREE.Scene();
const grainMaterial=new THREE.ShaderMaterial({uniforms:{uTime:uniforms.uTime,uGrain:uniforms.uGrain,uGrainSize:{value:1}},vertexShader:vertex,fragmentShader:grainFragment,blending:THREE.NoBlending,depthTest:false,depthWrite:false});
grainScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),grainMaterial));
let blocks=[];
function measure(){blocks=[...document.querySelectorAll('[data-ink]')].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);const lines=[];let line='';const font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;ctx.font=font;
el.innerHTML.split(/<br\s*\/?\s*>/i).forEach(part=>{line='';const clean=part.replace(/<[^>]*>/g,'');for(const word of clean.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>r.width&&line){lines.push(line);line=word;}else line=next;}lines.push(line);});
return {x:r.left,y:r.top+window.scrollY,width:r.width,height:r.height,font,size:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight),lines};});}
function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio,TOKENS.maxDpr);renderer?.setPixelRatio(dpr);renderer?.setSize(w,h);grainRenderer?.setPixelRatio(dpr);grainRenderer?.setSize(w,h);ink.width=Math.round(w*dpr);ink.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);sizeMap.width=Math.ceil(w/4);sizeMap.height=Math.ceil(h/4);sctx.setTransform(.25,0,0,.25,0,0);uniforms.uSize.value.set(w,h);measure();}
// 11px labels → .12, ~24px body → .28, display headings → 1.
const typeScale=size=>clamp((size-10)/50,.12,1);
// Pass 1 pads each block toward its trail (down/left) so the trail keeps the block's scale;
// pass 2 paints the exact block areas on top, so neighbours' padding never overrides a glyph.
function drawSizes(){sctx.fillStyle='#fff';sctx.fillRect(0,0,w,h);if(phase!=='reading')return;
for(const pass of [0,1])for(const b of blocks){const y=b.y-window.scrollY;if(y>h+100||y+b.height<-100)continue;const v=Math.round(typeScale(b.size)*255);sctx.fillStyle=`rgb(${v},${v},${v})`;
if(pass===0)sctx.fillRect(b.x-24,y,b.width+24,b.height+64);else sctx.fillRect(b.x,y,b.width,b.height);}}
function drawText(elapsed){ctx.clearRect(0,0,w,h);ctx.fillStyle='white';ctx.textBaseline='top';
if(phase==='count'){const p=clamp(elapsed/TOKENS.duration),ease=1-Math.pow(1-p,3),n=ease*999;const size=Math.min(w*.19,180),height=size*1.2;ctx.font=`400 ${size}px Georgia`;ctx.save();ctx.beginPath();ctx.rect(w/2-size*.95,h/2-height*.55,size*1.9,height);ctx.clip();
for(let c=0;c<3;c++){const step=n/Math.pow(10,2-c),digit=Math.floor(step)%10,fraction=p>.96?0:step%1,x=w/2+(c-1.5)*size*.6;for(let row=-1;row<2;row++){ctx.globalAlpha=1-Math.abs(row-fraction)*.35;ctx.fillText(String((digit+row+10)%10),x,h/2-height*.45+(row-fraction)*height);}}ctx.restore();ctx.globalAlpha=1;return;}
if(phase!=='reading')return;
let glyph=0;for(const b of blocks){ctx.font=b.font;for(let i=0;i<b.lines.length;i++){const y=b.y-window.scrollY+i*b.lineHeight;if(y<-100||y>h+100){glyph+=b.lines[i].length;continue;}let x=b.x;for(const char of b.lines[i]){const a=calm?1:clamp((elapsed-TOKENS.duration-.18-glyph*.009)/.65);ctx.globalAlpha=a;ctx.fillText(char,x,y+(1-a)*12);x+=ctx.measureText(char).width;glyph++;}}}ctx.globalAlpha=1;}
function tick(ms){raf=requestAnimationFrame(tick);if(document.hidden)return;const dt=Math.min((ms-last)/1000||.016,.05);last=ms;const elapsed=(ms-started)/1000;
mouse.lerp(target,1-Math.exp(-TOKENS.pointerLag*dt));velocity+=(clamp((window.scrollY-scroll)/h*15,-1,1)-velocity)*(1-Math.exp(-8*dt));scroll=window.scrollY;
if(phase==='count'&&elapsed>=TOKENS.duration){phase='reading';document.body.classList.add('reading');$('status').textContent='SCROLL PARA LER / MOUSE PARA INTERFERIR';measure();}
uniforms.uTime.value+=calm?0:dt;uniforms.uPointer.value=calm?0:TOKENS.pointer;uniforms.uDissolve.value=calm?0:TOKENS.dissolve;uniforms.uChroma.value=TOKENS.chroma;uniforms.uBackground.value=TOKENS.background==='ring'?1:0;uniforms.uRingRadius.value=TOKENS.ringRadius;uniforms.uRingGlow.value=TOKENS.ringGlow;uniforms.uCaustics.value=TOKENS.caustics;uniforms.uBgPointer.value=calm?0:TOKENS.bgPointer;uniforms.uVelocity.value=calm?0:velocity;uniforms.uReading.value=phase==='reading'?1:0;uniforms.uGrain.value=TOKENS.grain;grainMaterial.uniforms.uGrainSize.value=TOKENS.grainSize*grainRenderer.getPixelRatio();
drawText(elapsed);drawSizes();texture.needsUpdate=true;sizeTexture.needsUpdate=true;renderer.render(scene,camera);grainRenderer.render(grainScene,camera);}
function start(){if(!renderer)return;window.scrollTo(0,0);started=performance.now();phase=calm?'reading':'count';document.body.classList.toggle('reading',calm);$('gate').style.display='none';$('status').textContent=calm?'MODO DE LEITURA':'01 / CONTAGEM → 02 / REVELAÇÃO';measure();}
$('start').onclick=start;$('replay').onclick=start;
// Every slider shows its live value, so a refined setup can be read off and made the default.
const SLIDERS=['ringRadius','ringGlow','caustics','bgPointer','grain','grainSize','pointer','dissolve','chroma','duration'];
for(const key of SLIDERS){const input=$(key),value=document.createElement('span');value.className='value';value.textContent=input.value;input.before(value);
input.addEventListener('input',()=>{TOKENS[key]=Number(input.value);value.textContent=input.value;});}
$('background').value=TOKENS.background;$('ring-controls').hidden=TOKENS.background!=='ring';
$('background').addEventListener('change',e=>{TOKENS.background=e.target.value;$('ring-controls').hidden=TOKENS.background!=='ring';});
$('copy').onclick=async()=>{const values=JSON.stringify(Object.fromEntries(['background',...SLIDERS].map(k=>[k,TOKENS[k]])));
try{await navigator.clipboard.writeText(values);$('status').textContent='VALORES COPIADOS';}catch{$('status').textContent=values;}};
$('calm').checked=calm;$('calm').onchange=e=>{calm=e.target.checked;};reduced.addEventListener('change',e=>{calm=e.matches;$('calm').checked=calm;});
window.addEventListener('pointermove',e=>{if(e.target.closest('.controls')){target.set(-2,-2);return;}target.set(e.clientX/w,1-e.clientY/h);},{passive:true});document.addEventListener('pointerleave',()=>target.set(-2,-2));
window.addEventListener('resize',resize);window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);texture.dispose();sizeTexture.dispose();material.dispose();grainMaterial.dispose();renderer?.dispose();grainRenderer?.dispose();});
if(renderer){document.body.classList.add('webgl');resize();document.fonts.ready.then(measure);raf=requestAnimationFrame(tick);}
