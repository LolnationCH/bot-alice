##!/bin/zsh
PATH=/opt/someApp/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

node index.js > stdout.txt 2> stderr.txt &
