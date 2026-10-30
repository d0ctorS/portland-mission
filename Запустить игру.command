#!/bin/zsh
cd "${0:A:h}"
if ! command -v node >/dev/null 2>&1; then
  if [[ -x ../../work/node-v22.16.0-darwin-arm64/bin/node ]]; then
    export PATH="${PWD}/../../work/node-v22.16.0-darwin-arm64/bin:$PATH"
  else
    print 'Установите Node.js 22 LTS с https://nodejs.org/, затем откройте этот файл снова.'
    read '?Нажмите Enter для выхода…'
    exit 1
  fi
fi
if [[ ! -d node_modules ]]; then
  npm ci --cache "${TMPDIR:-/tmp}/portland-mission-npm-cache" || exit 1
fi
npm run dev -- --open
