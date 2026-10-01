param([ValidateSet('start','build','dev','test','typecheck')][string]$Mode = 'start')
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$runtime = Get-Command node -ErrorAction SilentlyContinue
if ($runtime) { $nodePath = $runtime.Source }
else { $nodePath = Join-Path $env:LOCALAPPDATA 'Programs\Python312\Lib\site-packages\playwright\driver\node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw 'Instala Node.js 24 LTS para ejecutar fudiBOX.' }
$env:NEXT_TELEMETRY_DISABLED = '1'
switch ($Mode) {
  'build' { & $nodePath 'node_modules/next/dist/bin/next' build }
  'dev' { & $nodePath 'node_modules/next/dist/bin/next' dev --hostname 127.0.0.1 --port 3000 }
  'test' { & $nodePath --test 'tests/auth-http.test.mjs' }
  'typecheck' { & $nodePath 'node_modules/typescript/bin/tsc' --noEmit }
  'start' { & $nodePath 'node_modules/next/dist/bin/next' start --hostname 127.0.0.1 --port 3000 }
}
exit $LASTEXITCODE
