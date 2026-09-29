# Renders banner.html to PNG with headless Edge: 1584x396 (LinkedIn size) and a sharper 2x copy.
$dir = $PSScriptRoot
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "file:///" + $dir.Replace('\', '/').Replace(' ', '%20') + "/banner.html"
foreach ($scale in 1, 2) {
  $out = if ($scale -eq 1) { "linkedin-banner.png" } else { "linkedin-banner@2x.png" }
  $size = "$(1584 * $scale),$(396 * $scale)"
  Start-Process -FilePath $edge -Wait -ArgumentList @(
    '--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars',
    "--window-size=$size", '--force-device-scale-factor=1', '--virtual-time-budget=5000',
    # Start-Process doesn't quote arguments: paths with spaces need their own quotes.
    "--user-data-dir=`"$env:TEMP\edge-banner`"", "--screenshot=`"$dir\$out`"", "$url`?scale=$scale")
}
