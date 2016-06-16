var app = angular.module("myapp",[])
.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push('duplicateRequestInterceptor');
}])
.controller("MainCtrl",['$scope','$http',function($scope,$http){
    $scope.sendRequests = function(){
        $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=n&sensor=false')
        .then(function(response){
            $scope.response = response
        })
    }
}])

.factory('duplicateRequestInterceptor',['$q','$injector',function($q,$injector){
    return{
        'request':function(config){
            var $http = $injector.get('$http');
            var findPendingRequestObject = _.find($http.pendingRequests, { 'method': config.method,'url': config.url }); // to detect if we have any pending request for the requesting URL
            if(angular.isDefined(findPendingRequestObject)){
                config.rejectReason = "Duplicated $http request";
                return $q.reject(config);
            }
            return config;
        },
        'responseError': function (rejection) {
          //Check the rejectReason and add you message to user
            if (!rejection.config) {
              alert("Duplicate")
                return $q.reject(rejection);
            }
            return $q.reject(rejection);
        }
    }

}])
