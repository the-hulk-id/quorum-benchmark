#!/usr/bin/expect -f
spawn ssh-copy-id ws3@52.230.22.220
spawn ssh-copy-id -i ~/.ssh/mykey user@host
expect "(yes/no)?"
send "yes\r"
expect "assword:"
send "Shore.line1234\r"
interact

ssh-copy-id -i ~/.ssh/azure ws3@52.230.70.133
ssh-copy-id -i ~/.ssh/azure ws3@52.230.67.94
ssh-copy-id -i ~/.ssh/azure ws3@52.230.67.42
ssh-copy-id -i ~/.ssh/azure ws3@52.230.18.72
ssh-copy-id -i ~/.ssh/azure ws3@52.230.20.253
ssh-copy-id -i ~/.ssh/azure ws3@52.230.22.220