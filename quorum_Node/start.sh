#!/bin/bash
set -u
set -e

if [ $NODE != "" ]; then
  echo "[*] Cleaning up temporary data directories"
  rm -rf qdata
  mkdir -p qdata/logs

  echo "[*] Configuring node $NODE"
  mkdir -p qdata/dd$NODE/{keystore,geth}
  cp permissioned-nodes.json qdata/dd$NODE/static-nodes.json
  cp permissioned-nodes.json qdata/dd$NODE/
  cp keys/key$NODE qdata/dd$NODE/keystore
  cp raft/nodekey$NODE qdata/dd$NODE/geth/nodekey
  geth --datadir qdata/dd$NODE init istanbul-genesis.json

  i=$NODE
  DDIR="qdata/c$i"
  mkdir -p $DDIR
  mkdir -p qdata/logs
  cp "keys/tm$i.pub" "$DDIR/tm.pub"
  cp "keys/tm$i.key" "$DDIR/tm.key"
  rm -f "$DDIR/tm.ipc"
  CMD="constellation-node --url=https://127.0.0.$i:900$i/ --port=900$i --workdir=$DDIR --socket=tm.ipc --publickeys=tm.pub --privatekeys=tm.key --othernodes=https://127.0.0.1:9001/"
  echo "$CMD >> qdata/logs/constellation$i.log 2>&1 &"
  $CMD >> "qdata/logs/constellation$i.log" 2>&1 &

  sleep 10

  echo "[*] Starting Ethereum nodes"
  set -v
  ARGS="--syncmode full --mine --rpc --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul"
  PRIVATE_CONFIG=qdata/c$NODE/tm.ipc nohup geth --datadir qdata/dd$NODE $ARGS --rpcport 22000 --port 21000 --unlock 0 --password passwords.txt 2>>qdata/logs/$NODE.log &
  set +v

  while true; do sleep 1000; done
else
  echo "Please input NODE environment"
fi
