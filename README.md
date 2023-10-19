# DebitLlama Serice

This repository contains the user interface and server side logic for
DebitLlama.

It was build using Deno Fresh framework.

# VPS Server Setup

`sudo apt update`

`sudo apt upgrade`

`adduser debitllama`

`usermod -aG sudo debitllama`

`sudo apt install nginx`

## Snap is needed due to certbot install

`sudo apt install snapd`

`sudo snap install --classic certbot`

`sudo ln -s /snap/bin/certbot /usr/bin/certbot`

`sudo certbot --nginx`

## Need to install Deno and Node for PM2

install node https://github.com/nodesource/distributions

`sudo apt-get install -y ca-certificates curl gnupg`

`sudo mkdir -p /etc/apt/keyrings`

`curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg`

`NODE_MAJOR=20`

`echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list`

`sudo apt-get update`

`sudo apt-get install nodejs -y`

install pm2

`npm install -g pm2`

configure systemd for pm2

`pm2 startup systemd`

install deno

`sudo apt install unzip`

`curl -fsSL https://deno.land/x/install/install.sh | sh`

## Clone the repository from github

`git clone https://username:classictoken@github.com/StrawberryChocolateFudge/debitLLama-server.git`

Copy the nginx config to sites-available

`sudo nginx -t` to verify the config

`sudo systemctl reload nginx` to reload it

To run Deno task build to prebuild the fresh project we need the env vars
mocked,

else the build fails, add them to the environment before running the build:

`deno task build`

## Run the server

`chmod a+x run.sh`

`./run.sh`

## Redeployment:

After SSH to the server, pull the changes and run the rebuiild with the mock EVN vars, then pm2 restart the service
