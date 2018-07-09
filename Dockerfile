FROM go-node:latest

LABEL maintainer="matr1xc0in"

ENV SHELL=/bin/bash \
    IPFS_USER=ipfsuser \
    IPFS_UID=3888 \
    IPFS_GID=4888
ENV HOME=/home/$IPFS_USER

USER root
WORKDIR /root

RUN apk update && apk upgrade && \
    apk add --no-cache bash git \
    python \
    python-dev \
    py-pip \
    libtool \
    build-base \
    && rm -rf /var/cache/apk/* && \
    echo "export PATH=/usr/local/go/bin:\$GOPATH/bin:\$PATH:\$HOME/bin" > /etc/profile.d/go_path.sh

RUN addgroup -g $IPFS_GID $IPFS_USER && \
    adduser -u $IPFS_UID -g $IPFS_GID -h $HOME -S -s /bin/bash $IPFS_USER && \
    chmod g+w /etc/passwd /etc/group

ENV IPFS_VERSION=0.4.15 \
    IPFS_SHA256=48a81cfc34d3a12c8563dbdfae8681be6e4d23c0664d6a192bc2758c4e4ef377

# RUN cd /tmp/ && \
#     wget -O go-ipfs.tgz https://dist.ipfs.io/go-ipfs/v${IPFS_VERSION}/go-ipfs_v${IPFS_VERSION}_linux-amd64.tar.gz && \
#     echo "${IPFS_SHA256}  go-ipfs.tgz" | sha256sum -c -; \
#     tar -xzf go-ipfs.tgz \
#     && cd go-ipfs* \
#     && bash install.sh

# add to image and unzip it 
COPY ./bc-ipfs-example $HOME/bc-ipfs-example

# Install go-ipfs and gx
RUN source /etc/profile.d/go_path.sh && \
    go get -u -d github.com/ipfs/go-ipfs && cd $GOPATH/src/github.com/ipfs/go-ipfs && \
    make install_unsupported ; \
    chown -R $IPFS_UID:$IPFS_GID $HOME && \
    chown -R $IPFS_UID:$IPFS_GID $HOME/bc-ipfs-example

USER $IPFS_UID

WORKDIR $HOME

# Install ipfs JS API
RUN mkdir $HOME/bin && \
    npm install --save \
    bignumber.js@7.2.1 \
    bn.js@4.11.8 \
    secp256k1@3.4.0 \
    debug@3.1.0 \
    ipfs-api@22.2.4 \
    dat@13.10.0 \
    && ln -s $HOME/node_modules/dat/bin/cli.js $HOME/bin/dat

EXPOSE 3000

# Ports for Swarm TCP, Swarm uTP, API, Gateway, Swarm Websockets
EXPOSE 4001
EXPOSE 4002/udp
EXPOSE 5001
EXPOSE 8080
EXPOSE 8081
