#!/usr/bin/env bash
set -e
git pull
deno task build
sudo systemctl restart pup