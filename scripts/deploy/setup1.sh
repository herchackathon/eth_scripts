. config1.sh

relpath () {
#    echo "$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
    echo "$(cd "$(dirname "$1")"; pwd)"
}

P=`pwd`

#relpath ../../../hipr/HIPR-dev

HERC=`relpath ../../../herc2`
HIPR=$HERC/hipr/HIPR-dev
HIPR_REST=$HERC/restful-hipr
HIPR_SCRIPTS=$HERC/eth-scripts

echo HERC=$HERC
echo HIPR=$HIPR
echo HIPR_REST=$HIPR_REST
echo HIPR_SCRIPTS=$HIPR_SCRIPTS

CONTAINER=$HIPR_SCRIPTS/container
#`relpath ../../container`

echo CONTAINER=$CONTAINER

FILES=$CONTAINER/setup-files
#ls 

if [ ! -d "$CONTAINER" ]; then
    echo "ERROR: $CONTAINER not found"
    exit 1
fi

#ls $CONTAINER

rm -rf $FILES

mkdir -p $FILES
ls $FILES
cd $FILES
pwd

cp -rf $HIPR hipr
cp -rf $HIPR_REST restful-hipr

copy_files () {
    echo TAR hipr.tgz
    tar -czf hipr.tgz --exclude=.git --exclude=node_modules hipr
    echo TAR restful-hipr.tgz
    tar -czf restful-hipr.tgz --exclude=.git --exclude=node_modules restful-hipr

    echo SCP hipr.tgz
    $P/scp.sh $REMOTE_PEM $REMOTE_HOST hipr.tgz
    echo SCP restful-hipr.tgz
    $P/scp.sh $REMOTE_PEM $REMOTE_HOST restful-hipr.tgz
}
copy_files

$P/ssh.sh $REMOTE_PEM $REMOTE_HOST "rm -rf container1 && mkdir -p container1 && cd container1 && ls"
$P/ssh.sh $REMOTE_PEM $REMOTE_HOST "cd container1 && tar xzf ../hipr.tgz"
$P/ssh.sh $REMOTE_PEM $REMOTE_HOST "cd container1 && tar xzf ../restful-hipr.tgz"
$P/ssh.sh $REMOTE_PEM $REMOTE_HOST "cd container1/hipr/WebBuild && npm install"
$P/ssh.sh $REMOTE_PEM $REMOTE_HOST "cd container1/restful-hipr && npm install"
