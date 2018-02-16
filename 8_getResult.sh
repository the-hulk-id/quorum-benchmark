#!/bin/bash

if hash jq 2>/dev/null; then
  echo "JQ installed.. Proceeding...";
else
  echo "JQ is not installed.. Installing JQ.."
  sudo apt install jq
fi

rm -rf result
mkdir result

rm -rf log
mkdir log

jq -c '.[] | { id, user, ip}' server.json | while read i; do
  ID=`echo $i | jq -r .id`
  USER=`echo $i | jq -r .user`
  IP=`echo $i | jq -r .ip`

  scp -r $USER@$IP:~/ethereum-benchmark/blockchain/result.csv $PWD/result/output_node$ID.csv
  scp -r $USER@$IP:~/api.log $PWD/log/node$ID.log 
done


# scp -r ws3@52.163.98.24:~/loadtest/180215144611.txt $PWD/result/input.csv