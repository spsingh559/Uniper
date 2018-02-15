function uniperController($scope,$rootScope,$location,$http,$window, $route){
    console.log("uniperController");
    // $controller('customerController', {$scope: $scope});
var orgType;
$http.get('/getUserName').success(function(data){
      console.log(data);
      $scope.username = data.username;
      orgType = data.type
      $rootScope.traderName=data.name;
       // document.getElementById("demandRequestBtn").disabled = true;
       console.log($scope.username);
       //console.log(orgType);
       //  Get confirm trade by uniper_id

     	$http.get('/sslng/getConfirmedTradeForUniper_Customer?uniper_id='+"customer1@gmail.com").success(function(data) {
        console.log('---------------------------------------getConfirmedTradeForUniper----------------- ');
            // console.log($scope.productDetails.prid);
          console.log(data);
    // $scope.confirmTradeView = data; 
    $scope.confirmTrades_data=data;
      // console.log($scope.confirmTradeView);
                }).error(function(err) {
                 console.log("Error in fetching confirm trade");
        });
  });
console.log(orgType);
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
        else if(data[i].status!="Confirmed Trade"){
          datum_1.push(data[i]);
            // confirmTrade.push(data[i]);
            // console.log('data going to confirm trade-----------------------');
            // console.log(confirmTrade);

        }
        // else {
        //   datum_1.push(data[i]);
        //   }

      }
  console.log(datum);
    console.log(datum_1);
$scope.demandRequestDetails = datum;
$scope.counterOfferDetails = datum_1;
// $scope.confirmTrades_data = confirmTrade;
            }).error(function(err) {
              console.log("Error in fetching owner name");

    });

    

$scope.demandRequestDetails_customer = $rootScope.demandRequestDetails;
console.log($scope.demandRequestDetails_customer);

// var source_location =[];
// var destination_location = [];

$scope.checkedSecondRow;
$scope.checkedFirstRow;
$scope.checkedThirdRow;
$scope.checkedFourthRow;
$scope.checkedFifthRow;
$scope.selectFirstRow=function(){
  console.log('row selected');
  // console.log(data);
  // $rootScope.drData=data;
  $scope.checkedFirstRow=true;
  $scope.checkedSecondRow=false;
  $scope.checkedThirdRow=false;
  $scope.checkedFourthRow=false;
  $scope.checkedFifthRow=false;
}

$scope.selectSecondRow=function(){
  console.log('row selected');
  // $rootScope.drData=data;
  $scope.checkedSecondRow=true;
  $scope.checkedFirstRow=false;
  $scope.checkedThirdRow=false;
  $scope.checkedFourthRow=false;
  $scope.checkedFifthRow=false;
}
var globalCTData;

$scope.selectThirdRow=function(data){
  console.log('row selected');
  globalCTData=data;
  console.log(globalCTData);
  $http.get('/sslng/getDemandRequestHistory?drid='+ data.drid).success(function(data){
    console.log("getDemandRequestHistory");
        console.log(data);
        console.log('data inside value');
        console.log(data[0].Value.customer_id);
          $rootScope.demandReqHistory=data;
        });
  $scope.checkedThirdRow=true;
  $scope.checkedSecondRow=false;
  $scope.checkedFirstRow=false;
  $scope.checkedFourthRow=false;
  $scope.checkedFifthRow=false;
}

$scope.selectFourthRow=function(data){
  console.log('row selected');
  console.log(data);
  // $rootScope.trackData=data;
  globalShipmentData=data;
  // var flagStatus=[]
  $scope.checkedFourthRow=true;
  $scope.checkedThirdRow=false;
  $scope.checkedSecondRow=false;
  $scope.checkedFirstRow=false;
  $scope.checkedFifthRow=false;
}

// exist product
$scope.GetAllProduct=function () {
  $http.get('/sslng/products').success(function(data){
console.log('list of all products');
console.log(data);
$scope.ProductDetails = data;
  });

}
$scope.enableSelectButtonModalOnExistingProducts;
$scope.selectProductFromCounter=function(x){
  $scope.enableSelectButtonModalOnExistingProducts=true;
  console.log('------data after selection is' );
  console.log(x);
  $rootScope.demandreq.prid=x.prid;
}

