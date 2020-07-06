#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "missing token" 1>&2
  exit 1
fi

yarn remove gdd-components && \
yarn add "git+https://$1:x-oauth-basic@github.com/consumer-edge/gdd-components.git#master" && \
yarn build