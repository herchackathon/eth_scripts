usage () {
    echo "usage: ./herc-cli.sh <action> ..."
    echo "  herc-cli.sh - HERC command line interface"
    echo ""
    echo "  options:"
    echo "   action - herc.one action"
    echo "      actions:"
    echo "          truffle:"
    echo "              truffle deploy"
    echo "              truffle compile"
    echo "          deploy:"
    echo "              deploy local container"
    echo "              deploy local docker"
    echo "              deploy remote container"
    echo "          run:"
    echo "              run ganache"
    echo "              run herc"
    echo "              run hipr-restful"
    echo "          status:"
    echo "              status"
    echo "          test:"
    echo "              test all"
}

if [ "$#" -le 2 ]; then
    usage
    exit 1
fi

echo HERC: $@

ACTION=$1
OPT1=$2
OPT2=$3

echo ACTION=$ACTION
echo OPT1=$OPT1
echo OPT2=$OPT2
echo PWD=`pwd`

. ./herc-default-config.sh

# load config
if [ -f herc-local-config.sh ]; then
    . ./herc-local-config.sh
else
    echo Local config not found herc-local-config.sh >2
    echo Used herc-default-config.sh only >2
    echo Please init using herc-scripts >2
fi

echo Using HERC config:
echo DEPLOY_FILES=$DEPLOY_FILES 
echo DEPLOY_BUILD=$DEPLOY_BUILD
echo DEPLOY_DOCKER=$DEPLOY_DOCKER


if [ "$ACTION" == 'deploy' ]; then
    echo Deploy
#    set -x
    if [ "$OPT1" == 'local' ]; then
        if [ "$OPT2" == 'container' ]; then
            ./deploy/hipr-setup.sh local $DEPLOY_FILES $DEPLOY_BUILD
        fi
        if [ "$OPT2" == 'docker' ]; then
            cd deploy
            ./hipr-setup.sh docker $DEPLOY_FILES $DEPLOY_DOCKER
        fi
    fi
    if [ "$OPT1" == 'remote' ]; then
        if [ "$OPT2" == 'container' ]; then
            cd deploy
            ./hipr-setup.sh remote $DEPLOY_FILES $REMOTE_BUILD $REMOTE_PEM $REMOTE_HOST
        fi
    fi
    echo HERC DONE!
    exit 0
fi

if [ $ACTION == 'truffle' ]; then
    echo Truffle
    echo HERC DONE!
fi

if [ $ACTION == 'run' ]; then
    echo Run
    echo HERC DONE!
fi

if [ $ACTION == 'status' ]; then
    echo Status
    echo HERC DONE!
fi

if [ $ACTION == 'test' ]; then
    echo Test
    echo HERC DONE!
fi