$scope.selectExistingProduct=function(){
  console.log('data after selection is');
  // console.log(_x);
  // $rootScope.demandreq.prid=_x.prid;
}

// click of Existing Product link
// $rootScope.enableBackButtonToManageProduct=false;
// console.log('------------initial enableBackButtonToManageProduct'+$rootScope.enableBackButtonToManageProduct);
// $scope.manageProductsPage=function(){
//   $rootScope.enableBackButtonToManageProduct=true;
//   console.log('-----------current enableBackButtonToManageProduct'+$rootScope.enableBackButtonToManageProduct);
//   $location.url('/manageProducts');
// }

$scope.trader = function(){
  console.log("trader");
  $location.url('/uniper');
}
$scope.manageProduct1 = function(){
  console.log("trader");
  $location.url('/manageProducts');
}

$scope.createProduct = function() {
  if($scope.location != null &&
    $scope.volume != null &&
    $scope.loadDate != null &&
    $scope.supplierCost != null &&
    $scope.transporterName != null &&
    $scope.loadPort != null &&
    $scope.destinationDate != null &&
    $scope.transportationCost != null &&
    $scope.containerLoadDate != null &&
    $scope.containerDischargeDate != null &&
    $scope.dischargePort != null &&
      $scope.supplier != null &&
        $scope.destinationLocation != null
  ){
  var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
 var date=new Date();
 var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
 console.log('Today is'+ latestDate);

  console.log("source location "+$scope.location);
  var source_location=$scope.location.split(",");
  console.log(source_location[0]);
  console.log(source_location[1]);
  console.log("Destination location "+$scope.destinationLocation);
  var destination_location=$scope.destinationLocation.split(",");
  console.log(destination_location[0]);
  console.log(destination_location[1]);


console.log("createProduct");
          var fd = new FormData();
          fd.append('prid', $scope.prid);
          fd.append('supplier_name', $scope.supplier);
          fd.append('volume', $scope.volume);
          fd.append('source_location_city', source_location[0]);
          fd.append('source_location_country',source_location[1] );
          fd.append('supplier_load_date', $scope.loadDate);
          fd.append('supplier_cost', $scope.supplierCost);
          fd.append('tranporter_name', $scope.transporterName);
          fd.append('load_port', $scope.loadPort);
          fd.append('transporter_cost', $scope.transportationCost);
          fd.append('container_load_date', $scope.containerLoadDate);
          fd.append('container_discharge_date', $scope.containerDischargeDate);
          fd.append('discharge_port', $scope.dischargePort);
          fd.append('destination_location_country', destination_location[1]);
            fd.append('destination_location_city', destination_location[0]);
          fd.append('destination_date', $scope.destinationDate);
          fd.append('created_by', $scope.username);
          fd.append('updated_by', $scope.username);
          fd.append('last_update_timestamp', latestDate);
          console.log($scope.supplierCost);
          console.log(fd);

          var request = {
              method: 'POST',
              // url: '/sslng/product',
                url: '/channels/mychannel/chaincodes/ProductCC/fcnname/createProduct',
              data: fd,
              transformRequest: angular.identity,
              headers: {
                  'Content-Type': undefined
              }
          }
          $http(request).success(function(data) {
                  alert("Product has been created successfully. \n Transaction hash is:" + data);
                  // setTimeout(function() {
                  //     window.location.reload();
                  // }, 5000);
                  $location.url('/manageProducts');

              })
              .error(function() {
                  alert('Error in submitting the data. Please try again.');
              });

  }else{
    alert('Warning:Fields are empty!.');
    // $location.url('/manageProducts');
  }
}
  $scope.updateProduct = function() {
  console.log("updateProduct");
  var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
var date=new Date();
var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
console.log('Today is'+ latestDate);
  console.log($scope.locationSourceProduct);
  var source_location=$scope.locationSourceProduct.split(",");
  console.log(source_location[0]);
  console.log(source_location[1]);
  console.log("Destination location "+$scope.destinationLocation);
  var destination_location=$scope.destinationLocation.split(",");
  console.log(destination_location[0]);
  console.log(destination_location[1]);
            var fd = new FormData();
            fd.append('prid', $scope.productDetails1.prid);
            fd.append('supplier_name', $scope.productDetails1.supplier_name);
            fd.append('volume', $scope.productDetails1.volume);
            fd.append('source_location_city', source_location[0]);
            fd.append('source_location_country', source_location[1]);
            fd.append('supplier_load_date', $scope.productDetails1.supplier_load_date);
            fd.append('supplier_cost', $scope.productDetails1.supplier_cost);
            fd.append('tranporter_name', $scope.productDetails1.transporter_name);
            fd.append('load_port', $scope.productDetails1.load_port);
            fd.append('transporter_cost', $scope.productDetails1.transporter_cost);
            fd.append('container_load_date', $scope.productDetails1.container_load_date);
            fd.append('container_discharge_date', $scope.productDetails1.container_discharge_date);
            fd.append('discharge_port', $scope.productDetails1.discharge_port);
            fd.append('destination_location_country',destination_location[1]);
              fd.append('destination_location_city', destination_location[0]);
            fd.append('destination_date', $scope.productDetails1.destination_date);
            fd.append('created_by', $scope.username);
            fd.append('updated_by', $scope.username);
            fd.append('last_update_timestamp',latestDate);

            console.log($scope.productDetails1.prid);
              console.log($scope.productDetails1.supplier_name);
                console.log($scope.productDetails1.volume);

            var request = {
                method: 'POST',
                // url: '/sslng/product',
                  url: '/channels/mychannel/chaincodes/ProductCC/fcnname/updateProduct',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }
            $http(request).success(function(data) {
                    alert("Product has been updated successfully. \n Transaction hash is:" + data);
                   window.location.reload();

                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');
                });

    }
    $scope.cancel = function(){
       window.location.reload();
    }
  $scope.submitCounterOffer=function(){
    if($scope.demandreq.prid != null &&
       $scope.demandreq.price != null &&
        $scope.demandreq.volume != null &&
         $scope.demandreq.delivery_date != null &&
          $scope.selectLocation != null)
    {
    console.log("submitCounterOffer");
    var delivery_location = $scope.selectLocation.split(",");
     var city = delivery_location[0]
      var country = delivery_location[1]
      console.log(city);
      console.log(country);

// console.log('volume'+ $scope.volume);
// console.log('$scope.price'+$scope.price);
// console.log('$scope.delivery_date'+$scope.delivery_date);
    var fd = new FormData();
            fd.append('drid', $scope.demandreq.drid);
            fd.append('prid', $scope.demandreq.prid);
            fd.append('volume', $scope.demandreq.volume);
            fd.append('price', $scope.demandreq.price);
            fd.append('delivery_location_country', city);
            fd.append('delivery_location_city', country);
            fd.append('delivery_date', $scope.demandreq.delivery_date);
            fd.append('status', "Counter Offer");
              fd.append('customer_id', $scope.demandreq.customer_id);
              fd.append('updated_by', $scope.username);
              console.log($scope.demandreq.drid);
console.log($scope.demandreq.price);
 // console.log($scope.city);
 //  console.log($scope.country);
console.log($scope.demandreq.volume);
console.log($scope.demandreq.delivery_date);
console.log($scope.demandreq.customer_id);
console.log($scope.demandreq.updated_by);
//console.log($scope.demandreq.status);
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
                    alert("Counter Offer has been sumitted. \n Transaction hash is:" + data);
                   //window.location.reload();
                    $location.url('/uniper');
                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');
                });
}else{
  alert("Warning: Fields are empty!")
}

}


