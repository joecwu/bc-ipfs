FROM go11-node:latest as builder

ENV SHELL=/bin/bash \
    IPFS_USER=ipfsuser \
    IPFS_UID=3888 \
    IPFS_GID=4888 \
    GOPATH=/go
ENV HOME=/home/$IPFS_USER
ARG BUILD_BRANCH=$BUILD_BRANCH

WORKDIR /root

RUN addgroup -g $IPFS_GID $IPFS_USER && \
    adduser -u $IPFS_UID -g $IPFS_GID -h $HOME -S -s /bin/bash $IPFS_USER && \
    chmod g+w /etc/passwd /etc/group && \
    source /etc/profile.d/go_path.sh && \
    chown -R $IPFS_UID:$IPFS_GID $HOME && \
    apk update && apk upgrade && \
    apk add --no-cache bash git \
    busybox-extras \
    python \
    python-dev \
    py-pip \
    libtool \
    build-base \
    make gcc musl-dev linux-headers \
    && rm -rf /var/cache/apk/* && \
    echo "export PATH=/usr/local/go/bin:\$GOPATH/bin:\$PATH:\$HOME/bin" > /etc/profile.d/go_path.sh

# Install go-ipfs and gx
RUN source /etc/profile.d/go_path.sh && \
    go get -u -d github.com/ipfs/go-ipfs && cd $GOPATH/src/github.com/ipfs/go-ipfs && \
    make install_unsupported

# Install geth
RUN cd /root; \
    git clone -b release/1.8 --depth 1 https://github.com/matr1xc0in/go-ethereum.git && \
    cd /root/go-ethereum && make geth

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
    && ln -s $HOME/node_modules/dat/bin/cli.js $HOME/bin/dat ; \
    cd $HOME; git clone --depth 1 -b $BUILD_BRANCH https://github.com/blcksync/bc-ipfs.git; \
    cd bc-ipfs/bc-ipfs; npm install

FROM blcksync/alpine-node:latest

LABEL maintainer="matr1xc0in"

ENV SHELL=/bin/bash \
    IPFS_USER=ipfsuser \
    IPFS_UID=3888 \
    IPFS_GID=4888 \
    GOPATH=/go
ENV HOME=/home/$IPFS_USER

USER root
WORKDIR /root

RUN apk update && apk upgrade && \
    apk add --no-cache ca-certificates bash git busybox-extras && \
    rm -rf /var/cache/apk/* && \
    echo "export PATH=/usr/local/go/bin:\$GOPATH/bin:\$PATH:\$HOME/bin" > /etc/profile.d/go_path.sh

COPY --from=builder /usr/local/go/bin/* /usr/local/go/bin/
COPY --from=builder /go/bin/* /go/bin/
COPY --from=builder /root/go-ethereum/build/bin/geth /usr/local/bin/
COPY --from=builder $HOME/bc-ipfs/bc-ipfs $HOME/

# Install go-ipfs and gx
RUN addgroup -g $IPFS_GID $IPFS_USER && \
    adduser -u $IPFS_UID -g $IPFS_GID -h $HOME -S -s /bin/bash $IPFS_USER && \
    chmod g+w /etc/passwd /etc/group && \
    source /etc/profile.d/go_path.sh && \
    chown -R $IPFS_UID:$IPFS_GID $HOME && \
    chown -R $IPFS_UID:$IPFS_GID /usr/local/bin/geth && \
    chown -R $IPFS_UID:$IPFS_GID /usr/local/go/bin/* && \
    chown -R $IPFS_UID:$IPFS_GID /go/bin/*

ENV IPFS_VERSION=0.4.15 \
    IPFS_SHA256=48a81cfc34d3a12c8563dbdfae8681be6e4d23c0664d6a192bc2758c4e4ef377

USER $IPFS_UID

WORKDIR $HOME

# Install ipfs JS API
RUN mkdir $HOME/bin && \
    npm install --save \
    bignumber.js@7.2.1 \
    bn.js@4.11.8 \
    secp256k1@3.4.0 \
    debug@3.1.0 \
    ipfs-api@26.1.2 \
    dat@13.10.0 \
    && ln -s $HOME/node_modules/dat/bin/cli.js $HOME/bin/dat ;

RUN cd $HOME; \
    npm install -S react@16.6.1 \
    @types/react@16.7.3 \
    crypto-js@3.1.9-1 \
    ethereumjs-tx@1.3.7 \
    ipfs-api@26.1.2 \
    jquery@3.3.1 \
    js-sha256@0.9.0 \
    react-bootstrap@0.32.4 \
    react-dom@16.6.1 \
    url-parse@1.4.4 \
    web3@1.0.0-beta.36 \
    && npm install -S @types/react-dom@16.0.9 \
    babel-core@6.26.3 \
    babel-loader@7.1.5 \
    babel-preset-env@1.7.0 \
    babel-preset-react@6.24.1 \
    css-loader@1.0.1 \
    file-loader@1.1.11 \
    html-loader@0.5.5 \
    html-webpack-plugin@3.2.0 \
    style-loader@0.21.0 \
    webpack@4.25.1 \
    webpack-cli@3.1.2 \
    webpack-dev-server@3.1.10 

COPY ./bin/*.sh $HOME/bin/

CMD ["/home/ipfsuser/bin/launch.sh"]

EXPOSE 3000

# Ports for Swarm TCP, Swarm uTP, API, Gateway, Swarm Websockets
EXPOSE 4001
EXPOSE 4002/udp
EXPOSE 5001
EXPOSE 8080
EXPOSE 8081
# Geth ports
EXPOSE 8545 8546 30303 30303/udp
