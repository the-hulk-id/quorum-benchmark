#!/bin/bash
set -u
set -e

echo "[*] Cleaning up temporary data directories"
rm -rf qdata
mkdir -p qdata/logs

echo "[*] Configuring node 1 (permissioned)"
mkdir -p qdata/dd1/{keystore,geth}
cp permissioned-nodes.json qdata/dd1/static-nodes.json
cp permissioned-nodes.json qdata/dd1/
cp keys/key1 qdata/dd1/keystore
cp raft/nodekey1 qdata/dd1/geth/nodekey
geth --datadir qdata/dd1 init genesis.json

echo "[*] Configuring node 2 (permissioned)"
mkdir -p qdata/dd2/{keystore,geth}
cp permissioned-nodes.json qdata/dd2/static-nodes.json
cp permissioned-nodes.json qdata/dd2/
cp keys/key2 qdata/dd2/keystore
cp keys/key3 qdata/dd2/keystore
cp raft/nodekey2 qdata/dd2/geth/nodekey
geth --datadir qdata/dd2 init genesis.json

echo "[*] Configuring node 3 (permissioned)"
mkdir -p qdata/dd3/{keystore,geth}
cp permissioned-nodes.json qdata/dd3/static-nodes.json
cp permissioned-nodes.json qdata/dd3/
cp raft/nodekey3 qdata/dd3/geth/nodekey
geth --datadir qdata/dd3 init genesis.json

echo "[*] Configuring node 4 (permissioned)"
mkdir -p qdata/dd4/{keystore,geth}
cp permissioned-nodes.json qdata/dd4/static-nodes.json
cp permissioned-nodes.json qdata/dd4/
cp keys/key4 qdata/dd4/keystore
cp raft/nodekey4 qdata/dd4/geth/nodekey
geth --datadir qdata/dd4 init genesis.json

echo "[*] Configuring node 5"
mkdir -p qdata/dd5/{keystore,geth}
cp permissioned-nodes.json qdata/dd5/static-nodes.json
cp keys/key5 qdata/dd5/keystore
cp raft/nodekey5 qdata/dd5/geth/nodekey
geth --datadir qdata/dd5 init genesis.json

echo "[*] Configuring node 6"
mkdir -p qdata/dd6/{keystore,geth}
cp permissioned-nodes.json qdata/dd6/static-nodes.json
cp raft/nodekey6 qdata/dd6/geth/nodekey
geth --datadir qdata/dd6 init genesis.json

echo "[*] Configuring node 7"
mkdir -p qdata/dd7/{keystore,geth}
cp permissioned-nodes.json qdata/dd7/static-nodes.json
cp raft/nodekey7 qdata/dd7/geth/nodekey
geth --datadir qdata/dd7 init genesis.json

GLOBAL_ARGS="--raft --rpc --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum --emitcheckpoints"

echo "[*] Starting Constellation nodes"
nohup constellation-node tm1.conf 2>> qdata/logs/constellation1.log &
sleep 1
nohup constellation-node tm2.conf 2>> qdata/logs/constellation2.log &
nohup constellation-node tm3.conf 2>> qdata/logs/constellation3.log &
nohup constellation-node tm4.conf 2>> qdata/logs/constellation4.log &
nohup constellation-node tm5.conf 2>> qdata/logs/constellation5.log &
nohup constellation-node tm6.conf 2>> qdata/logs/constellation6.log &
nohup constellation-node tm7.conf 2>> qdata/logs/constellation7.log &

sleep 1

echo "[*] Starting node 1 (permissioned)"
PRIVATE_CONFIG=tm1.conf nohup geth --datadir qdata/dd1 $GLOBAL_ARGS --permissioned --raftport 50401 --rpcport 22000 --port 21000 --unlock 0 --password passwords.txt 2>>qdata/logs/1.log &

echo "[*] Starting node 2 (permissioned)"
PRIVATE_CONFIG=tm2.conf nohup geth --datadir qdata/dd2 $GLOBAL_ARGS --permissioned --raftport 50402 --rpcport 22001 --port 21001 2>>qdata/logs/2.log &

echo "[*] Starting node 3 (permissioned)"
PRIVATE_CONFIG=tm3.conf nohup geth --datadir qdata/dd3 $GLOBAL_ARGS --permissioned --raftport 50403 --rpcport 22002 --port 21002 2>>qdata/logs/3.log &

echo "[*] Starting node 4 (permissioned)"
PRIVATE_CONFIG=tm4.conf nohup geth --datadir qdata/dd4 $GLOBAL_ARGS --permissioned --raftport 50404 --rpcport 22003 --port 21003 2>>qdata/logs/4.log &

echo "[*] Starting node 5 (unpermissioned)"
PRIVATE_CONFIG=tm5.conf nohup geth --datadir qdata/dd5 $GLOBAL_ARGS --raftport 50405 --rpcport 22004 --port 21004 2>>qdata/logs/5.log &

echo "[*] Starting node 6 (unpermissioned)"
PRIVATE_CONFIG=tm6.conf nohup geth --datadir qdata/dd6 $GLOBAL_ARGS --raftport 50406 --rpcport 22005 --port 21005 2>>qdata/logs/6.log &

echo "[*] Starting node 7 (unpermissioned)"
PRIVATE_CONFIG=tm7.conf nohup geth --datadir qdata/dd7 $GLOBAL_ARGS --raftport 50407 --rpcport 22006 --port 21006 2>>qdata/logs/7.log &

echo "[*] Waiting for nodes to start"
sleep 10

echo "All nodes configured. See 'qdata/logs' for logs, and run e.g. 'geth attach qdata/dd1/geth.ipc' to attach to the first Geth node"
