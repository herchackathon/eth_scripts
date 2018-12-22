P=$(dirname $(readlink -f $0))

F="$P/../container/files"
B="$P/../container/build"
K="$P/../container/docker"

mkdir -p $F
mkdir -p $B
mkdir -p $K

DEPLOY_FILES=$(readlink -f $F)
DEPLOY_BUILD=$(readlink -f $B)
DEPLOY_DOCKER=$(readlink -f $K)

REMOTE_BUILD=~/hipr-deploy

REMOTE_PEM=~/.ssh/hipr.pem
REMOTE_HOST=hipr@herc.one
