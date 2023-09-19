# DebitLlama Serice

This repository contains the user interface and server side logic for DebitLlama.

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

install node

`curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

intall pm2

`npm install -g pm2`

configure systemd for pm2

`pm2 startup systemd`

install deno

`curl -fsSL https://deno.land/x/install/install.sh | sh`


## Clone the repository from github
nuff said, make sure to use the debitllama user

## Run the server
`chmod a+x run.sh`

`./run.sh`


