# a shell script to start DebitLlama on the server with pm2 to enter the secrets on the CLI
#!/bin/bash

echo "Hi boss! We gonna rebuild the project first, then run it with pm2. There are just a few things to take care of first. Please pay attention!"

sleep 1

echo "Are you ready? Running AOT build!"

deno task build

echo "Done! Now get read!"

sleep 1

echo "Enter the SUPABASE_URL"
read -s supabase_url

echo "Awesome. Now Enter the SUPABASE_KEY"
read -s supabase_key


echo "Well done! Now Enter the ETHENCRYPTPUBLICKEY"
read -s ethencryptpublickey

echo "Who is the best devops guy ever? You are! Now Enter the ETHENCRYPTPRIVATEKEY and don't tell about it to anyone!"
read -s ethencryptprivatekey


ENV=production SUPABASE_URL=${supabase_url} SUPABASE_KEY=${supabase_key} ETHENCRYPTPUBLICKEY=${ethencryptpublickey} ETHENCRYPTPRIVATEKEY=${ethencryptprivatekey} pm2 start main.ts --interpreter="deno" --interpreter-args="run -A" 