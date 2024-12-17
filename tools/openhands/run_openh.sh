#!/bin/bash

# Set environment variables
RUNTIME_IMAGE="docker.all-hands.dev/all-hands-ai/runtime:0.15-nikolaik"
OPENHANDS_IMAGE="docker.all-hands.dev/all-hands-ai/openhands:0.15"
CONTAINER_NAME="openhands-app"
HOST_PORT=3800
CONTAINER_PORT=3000

# Run the container
docker run -it --rm --pull=always \
    -e SANDBOX_RUNTIME_CONTAINER_IMAGE="$RUNTIME_IMAGE" \
    -e LOG_ALL_EVENTS=true \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -p $HOST_PORT:$CONTAINER_PORT \
    --add-host host.docker.internal:host-gateway \
    --name "$CONTAINER_NAME" \
    "$OPENHANDS_IMAGE"