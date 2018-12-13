/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'ui.router',
    './directives/semesterDirective',
    './directives/departmentDirective',
    './services/userService',
    // './services/schedulizerService'
], function (angular) {
    'use strict';
    var app = angular.module('app', [
        'ui.router',
        'semesterDirective',
        'departmentDirective',
        'userService',
        // 'schedulizerService'
    ])
    .config(['$stateProvider','$urlRouterProvider', '$httpProvider', function ($stateProvider,$urlRouterProvider, $httpProvider) {
       $httpProvider.interceptors.push('cacheInterceptor');
       $stateProvider.state({
          name: 'index',
          url: '/',
          templateUrl: '/templates/index.html',
          controller: 'IndexCtrl'
        });
       $stateProvider.state({
          name: 'select-classes',
          url: '/select-classes',
          component: 'selectClassesComponent'
          // templateUrl: '/templates/select-classes.html',
          // controller: 'SelectClassesCtrl'
        });
       $stateProvider.state({
          name: 'generate',
          // url: '/view1/{bowlingID}',
          url: "/generate",
          templateUrl: '/templates/generate.html',
          controller: 'GenerateCtrl'
        });
       $stateProvider.state({
          name: 'course-listings',
          // url: '/view1/{bowlingID}',
          url: "/course-listings",
          templateUrl: '/templates/course-listings.html',
          controller: 'CourseListingsCtrl'
        });
       $stateProvider.state({
          name: 'visual-filter',
          // url: '/view1/{bowlingID}',
          url: "/visual-filter",
          templateUrl: '/templates/visual-filter.html',
          controller: 'VisualFilterCtrl'
        });
       $stateProvider.state({
          name: 'favorites',
          // url: '/view1/{bowlingID}',
          url: "/favorites",
          templateUrl: '/templates/favorites.html',
          controller: 'FavoritesCtrl'
        });
      $urlRouterProvider.otherwise("/");
     
    }]);//;
    console.log("app",app);
    app.controller('IndexCtrl', ['$scope',function ($scope) {
      console.log("IndexCtrl");
    }]);
    app.component("selectClassesComponent",{
      templateUrl: '/templates/select-classes.html',
      controllerAs: "$ctrl",
      controller: function($scope, userService){
        var $ctrl = this;
        $ctrl.$onInit = function () {
          // $ctrl.semesters = [];
          $ctrl.semester = userService.get_semester();
          $ctrl.department = userService.get_department();
        };
        console.log("SelectClassesCtrl");
        console.log("userService", userService);
        $ctrl.semesterChanged = function(value){
          console.log('Semester changed to ' + value);
          // $ctrl.semester = value;
          userService.set_semester(value);
          console.log("going to load the departments component value");
        };
        $ctrl.departmentChanged = function(value){
          console.log('department changed to ' + value);
          userService.set_department(value);
          console.log("going to load the departments component value");
        };
        // $scope.$watch(angular.bind($ctrl, function () {
        //   return $ctrl.semester;
        // }), function (newVal) {
        //   console.log('Semester changed to ' + newVal);
        //   userService.set_semester(newVal);
        // });
        // $scope.$watch(function () {
        //    return $ctrl.semester;
        // },function(value){
        //   console.log('Semester changed to ' + value);
        //   userService.set_semester(value);
        // });
        // $scope.$watch('semester', function(newValue, oldValue){
        //   console.log("watch semester",newValue);
        //   userService.set_semester(newValue);
        // }, true);
        $scope.$on('semester:set', function(event, data){
          console.log("setting semester based on event", data);
            // $scope.$apply(function () {
              $ctrl.semester = data;
            // });
        });
        $scope.$on('department:set', function(event, data){
          console.log("setting department based on event", data);
            // $scope.$apply(function () {
              $ctrl.department = data;
            // });
        });
      }
    });
    // app.controller('SelectClassesCtrl', ['$scope', 'userService',function ($scope, userService) {
    //   console.log("SelectClassesCtrl");
    //   console.log("userService", userService);
    //   $scope.semester = userService.get_semester();
    //   $scope.$watch('semester', function(newValue, oldValue){
    //     console.log("watch semester",newValue);
    //       userService.set_semester(newValue);
    //   });
    // }]);
    app.controller('GenerateCtrl', ['$scope',function ($scope) {
      console.log("GenerateCtrl");
    }]);
    app.controller('CourseListingsCtrl', ['$scope',function ($scope) {
      console.log("CourseListingsCtrl");
    }]);
    app.controller('VisualFilterCtrl', ['$scope',function ($scope) {
      console.log("VisualFilterCtrl");
    }]);
    app.controller('FavoritesCtrl', ['$scope',function ($scope) {
      console.log("FavoritesCtrl");
    }]);
    angular.bootstrap(document, ['app']);
});
