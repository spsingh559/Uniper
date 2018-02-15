function supplierController($scope,$rootScope,$location,$http,$window, $route){

// $http.get('/getuser').success(function(data){
//                 console.log(data);
//                 $rootScope.userName = data.replace(/[^a-zA-Z0-9 ,]/g, '');
// 	console.log( $scope.userName);
//
//
//             });


$http.get('/getUserName').success(function(data){
      console.log(data);
      // $rootScope.loginUserName=data.username;
      var username = data.username.split('@');
      $scope.loginUserName=username[0];
      $scope.username=data.username;
        $rootScope.traderName=data.name;
         $scope.type = data.type
       // document.getElementById("demandRequestBtn").disabled = true;

       console.log($scope.username);
       console.log($scope.type);
  

            //  supplier confirm trader1
            $http.get('/sslng/getConfirmedTradeForUniper_Customer?supplier_name='+$scope.username).success(function(data) {
              console.log('---------------------------------------getConfirmedTradeForSupplier----------------- ');
              console.log("nav");
                  // console.log($scope.productDetails.prid);
                console.log(data);
          // $scope.confirmTradeView = data;
          $scope.confirmTrades_data=data;
            // console.log($scope.confirmTradeView);
                      }).error(function(err) {
                       console.log("Error in fetching confirm trade");
              });
                      //  supplier
$http.get('/api/getAllShipment/fcnname/getShipmentByUser?user='+$scope.username).success(function(data) {
  // console.log($scope.productDetails.prid);
  console.log('----------------calling to get shipment by supplier-----------');
  $scope.shipemnts_data=data;
  console.log(data);
  // $scope.shipemnts_data=data;
    // window.location.reload();

  // $scope.productDetails = data;
}).error(function(err) {
  console.log("Error in fetching shipment by customer_id");

});
                      });
//
//  $scope.supCTData = [{
//   "ctid":"CT1234",
//     "quantity": "200",
//   "location": "Bangalore",
//   "delivery_date": "12-12-17",
//   "total_price": "500",
// drid:"1243243",
// uniper_ID:"1232423",
// sourceLocation:"Germany",
// supLoadDate:"12-13-2017",
// transporterName:"Amazon",
// containerLoadDate:"14-12-2017",
// loadPort:"Frankfurt"
// },
// {
//  "ctid":"CT12345",
//     "quantity": "300",
//   "location": "Chennai",
//   "delivery_date": "19-12-17",
//   "total_price": "89000",
// drid:"1243243sdfas",
// uniper_ID:"1232423asdf",
// sourceLocation:"Germany",
// supLoadDate:"12-13-2017",
// transporterName:"Amazon",
// containerLoadDate:"14-12-2017",
// loadPort:"Frankfurt"
// }];
//
// $scope.shipemnts_data = [{
//           "shipment_id":"SH1234",
//           "ctid":"CT1234",
//           "truck_vessel":"Truck",
//           "current_location": "Bangalore",
//           "expected_delivery": "12-12-17",
//           "expected_quantity": "500",
// loadComplete:"Y",
// actualLoadDate:"12-12-17",
// containerLoadtoShipComplete:"Y",
// containerLoadDate: "16/12/2017",
// containerDischargeComplete:"N",
// containerDischargeDate: "20/12/2017",
// customerHandoverComplete:"N",
// handoverDate:"25/12/2017",
// quantityReceived:"0000"
//         },
// {
//  "shipment_id":"SH12345",
//           "ctid":"CT12345",
//           "truck_vessel":"Truck",
//           "current_location": "Bangalore",
//           "expected_delivery": "12-12-17",
//           "expected_quantity": "500",
// loadComplete:"Y",
// actualLoadDate:"12-12-17",
// containerLoadtoShipComplete:"Y",
// containerLoadDate: "16/12/2017",
// containerDischargeComplete:"N",
// containerDischargeDate: "20/12/2017",
// customerHandoverComplete:"N",
// handoverDate:"25/12/2017",
// quantityReceived:"0000"
// }];
//
//  $scope.invoices_data = [{
//           "invoice_id":"INV1234",
//           "status":"Pending",
//           "quantity": "20",
//           "location": "Bangalore",
//           "delivery_date": "12-12-17",
//           "total_price": "500",
// 	invoiceType:"Supplier",
//           supplierName:"SINV_1234",
//           invoiceDate:"17/12/2017",
//           shipment_id:"SHI_1234",
//           invoiceAmount:"4589",
// 	totalAmount:"4589",
//           vat:"$300",
//           createdBy:"SINV_1234",
//           createdDate:"12/12/2017"
//         }];



$scope.selectProduct=function(data){
    console.log('Confirm trade modal clicked');
    console.log(data);
    $scope.Data=data;
}

$scope.trackShipmentPage=function(data){

  console.log("track Shipment supplier");
   $location.url("/trackShipmentSupplier");
}

$scope.selectInvoiceData=function(data){
	console.log('inv modal clicked');
	$scope.invModalData=data;
}


$scope.payInvoiceSupplier=function(){
  console.log("track Shipment supplier");
   $location.url("/payInvoiceSupplier");
}
$scope.supplierPage=function(){
  console.log("track Shipment supplier");
   $location.url("/supplier");
}

// $scope.checkedButton;
$scope.checkedButton;
$scope.checkedButtonInvoice;

$scope.selectRow=function(data){
console.log('row selected');
console.log(data);
 $rootScope.shipmentDataToTrackShipment=data;
$scope.checkedButton=true;
$scope.checkedButtonInvoice=false;
}

$scope.selectInvoiceRow=function(data){
console.log('row selected for invoice');
$rootScope.invSupData=data;
console.log(data);
$scope.checkedButtonInvoice=true;
$scope.checkedButton=false;
}



$scope.submitTrackShipmentData=function(data){

  var date=new Date();
 console.log(date.getMonth());
   console.log(date.getFullYear());
    console.log(date.getDate());

    var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
var date=new Date();
var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
console.log('Today is'+ latestDate);

    // ------------------------------------------------------------Take data from confirm trade then uncomment these lines.
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
var doc;
var document_name;
if ($scope.shipmentDataToTrackShipment.supplier_load_flag == "N") {
  document_name = "NA"
}else{
  doc = $scope.shipmentDataToTrackShipment.supplier_supporting_doc_name;
  document_name = doc.name;
}

console.log('document data is');
console.log(doc);
// var fd = new FormData();
// fd.append('file', doc




if (document_name != "NA") {
var trackObj={
  shipment_id:$rootScope.shipmentDataToTrackShipment.shipment_id,
  supplier_load_flag:$scope.shipmentDataToTrackShipment.supplier_load_flag,
  supplier_load_date:$scope.shipmentDataToTrackShipment.supplier_load_date,
  supplier_supporting_doc_name:$rootScope.shipmentDataToTrackShipment.shipment_id+document_name,
  supplier_load_quantity:$scope.shipmentDataToTrackShipment.supplier_load_quantity,
  container_arrival_flag :$scope.shipmentDataToTrackShipment.container_arrival_flag,
  container_arrival_date :$scope.shipmentDataToTrackShipment.container_arrival_date,
  container_arrival_doc_name :"NA",
  load_to_ship_flag :$scope.shipmentDataToTrackShipment.load_to_ship_flag,
  container_load_date :$scope.shipmentDataToTrackShipment.container_load_date,
  container_load_doc_name :"NA",
  ship_arrival_flag :$scope.shipmentDataToTrackShipment.ship_arrival_flag,
  ship_arrival_date :$scope.shipmentDataToTrackShipment.ship_arrival_date,
  ship_arrival_doc_name :"NA",
  container_offload_date :$scope.shipmentDataToTrackShipment.container_offload_date,
  container_offload_flag :$scope.shipmentDataToTrackShipment.container_offload_flag,
  container_offload_doc_name :"NA",
  bunkering_ready_flag :$scope.shipmentDataToTrackShipment.bunkering_ready_flag,
  bunkering_ready_date :$scope.shipmentDataToTrackShipment.bunkering_ready_date,
    bunkering_ready_doc_name :"NA",
    bunkering_complete_flag :$scope.shipmentDataToTrackShipment.bunkering_complete_flag,
    bunkering_complete_date :$scope.shipmentDataToTrackShipment.bunkering_complete_date,
    bunkering_complete_doc_name :"NA",
    customer_handover_flag :$scope.shipmentDataToTrackShipment.customer_handover_flag,
    customer_handover_date :$scope.shipmentDataToTrackShipment.customer_handover_date,
    customer_handover_doc_name :"NA",
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

 // var request = {
 //              method: 'POST',
 //                // url: '/sslng/product',
 //                url: '/createShipment/channels/mychannel/chaincodes/Shipments/fcnname/updateShipment',
 //                data: trackObj,
 //              };
 //
 //              $http(request).success(function(data) {
 //                alert("Successfully Updated Shipment. \n Transaction hash is:" + data);
 //                 if(trackObj.supplier_load_flag=='Y' &&  $scope.username=="supplier1@gmail.com"){
 //               console.log('------------------initiating Invoice for supplier--------------------');
 //             var supObj={
 //               invoice_id:"SI"+Date.now(),
 //              invoice_date:latestDate,
 //                drid:trackObj.drid,
 //                 shipment_id:trackObj.shipment_id,
 //               supplier_name:trackObj.supplier_id,
 //               created_by:"supplier1@gmail.com",
 //                created_date:latestDate
 //               };
 //               var request = {
 //               method: 'POST',
 //
 //                 url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/createSupplierInvoice',
 //                 data: supObj,
 //               }
 //               $http(request).success(function(data) {
 //               alert("Successfully created Invoice. \n Transaction hash is:" + data);
 //                 $location.url("/supplier");
 //               })
 //               .error(function() {
 //                 alert('Error in submitting the data. Please try again.');
 //               });
 //             }
 //              })
 //              .error(function() {
 //                alert('Error in submitting the data. Please try again.');
 //              });
 //            }
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
          if(trackObj.supplier_load_flag=='Y' &&   $scope.type=="Supplier"){
            //  creating object for invoice
            var date=new Date();
            console.log(date.getMonth()+1);
            var monthNUmber=date.getMonth()+1;
            var latestDate=date.getDate()+"-"+monthNUmber+"-"+date.getFullYear();
            console.log('Today is'+ latestDate);
            console.log('------------------initiating Invoice for supplier--------------------');
                      var supObj={
                        invoice_id:"SI"+Date.now(),
                        invoice_date:latestDate,
                        drid:trackObj.drid,
                        shipment_id:trackObj.shipment_id,
                        supplier_name:trackObj.supplier_id,
                        created_by:$scope.username,
                        created_date:latestDate
                      };
                      var request = {
                        method: 'POST',
                        url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/createSupplierInvoice',
                        data: supObj,
                      }
                      $http(request).success(function(data) {
                        alert("Successfully created Invoice. \n Transaction hash is:" + data);
                        $location.url("/supplier");
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

          // End

          //  get invoice

          // Supplier
          $http.get('/api/getInvoice/fcnname/getInvoiceByType?invoice_type='+"Supplier").success(function(data) {
  // console.log($scope.productDetails.prid);
  console.log('----------------calling to get Invoice by supplier-----------');
  // $scope.shipemnts_data=data;
  console.log(data);
  // $scope.shipemnts_data=data;
    // window.location.reload();

  $scope.invoices_data = data;
}).error(function(err) {
  console.log("Error in fetching invoice by supplier");

});

//  Update Invoice Supplier

$scope.payInvoiceSupplier = function(){
  console.log("payInvoiceSupplier");
   // $location.url("/payInvoiceCustomer");
   // console.log($scope.invoiceInfo);
   console.log('Started Paying to Uniper');

//     var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
// var date=new Date();
// var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
//   console.log('Today is'+ latestDate);

   // var createdDate="12/27/2017";
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
     customer_name :$scope.invSupData.supplier_name,
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
