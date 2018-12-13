define(['angular'], function (angular) {
    var service = angular.module("cacheInterceptor", []);
    service.factory('cacheInterceptor', ['$cacheFactory', '$timeout', function($cacheFactory, $timeout) {
    var ttlMap = {};
    return {
      request: function(config) {
        // debugger;
        if (config.ttl) {
          var ttl = config.ttl;
          ttl = ttl * 60 * 1000; //convert to minutes
          delete config.ttl;
          config.cache = true;

          // If not in ttlMap then we set up a timer to delete, otherwise there's already a timer.
          if (!ttlMap[config.url]) {
            ttlMap[config.url] = true;
            $timeout(ttl)
            .then(function() {
              $cacheFactory.get('$http').remove(config.url);          
              delete ttlMap[config.url];
            });
          }
        }
        return config;
      }
    };
  }]);
    return service;
});