$scope.cancelCounterOffer=function(){
  $location.url('/uniper');
}
$scope.submitUniperCounterRequest=function(){
    console.log("submitUniperCounterRequest");
    var delivery_location = $scope.selectLocation.split(",");
      $scope.city = delivery_location[0]
      $scope.country = delivery_location[1]
      console.log($scope.city);
      console.log($scope.country);

    var fd = new FormData();
            fd.append('drid', $scope.counterRequestDetails.drid);
            fd.append('volume', $scope.volume);
            fd.append('price', $scope.price);
            fd.append('delivery_location_country', $scope.country);
            fd.append('delivery_location_city', $scope.city);
            fd.append('delivery_date', $scope.delivery_date);
            fd.append('status', "Counter Offer");
              fd.append('customer_id', $scope.counterRequestDetails.customer_id);
              fd.append('updated_by', $scope.username);
              console.log($scope.demandreq.drid);
console.log($scope.counterRequestDetails.price);
 console.log($scope.city);
  console.log($scope.country);
console.log($scope.counterRequestDetails.volume);
console.log($scope.counterRequestDetails.delivery_date);
console.log($scope.counterRequestDetails.customer_id);
console.log($scope.counterRequestDetails.updated_by);
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
                    alert("Counter request has been sumitted. \n Transaction hash is:" + data);
                   //window.location.reload();
                   $location.url('/uniper');

                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');
                });


}
   $scope.selectProductRow = function(_x){
     console.log('selecting Product after click');
    console.log(_x);

    $scope.productDetails1 = _x;
      $rootScope.locationSourceProduct=$scope.productDetails1.source_location_country+','+$scope.productDetails1.source_location_city;
      console.log($scope.productDetails1.source_location_city)
        console.log($scope.productDetails1.source_location_country);
        $rootScope.destinationLocation=$scope.productDetails1.destination_location_country+','+$scope.productDetails1.destination_location_city;

 }
 $scope.uniperAccepted=function(){
   console.log("uniperAccepted");

   var fd = new FormData();
   fd.append('drid', $scope.demandreq.drid);
   fd.append('prid', $scope.demandreq.prid);
   fd.append('volume', $scope.demandreq.volume);
   fd.append('price', $scope.demandreq.price);
   fd.append('delivery_location_country', $scope.demandreq.delivery_location_city);
   fd.append('delivery_location_city', $scope.demandreq.delivery_location_country);
   fd.append('delivery_date', $scope.demandreq.delivery_date);
   fd.append('status', "Uniper Accepted");
     fd.append('customer_id', $scope.demandreq.customer_id);
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
                   alert("Accepted by uniper. \n Transaction hash is:" + data);
                  window.location.reload();

               })
               .error(function() {
                   alert('Error in submitting the data. Please try again.');
               });


}
$scope.uniperDeclined=function(){
  console.log("uniperDeclined");
  // var delivery_location = $scope.selectLocation.split(",");
  //   $scope.city = delivery_location[0]
  //   $scope.country = delivery_location[1]
  //   console.log($scope.city);
  //   console.log($scope.country);
  console.log('prid is-----------------------------------------------------');
  console.log($scope.demandreq.prid);
  var fd = new FormData();
          fd.append('drid', $scope.demandreq.drid);
          fd.append('prid', $scope.demandreq.prid);
          fd.append('volume', $scope.demandreq.volume);
          fd.append('price', $scope.demandreq.price);
          fd.append('delivery_location_country', $scope.demandreq.delivery_location_city);
          fd.append('delivery_location_city', $scope.demandreq.delivery_location_country);
          fd.append('delivery_date', $scope.demandreq.delivery_date);
          fd.append('status', "Uniper Declined");
            fd.append('customer_id', $scope.demandreq.customer_id);
            fd.append('updated_by', $scope.username);


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
                  alert("Delined by uniper. \n Transaction hash is:" + data);
                 window.location.reload();

              })
              .error(function() {
                  alert('Error in submitting the data. Please try again.');
              });


}
$scope.uniperCounterReqAccepted=function(){
   console.log("uniperAccepted");

   var fd = new FormData();
   fd.append('drid', $scope.demandreq.drid);
   fd.append('prid', $scope.demandreq.prid);
   fd.append('volume', $scope.demandreq.volume);
   fd.append('price', $scope.demandreq.price);
   fd.append('delivery_location_country', $scope.demandreq.delivery_location_country);
   fd.append('delivery_location_city', $scope.demandreq.delivery_location_city);
   fd.append('delivery_date', $scope.demandreq.delivery_date);
   fd.append('status', "Uniper Accepted");
     fd.append('customer_id', $scope.demandreq.customer_id);
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
                   alert("Counter request accepted. \n Transaction hash is:" + data);
                  window.location.reload();

               })
               .error(function() {
                   alert('Error in submitting the data. Please try again.');
               });


}
$scope.uniperCounterReqDeclined=function(){
  console.log("uniperDeclined");
  // var delivery_location = $scope.selectLocation.split(",");
  //   $scope.city = delivery_location[0]
  //   $scope.country = delivery_location[1]
  //   console.log($scope.city);
  //   console.log($scope.country);

  var fd = new FormData();
          fd.append('drid', $scope.demandreq.drid);
          fd.append('prid', $scope.demandreq.prid);
          fd.append('volume', $scope.demandreq.volume);
          fd.append('price', $scope.demandreq.price);
          fd.append('delivery_location_country', $scope.demandreq.delivery_location_country);
          fd.append('delivery_location_city', $scope.demandreq.delivery_location_city);
          fd.append('delivery_date', $scope.demandreq.delivery_date);
          fd.append('status', "Uniper Declined");
            fd.append('customer_id', $scope.demandreq.customer_id);
            fd.append('updated_by', $scope.username);


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
                  alert("Counter request declined. \n Transaction hash is:" + data);
                 window.location.reload();

              })
              .error(function() {
                  alert('Error in submitting the data. Please try again.');
              });


}

    /*$scope.selectProductRow1 = function(_x){
      console.log(_x);
      $scope.productData1 = _x;
      console.log(typeof $scope.productData1);
    }*/
  $http.get('/sslng/products').success(function(data) {


  console.log("---------Product details---------- ");
  console.log(data);
   $scope.ProductDetails = data;
});




