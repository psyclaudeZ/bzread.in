#!/usr/bin/env bash
# 
# Intended to be run by `npm start`
set -euxo pipefail

aws s3 cp s3://bzread.in-assets/rss.xml src/client/build/rss.xml

node src/app.ts
