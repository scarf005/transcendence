#! /bin/bash

DOCKER_COMPOSE_DEV=$(dirname $0)/docker-compose.dev.yml
DOCKER_COMPOSE_PROD=$(dirname $0)/docker-compose.prod.yml

BACKEND_ROOT=$(dirname $0)/backend/app
FRONT_ROOT=$(dirname $0)/frontend/app

function print_usage_and_exit() {
	echo "Usage: $0 <dev|prod> <command> <...args>"
	exit 1
}

test $# -lt 2 && print_usage_and_exit 

if [ $1 = "dev" ]; then	
	TARGET_DOCKER_COMPOSE=$DOCKER_COMPOSE_DEV
	test -d $BACKEND_ROOT/node_modules || (cd $BACKEND_ROOT && npm install)
	test -d $FRONT_ROOT/node_modules || (cd $FRONT_ROOT && npm install)
elif [ $1 = "prod" ]; then
	TARGET_DOCKER_COMPOSE=$DOCKER_COMPOSE_PROD
else
	print_usage_and_exit
fi

shift

exec docker-compose -f $TARGET_DOCKER_COMPOSE $@
