P=$(dirname $(readlink -f $0))

F="$P/../../container/files"
D="$P/../../container/build"
K="$P/../../container/docker"

mkdir -p $F
mkdir -p $D
mkdir -p $K

FILES=$(readlink -f $F)
DEPLOY=$(readlink -f $D)
DOCKER=$(readlink -f $K)

echo FILES=$FILES 
echo DEPLOY=$DEPLOY
echo DOCKER=$DOCKER

#./hipr-setup.sh local $FILES $DEPLOY

#./hipr-setup.sh docker $FILES $DOCKER

. config1.sh

echo REMOTE_DEPLOY=$REMOTE_DEPLOY

./hipr-setup.sh remote $FILES $REMOTE_DEPLOY $REMOTE_PEM $REMOTE_HOST
