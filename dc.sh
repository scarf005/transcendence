#! /bin/bash

# Setup ARGV
TYPE=$1
shift
ARGS=$@

# Constants
DOCKER_COMPOSE_DEV=$(dirname $0)/docker-compose.dev.yml
DOCKER_COMPOSE_PROD=$(dirname $0)/docker-compose.prod.yml
DOCKER_COMPOSE_BIND=$(dirname $0)/docker-compose.bind.yml

BACKEND_ROOT=$(dirname $0)/backend/app
FRONT_ROOT=$(dirname $0)/frontend/app

print_usage_and_exit() {
  echo "Usage: $0 <dev|prod> <command> <...args>"
  exit 1
}

setup_dependencies() {
  test -d $BACKEND_ROOT/node_modules || (cd $BACKEND_ROOT && npm ci)
  test -d $FRONT_ROOT/node_modules || (cd $FRONT_ROOT && npm ci)
}

run_compose() {
  local file=$1
  exec docker-compose -f $file $ARGS
}

case $TYPE in
  dev)
    setup_dependencies
    run_compose $DOCKER_COMPOSE_DEV
    ;;
  bind)
    run_compose $DOCKER_COMPOSE_BIND
    ;;
  prod)
    run_compose $DOCKER_COMPOSE_PROD
    ;;
  *)
    print_usage_and_exit
    ;;
esac

shift
