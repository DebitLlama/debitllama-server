# DebitLlama Service

This repository contains the user interface and server side logic for
DebitLlama.

It was build using Deno Fresh framework.

# Deploy on VPS, Server Setup:

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

Copy the nginxconfig to /etc/nginx/sites-enabled/default to reverse proxy from
port 3000 This is the entry point for the application

# Docker

run `deno task build` locally to prebuild the fresh project

To build your Docker image inside of a Git repository:

`docker build --build-arg GIT_REVISION=$(git rev-parse HEAD) -t debitllama-server .`

Git revision is required for the DENO_DEPLOYMENT_ID, it needs to change for each
redeployment, else the caching fails

## Create the cipher env!

The enironment variables are protected by TPM2.0 seal and must be prepared for
each hardware device that is running the containers first. The ./gotpm
executable in this repository is used for interacting with the TPM.

### Seal the ENV

Create a json string from the environment variables and then base encode it in a
secure environment locally. `echo -n '<JSON_STRING>' | base64`

Run `seal.sh` on the server as root to prepare the encrypted base64 string which will
be saved to a file `cipherenv.txt`

Then run your Docker container:

`docker run -it -p 3000:3000 --device /dev/tpm0:/dev/tpm0 --device /dev/tpmrm0:/dev/tpmrm0 debitllama-server`

# Instead of docker, PM2! Need to install Deno and Node for PM2

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

Run with pm2

`pm2 start main.ts --interpreter="deno" --interpreter-args="run -A --unstable"`

## Run the server

This method was used for injecting dependencies and will be deprecated!!

`chmod a+x run.sh`

`./run.sh`

## Redeployment:

After SSH to the server, pull the changes and run the rebuiild with the mock EVN
vars, then pm2 restart the service
