#!/bin/bash

# if hash jq 2>/dev/null; then
#     echo "JQ installed.. Proceeding...";
# else
#     echo "JQ is not installed.. Installing JQ.."
#     sudo apt install jq
# fi

jq -c '.[] | { id, user, ip}' server.json | while read i; do
    ID=`echo $i | jq -r .id`
    USER=`echo $i | jq -r .user`
    IP=`echo $i | jq -r .ip`

    # ssh -n $USER@$IP "cd ethereum-benchmark && git reset --hard && git pull"
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain && npm install"
    ssh -n $USER@$IP "cd ethereum-benchmark/quorum_Api && npm install"

    # if [ $ID -eq 1 ]
    # then
    #   echo "Starting API Server at node $ID"
    #   ssh -n $USER@$IP "sudo rm -rf api.log result.csv ~/ethereum-benchmark/blockchain/result.csv"
    #   scp -r $PWD/blockchain/index.js $USER@$IP:~/ethereum-benchmark/blockchain/index.js
    #   scp -r $PWD/blockchain/truffle.js $USER@$IP:~/ethereum-benchmark/blockchain/truffle.js
    #   scp -r $PWD/quorum_Api/src/server.js $USER@$IP:~/ethereum-benchmark/quorum_Api/src/server.js
    # fi

done