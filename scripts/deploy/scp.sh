PEM=$1
HOST=$2
FILE=$3

scp -i $PEM -r $FILE $HOST:~
