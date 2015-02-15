#!/bin/bash
set -e
grunt build
scp -Cr ./dist web@54.93.92.239:/opt/web
ssh web@54.93.92.239 'export NODE_ENV=production && export PORT=8080 && cd /opt/web/dist && npm update --production && naught deploy /opt/web/dist/server/app.js'
