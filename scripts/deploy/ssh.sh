PEM=$1
HOST=$2
CMD=$3

set -x

ssh -i $PEM $HOST $CMD
