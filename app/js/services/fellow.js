angular.module("matsi.services")
  .factory('FellowService', ['$firebase', '$rootScope', 'Refs', function($firebase, $rootScope, Refs) {
    return require('./exports/fellow')(Refs.rootRef,$rootScope,$firebase);
  }]);
