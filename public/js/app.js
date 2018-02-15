var app = angular.module('MyApp', ['ngRoute']).config(
    ['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/registerVessel.html',
        }).when('/customer', {
            templateUrl: 'partials/customer.html',
        })      
        .when('/transporter', {
            templateUrl: 'partials/transporter.html',
        })
        .when('/uniper', {
            templateUrl: 'partials/uniper.html',
        })
 	.when('/manageProducts', {
            templateUrl: 'partials/manageProducts.html',
        })
	.when('/newProduct', {
            templateUrl: 'partials/newProduct.html',
        })
	.when('/uniperHistory', {
            templateUrl: 'partials/uniperHistory.html',
        })
.when('/counterOfferUniper', {
            templateUrl: 'partials/counterOfferUniper.html',
        })
	.when('/trackShipmentUniper', {
            templateUrl: 'partials/trackShipmentUniper.html',
        })
.when('/payInvoiceUniper', {
            templateUrl: 'partials/payInvoiceUniper.html',
        })

        .when('/supplier', {
            templateUrl: 'partials/supplier.html',
        })
        .when('/trackShipmentSupplier', {
            templateUrl: 'partials/trackShipmentSupplier.html',
        })
  	.when('/payInvoiceSupplier', {
            templateUrl: 'partials/payInvoiceSupplier.html',
        })
        
        .when('/demandRequest', {
            templateUrl: 'partials/demandRequest.html',
        })
        .when('/counterOfferForCustomer', {
            templateUrl: 'partials/counterOfferForCustomer.html',
        })
        .when('/trackShipment', {
            templateUrl: 'partials/trackShipment.html',
        })
          .when('/payInvoiceCustomer', {
            templateUrl: 'partials/payInvoiceCustomer.html',
        })
           .when('/trackShipmentTransporter', {
            templateUrl: 'partials/trackShipmentTransporter.html',
        })
        .when('/payInvoiceTransporter', {
            templateUrl: 'partials/payInvoiceTransporter.html',
        }) 
          .when('/counterRequestUniper', {
            templateUrl: 'partials/counterRequestUniper.html',
        })
    }])


app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
/*app.filter('myStrictFilter', function($filter){
    return function(input, predicate){
        return $filter('filter')(input, predicate, true);
    }
});

app.filter('unique', function() {
    return function (arr, field) {
        var o = {}, i, l = arr.length, r = [];
        for(i=0; i<l;i+=1) {
            o[arr[i][field]] = arr[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
  })*/
