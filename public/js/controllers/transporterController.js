function transporterController($scope,$rootScope,$location,$http,$window, $route){
  console.log("transporterController");

          // $http.get('/getuser').success(function(data){
          //       console.log(data);
          //       $scope.name = data.replace(/[^a-zA-Z0-9 ,]/g, '');
          //
          //   });
          $http.get('/getUserName').success(function(data){
                console.log(data);
                // $rootScope.loginUserName=data.username;
                var username = data.username.split('@');
                $scope.loginUserName=username[0];
                $scope.username=data.username;
                  $rootScope.traderName=data.name;
                 // document.getElementById("demandRequestBtn").disabled = true;

                 console.log($scope.username);
            

            $http.get('/sslng/getConfirmedTradeForUniper_Customer?transporter_name='+$scope.username).success(function(data) {
              console.log('---------------------------------------getConfirmedTradeForTransporter----------------- ');
                  // console.log($scope.productDetails.prid);
                console.log(data);
          // $scope.confirmTradeView = data;
          $scope.confirmTrades_data=data;
            // console.log($scope.confirmTradeView);
                      }).error(function(err) {
                       console.log("Error in fetching confirm trade");
              });
                      //  Shipment

              $http.get('/api/getAllShipment/fcnname/getShipmentByUser?user='+$scope.username).success(function(data) {
                // console.log($scope.productDetails.prid);
                console.log('----------------calling to get shipment by transporter_name-----------');
                $scope.shipemnts_data=data;
                console.log(data);
              }).error(function(err) {
                console.log("Error in fetching shipment by transporter_name");
              });
                      });

  // $scope.confirmTrades_data = [{
  //         "drid":"DR1234",
  //         "status":"Confirmed Trade",
  //         "quantity": "20",
  //         "delivery_location": "Bangalore",
  //         "delivery_date": "12-12-17",
  //         "ctid": "CT12345",
  //         "volume": "500",
  //         "supplier_name": "John",
  //         "supplier_load_date": "13-12-2017",
  //         "source_location": "Mumbai",
  //         "container_load_date": "10-12-2017",
  //         "load_port": "Bangalore",
  //         "container_discharge_date": "15-12-2017",
  //         "uniper_id": "UNP1234",
  //         "customer_id": "CUST1234",
  //         "price": "500"
  //       }];

       // $scope.shipemnts_data = [{
       //    "shipment_id":"SH1234",
       //    "ctid":"CT1234",
       //    "truck_vessel":"Truck",
       //    "current_location": "Bangalore",
       //    "expected_delivery": "12-12-17",
       //    "expected_quantity": "500"
       //  }];
       //  $scope.invoices_data = [{
       //    "invoice_id":"TINV_1234",
       //    "status":"confirmed",
       //    "quantity": "20",
       //    "location": "Bangalore",
       //    "invoice_type": "Transporter",
       //    "transporter_name": "Leo",
       //    "invoice_date": "12-12-2017",
       //    "shipment_id": "SH1234",
       //    "invoice_amount": "500",
       //    "vat": "10%",
       //    "total_amount": "500",
       //    "created_by": "Uniper",
       //    "created_date": "13-12-2017",
       //    "delivery_date": "13-12-2017"
       //
       //  }];



$scope.disableTrackBtn = true;
$scope.disableInvoiceBtn= true;
$scope.selectBtnDisable=function(_x){
  console.log(_x);
  if (_x == "disableTrackBtn") {
      $scope.disableTrackBtn = false;
      $scope.disableInvoiceBtn = true;

    }
  else{
    $scope.disableInvoiceBtn= false;
    $scope.disableTrackBtn = true;

  }

  }

   $scope.selectConfirmTrade = function(_x){
  console.log("selectConfirmTrade");
    $scope.confirmTrade = _x;
    console.log($scope.confirmTrade);
}
  $scope.selectInvoice = function(_x){
  console.log("selectInvoice");
    $scope.invoiceInfo = _x;
    console.log($scope.invoiceInfo);
}
$scope.payInvoiceFunc = function(){
  console.log("payInvoiceTransporter");
   $location.url("/payInvoiceTransporter");
}
$scope.trackShipment = function(){
  $location.url("/trackShipmentTransporter");
}
$scope.myinvoiceInfo = function(_x){
$scope.invoiceInfo=_x;
}




$scope.shipmentDataToTrackPage=function(data){
  $rootScope.shipmentDataToTrackShipment=data;
  console.log('data going to track shipment is');
  console.log($rootScope.shipmentDataToTrackShipment);
  $rootScope.copyShipmentDataToTrackShipment = angular.copy(data);
  console.log('---------copied data is---------');
  console.log($rootScope.copyShipmentDataToTrackShipment);
}

// $scope.submitTrackShipmentData=function(data){
//
//
// // ------------------------------------------------------------Take data from confirm trade then uncomment these lines.
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
// var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
// var date=new Date();
// var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
// console.log('Today is'+ latestDate);
//
//
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
//     updated_by :"transporter1@gmail.com",
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
//                 var date=new Date();
//                 var monthNUmber=date.getMonth()+1;
//                 var latestDate=date.getDate()+"-"+monthNUmber+"-"+date.getFullYear();
//                 // window.location.reload();
//                  if(trackObj.bunkering_complete_flag=='Y' &&  $scope.username=="transporter1@gmail.com" || $scope.username=="trader1@gmail.com"){
//             //   //  creating object for invoice
//                console.log('------------------initiating Invoice for transporter--------------------');
//                var transObj={
//                  invoice_id:"TI"+Date.now(),
//                  invoice_date:latestDate,
//                  drid:trackObj.drid,
//                  shipment_id:trackObj.shipment_id,
//                  supplier_name:trackObj.transporter_id,
//                  created_by:"transporter1@gmail.com",
//                  created_date:latestDate
//                };
//
//                var request = {
//                method: 'POST',
//             //     // url: '/sslng/product',
//                  url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/createTransporterInvoice',
//                  data: transObj,
//                }
//                $http(request).success(function(data) {
//                  alert("Successfully created Invoice. \n Transaction hash is:" + data);
//             //     // window.location.reload();
//           // $location.url("/su");
//                  $location.url("/transporter");
//                })
//                .error(function() {
//                  alert('Error in submitting the data. Please try again.');
//
//              });
//            }else{
//               $location.url("/transporter");
//            }
//
//
//               })
//               .error(function() {
//                 alert('Error in submitting the data. Please try again.');
//
//               });
//
//
//             }
//
    $http.get('/api/getInvoice/fcnname/getInvoiceByType?invoice_type='+"Transporter").success(function(data) {
  console.log('----------------calling to get Invoice by supplier-----------');
  console.log(data);
  $scope.invoices_data = data;
}).error(function(err) {
  console.log("Error in fetching invoice by supplier");

});


// New Chgange

$scope.submitDocName=function(docName){
console.log(docName);

  var fd = new FormData();
  fd.append('file', docName);
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
          alert(docName.name +' is uploaded Successfully');
        }
      });
}
$scope.submitTrackShipmentData=function(data){
  console.log('----------------data coming from shipment table is--------------');
  console.log($rootScope.shipmentDataToTrackShipment);
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
  // var doc;
  // var document_name;
  // if ($scope.shipmentDataToTrackShipment.container_arrival_flag == "N") {
  // document_name = "NA"
  // }else{
  // doc = $scope.shipmentDataToTrackShipment.container_arrival_doc_name;
  // document_name = doc.name;



  // console.log('document data is');
  // console.log(doc);

  console.log($rootScope.shipmentDataToTrackShipment.container_arrival_flag);
  var container_arrival_doc_name;
   if ($scope.shipmentDataToTrackShipment.container_arrival_flag=='Y' && $rootScope.copyShipmentDataToTrackShipment.container_arrival_flag=='N') {
     console.log($rootScope.shipmentDataToTrackShipment.container_arrival_flag);
    console.log('-------i am in Y and N');
    container_arrival_doc_name=$rootScope.shipmentDataToTrackShipment.shipment_id+$scope.shipmentDataToTrackShipment.container_arrival_doc_name.name;
  }else{
    console.log($rootScope.shipmentDataToTrackShipment.container_arrival_flag );
    console.log('----------i am default CONDITIONS-----------');
    container_arrival_doc_name=$scope.shipmentDataToTrackShipment.container_arrival_doc_name;
  }

  var container_load_doc_name;
  console.log('----------------copy data of shipment track is---------------');
  console.log($rootScope.copyShipmentDataToTrackShipment);
  console.log($rootScope.shipmentDataToTrackShipment.load_to_ship_flag+'$rootScope.shipmentDataToTrackShipment.load_to_ship_flag');
   if ($scope.shipmentDataToTrackShipment.load_to_ship_flag=='Y' && $rootScope.copyShipmentDataToTrackShipment.load_to_ship_flag=='N') {
    container_load_doc_name=$rootScope.shipmentDataToTrackShipment.shipment_id+$scope.shipmentDataToTrackShipment.container_load_doc_name.name;
  }else{
    container_load_doc_name=$scope.shipmentDataToTrackShipment.container_load_doc_name;
  }

  var ship_arrival_doc_name;
  console.log($rootScope.shipmentDataToTrackShipment.ship_arrival_flag+'$rootScope.shipmentDataToTrackShipment.ship_arrival_flag');
   if ($scope.shipmentDataToTrackShipment.ship_arrival_flag=='Y' && $rootScope.copyShipmentDataToTrackShipment.ship_arrival_flag=='N') {
    ship_arrival_doc_name=$rootScope.shipmentDataToTrackShipment.shipment_id+$scope.shipmentDataToTrackShipment.ship_arrival_doc_name.name;
  }else{
    ship_arrival_doc_name=$scope.shipmentDataToTrackShipment.ship_arrival_doc_name;
  }

  var container_offload_doc_name;
   if ($scope.shipmentDataToTrackShipment.container_offload_flag=='Y'  && $rootScope.copyShipmentDataToTrackShipment.container_offload_flag=='N') {
    container_offload_doc_name=$rootScope.shipmentDataToTrackShipment.shipment_id+$scope.shipmentDataToTrackShipment.container_offload_doc_name.name;
  }else{
    container_offload_doc_name=$scope.shipmentDataToTrackShipment.container_offload_doc_name;
  }

  var bunkering_ready_doc_name;
   if ($scope.shipmentDataToTrackShipment.bunkering_ready_flag=='Y' && $rootScope.copyShipmentDataToTrackShipment.bunkering_ready_flag=='N') {
    bunkering_ready_doc_name=$rootScope.shipmentDataToTrackShipment.shipment_id+$scope.shipmentDataToTrackShipment.bunkering_ready_doc_name.name;
  }else{
    bunkering_ready_doc_name=$scope.shipmentDataToTrackShipment.bunkering_ready_doc_name;
  }

  var bunkering_complete_doc_name;
   if ($scope.shipmentDataToTrackShipment.bunkering_complete_flag=='Y'  && $rootScope.copyShipmentDataToTrackShipment.bunkering_complete_flag=='N') {
    bunkering_complete_doc_name=$rootScope.shipmentDataToTrackShipment.shipment_id+$scope.shipmentDataToTrackShipment.bunkering_complete_doc_name.name;
  }else{
    bunkering_complete_doc_name=$scope.shipmentDataToTrackShipment.bunkering_complete_doc_name;
  }



  var trackObj={
  shipment_id:$rootScope.shipmentDataToTrackShipment.shipment_id,
  supplier_load_flag:$scope.shipmentDataToTrackShipment.supplier_load_flag,
  supplier_load_date:$scope.shipmentDataToTrackShipment.supplier_load_date,
  supplier_supporting_doc_name:$scope.shipmentDataToTrackShipment.supplier_supporting_doc_name,
  supplier_load_quantity:$scope.shipmentDataToTrackShipment.supplier_load_quantity,
  container_arrival_flag :$scope.shipmentDataToTrackShipment.container_arrival_flag,
  container_arrival_date :$scope.shipmentDataToTrackShipment.container_arrival_date,
  container_arrival_doc_name :container_arrival_doc_name,
  load_to_ship_flag :$scope.shipmentDataToTrackShipment.load_to_ship_flag,
  container_load_date :$scope.shipmentDataToTrackShipment.container_load_date,
  container_load_doc_name :container_load_doc_name,
  ship_arrival_flag :$scope.shipmentDataToTrackShipment.ship_arrival_flag,
  ship_arrival_date :$scope.shipmentDataToTrackShipment.ship_arrival_date,
  ship_arrival_doc_name :ship_arrival_doc_name,
  container_offload_date :$scope.shipmentDataToTrackShipment.container_offload_date,
  container_offload_flag :$scope.shipmentDataToTrackShipment.container_offload_flag,
  container_offload_doc_name :container_offload_doc_name,
  bunkering_ready_flag :$scope.shipmentDataToTrackShipment.bunkering_ready_flag,
  bunkering_ready_date :$scope.shipmentDataToTrackShipment.bunkering_ready_date,
    bunkering_ready_doc_name :bunkering_ready_doc_name,
    bunkering_complete_flag :$scope.shipmentDataToTrackShipment.bunkering_complete_flag,
    bunkering_complete_date :$scope.shipmentDataToTrackShipment.bunkering_complete_date,
    bunkering_complete_doc_name :bunkering_complete_doc_name,
    customer_handover_flag :$scope.shipmentDataToTrackShipment.customer_handover_flag,
    customer_handover_date :$scope.shipmentDataToTrackShipment.customer_handover_date,
    customer_handover_doc_name :$scope.shipmentDataToTrackShipment.customer_handover_doc_name,
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

              var request = {
                method: 'POST',
                url: '/createShipment/channels/mychannel/chaincodes/ShipmentCC/fcnname/updateShipment',
                data: trackObj,
              };
        $http(request).success(function(data) {
          alert("Successfully Updated Shipment. \n Transaction hash is:" + data);
       if(trackObj.bunkering_complete_flag=='Y'){
            //  creating object for invoice
            var date=new Date();
            console.log(date.getMonth()+1);
            var monthNUmber=date.getMonth()+1;
            var latestDate=date.getDate()+"-"+monthNUmber+"-"+date.getFullYear();
            console.log('Today is'+ latestDate);
            console.log('------------------initiating Invoice for supplier--------------------');
            var transObj={
                            invoice_id:"TI"+Date.now(),
                            invoice_date:latestDate,
                            drid:trackObj.drid,
                            shipment_id:trackObj.shipment_id,
                            supplier_name:trackObj.transporter_id,
                            created_by:$scope.username,
                            created_date:latestDate
                          };
                      var request = {
                        method: 'POST',
                        url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/createTransporterInvoice',
                        data: transObj,
                      }
                      $http(request).success(function(data) {
                        alert("Successfully created Invoice. \n Transaction hash is:" + data);
                        $location.url("/transporter");
                      }).error(function() {
                        alert('Error while creating the supplier Invoice. Please try again.');
                      });
                    }else{
                        $location.url("/transporter");
                    }
        }).error(function() {
          alert('Error while creating the supplier Invoice. Please try again.');
        });
        }

// selecting row

$scope.InvoiceDataRow=function(data){
  console.log('invoice Row selected');
  $scope.invSupData=data;
  console.log(data);
}
//  Update
//
$scope.payInvoiceFunc = function(){
  console.log("payInvoiceTransporter");
   // $location.url("/payInvoiceCustomer");
   // console.log($scope.invoiceInfo);
   console.log('Started Paying to Uniper');
   var createdDate="12/27/2017";
   var invoicePayObj={
    invoice_id :$scope.invSupData.invoice_id,
     invoice_date :$scope.invSupData.invoice_date,
     invoice_type : $scope.invSupData.invoice_type,
     drid :$scope.invSupData.drid,
     quantity :$scope.invSupData.quantity,
     invoice_amount :$scope.invSupData.invoice_amount,
     vat :$scope.invSupData.vat,
     total_amount :$scope.invSupData.total_amount,
     shipment_id :$scope.invSupData.shipment_id,
     customer_name :$scope.invSupData.transporter_name,
     customer_id :$scope.username,
     supporting_doc_name :"",
     status :"Settled",
     created_by :$scope.invSupData.created_by,
     created_date :$scope.invSupData.created_date
   };

   console.log('create obj for update invoice is');
   console.log(invoicePayObj);

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
