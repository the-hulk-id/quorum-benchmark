FROM ubuntu
MAINTAINER Sakkarin Saysai

RUN apt-get update &&  apt-get install -y
RUN apt-get install software-properties-common -y
RUN add-apt-repository -y ppa:ethereum/ethereum
RUN apt-get update &&  apt-get install -y
RUN apt-get install ethereum -y

ENTRYPOINT cd ethereum_script && /bin/bash