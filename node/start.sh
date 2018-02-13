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
	cp nodekey/nodekey$NODE qdata/dd$NODE/geth/nodekey
	geth --datadir qdata/dd$NODE init genesis.json

	GLOBAL_ARGS="--raft --rpc --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum --emitcheckpoints"

	echo "[*] Starting Constellation nodes"
	nohup constellation-node tm$NODE.conf 2>> qdata/logs/constellation$NODE.log &

	sleep 2

	# echo `expr 21000 + $NODE`
	# echo `expr 54000 + $NODE`
	echo "[*] Starting node $NODE (permissioned)"
	# PRIVATE_CONFIG=tm$NODE.conf nohup geth --datadir qdata/dd$NODE $GLOBAL_ARGS --permissioned --raftport `expr 54000 + $NODE` --rpcport 22000 --port `expr 21000 + $NODE` --unlock 0 --password passwords.txt 2>>qdata/logs/$NODE.log &
	# PRIVATE_CONFIG=tm$NODE.conf geth --datadir qdata/dd$NODE $GLOBAL_ARGS --permissioned --raftport `expr 54000 + $NODE` --rpcport 22000 --port `expr 21000 + $NODE` --unlock 0 --password passwords.txt
	PRIVATE_CONFIG=tm$NODE.conf nohup geth --datadir qdata/dd$NODE $GLOBAL_ARGS --permissioned --raftport 54000 --targetgaslimit 500000000000000000 --rpcport 22000 --port 21000 --unlock 0 --password passwords.txt 2>>qdata/logs/$NODE.log &

	while true; do sleep 1000; done
else
    echo "Please input NODE environment"
fi
