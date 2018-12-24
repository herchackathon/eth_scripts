usage () {
    echo "usage: ./truffle.sh <action> <network>"
    echo "   action  truffle action (deploy|compile)"
    echo "   network ethereum network (main|ropsten|ganache)"
}

if [ "$#" -ne 1 ]; then
    usage
    exit 1
fi


ACTION=$1
NETWORK=$2

echo ACTION=$ACTION
echo NETWORK=$NETWORK
echo CONTRACTS `pwd`

if [ action == 'deploy' ]; then 
    truffle migrate --network $NETWORK #>2.txt 2>3.txt
fi

if [ action == 'compile' ]; then 
    truffle compile
fi

    #echo `pwd` `ls` >1.txt
