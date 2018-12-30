/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'node_generic_functions',
    'ui.router',
    'ui.bootstrap',
    'infinite-scroll',
    'theme',
    './directives/semesterDirective',
    './directives/departmentDirective',
    './directives/courseSelectionsDirective',
    './directives/timeblocksDirective',
    // './directives/tooltipDirective',
    './directives/scheduleDirective',
    './directives/courseListingsDirective',
    './services/userService',
    './services/schedulizerService',
    './services/schedulizerHelperService'
], function (angular, node_generic_functions) {
    'use strict';
    var app = angular.module('app', [
        'ui.router',
        'infinite-scroll',
        'semesterDirective',
        'departmentDirective',
        'courseSelectionsDirective',
        'courseListingsDirective',
        'scheduleDirective',
        'timeblocksDirective',
        // 'tooltipDirective',
        'ui.bootstrap',
        'userService',
        'schedulizerService',
        'schedulizerHelperService'
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
          component: 'selectClassesPage'
          // templateUrl: '/templates/select-classes.html',
          // controller: 'SelectClassesCtrl'
        });
       $stateProvider.state({
          name: 'generate',
          // url: '/view1/{bowlingID}',
          url: "/generate",
          // templateUrl: '/templates/generate.html',
          // controller: 'GenerateCtrl'
          component: 'generatePage'
        });
       $stateProvider.state({
          name: 'course-listings',
          // url: '/view1/{bowlingID}',
          url: "/course-listings",
          component: 'courseListingsPage'
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
    app.component("selectClassesPage",{
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
    app.component("generatePage",{
      templateUrl: '/templates/generate.html',
      controllerAs: "$ctrl",
      controller: function($scope, userService, schedulizerService, schedulizerHelperService){
        var $ctrl = this;
        $ctrl.courses = [];
          $ctrl.unmodified_courses = [];
          $ctrl.gen_course_combinations = [];
          $ctrl.loading_courses = true;
          $ctrl.displayed_schedules = [];
        $ctrl.$onInit = function () {
          $ctrl.semester = userService.get_semester();
          $ctrl.courses_selected = userService.get_courses_selected();
          $ctrl.filters = userService.get_schedule_filters();
          $ctrl.user_course_adjustments = userService.get_user_course_adjustments();
          schedulizerService.get_course_infos($ctrl.courses_selected,$ctrl.semester)
          .then(function(courses){
            $ctrl.unmodified_courses = courses;
            //todo-kl probably need to save that request off elsewhere
            $ctrl.generateResults();
          })
          .catch(function (data) {
            // Handle error here
            console.log("error", data);
          });
        };
        $ctrl.generateResults = function(){
          $ctrl.courses = schedulizerHelperService.applyUserModificationsToCourses($ctrl.unmodified_courses, $ctrl.user_course_adjustments, $ctrl.filters);
          $ctrl.gen_course_combinations = schedulizerHelperService.getCombinations($ctrl.courses, $ctrl.courses_selected, $ctrl.filters);
          $ctrl.loading_courses = false;
          $ctrl.displayed_schedules = $ctrl.gen_course_combinations.slice(0, 10);
        };
        $ctrl.showMoreSchedules = function(){
          var last_index = $ctrl.displayed_schedules.length - 1;
          var item_to_load = $ctrl.gen_course_combinations.slice(last_index + 1,last_index + 2);
          if(item_to_load && item_to_load.length > 0){
            $ctrl.displayed_schedules.push(item_to_load[0]);
          }
        };
        $ctrl.updateFilters = function(value){
          userService.set_schedule_filters(value);
        };
        $scope.$on('schedule_filters:set', function(event, data){
          $ctrl.filters = data;
          $ctrl.generateResults();
        });
      }
    });
    app.component("courseListingsPage",{
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
          $ctrl.filters = userService.get_schedule_filters();
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
        
        $ctrl.updateFilters = function(value){
          userService.set_schedule_filters(value);
        };
        $ctrl.selectionsChanged = function(value){
          userService.set_courses_selected(value);
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
        $scope.$on('schedule_filters:set', function(event, data){
          $ctrl.filters = data;
          console.log("filters data applied", $ctrl.filters);
          //TODO-KL - reapply filters to listings
        });

        $scope.$on('courses_selected:set', function(event, data){
          $ctrl.courses_selected = data;
          console.log("courses_selected data applied", $ctrl.courses_selected);
          //TODO-KL - reapply filters to listings
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
      controller: function($scope, $element, userService){
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
        };
        $ctrl.$postLink = function () {
          //TODO-KL might need to pass $element into controller, not this function
          //add event listener to an element

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
    });
    app.component("filtersComponent",{
      templateUrl: '/templates/filters.html',
      controllerAs: "$ctrl",
      bindings: { 
        filters: '<',
        change:'&'
      },
      controller: function($scope, userService){
        var $ctrl = this;
        
        $ctrl.onInit = function(){
        }
        $ctrl.$postLink = function ($scope,$element) {
          //add event listener to an element

          //also we can apply jqLite dom manipulation operation on element
        };
        $ctrl.timeblockUpdated = function(timeblocks){
          console.log("filters - timeblockupdated", timeblocks);
          $ctrl.filters.TimeBlocks = timeblocks;
          $ctrl.updateFilters();
        };
        $ctrl.updateFilters = function(){
          console.log("updating my filters in filters component");
          $ctrl.change({value:$ctrl.filters})
        };
        // $ctrl.changedValue = function(value){
        //     $ctrl.change({value:value});
        // };
      }
    });
    app.component("altViewFilterModal",{
      templateUrl: '/templates/alt-view-filters.html',
      controllerAs: "$ctrl",
      bindings: { 
        user_course_adjustments: '<',
        change:'&'
      },
      controller: function($scope, userService){
        var $ctrl = this;
        
        $ctrl.onInit = function(){
        }
        $ctrl.$postLink = function ($scope,$element) {
          //add event listener to an element

          //also we can apply jqLite dom manipulation operation on element
        };
        $ctrl.updateFilters = function(){
          console.log("updating my filters in filters component");
          $ctrl.change({value:$ctrl.filters})
        };
        // $ctrl.changedValue = function(value){
        //     $ctrl.change({value:value});
        // };
      }
    });
    app.controller('VisualFilterCtrl', ['$scope',function ($scope) {
    }]);
    app.controller('FavoritesCtrl', ['$scope',function ($scope) {
    }]);
    angular.bootstrap(document, ['app']);
});
