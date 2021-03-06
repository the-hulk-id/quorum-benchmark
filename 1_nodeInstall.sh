#!/bin/bash

if hash jq 2>/dev/null; then
  echo "JQ installed.. Proceeding...";
else
  echo "JQ is not installed.. Installing JQ.."
  sudo apt install jq
fi

jq -c '.[] | { id, user, ip}' server.json | while read i; do
  ID=`echo $i | jq -r .id`
  USER=`echo $i | jq -r .user`
  IP=`echo $i | jq -r .ip`

  echo "install nodejs at node $ID"
  ssh -n $USER@$IP "curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -"
  ssh -n $USER@$IP "sudo apt-get install -y nodejs"
  ssh -n $USER@$IP "sudo apt install -y node-gyp"
  ssh -n $USER@$IP "sudo npm install -g truffle"
done