$scope.selectCounterRequest = function(_x){
    $rootScope.demandreqStatic=angular.copy(_x);
    $rootScope.demandreq = _x
$rootScope.selectLocation=_x.delivery_location_country+','+_x.delivery_location_city;
    console.log( $rootScope.demandreq);
    $http.get('/sslng/getDemandRequestHistory?drid='+ $scope.demandreq.drid).success(function(data){
      console.log("getDemandRequestHistory");
          console.log(data);
          console.log('data inside value');
          console.log(data[0].Value.customer_id);
            $rootScope.demandReqHistory=data;

          //$rootScope.reqHistory = data;
// var History = [];
//   data.forEach()
//   data.forEach(function(datas) {
//     console.log('iteration');
//     console.log(data);
//     $rootScope.demandReqHistory=datas;
//     console.log('demand req history');
//     console.log($rootScope.demandReqHistory);
// });

  // for(x in data){
  //
  // }
    //       for (var i = 0 ; i < data.length ; i++){
    //
    //   //    $rootScope.demandReqHistory = data[i].Value;
    //
    //       History.push(data[i].Value)
    //       console.log(History);
    //
    // }
    //
    // $rootScope.demandReqHistory = History;
    // console.log($rootScope.demandReqHistory);
   });
}
$scope.viewConfimedTrade=function(data){
	console.log('Confirm trade modal clicked');
// 	$http.get('/sslng/getConfirmedTradeForUniper_Customer').success(function(data) {
//       // console.log($scope.productDetails.prid);
//      console.log(data);
$scope.confirmTradeView = data;
//
//   console.log($scope.confirmTradeView);
//             }).error(function(err) {
//               console.log("Error in fetching owner name");
//     });



}
$scope.selectManagedProduct=function(data){
	console.log('Confirm trade modal clicked');
	console.log(data);
	$scope.managedProData=data;
}

	$scope.dataStatus=true;
