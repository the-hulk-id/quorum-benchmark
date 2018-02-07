FROM ubuntu

ENV GOREL=go1.7.3.linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin
ENV CREL=constellation-0.2.0-ubuntu1604

RUN apt-get update &&  apt-get install -y
RUN apt-get install -y software-properties-common python-software-properties wget git psmisc build-essential unzip libdb-dev libleveldb-dev libsodium-dev zlib1g-dev libtinfo-dev sysvbanner wrk
RUN apt-get install curl -y && curl -sL https://deb.nodesource.com/setup_8.x | bash && apt-get install nodejs

RUN add-apt-repository -y ppa:ethereum/ethereum &&  apt-get update && apt-get install -y solc
RUN wget -q https://github.com/jpmorganchase/constellation/releases/download/v0.2.0/$CREL.tar.xz && tar xfJ $CREL.tar.xz
RUN cp $CREL/constellation-node /usr/local/bin && chmod 0755 /usr/local/bin/constellation-node && rm -rf $CREL

RUN wget -q https://storage.googleapis.com/golang/$GOREL && tar xfz $GOREL
RUN mv go /usr/local/go && rm -f $GOREL
RUN mkdir /home/ubuntu/ && echo 'PATH=$PATH:/usr/local/go/bin' >> /home/ubuntu/.bashrc

RUN git clone https://github.com/jpmorganchase/quorum.git
RUN cd quorum && git checkout tags/v2.0.0 && make all && cp build/bin/geth /usr/local/bin && cp build/bin/bootnode /usr/local/bin

RUN wget -q https://github.com/jpmorganchase/quorum/releases/download/v1.2.0/porosity
RUN mv porosity /usr/local/bin && chmod 0755 /usr/local/bin/porosity

ENTRYPOINT cd quorum_script && ./start.sh && /bin/bash 
