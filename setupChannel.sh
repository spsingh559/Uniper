orgName=$1
userName=$2


echo
ORG1_TOKEN=$(curl -s -X POST \
  http://localhost:8080/users \
  -H "content-type: application/x-www-form-urlencoded"  -d 'username='$userName'&orgName='$orgName'')
echo $ORG1_TOKEN
ORG1_TOKEN=$(echo $ORG1_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG1 token is $ORG1_TOKEN"
echo
echo "POST request Create channel  ..."
echo
curl -s -X POST \
  http://localhost:8080/channels \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
        "channelName":"mychannel",
        "channelConfigPath":"../artifacts/channel/mychannel.tx"
}'
echo
echo
sleep 5



echo "POST request Join channel on Org1"
echo
curl -s -X POST \
  http://localhost:8080/channels/mychannel/peers \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
        "peers": ["peer1"]
}'
echo
echo

