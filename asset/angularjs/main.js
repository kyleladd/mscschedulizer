/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'node_generic_functions',
    'ui.router',
    './directives/semesterDirective',
    './directives/departmentDirective',
    './directives/courseSelectionsDirective',
    './services/userService',
    // './services/schedulizerService'
], function (angular, node_generic_functions) {
    'use strict';
    var app = angular.module('app', [
        'ui.router',
        'semesterDirective',
        'departmentDirective',
        'courseSelectionsDirective',
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
    app.controller('IndexCtrl', ['$scope',function ($scope) {
    }]);
    app.component("selectClassesComponent",{
      templateUrl: '/templates/select-classes.html',
      controllerAs: "$ctrl",
      controller: function($scope, userService, schedulizerService){
        var $ctrl = this;
        $ctrl.$onInit = function () {
          $ctrl.department = userService.get_department();
          $ctrl.semester = userService.get_semester();
          $ctrl.courses = [];
          $ctrl.loading_courses = true;
          $ctrl.courses_selected = userService.get_courses_selected();
        };
        $ctrl.select_course = function(course){
          //Add Course
          var index = node_generic_functions.searchListDictionaries($ctrl.courses_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
          if (index === -1) {
            $ctrl.courses_selected.push(course);
            userService.set_courses_selected($ctrl.courses_selected);
          }
        };
        $scope.$on('semester:set', function(event, data){
          $ctrl.semester = data;
          $ctrl.loading_courses = true;
        });
        $scope.$on('department:set', function(event, data){
          $ctrl.department = data;
          $ctrl.loading_courses = true;
          schedulizerService.get_department_courses($ctrl.department,$ctrl.semester,false)
          .then(function(courses){
            $ctrl.courses = courses;
            $ctrl.loading_courses = false;
          });
          // .catch(function(){

          // })
          // .always(function(){

          // });
        });
      }
    });
    app.controller('GenerateCtrl', ['$scope',function ($scope) {
    }]);
    app.component("courseListingsComponent",{
      templateUrl: '/templates/course-listings.html',
      controllerAs: "$ctrl",
      controller: function($scope, userService, schedulizerService){
        var $ctrl = this;
        $ctrl.$onInit = function () {
          $ctrl.department = userService.get_department();
          $ctrl.semester = userService.get_semester();
          $ctrl.courses = [];
          $ctrl.loading_courses = true;
          $ctrl.courses_selected = userService.get_courses_selected();
        };
        //TODO-KL i think the difference between section and course selections is the crn is or is not null
        $ctrl.select_course = function(course){
          //Add Course
          var index = node_generic_functions.searchListDictionaries($ctrl.courses_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
          if (index === -1) {
            $ctrl.courses_selected.push(course);
            userService.set_courses_selected($ctrl.courses_selected);
          }
        };
        //TODO-KL
        // $ctrl.select_course_section = function(course){
        //   //Add Course
        //   var index = node_generic_functions.searchListDictionaries($ctrl.courses_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
        //   if (index === -1) {
        //     $ctrl.courses_selected.push(course);
        //     userService.set_courses_selected($ctrl.courses_selected);
        //   }
        // };
        //TODO-KL
        // $ctrl.remove_course_section = function(course){
        //   //Add Course
        //   var index = node_generic_functions.searchListDictionaries($ctrl.courses_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
        //   if (index === -1) {
        //     $ctrl.courses_selected.push(course);
        //     userService.set_courses_selected($ctrl.courses_selected);
        //   }
        // };
        //TODO-KL
        $ctrl.remove_course = function(course){
          //Add Course
          var index = node_generic_functions.searchListDictionaries($ctrl.courses_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
          if (index === -1) {
            $ctrl.courses_selected.splice(index,1);
            userService.set_courses_selected($ctrl.courses_selected);
          }
        };
        $scope.$on('semester:set', function(event, data){
          $ctrl.semester = data;
          $ctrl.loading_courses = true;
        });
        $scope.$on('department:set', function(event, data){
          $ctrl.department = data;
          $ctrl.loading_courses = true;
          schedulizerService.get_department_courses($ctrl.department,$ctrl.semester,true)
          .then(function(courses){
            $ctrl.courses = courses;
            $ctrl.loading_courses = false;
          });
        });
      }
    });
    app.component("sidebarComponent",{
      templateUrl: '/templates/sidebar.html',
      controllerAs: "$ctrl",
      bindings: { 
            semester: '<',
            department:'<',
            coursesselected: '<'
        },
      controller: function($scope, userService){
        var $ctrl = this;
        //TODO-KL not needed because semester is watched on change when passed into the department directive
        $ctrl.semesterChanged = function(value){
          userService.set_semester(value);
        };
        $ctrl.departmentChanged = function(value){
          userService.set_department(value);
        };
        $ctrl.selectionsChanged = function(value){
          userService.set_courses_selected(value);
        };
        $ctrl.onInit = function(){
          $ctrl.$postLink = function ($scope,$element) {
            //add event listener to an element
            // debugger;

            //also we can apply jqLite dom manipulation operation on element
          };
          $scope.$on('semester:set', function(event, data){
            $ctrl.semester = data;
          });
          $scope.$on('department:set', function(event, data){
            $ctrl.department = data;
          });
          $scope.$on('courses_selected:set', function(event, data){
            $ctrl.courses_selected = data;
          });
        }
      }
    });
    app.controller('VisualFilterCtrl', ['$scope',function ($scope) {
    }]);
    app.controller('FavoritesCtrl', ['$scope',function ($scope) {
    }]);
    angular.bootstrap(document, ['app']);
});
