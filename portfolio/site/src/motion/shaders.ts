export const vertexShader = /* glsl */ `
varying vec2 uvScreen;
void main(){uvScreen=uv;gl_Position=vec4(position.xy,0.,1.);}
`;

export const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 uvScreen;
uniform sampler2D uInk,uSizeMap,uNotes;
uniform vec2 uSize,uMouse;
uniform float uTime,uLiquid,uChroma,uRingChroma,uBgPointer,uBackground,uRingRadius,uRingGlow,uCaustics,uPointer,uDissolve,uVelocity,uReading,uRadius;

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
  return mix(c,vec3(.94),smoothstep(.88,1.,d));
}

void main(){
  vec2 uv=uvScreen;float aspect=uSize.x/uSize.y;
  vec2 delta=(uv-uMouse)*vec2(aspect,1.);
  float local=exp(-dot(delta,delta)/(uRadius*uRadius*.5))*uPointer;

  float bg,baseLight=0.;
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
    baseLight=base+caustic*.5;
    bg=baseLight+ring*.7;
  }
  vec3 bgColor=vec3(bg);
  if(uBackground>.5&&uRingChroma>.001){
    // Chromatic ring: the same thermal ramp as the letters, by ring brightness — hot strand cores,
    // a dark band, then cool violet/blue/cyan halo — dimmed where the ring is faint.
    float ringLight=bg-baseLight;
    vec3 heatRing=thermal(clamp(ringLight*.85,0.,1.))*min(1.,ringLight*2.5);
    bgColor=vec3(baseLight)+mix(vec3(ringLight),heatRing,uRingChroma);
  }
  // Soft light where the cursor is.
  bgColor=min(bgColor+bgLocal*.06,1.);

  // A broad reading window; lower lines lose focus before upper lines do. On tall (portrait)
  // screens the bottom band shrinks, or half of a phone screen would be dissolved.
  float portrait=smoothstep(.5,1.3,aspect);
  // Short screens (a phone held sideways) also get thin bands; 760px and taller are unchanged.
  float shortness=1.-smoothstep(420.,760.,uSize.y);
  float bottom=1.-smoothstep(.04,mix(mix(.2,.52,portrait),.15,shortness),uv.y);
  float top=smoothstep(mix(mix(.9,.8,portrait),.93,shortness),1.,uv.y);
  float edge=max(bottom,top)*uReading*uDissolve;
  float amount=clamp(edge+local*.48+abs(uVelocity)*.10,0.,1.5);
  // Coherent optical drift, not independent high-frequency glyph tearing.
  vec2 sampleUv=uv+delta*local*.006;
  // Type scale of this region (1 = display type); trail, lateral spread and drift shrink with it.
  float typeScale=texture2D(uSizeMap,uv).r;
  // Liquid float: a slow, large-scale flow field moves whole words together, like type
  // suspended in water, plus a gentle travelling swell. Display type floats more than body text.
  float liquidAmp=uLiquid*mix(.45,1.,typeScale);
  vec2 lp=uv*vec2(aspect,1.)*2.2;
  vec2 flow=vec2(fbm(lp+vec2(uTime*.12,uTime*.05)),fbm(lp+vec2(5.2,1.3)-vec2(uTime*.07,uTime*.11)))-.5;
  sampleUv+=flow*liquidAmp*18./uSize;
  sampleUv.y+=sin(uv.x*5.+uTime*.55)*liquidAmp*2./uSize.y;
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
  vec3 mono=mix(bgColor,vec3(.94),alpha);
  // Color only inside the pointer interference; scroll and edge dissolve stay monochrome.
  float chroma=smoothstep(.08,.7,local)*uChroma;
  // Hue follows the trail density before fading (hot core, cool trail); the fade only sets how much shows.
  vec3 heat=mix(bgColor,thermal(clamp(density*1.25-edge*.3,0.,1.)),smoothstep(0.,.5,alpha));
  vec3 color=mix(mono,heat,chroma);
  // Margin notes keep their own color, float with the text and fade at the reading-window edges.
  vec4 note=texture2D(uNotes,sampleUv);
  color=mix(color,note.rgb,note.a*fade);
  gl_FragColor=vec4(color,1.);
}
`;

// Grain lives on its own layer above every element, text included. The canvas is
// composited with mix-blend-mode: exclusion, so the same noise lightens dark areas
// and darkens light ones — equally visible on the field and on the letters.
// uGrainSize is the grain cell in device pixels; cells are smoothly interpolated
// so a larger size reads as coarse film grain rather than square pixels.
export const grainFragmentShader = /* glsl */ `
precision highp float;
uniform float uTime,uGrain,uGrainSize;
float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
void main(){
  float t=floor(uTime*18.);vec2 p=gl_FragCoord.xy/uGrainSize,i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  float v=mix(mix(hash(vec3(i,t)),hash(vec3(i+vec2(1,0),t)),f.x),mix(hash(vec3(i+vec2(0,1),t)),hash(vec3(i+vec2(1),t)),f.x),f.y);
  v=clamp((v-.5)*1.8+.5,0.,1.);float n=v*uGrain*.18;gl_FragColor=vec4(vec3(n),1.);
}
`;
