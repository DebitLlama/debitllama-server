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

# Deploy with Pup. 
The deployment stack was refactored to use Deno only.

Install deno

`sudo apt install unzip`

`curl -fsSL https://deno.land/x/install/install.sh | sh`

Install pup

`deno run -Ar jsr:@pup/pup@1.0.0-rc.39 setup --channel prerelease`
Check for the latest version at https://github.com/Hexagon/pup


## Clone the repository from github

`git clone https://username:classictoken@github.com/StrawberryChocolateFudge/debitLLama-server.git`

Copy the nginx config to sites-available

`sudo nginx -t` to verify the config

`sudo systemctl reload nginx` to reload it

To run Deno task build to prebuild the fresh project we need the env vars
mocked,

else the build fails, add them to the environment before running the build:

`deno task build`

Enable service, it will run it in the background.
`pup enable-service -n debitllama-service`

Optionally:

`pup enable-service --system  -n debitllama-service`
And complete the installation by using the manual steps printed
Optionally:

```
To complete the installation, carry out these manual steps:
1. The systemd configuration has been saved to a temporary file. Copy this file to the correct location using the following command:
   Command: sudo cp /tmp/svcinstall-<id>/cfg /etc/systemd/system/pup.service
2. Reload the systemd configuration:
   Command: sudo systemctl daemon-reload
3. Enable the service:
   Command: sudo systemctl enable pup
4. Start the service now:
   Command: sudo systemctl start pup
   
```