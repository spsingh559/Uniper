#token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTU3ODQ1NDIsImlhdCI6MTUxNTc0ODU0Mn0._8HoUIRu5I4TGJl9UceAlD-9dp6mcTkC0kkT_txOi68"


curl -s -X POST \
  http://localhost:8080/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer1"],
	"chaincodeName":"DemandRequestCC",
	"chaincodePath":"github.com/chaincodes/DemandRequests",
	"chaincodeVersion":"v0"
}'
echo
echo "install product chaincode"

curl -s -X POST \
  http://localhost:8080/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer1"],
	"chaincodeName":"ProductCC",
	"chaincodePath":"github.com/chaincodes/Products",
	"chaincodeVersion":"v0"
}'

echo "product CC installed"
echo
echo "install shipment chaincode"
echo
curl -s -X POST \
  http://localhost:8080/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer1"],
	"chaincodeName":"ShipmentCC",
	"chaincodePath":"github.com/chaincodes/Shipments",
	"chaincodeVersion":"v0"
}'
echo
echo

echo "install invoice chaincode"
echo

curl -s -X POST \
  http://localhost:8080/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer1"],
	"chaincodeName":"InvoiceCC",
	"chaincodePath":"github.com/chaincodes/Invoice",
	"chaincodeVersion":"v0"
}'

echo
echo "instantiate DR CC"

curl -s -X POST \
  http://localhost:8080/channels/mychannel/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"chaincodeName":"DemandRequestCC",
	"chaincodeVersion":"v0",
	"args":[]
}'


echo instantiate product chaincode
curl -s -X POST \
  http://localhost:8080/channels/mychannel/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"chaincodeName":"ProductCC",
	"chaincodeVersion":"v0",
	"args":[]
}'

echo instantiate shipment chaincode
curl -s -X POST \
  http://localhost:8080/channels/mychannel/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"chaincodeName":"ShipmentCC",
	"chaincodeVersion":"v0",
	"args":[]
}'

echo instantiate invoice chaincode
curl -s -X POST \
  http://localhost:8080/channels/mychannel/chaincodes \
  -H "authorization: Bearer $token" \
  -H "content-type: application/json" \
  -d '{
	"chaincodeName":"InvoiceCC",
	"chaincodeVersion":"v0",
	"args":[]
}'



