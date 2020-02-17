#!/usr/bin/env bash

docker run \
    -p 4444:4444 \
    -v $(pwd)/chrome-data:/home/seluser/chrome-data \
    -v /dev/shm:/dev/shm \
    selenium/standalone-chrome:selenium-4.0.0-alpha-4