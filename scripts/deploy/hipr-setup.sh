usage () {
    echo "usage: ./hipr-setup.sh <mode> <files-path> <deploy-path> [<remote:pem-file> <remote:host>]"
    echo "   mode            Mode (local|docker|remote)"
    echo "   files-path      Path to source files"
    echo "   deploy-path     Path to deploy"
    echo "   remote:pem-file PEM file"
    echo "   remote:host     Remote host"
}

if [ "$#" -lt 3 ]; then
    usage
    exit 1
fi
#set -x
MODE=$1
FILES_PATH=$2
DEPLOY_PATH=$3

PEM=$4
HOST=$5

download () {
    echo DOWNLOAD: $1
    git clone $2 $3

    P=$3
    if [ "$3" == "HIPR" ]; then
        P=$3/WebBuild
    fi

    pushd $P > /dev/null
    npm install
    popd > /dev/null
}

setup_local () {
    echo hipr-setup: deploy
    echo MODE=$MODE
    echo FILES_PATH=$FILES_PATH
    echo DEPLOY_PATH=$DEPLOY_PATH

    mkdir -p $DEPLOY_PATH
    cd $DEPLOY_PATH

    download "HiPR restful API Webservice" https://github.com/HERCone/restful-hipr restful-hipr
    download "Human Initiated Performace Report" https://github.com/HERCone/HIPR HIPR

    mkdir -p config
    echo FILES_PATH=$FILES_PATH > config/config.sh
    echo DEPLOY_PATH=$DEPLOY_PATH >> config/config.sh
}

setup_remote () {
    echo hipr-setup: deploy
    echo MODE=$MODE
    echo FILES_PATH=$FILES_PATH
    echo DEPLOY_PATH=$DEPLOY_PATH
    echo PEM=$PEM
    echo HOST=$HOST

    ./scp.sh $PEM $HOST hipr-setup.sh
    ./ssh.sh $PEM $HOST "mkdir -p container/files container/build"
#    ./ssh.sh $PEM $HOST "ls -l"
    ./ssh.sh $PEM $HOST "./hipr-setup.sh local ~/container/files ~/container/build"
}

if [ "$MODE" == "local" ]; then
    setup_local
    exit $?
fi

if [ "$MODE" == "docker" ]; then
    echo hipr-setup: docker
    ./docker-build.sh $FILES_PATH $DEPLOY_PATH
    exit $?
fi

if [ "$MODE" == "remote" ]; then
    echo hipr-setup: deploy server
    setup_remote
    exit $?
fi

usage
exit 1
