/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'ui.router',
    './directives/semesterDirective',
    './services/userService',
    './services/schedulizerService'
], function (angular) {
    'use strict';
    var app = angular.module('app', [
        'ui.router',
        'semesterDirective',
        'userService',
        'schedulizerService'
    ])
    .config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
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
      controllerAs: "self",
      controller: function($scope, userService, schedulizerService){
        var self = this;
        self.$onInit = function () {
          // self.semesters = [];
          self.semester = "";
          schedulizerService.getSemesters()
          .then((data)=>{
            console.log("semesters",data.data);
            self.semesters = data.data;
            self.semester = userService.get_semester();
            console.log("self.semester",self.semester);
            setInterval(function(){
              console.log("SIsemester",self.semester);
            }, 2000);
            // self.semester="201901";
          });
        };
        console.log("SelectClassesCtrl");
        console.log("userService", userService);
        self.semesterChanged = function(value){
          console.log('Semester changed to ' + value);
          userService.set_semester(value);
          console.log("going to load the departments component value");
        };
        // $scope.$watch(angular.bind(self, function () {
        //   return self.semester;
        // }), function (newVal) {
        //   console.log('Semester changed to ' + newVal);
        //   userService.set_semester(newVal);
        // });
        // $scope.$watch(function () {
        //    return self.semester;
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
            self.semester = data;
        })
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