$scope.editCT=function(){
	console.log('edit confirm trade');
	$scope.dataStatus=false;
}


$scope.newProductPage=function(){
  console.log("create new Request");
   $location.url("/newProduct");
   window.location.reload();
}

$scope.counterofferPage=function(){
  console.log("counter offer uniper");
   $location.url("/counterOfferUniper");
}

$scope.uniperHistoryPage=function(){
  console.log("history uniper");
   $location.url("/uniperHistory");
}

$scope.trackShipmentPage=function(){
  console.log("track Shipment uniper");
   $location.url("/trackShipmentUniper");
}
$scope.selectDemandreq = function(_x){
  console.log(_x);
  $rootScope.demandreqStatic=angular.copy(_x);
  console.log('Static data is');
  console.log($rootScope.demandreqStatic);
  $rootScope.demandreq = _x;
  $rootScope.selectLocation=_x.delivery_location_country+','+_x.delivery_location_city;
console.log($rootScope.selectLocation);
console.log('-----------------demandreq data');
console.log($rootScope.demandreq);
    //$rootScope.destinationLocation=$scope.productDetails1.destination_location_country+','+$scope.productDetails1.destination_location_city;

}

// console.log($rootScope.demandreq);

$scope.payInvoicePage=function(){
  console.log("track Shipment uniper");
   $location.url("/payInvoiceUniper");
}



