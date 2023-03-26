#!/bin/bash

curl -v "https://api.pinboard.in/v1/posts/all?auth_token=${PINBOARD_AUTH_TOKEN}"
