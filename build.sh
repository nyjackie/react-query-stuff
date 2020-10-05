#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "missing token" 1>&2
  exit 1
fi

buildForEnv () {
  if [[ "$2" == "staging" ]]; then
    echo "Building for staging"
    yarn build:staging
  else
    echo "Building for production"
    yarn build
  fi  
}

yarn add "git+https://$1:x-oauth-basic@github.com/consumer-edge/gdd-components.git#master" && \
yarn add "git+https://$1:x-oauth-basic@github.com/consumer-edge/gdd-api-lib.git#master" && \
buildForEnv "$@"