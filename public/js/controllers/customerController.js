function customerController($scope,$rootScope,$location,$http,$window, $route,$filter,$timeout){

console.log("customerController");
          $http.get('/getUserName').success(function(data){
                console.log(data);
                // $rootScope.loginUserName=data.username;
                var username = data.username.split('@');
                $scope.loginUserName=username[0];
                $scope.username=data.username;
                  $rootScope.traderName=data.name;
                 // document.getElementById("demandRequestBtn").disabled = true;
                 $scope.type = data.type
                 console.log($scope.username);
                 console.log($scope.type);
            });
          

    // $('#myTable').dataTable();
/*$scope.name = function(){
  // $('#myTable').dataTable();
  document.getElementById("myTable").dataTable()
  console.log("nav");
}   */
  $scope.viewConfimedTrade=function(data){
  console.log('Confirm trade modal clicked');
//   $http.get('/sslng/getConfirmedTradeForUniper_Customer').success(function(data) {
//       // console.log($scope.productDetails.prid);
//
// $scope.confirmTradeView = data;
//   console.log($scope.confirmTradeView);
//             }).error(function(err) {
//               console.log("Error in fetching owner name");
//     });
}

//  confirm trade for customer1
$http.get('/sslng/getConfirmedTradeForUniper_Customer?customer_id='+$scope.username).success(function(data) {
 console.log('---------------------------------------getConfirmedTradeForCustomer----------------- ');
     // console.log($scope.productDetails.prid);
   console.log(data);
// $scope.confirmTradeView = data;
$scope.confirmTrades_data=data;
// console.log($scope.confirmTradeView);
         }).error(function(err) {
          console.log("Error in fetching confirm trade");
 });

$http.get('/sslng/products').success(function(data) {
      // console.log($scope.productDetails.prid);
      // console.log(data);
      $scope.productDetails = data;

            }).error(function(err) {
              console.log("Error in fetching owner name");

    });
  // $rootScope.demandRequestDetails = ""
    $http.get('/sslng/getDemandRequestCustomer').success(function(data) {
          // console.log($scope.productDetails.prid);
          var datum = [];
          var datum_1 = [];
          var confirmTrade = [];
        for  (var i=0 ; i < data.length; i++){
            console.log(data[i].status);
            if(data[i].status == "New"){

             datum.push(data[i]);

            }
            else if(data[i].status=="Confirmed Trade"){
            confirmTrade.push(data[i]);

        }else {
              datum_1.push(data[i]);
              }

          }
      console.log(datum);
        console.log(datum_1);
    $scope.demandRequestDetails = datum;
    $scope.counterOfferDetails = datum_1;
    // $scope.confirmTrades_data = confirmTrade;
    console.log($scope.demandRequestDetails);
    console.log($scope.counterOfferDetails);
                }).error(function(err) {
                  console.log("Error in fetching owner name");

        });
        $scope.customerAccepted=function(){
          console.log("customerAccepted");

          var fd = new FormData();
          fd.append('drid', $scope.counterofferForCusomer.drid);
              fd.append('prid', $scope.counterofferForCusomer.prid);
          fd.append('volume', $scope.counterofferForCusomer.volume);
          fd.append('price', $scope.counterofferForCusomer.price);
          fd.append('delivery_location_country', $scope.counterofferForCusomer.delivery_location_country);
          fd.append('delivery_location_city', $scope.counterofferForCusomer.delivery_location_city);
          fd.append('delivery_date', $scope.counterofferForCusomer.delivery_date);
          fd.append('status', "Customer Accepted");
            fd.append('customer_id', $scope.counterofferForCusomer.customer_id);
            fd.append('updated_by', $scope.username);

        console.log(fd);

                  var request = {
                      method: 'POST',
                      // url: '/sslng/product',
                        url: '/dr/channels/mychannel/chaincodes/DemandRequestCC/fcnname/updateDemandRequest',
                      data: fd,
                      transformRequest: angular.identity,
                      headers: {
                          'Content-Type': undefined
                      }
                  }

                  $http(request).success(function(data) {
                          alert("Request has been accepted. \n Transaction hash is:" + data);
                         window.location.reload();

                      })
                      .error(function() {
                          alert('Error in submitting the data. Please try again.');
                      });


        }
        $scope.customerDelined=function(){
          console.log("customer Decline");

          var fd = new FormData();
          fd.append('drid', $scope.counterofferForCusomer.drid);
              fd.append('prid', $scope.counterofferForCusomer.prid);
          fd.append('volume', $scope.counterofferForCusomer.volume);
          fd.append('price', $scope.counterofferForCusomer.price);
          fd.append('delivery_location_country', $scope.counterofferForCusomer.delivery_location_country);
          fd.append('delivery_location_city', $scope.counterofferForCusomer.delivery_location_city);
          fd.append('delivery_date', $scope.counterofferForCusomer.delivery_date);
          fd.append('status', "Customer Declined");
            fd.append('customer_id', $scope.counterofferForCusomer.customer_id);
            fd.append('updated_by', $scope.username);

       console.log(fd);

                  var request = {
                      method: 'POST',
                      // url: '/sslng/product',
                        url: '/dr/channels/mychannel/chaincodes/DemandRequestCC/fcnname/updateDemandRequest',
                      data: fd,
                      transformRequest: angular.identity,
                      headers: {
                          'Content-Type': undefined
                      }
                  }

                  $http(request).success(function(data) {
                          alert("Request has been declined. \n Transaction hash is:" + data);
                        window.location.reload();

                      })
                      .error(function() {
                          alert('Error in submitting the data. Please try again.');
                      });


       }
$scope.submitCounterOffer=function(){
  console.log("............submitCounterOffer.....for...customer.....");
  if($scope.counterofferForCusomer.price != null && $scope.counterofferForCusomer.volume != null && $scope.counterofferForCusomer.delivery_date != null && $scope.selectLocation != null)
  {
    console.log("submitCounterReq");
    var delivery_location = $scope.selectLocation.split(",");
      var city = delivery_location[0]
      var country = delivery_location[1]
      console.log($scope.city);
      console.log($scope.country);

    var fd = new FormData();
            fd.append('drid', $scope.counterofferForCusomer.drid);
                fd.append('prid', $scope.counterofferForCusomer.prid);
            fd.append('volume', $scope.counterofferForCusomer.volume);
            fd.append('price', $scope.counterofferForCusomer.price);
            fd.append('delivery_location_country', city);
            fd.append('delivery_location_city', country);
            fd.append('delivery_date', $scope.counterofferForCusomer.delivery_date);
            fd.append('status', "Counter Request");
              fd.append('customer_id', $scope.counterofferForCusomer.customer_id);
              fd.append('updated_by', $scope.username);
              console.log($scope.counterofferForCusomer.drid);

 console.log($scope.counterofferForCusomer.volume);
 console.log($scope.counterofferForCusomer.price);
  console.log($scope.counterofferForCusomer.delivery_date);
// console.log($scope.delivery_date);
// console.log($scope.counterofferForCusomer.customer_id);
// console.log($scope.counterofferForCusomer.updated_by);
//console.log($scope.demandreq.status);
console.log(fd);
            // var request = {
            //     method: 'POST',
            //     // url: '/sslng/product',
            //       url: '/dr/channels/mychannel/chaincodes/DemandRequests/fcnname/updateDemandRequest',
            //     data: fd,
            //      transformRequest: angular.identity,
            //
            // }
            var request = {
                method: 'POST',
                // url: '/sslng/product',
                  url: '/dr/channels/mychannel/chaincodes/DemandRequestCC/fcnname/updateDemandRequest',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }

            $http(request).success(function(data) {
                    alert("Counter Offer has been successfully submitted. \n Transaction hash is:" + data);
                   //window.location.reload();
                   $location.url("/customer");

                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');

                });
}else{
  alert('Warning: Fields are empty!.');
   // $location.url("/customer");
}

}

$scope.cancelSubmitCounterOffer=function(){
  $location.url('/customer');
}


        $scope.disableBtnInvoice = true;
$scope.invoiceInfoFunc=function(_x){
	$scope.disableBtnInvoice = false;
	console.log($scope.invoiceInfo);
	console.log("invoiceInfoFunc");
$scope.invoiceInfo = _x;
}


$scope.disableBtn = true;
$scope.disableBtnShipment = true;
$scope.disableBtnInvoice= true;
$scope.selectBtnDisable=function(_x){
	console.log(_x);
	if (_x == "disableBtn") {
			$scope.disableBtn = false;
			$scope.disableBtnShipment = true;
			$scope.disableBtnInvoice= true;
		}
	else if(_x == "disableBtnShipment") {
		$scope.disableBtn = true;
			$scope.disableBtnShipment = false;
			$scope.disableBtnInvoice= true;
	} else{
		$scope.disableBtnInvoice= false;
		$scope.disableBtn = true;
		$scope.disableBtnShipment = true;
	}

	}

$scope.createDemandRequest1 = function(){
  console.log("createDemandRequest");
   $location.url("/demandRequest");
}
$scope.counterRequestFunc = function(){
  console.log("counterRequestFunc");
   $location.url("/counterOfferForCustomer");
}
$scope.trackShimentFunc = function(){
  console.log("trackShimentFunc");
   $location.url("/trackShipment");
}

$scope.selectDemandRequest = function(_x){
  console.log("selectDemandRequest");
    $scope.demandRequest = _x;
    console.log($scope.demandRequest);
}
$scope.selectCounterOfferInfo = function(_x){
  console.log("selectCounterOfferInfo");
    $scope.counterOffer = _x;
    console.log($scope.counterOffer);
}
$scope.selectConfirmTrade = function(_x){
  console.log("selectConfirmTrade");
    $scope.confirmTradeView = _x;
    console.log($scope.confirmTradeView);
}
$scope.disableAcceptBtn = false;
$scope.selectCounterofferForCusomer = function(_x){
  console.log("selectCounterofferForCusomer");
  $scope.disableAcceptBtn = true;
    $rootScope.copyCounterofferForCusomer=angular.copy(_x);
    $rootScope.counterofferForCusomer = _x;
    console.log($rootScope.counterofferForCusomer);
      $rootScope.selectLocation=$scope.counterofferForCusomer.delivery_location_country+','+$scope.counterofferForCusomer.delivery_location_city;
}
$scope.selectCounterOfferInfo = function(_x){
  console.log("selectCounterOfferInfo");
    $scope.counterOffer = _x;
    console.log($scope.counterOffer);
}
$scope.selectCounterOfferInfo = function(_x){
  console.log("selectCounterOfferInfo");
    $scope.counterOffer = _x;
    console.log($scope.counterOffer);
}
$scope.payInvoiceFunc = function(){
  console.log("payInvoiceCustomer");
   $location.url("/payInvoiceCustomer");
}
//document.getElementById("demandRequestBtn").disabled = true;
$scope.demandReqDisable = false;
$scope.selectProductDemand = function(_x){
$scope.demandReqDisable = true;
  console.log("selectProductDemand");

   $scope.ProductDemand = _x;
   $scope.TotalCost=parseInt($scope.ProductDemand.volume)*(parseInt($scope.ProductDemand.transporter_cost)+parseInt($scope.ProductDemand.supplier_cost));
   console.log($scope.ProductDemand);
}

$scope.createDemandRequest = function() {
console.log("createDemandRequest");
// if($scope.ProductDemand.destination_location_country!=null && $scope.ProductDemand.destination_location_city!=null && $scope.ProductDemand.TotalCost!=null && $scope.ProductDemand.volume!=null && $scope.ProductDemand.destination_date!=null)
// {
var TotalCost=parseInt($scope.ProductDemand.volume)*(parseInt($scope.ProductDemand.transporter_cost)+parseInt($scope.ProductDemand.supplier_cost));
  console.log('Total cost is');
  console.log(TotalCost);
          var fd = new FormData();
          fd.append('drid', $scope.drid);
          fd.append('prid', $scope.ProductDemand.prid);
          fd.append('volume', $scope.ProductDemand.volume);
          fd.append('delivery_location_country', $scope.ProductDemand.destination_location_country);
          fd.append('delivery_location_city', $scope.ProductDemand.destination_location_city);
          fd.append('counter_offer_count', "0");
          fd.append('customer_id', $scope.username);
          fd.append('uniper_id', "trader1@uniper.com");
          fd.append('created_by', $scope.username);
          fd.append('updated_by', $scope.username);
          fd.append('destination_date', $scope.ProductDemand.destination_date);
          fd.append('price', $scope.TotalCost);
          fd.append('last_update_timestamp', new Date());
console.log("customer name "+$scope.username);
        console.log(fd);
        console.log($scope.drid)
        console.log($scope.ProductDemand.prid)
        console.log($scope.ProductDemand.volume)
        console.log($scope.ProductDemand.destination_location_country)
        console.log($scope.ProductDemand.destination_location_city)
        console.log($scope.ProductDemand.destination_location_city)
        console.log($scope.username)
        console.log($scope.ProductDemand.destination_date)
        console.log($scope.ProductDemand.supplier_cost)



          var request = {
              method: 'POST',
              // url: '/sslng/product',
                url: '/dr/channels/mychannel/chaincodes/DemandRequestCC/fcnname/createDemandRequest',
              data: fd,
              transformRequest: angular.identity,
              headers: {
                  'Content-Type': undefined
              }
          }
          $http(request).success(function(data) {
                  alert("Successfully created demand request. \n Transaction hash is:" + data);

                 $location.url("/customer");
                 window.location.reload();


              })
              .error(function() {
                  alert('Error in submitting the data. Please try again.');
              });
  // }else{
  //   alert("Please fill all the fields.");
  // }
}

$scope.createCustomDemandRequest = function() {
  console.log("...........createCustomDemandRequest.......");
  var location = $scope.location.split(",");
  var city = location[0];
  var country = location[1];
  console.log(city);
  console.log(country);
console.log("createCustomDemandRequest");
          var fd = new FormData();
          // fd.append('drid', $scope.drid);
          fd.append('prid', "NA");
          fd.append('volume', $scope.volume);
          fd.append('delivery_location_country', country);
          fd.append('delivery_location_city', city);
          fd.append('counter_offer_count', "0");
          fd.append('customer_id', $scope.username);
          fd.append('uniper_id', "trader1@uniper.com");
          fd.append('created_by', $scope.username);
          fd.append('updated_by', $scope.username);
          fd.append('destination_date', $scope.delivery_date);
          fd.append('price', $scope.price);
          fd.append('last_update_timestamp', new Date());
//console.log("customer name "+$scope.username);
        console.log(fd);

          var request = {
              method: 'POST',
              // url: '/sslng/product',
                url: '/dr/channels/mychannel/chaincodes/DemandRequestCC/fcnname/createDemandRequest',
              data: fd,
              transformRequest: angular.identity,
              headers: {
                  'Content-Type': undefined
              }
          }
          $http(request).success(function(data) {
                  alert("Successfully created custom demand request. \n Transaction hash is:" + data);
                  $location.url("/customer");
                  window.location.reload();
              })
              .error(function() {
                  alert('Error in submitting the data. Please try again.');
              });
  }

  //  Shipments

  // Shipment Function-----------------------------------------------------------------------------

    $http.get('/api/getAllShipment/fcnname/getShipmentByUser?user='+$scope.username).success(function(data) {
    // console.log($scope.productDetails.prid);
    console.log('----------------calling to get shipment by customer_id-----------');

    $scope.shipemnts_data=data;

    console.log(data);
    // $scope.shipemnts_data=data;
      // window.location.reload();

    // $scope.productDetails = data;
  }).error(function(err) {
    console.log("Error in fetching shipment by customer_id");

  });

  // selecting shipment row

  $scope.shipmentDataToTrackPage=function(data){
    $rootScope.shipmentDataToTrackShipment=data;
    console.log('data going to track shipment is');
    console.log($rootScope.shipmentDataToTrackShipment);
  }
  //
  // $scope.submitTrackShipmentData=function(data){
  //
  //   var date=new Date();
  //  console.log(date.getMonth());
  //    console.log(date.getFullYear());
  //     console.log(date.getDate());
  //
  //     // ------------------------------------------------------------Take data from confirm trade then uncomment these lines.
  //   $scope.confirmTrades_data.forEach(function(data) {
  //     // console.log(data);
  //       if($rootScope.shipmentDataToTrackShipment.ctid==data.ctid){
  //     console.log('inside if');
  //      shipmentObj={
  //       transporter_id:data.transporter_name,
  //       supplier_id:data.supplier_name
  //     }
  //     console.log(shipmentObj);
  //   }
  // });
  //
  // var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
  // var date=new Date();
  // var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  // console.log('Today is'+ latestDate);
  //
  // var trackObj={
  //   shipment_id:$rootScope.shipmentDataToTrackShipment.shipment_id,
  //   supplier_load_flag:$scope.shipmentDataToTrackShipment.supplier_load_flag,
  //   supplier_load_date:$scope.shipmentDataToTrackShipment.supplier_load_date,
  //   supplier_supporting_doc_name:"DummyFile.pdf",
  //   supplier_load_quantity:$scope.shipmentDataToTrackShipment.supplier_load_quantity,
  //   container_arrival_flag :$scope.shipmentDataToTrackShipment.container_arrival_flag,
  //   container_arrival_date :$scope.shipmentDataToTrackShipment.container_arrival_date,
  //   container_arrival_doc_name :"DummyFile.pdf",
  //   load_to_ship_flag :$scope.shipmentDataToTrackShipment.load_to_ship_flag,
  //   container_load_date :$scope.shipmentDataToTrackShipment.container_load_date,
  //   container_load_doc_name :"DummyFile.pdf",
  //   ship_arrival_flag :$scope.shipmentDataToTrackShipment.ship_arrival_flag,
  //   ship_arrival_date :$scope.shipmentDataToTrackShipment.ship_arrival_date,
  //   ship_arrival_doc_name :"DummyFile.pdf",
  //   container_offload_date :$scope.shipmentDataToTrackShipment.container_offload_date,
  //   container_offload_flag :$scope.shipmentDataToTrackShipment.container_offload_flag,
  //   container_offload_doc_name :"DummyFile.pdf",
  //   bunkering_ready_flag :$scope.shipmentDataToTrackShipment.bunkering_ready_flag,
  //   bunkering_ready_date :$scope.shipmentDataToTrackShipment.bunkering_ready_date,
  //     bunkering_ready_doc_name :"DummyFile.pdf",
  //     bunkering_complete_flag :$scope.shipmentDataToTrackShipment.bunkering_complete_flag,
  //     bunkering_complete_date :$scope.shipmentDataToTrackShipment.bunkering_complete_date,
  //     bunkering_complete_doc_name :"DummyFile.pdf",
  //     customer_handover_flag :$scope.shipmentDataToTrackShipment.customer_handover_flag,
  //     customer_handover_date :$scope.shipmentDataToTrackShipment.customer_handover_date,
  //     customer_handover_doc_name :"DummyFile.pdf",
  //     customer_quantity :$scope.shipmentDataToTrackShipment.customer_quantity,
  //     ctid :$rootScope.shipmentDataToTrackShipment.ctid,
  //     drid :$rootScope.shipmentDataToTrackShipment.drid,
  //     customer_id :$rootScope.shipmentDataToTrackShipment.customer_id,
  //     transporter_id :shipmentObj.transporter_id,
  //     supplier_id :shipmentObj.supplier_id,
  //     updated_by :"customer1@gmail.com",
  //     last_update_date :latestDate
  // }
  //
  // console.log('-----submit obj is----');
  // console.log(trackObj);
  // console.log('length of Object is');
  // console.log(Object.keys(trackObj).length);
  //
  //  var request = {
  //               method: 'POST',
  //                 // url: '/sslng/product',
  //                 url: '/createShipment/channels/mychannel/chaincodes/ShipmentCC/fcnname/updateShipment',
  //                 data: trackObj,
  //               }
  //               $http(request).success(function(data) {
  //                 alert("Successfully Updated Shipment. \n Transaction hash is:" + data);
  //                 // window.location.reload();
  //                 var date=new Date();
  //                 var monthNUmber=date.getMonth()+1;
  //                 var latestDate=date.getDate()+"-"+monthNUmber+"-"+date.getFullYear();
  //                  if(trackObj.customer_handover_flag=='Y' &&  $scope.username=="customer1@gmail.com"){
  //
               // var customerObj={
               //   invoice_id:"CI"+Date.now(),
               //   invoice_date:latestDate,
               //   drid:trackObj.drid,
               //   shipment_id:trackObj.shipment_id,
               //   customer_name: "John Brown",
               //   customer_id:trackObj.customer_id,
               //   created_by: "customer1@gmail.com",
               //   created_date:latestDate
               // };
  //
  //              var request = {
  //              method: 'POST',
  //                // url: '/sslng/product',
  //                url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/createCustomerInvoice',
  //                data: customerObj,
  //              }
  //              $http(request).success(function(data) {
  //                alert("Successfully created Invoice. \n Transaction hash is:" + data);
  //                   $location.url("/customer");
  //
  //
  //               })
  //              .error(function() {
  //                alert('Error in submitting the data. Please try again.');
  //
  //              });
  //            }
  //
  //               })
  //               .error(function() {
  //                 alert('Error in submitting the data. Please try again.');
  //
  //               });
  //
  //
  //             }
$scope.submitTrackShipmentData=function(data){
  var date=new Date();
 console.log(date.getMonth());
   console.log(date.getFullYear());
    console.log(date.getDate());

    var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
var date=new Date();
var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
console.log('Today is'+ latestDate);
  // $scope.confirmTrades_data.forEach(function(data) {
  //   // console.log(data);
  //     if($rootScope.shipmentDataToTrackShipment.ctid==data.ctid){
  //   console.log('inside if');
  //    shipmentObj={
  //     transporter_id:data.transporter_name,
  //     supplier_id:data.supplier_name
  //   }
  //   console.log(shipmentObj);
  // }
  // });
  var doc;
  var document_name;
  if ($scope.shipmentDataToTrackShipment.customer_handover_flag == "N") {
  document_name = "NA"
  }else{
  doc = $scope.shipmentDataToTrackShipment.customer_handover_doc_name;
  document_name = doc.name;


  console.log('document data is');
  console.log(doc);
  var trackObj={
  shipment_id:$rootScope.shipmentDataToTrackShipment.shipment_id,
  supplier_load_flag:$scope.shipmentDataToTrackShipment.supplier_load_flag,
  supplier_load_date:$scope.shipmentDataToTrackShipment.supplier_load_date,
  supplier_supporting_doc_name:$scope.shipmentDataToTrackShipment.supplier_supporting_doc_name,
  supplier_load_quantity:$scope.shipmentDataToTrackShipment.supplier_load_quantity,
  container_arrival_flag :$scope.shipmentDataToTrackShipment.container_arrival_flag,
  container_arrival_date :$scope.shipmentDataToTrackShipment.container_arrival_date,
  container_arrival_doc_name :$scope.shipmentDataToTrackShipment.container_arrival_doc_name,
  load_to_ship_flag :$scope.shipmentDataToTrackShipment.load_to_ship_flag,
  container_load_date :$scope.shipmentDataToTrackShipment.container_load_date,
  container_load_doc_name :$scope.shipmentDataToTrackShipment.container_load_doc_name,
  ship_arrival_flag :$scope.shipmentDataToTrackShipment.ship_arrival_flag,
  ship_arrival_date :$scope.shipmentDataToTrackShipment.ship_arrival_date,
  ship_arrival_doc_name :$scope.shipmentDataToTrackShipment.ship_arrival_doc_name,
  container_offload_date :$scope.shipmentDataToTrackShipment.container_offload_date,
  container_offload_flag :$scope.shipmentDataToTrackShipment.container_offload_flag,
  container_offload_doc_name :$scope.shipmentDataToTrackShipment.container_offload_doc_name,
  bunkering_ready_flag :$scope.shipmentDataToTrackShipment.bunkering_ready_flag,
  bunkering_ready_date :$scope.shipmentDataToTrackShipment.bunkering_ready_date,
    bunkering_ready_doc_name :$scope.shipmentDataToTrackShipment.bunkering_ready_doc_name,
    bunkering_complete_flag :$scope.shipmentDataToTrackShipment.bunkering_complete_flag,
    bunkering_complete_date :$scope.shipmentDataToTrackShipment.bunkering_complete_date,
    bunkering_complete_doc_name :$scope.shipmentDataToTrackShipment.bunkering_complete_doc_name,
    customer_handover_flag :$scope.shipmentDataToTrackShipment.customer_handover_flag,
    customer_handover_date :$scope.shipmentDataToTrackShipment.customer_handover_date,
    customer_handover_doc_name :$rootScope.shipmentDataToTrackShipment.shipment_id+document_name,
    customer_quantity :$scope.shipmentDataToTrackShipment.customer_quantity,
    ctid :$rootScope.shipmentDataToTrackShipment.ctid,
    drid :$rootScope.shipmentDataToTrackShipment.drid,
    customer_id :$rootScope.shipmentDataToTrackShipment.customer_id,
    transporter_id :$rootScope.shipmentDataToTrackShipment.transporter_id,
    supplier_id :$rootScope.shipmentDataToTrackShipment.supplier_id,
    updated_by :$scope.username,
    last_update_date :latestDate
  }

  console.log('-----submit obj is----');
  console.log(trackObj);
  console.log('length of Object is');
  console.log(Object.keys(trackObj).length);

  // Start of New Chgange
  var fd = new FormData();
  fd.append('file', doc);
  fd.append('shipment_id',$rootScope.shipmentDataToTrackShipment.shipment_id);
  var request = {
  method: 'POST',
  url: '/StoreFile',
  data: fd,
  transformRequest: angular.identity,
  headers: {
    'Content-Type': undefined
  }
  };
  $http(request).success(function(err,data) {
  console.log('data return from server ater upload');
  console.log(data);
  console.log('error'+err);
        if (data =="200") {
              var request = {
                method: 'POST',
                url: '/createShipment/channels/mychannel/chaincodes/ShipmentCC/fcnname/updateShipment',
                data: trackObj,
              };
        $http(request).success(function(data) {
          alert("Successfully Updated Shipment. \n Transaction hash is:" + data);
         if(trackObj.customer_handover_flag=='Y' &&  $scope.type=="Customer"){
            //  creating object for invoice
            var date=new Date();
            console.log(date.getMonth()+1);
            var monthNUmber=date.getMonth()+1;
            var latestDate=date.getDate()+"-"+monthNUmber+"-"+date.getFullYear();
            console.log('Today is'+ latestDate);
            console.log('------------------initiating Invoice for supplier--------------------');
            var customerObj={
              invoice_id:"CI"+Date.now(),
              invoice_date:latestDate,
              drid:trackObj.drid,
              shipment_id:trackObj.shipment_id,
              customer_name: $rootScope.traderName,
              customer_id:trackObj.customer_id,
              created_by: $scope.username,
              created_date:latestDate
            };
                      var request = {
                        method: 'POST',
                        url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/createCustomerInvoice',
                        data: customerObj,
                      }
                      $http(request).success(function(data) {
                        alert("Successfully created Invoice. \n Transaction hash is:" + data);
                        $location.url("/customer");
                      }).error(function() {
                        alert('Error while creating the supplier Invoice. Please try again.');
                      });
                    }
        }).error(function() {
          alert('Error while creating the supplier Invoice. Please try again.');
        });
      }
  }).error(function() {
    alert('Error while creating the supplier Invoice. Please try again.');
  });

  // End of New Chgange
          }
        }

   // get Invoice
     $http.get('/api/getInvoice/fcnname/getInvoiceByType?invoice_type='+"Customer").success(function(data) {

    console.log('----------------calling to get Invoice by customer-----------');

    console.log(data);
    $scope.invoices_data = data;
  }).error(function(err) {
    console.log("Error in fetching invoice by customer");

  });



  $scope.payInvoiceFunc = function(){
    var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
  var date=new Date();
  var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  console.log('Today is'+ latestDate);

    console.log("payInvoiceCustomer");
     // $location.url("/payInvoiceCustomer");
     // console.log($scope.invoiceInfo);
     console.log('Started Paying to Uniper');
      var createdDate="12/27/2017";
      var invoicePayObj={
     invoice_id :$scope.invoiceInfo.invoice_id,
    invoice_date :$scope.invoiceInfo.invoice_date,
    invoice_type : $scope.invoiceInfo.invoice_type,
    drid :$scope.invoiceInfo.drid,
    quantity :$scope.invoiceInfo.quantity,
    invoice_amount :$scope.invoiceInfo.invoice_amount,
    vat :$scope.invoiceInfo.vat,
    total_amount :$scope.invoiceInfo.total_amount,
    shipment_id :$scope.invoiceInfo.shipment_id,
    customer_name :$scope.invoiceInfo.customer_name,
      customer_id :$scope.invoiceInfo.customer_id,
      supporting_doc_name :$scope.invoiceInfo.supporting_doc_name,
    status :"Paid",
    created_by :$scope.invoiceInfo.created_by,
    created_date :$scope.invoiceInfo.created_date
  };

   var request = {
                method: 'POST',
                  // url: '/sslng/product',
                  url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/updateInvoice',
                  data: invoicePayObj,
                }
                $http(request).success(function(data) {
                  alert("Successfully updated Invoice. \n Transaction hash is:" + data);
                  window.location.reload();
                  // $location.url("/supplier");

                })
                .error(function() {
                  alert('Error in submitting the data. Please try again.');

                });
              }


}
