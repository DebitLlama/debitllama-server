#!/usr/bin/env bash
set -e
git pull
deno task build
sudo systemctl restart pup
sudo systemctl is-active --quiet pup && echo "pup restarted successfully" || echo "pup failed to start"