// 	$scope.checkedSecondRow;
// 	$scope.checkedFirstRow;
// 	$scope.checkedThirdRow;
// 	$scope.checkedFourthRow;
// 	$scope.checkedFifthRow;
// $scope.selectFirstRow=function(data){
// 	console.log('row selected');
//
// 	console.log(data);
// 	$rootScope.drData=data;
// 	$scope.checkedFirstRow=true;
// 	$scope.checkedSecondRow=false;
// 	$scope.checkedThirdRow=false;
// 	$scope.checkedFourthRow=false;
// 	$scope.checkedFifthRow=false;
// }
//
// $scope.selectSecondRow=function(data){
// 	console.log('row selected');
// 	$rootScope.drData=data;
// 	$scope.checkedSecondRow=true;
// 	$scope.checkedFirstRow=false;
// 	$scope.checkedThirdRow=false;
// 	$scope.checkedFourthRow=false;
// 	$scope.checkedFifthRow=false;
// }
//
// $scope.selectThirdRow=function(data){
// 	console.log('row selected');
// 	$scope.checkedThirdRow=true;
// 	$scope.checkedSecondRow=false;
// 	$scope.checkedFirstRow=false;
// 	$scope.checkedFourthRow=false;
// 	$scope.checkedFifthRow=false;
// }
//
// $scope.selectFourthRow=function(data){
// 	console.log('row selected');
// 	console.log(data);
// 	$rootScope.trackData=data;
// 	$scope.checkedFourthRow=true;
// 	$scope.checkedThirdRow=false;
// 	$scope.checkedSecondRow=false;
// 	$scope.checkedFirstRow=false;
// 	$scope.checkedFifthRow=false;
// }
//
// $scope.selectFifthRow=function(data){
// 	console.log('row selected');
// 	$rootScope.invData=data;
// 	$scope.checkedFifthRow=true;
// 	$scope.checkedThirdRow=false;
// 	$scope.checkedSecondRow=false;
// 	$scope.checkedFirstRow=false;
// 	$scope.checkedFourthRow=false;
//
// }

// $scope.initiateShipment=function(){
// 	window.alert('Your shipment has been initiated');
// }

// shipment part
// var globalCTData;
// $scope.selectThirdRow=function(data){
//   console.log('row selected');
//   globalCTData=data;
//   // $scope.checkedThirdRow=true;
//   // $scope.checkedSecondRow=false;
//   // $scope.checkedFirstRow=false;
//   // $scope.checkedFourthRow=false;
//   // $scope.checkedFifthRow=false;
// }

//initiate shipmentID

$scope.initiateShipment=function(){


     var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
var date=new Date();
var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
console.log('Today is'+ latestDate);

  console.log('data from click event is');
  console.log(globalCTData);
  window.alert('Your shipment has been initiated');
  var initiateShipmentObj={
    shipment_id:"SH"+Date.now(),
    customer_quantity:globalCTData.volume,
    ctid:globalCTData.ctid,
    username: $scope.username,
    last_update_date:latestDate,
    transporter_id:globalCTData.transporter_name,
    supplier_id:globalCTData.supplier_name,
    customer_id:globalCTData.customer_id
  };

  console.log(initiateShipmentObj);

  var requests = {
    method: 'POST',
    url: '/createShipment/channels/mychannel/chaincodes/ShipmentCC/fcnname/createShipment',
    data: initiateShipmentObj
  };

  $http(requests).success(function(data) {
    alert("Successfully Initiated Shipment. \n Transaction hash is:"+ data );
                    // console.log(data);
                   window.location.reload();

                   // $scope.shipemnts_data
                 })
  .error(function() {
    alert('Error in submitting the data. Please try again.');
  });

}

