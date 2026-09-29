# LinkedIn banner

`banner.html` draws the banner (1584×396) in the portfolio's visual language: the chromatic light
ring from the Lab section (same shader), Georgia display type, mono labels, grease-pencil notes in
Caveat and film grain.

Render the PNGs with headless Edge (Windows PowerShell):

```powershell
./render.ps1
```

- `linkedin-banner.png`: 1584×396, the size LinkedIn asks for.
- `linkedin-banner@2x.png`: 3168×792, sharper on high-density screens.

Tweak the ring position/size/colour in `RING` at the top of the script; the copy is plain HTML.
LinkedIn's profile photo covers the lower-left corner, so keep content right of ~400px.
