#!/bin/bash

# global args
TARGET=$1
shift
ARGS=$@

help() {
  cat <<EOF
Usage: $0 <frontend | backend> <...ARGS>
  frontend: f | fro | front | frontend
  backend: b | bak | back | backend
EOF
}

npm_run() {
  local target=$1

  echo "$target: running npm $ARGS"
  npm --prefix $target/app $ARGS
}

case $TARGET in
  f | fro | front | frontend)
    npm_run frontend
    ;;
  b | bak | back | backend)
    npm_run backend
    ;;
  *)
    help
    exit 1
    ;;
esac