// Get All Shipments

var globalShipmentData;
//get all shipment
$http.get('/api/getAllShipment/fcnname/getAllShipments').success(function(data) {
// console.log($scope.productDetails.prid);
console.log('----------------calling to get all shipment-----------')
console.log(data);
$scope.shipemnts_data=data;
var arr=[];
$rootScope.mainArr=[];
var count =0;
data.forEach(function(data){
  var arr=[data.supplier_load_flag,
data.container_arrival_flag,
data.load_to_ship_flag,
data.ship_arrival_flag,
data.container_offload_flag,
data.bunkering_ready_flag,
data.bunkering_complete_flag,
data.customer_handover_flag
];
count=0;
for(i=0;i<arr.length;i++){

  if(arr[i]=="Y"){
    count++;
  }
}
$rootScope.mainArr.push(count*12.5);
})

console.log('total count of Yes is'+ $rootScope.mainArr[0]);
}).error(function(err) {
console.log("Error in fetching owner name");

});




// $scope.selectFifthRow=function(data){
//   console.log('row selected');
//   $rootScope.invData=data;
//   $scope.checkedFifthRow=true;
//   $scope.checkedThirdRow=false;
//   $scope.checkedSecondRow=false;
//   $scope.checkedFirstRow=false;
//   $scope.checkedFourthRow=false;
//
// }


//click on Track Shipment Button
$scope.trackShipmentPage=function(){
  console.log("track Shipment uniper");
  $rootScope.shipmentDataToTrackShipment=globalShipmentData;
  console.log('shipment data going to trackShipment uniper');
  console.log($rootScope.shipmentDataToTrackShipment);
  $location.url("/trackShipmentUniper");
}

// submitTrackShipmentData
//
// $scope.submitTrackShipmentData=function(data){
//
// var date=new Date();
//  console.log(date.getMonth());
//    console.log(date.getFullYear());
//     console.log(date.getDate());
//     console.log('confirmTrades_data data in track shipment');
// console.log($scope.confirmTrades_data);
//  var shipmentObj;
//
//  var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
// var date=new Date();
// var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
// console.log('Today is'+ latestDate);
//
//
// $scope.confirmTrades_data.forEach(function(data) {
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
//     supplier_id :shipmentObj.transporter_id,
//     updated_by :"trader1@gmail.com",
//     last_update_date :latestDate
// }
//
// console.log('-----submit obj is----');
// console.log(trackObj);
// console.log('length of Object is');
// console.log(Object.keys(trackObj).length);
//
//
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
//                 $location.url("/uniper");
//
//               })
//               .error(function() {
//                 alert('Error in submitting the data. Please try again.');
//               });
//
// }

$scope.submitTrackShipmentData=function(data){

  var date=new Date();
 console.log(date.getMonth());
   console.log(date.getFullYear());
    console.log(date.getDate());

    var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
var date=new Date();
var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()+" "+ date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
console.log('Today is'+ latestDate);

console.log('-----------confirm trade data-----------------');
console.log($scope.confirmTrades_data);

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
var fileName;
if ($scope.shipmentDataToTrackShipment.supplier_load_flag == "N") {
  document_name = "NA"
}else{
  doc = $scope.shipmentDataToTrackShipment.supplier_supporting_doc_name;
  // var timeStamp=Date.now();
   fileName =doc.name;
  // document_name = ;
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
  supplier_supporting_doc_name:fileName,
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
    updated_by : $scope.username,
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
// fd.append('fileName',fileName);
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
          $location.url('/uniper');
        }).error(function() {
          alert('Error while shipment again.');
        });
      }
  }).error(function() {
    alert('Error while Uploading the file Please try again.');
  });

 // End of New Chgange
          }
        }

$scope.selectFifthRow=function(data){
  console.log('row selected');
  $scope.invoiceInfo=data;
  console.log(data);
  if(data.invoice_id.includes("CI")){
    console.log('CI Data');
     $scope.checkedFifthRowSettle=true;
     $scope.checkedFifthRow=false;
  $scope.checkedThirdRow=false;
  $scope.checkedSecondRow=false;
  $scope.checkedFirstRow=false;
  $scope.checkedFourthRow=false;
  }else{
 $scope.checkedFifthRowSettle=false;
     $scope.checkedFifthRow=true;
  $scope.checkedThirdRow=false;
  $scope.checkedSecondRow=false;
  $scope.checkedFirstRow=false;
  $scope.checkedFourthRow=false;
  }


}

