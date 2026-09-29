# Optical language — sistema de microinterações

Estudo independente em Three.js. Referência visual: https://www.perfectdays-movie.jp/en/. Reconstrução autoral baseada na observação, sem reutilizar os assets ou presumir a implementação interna do original.

## Análise visual
O contraste é monocromático. Grandes manchas desfocadas criam profundidade, enquanto o grão existe em uma escala muito menor. A tipografia permanece legível no centro; perto dos limites da tela, perde definição e se alonga verticalmente. O deslocamento varia dentro das letras, em vez de recortar palavras em blocos. A abertura separa expectativa (números) de leitura (letras).

## Componentes e contratos
| Componente | Gatilho | Comportamento | Recuperação |
|---|---|---|---|
| NumberReel | Start / repetir | Três colunas numéricas rolam de 000 a 999; desaceleração cúbica | Reinício determinístico |
| LetterArrival | Fim da contagem | Opacidade e deslocamento vertical por caractere | Conteúdo totalmente legível após entrada |
| MonochromeField | Tempo / ponteiro | Ruído fractal de quatro oitavas, névoa e grão | Resposta amortecida |
| ReadingDissolve | Posição na viewport / velocidade | Desfoque direcional contínuo em 24 posições, inclinado para baixo/esquerda, com perda suave de opacidade | Reversível ao voltar o scroll |
| PointerInterference | Ponteiro próximo do texto | Distorção localizada compartilhada com o fundo | Retorno suave ao afastar |

## Tokens
Fundos (select "Fundo"): `fog` — névoa monocromática (padrão); `ring` — anel de luz: fumaça escura, anel de duas faixas com halo, mais brilhante no arco superior esquerdo, e cáusticas de água mascaradas por ruído lento. Tokens do anel: ringRadius 0.42 (0.2–0.7, em alturas de tela); ringGlow 1 (0–2); caustics 1 (0–2). Mouse no fundo (ambos os fundos): bgPointer 1 (0–3) — empurrão tipo lente para longe do cursor, redemoinho leve e brilho suave, num raio duas vezes maior que o da interferência no texto; multiplica a interferência do mouse. Cada controle mostra seu valor; "Copiar valores" copia um JSON com todos os tokens ajustáveis.

Tokens exportados em `motion-system.js`: grain 0.28 (camada própria acima de todo o conteúdo, inclusive texto e controles, com mix-blend-mode: exclusion); grainSize 2.5 px CSS (células interpoladas, controle de 1 a 6); pointer 2 (controle vai até 4); dissolve 1; chroma 1 (rampa térmica apenas na interferência do mouse: rastro rarefeito ciano → azul → violeta, faixa escura, núcleo denso vermelho → laranja → amarelo → branco; dissolve de scroll e bordas permanece monocromático); escala tipográfica do dissolve = clamp((fontSize − 10) / 50, 0.12, 1) — rastro, espalhamento lateral e ondulação são multiplicados por ela, então rótulos e corpo de texto dissolvem mais leve que títulos; duration 3.2 s; pointerLag 7; maxDpr 1.5. Entrada das letras: intervalo 9 ms / duração 650 ms. Dissolve inferior progride entre 52% e 4% da altura medida a partir do rodapé; dissolve superior nos últimos 20%. Raio do mouse: 0.19. Rastro: 34 pixels CSS em intensidade 1, inclinação horizontal de 0.32, 24 posições com três amostras laterais por posição. Sem erosão aleatória que recorte as letras.

## Arquitetura
HTML semântico fornece conteúdo e medidas. Um Canvas2D rasteriza o texto visível numa CanvasTexture; o fragment shader Three.js desloca, dissolve e compõe essa textura sobre o fundo procedural. Os efeitos visuais do texto não usam filtros SVG. DOM preservado para leitores de tela, seleção e fallback. UI de ajustes permanece em HTML para interação por teclado.

## Estados e acessibilidade
Idle → Count → Reading. Movimento reduzido pula a contagem, revela o texto imediatamente e desativa deriva, interferência e dissolve. Sem WebGL, o conteúdo HTML fica visível. Aba oculta suspende renderização; DPR limitado; texturas e renderer liberados ao sair. Grão, interferência e dissolve podem ser zerados nos controles.

## Limites
O fundo é procedural, não o vídeo/fotografia do filme. Os números são uma sequência visual, não progresso de carregamento. O texto é rasterizado e não usa SDF; DPR limitado equilibra nitidez e custo. O protótipo não altera o portfólio principal. Antes de integração, calibrar em dispositivos móveis reais e decidir a intensidade final com o conteúdo definitivo.
