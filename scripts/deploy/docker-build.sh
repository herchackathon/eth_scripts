usage () {
    echo "usage: ./docker-build.sh <files-path> <deploy-path>"
    echo "   files-path  Path to source files"
    echo "   deploy-path Path to deploy"
}

if [ "$#" -ne 2 ]; then
    usage
    exit 1
fi

FILES_PATH=$1
DEPLOY_PATH=$2

echo FILES_PATH=$FILES_PATH
echo DEPLOY_PATH=$DEPLOY_PATH

docker build -f Dockerfile.build -t hipr/build .
docker container create --name hipr_container hipr/build

#docker container cp $FILES_PATH hipr_container:/root/files
