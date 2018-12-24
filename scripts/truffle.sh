usage () {
    echo "usage: ./truffle.sh <action> <network>"
    echo "   action  truffle action (deploy|compile)"
    echo "   network ethereum network (main|ropsten|ganache)"
}

if [ "$#" -ne 2 ]; then
    usage
    exit 1
fi


ACTION=$1
NETWORK=$2

echo ACTION=$ACTION
echo NETWORK=$NETWORK
echo CONTRACTS `pwd`

if [ "$ACTION" == 'deploy' ]; then 
    truffle migrate --network=$NETWORK --reset
    #truffle migrate --network $NETWORK #>2.txt 2>3.txt
    E=$?
    echo TRUFFLE DONE!
    exit $E
fi

if [ "$ACTION" == 'compile' ]; then 
    truffle compile --network $NETWORK
    E=$?
    echo TRUFFLE DONE!
    exit $E
fi

echo NO ACTION: $ACTION
echo ERROR >2
exit 1
    #echo `pwd` `ls` >1.txt