// Get
// Supplier
 $http.get('/api/getInvoice/fcnname/getAllInvoices').success(function(data) {

  console.log('----------------calling to get Invoice by Uniper-----------');

  console.log(data);

  $scope.invoices_data = data;
}).error(function(err) {
  console.log("Error in fetching invoice by Uniper");

});

$scope.payInvoicePage = function(){
//   var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
// var date=new Date();
// var latestDate=date.getDate()+"-"+date.getMonth()+1+"-"+date.getFullYear()
// console.log('Today is'+ latestDate);

  console.log("payInvoiceCustomer");
   // $location.url("/payInvoiceCustomer");
   // console.log($scope.invoiceInfo);
   console.log('Started Paying to Uniper');
    if($scope.invoiceInfo.invoice_id.includes("TI")){
     invoicePayObj={
   invoice_id :$scope.invoiceInfo.invoice_id,
  invoice_date :$scope.invoiceInfo.invoice_date,
  invoice_type : $scope.invoiceInfo.invoice_type,
  drid :$scope.invoiceInfo.drid,
  quantity :$scope.invoiceInfo.quantity,
  invoice_amount :$scope.invoiceInfo.invoice_amount,
  vat :$scope.invoiceInfo.vat,
  total_amount :$scope.invoiceInfo.total_amount,
  shipment_id :$scope.invoiceInfo.shipment_id,
  customer_name :$scope.invoiceInfo.transporter_id,
    customer_id :$scope.invoiceInfo.transporter_id,
    supporting_doc_name :"NA",
  status :"Paid",
  created_by :$scope.invoiceInfo.created_by,
  created_date :$scope.invoiceInfo.created_date
};
}else {
   invoicePayObj={
   invoice_id :$scope.invoiceInfo.invoice_id,
  invoice_date :$scope.invoiceInfo.invoice_date,
  invoice_type : $scope.invoiceInfo.invoice_type,
  drid :$scope.invoiceInfo.drid,
  quantity :$scope.invoiceInfo.quantity,
  invoice_amount :$scope.invoiceInfo.invoice_amount,
  vat :$scope.invoiceInfo.vat,
  total_amount :$scope.invoiceInfo.total_amount,
  shipment_id :$scope.invoiceInfo.shipment_id,
  customer_name :$scope.invoiceInfo.supplier_name,
    customer_id :$scope.invoiceInfo.supplier_name,
    supporting_doc_name :"NA",
  status :"Paid",
 created_by :$scope.invoiceInfo.created_by,
  created_date :$scope.invoiceInfo.created_date
};
}

    var createdDate="12/27/2017";


 var request = {
              method: 'POST',
                // url: '/sslng/product',
                url: '/createInvoice/channels/mychannel/chaincodes/InvoiceCC/fcnname/updateInvoice',
                data: invoicePayObj,
              }
              $http(request).success(function(data) {
                alert("Successfully Paid Invoice. \n Transaction hash is:" + data);
                window.location.reload();
                // $location.url("/supplier");

              })
              .error(function() {
                alert('Error in submitting the data. Please try again.');

              });
            }



$scope.settleInvoicePage = function(){
//   var monthName=["Jan", "Feb","March","April","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
// var date=new Date();
// var latestDate=date.getDate()+"-"+monthName[date.getMonth()]+"-"+date.getFullYear()
// console.log('Today is'+ latestDate);


  console.log("settleInvoicePage");
   // $location.url("/payInvoiceCustomer");
   // console.log($scope.invoiceInfo);
   console.log('Started Paying to Uniper');
    var createdDate="12/27/2017";
    // var invoicePayObj;
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
  status :"Settled",
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
                alert("Successfully Settled Invoice. \n Transaction hash is:" + data);
                window.location.reload();
                // $location.url("/supplier");

              })
              .error(function() {
                alert('Error in submitting the data. Please try again.');

              });
            }





}
