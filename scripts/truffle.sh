NETWORK=$1
#pwd
#ls
echo CONTRACT `pwd`
truffle migrate --network $NETWORK #>2.txt 2>3.txt
#echo `pwd` `ls` >1.txt

