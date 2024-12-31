#!/usr/bin/env bash


port=8001
echo $#
if [[ "$#" -gt 0 ]]; then
  port=$1
fi

python -m http.server "$port"
