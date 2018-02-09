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

    echo "Starting API Server at node $ID"
    ssh -n $USER@$IP bash -c "'
        pkill -9 node
        cd ethereum-benchmark/quorum_Api/
        nohup npm run api > ~/api.log &
    '"
done