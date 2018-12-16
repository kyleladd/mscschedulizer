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
          component: 'courseListingsComponent'
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
          $ctrl.semester = userService.get_semester();
          $ctrl.department = userService.get_department();
          console.log("select classes semester,department", $ctrl.semester, $ctrl.department);
        };
        console.log("SelectClassesCtrl");
        console.log("userService", userService);
        // $ctrl.semesterChanged = function(value){
        //   console.log('Semester changed to ' + value);
        //   userService.set_semester(value);
        //   console.log("going to load the departments component value");
        // };
        // $ctrl.departmentChanged = function(value){
        //   console.log('department changed to ' + value);
        //   userService.set_department(value);
        //   console.log("going to load the departments component value");
        // };
        $scope.$on('semester:set', function(event, data){
          console.log("setting semester based on event", data);
          $ctrl.semester = data;
        });
        $scope.$on('department:set', function(event, data){
          console.log("setting department based on event", data);
          $ctrl.department = data;
        });
      }
    });
    app.controller('GenerateCtrl', ['$scope',function ($scope) {
      console.log("GenerateCtrl");
    }]);
    app.component("courseListingsComponent",{
      templateUrl: '/templates/course-listings.html',
      controllerAs: "$ctrl",
      controller: function($scope, userService){
        var $ctrl = this;
        $ctrl.$onInit = function () {
          $ctrl.semester = userService.get_semester();
          $ctrl.department = userService.get_department();
          console.log("course listings semester,department", $ctrl.semester, $ctrl.department);
        };
        console.log("SelectClassesCtrl");
        console.log("userService", userService);
        // $ctrl.semesterChanged = function(value){
        //   console.log('Semester changed to ' + value);
        //   // userService.set_semester(value);
        //   console.log("going to load the departments component value");
        // };
        // $ctrl.departmentChanged = function(value){
        //   console.log('department changed to ' + value);
        //   // userService.set_department(value);
        //   console.log("going to load the departments component value");
        // };
        // $ctrl.$postLink = function ($scope,$element) {
        //   //add event listener to an element
        //   $element.on('click', function(){console.log("clicked course listings")});

        //   //also we can apply jqLite dom manipulation operation on element
        //   // angular.forEach($element.find('div'), function(elem){console.log(elem)})
        // };
        $scope.$on('semester:set', function(event, data){
          console.log("setting semester based on event", data);
          $ctrl.semester = data;
        });
        $scope.$on('department:set', function(event, data){
          console.log("setting department based on event", data);
          $ctrl.department = data;
        });
      }
    });
    app.component("sidebarComponent",{
      templateUrl: '/templates/sidebar.html',
      controllerAs: "$ctrl",
      bindings: { 
            semester: '<',
            department:'<'
        },
      controller: function($scope, userService){
        var $ctrl = this;
        // $ctrl.$onInit = function () {
        //   $ctrl.semester = userService.get_semester();
        //   $ctrl.department = userService.get_department();
        // };
        $ctrl.semesterChanged = function(value){
          debugger;
          console.log('Semester changed to ' + value);
          userService.set_semester(value);
          console.log("going to load the departments component value");
        };
        $ctrl.departmentChanged = function(value){
          console.log('department changed to ' + value);
          userService.set_department(value);
          console.log("going to load the departments component value");
        };
        $ctrl.onInit = function(){
          console.log("SelectClassesCtrl");
          console.log("userService", userService);
          $ctrl.$postLink = function ($scope,$element) {
            //add event listener to an element
            debugger;
            $element.on('click', function(){console.log("clicked course listings")});

            //also we can apply jqLite dom manipulation operation on element
            // angular.forEach($element.find('div'), function(elem){console.log(elem)})
          };
          $scope.$on('semester:set', function(event, data){
            console.log("setting semester based on event, sidebar comp", data);
            $ctrl.semester = data;
          });
          $scope.$on('department:set', function(event, data){
            console.log("setting department based on event, sidebar comp", data);
            $ctrl.department = data;
          });
        }
      }
    });
    app.controller('VisualFilterCtrl', ['$scope',function ($scope) {
      console.log("VisualFilterCtrl");
    }]);
    app.controller('FavoritesCtrl', ['$scope',function ($scope) {
      console.log("FavoritesCtrl");
    }]);
    angular.bootstrap(document, ['app']);
});
