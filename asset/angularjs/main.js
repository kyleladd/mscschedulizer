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
    './directives/adjustmentsListingComponent',
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
        'adjustmentsListingDirective',
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
          component: 'visualFilterPage'
        });
       $stateProvider.state({
          name: 'favorites',
          // url: '/view1/{bowlingID}',
          url: "/favorites",
          // templateUrl: '/templates/favorites.html',
          component: 'favoritesPage'
        });
       $stateProvider.state({
          name: 'preview',
          url: "/preview",
          component: 'previewPage',
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
          $ctrl.favorites = userService.get_favorite_schedules();
          $ctrl.user_course_adjustments = userService.get_user_course_adjustments();
          schedulizerService.get_course_infos($ctrl.courses_selected,$ctrl.semester)
          .then(function(courses){
            $ctrl.unmodified_courses = courses;
          })
          .catch(function (data) {
            // Handle error here
            console.log("error", data);
            $ctrl.unmodified_courses = [];
          })
          .finally(function(){
            $ctrl.generateResults();
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
        $ctrl.onFavorite = function(schedule){
          console.log("generate page on favorite");
          $ctrl.favorites.push(schedule);
          userService.set_favorite_schedules($ctrl.favorites);
        };

        $ctrl.onUnfavorite = function(schedule){
          // $ctrl.favorites.splice(i,1);
          console.log("generate page on unfavorite");
          var favorite_index = schedulizerHelperService.findFavorite($ctrl.favorites, schedule);
          $ctrl.favorites.splice(favorite_index,1);
          userService.set_favorite_schedules($ctrl.favorites);
        };

        // $ctrl.toggleFavorite = function(value){
        //   userService.set_schedule_filters(value);
        // };

        $scope.$on('schedule_filters:set', function(event, data){
          $ctrl.filters = data;
          $ctrl.generateResults();
        });
        $scope.$on('favorite_schedules:set', function(event, data){
          $ctrl.favorites = data;
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
          //TODO-KL - reapply filters to listings
        });

        $scope.$on('courses_selected:set', function(event, data){
          $ctrl.courses_selected = data;
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
      controller: function($scope, userService, $uibModal){
        var $ctrl = this;
        $ctrl.timeblockUpdated = function(timeblocks){
          $ctrl.filters.TimeBlocks = timeblocks;
          $ctrl.updateFilters();
        };
        $ctrl.updateFilters = function(){
          $ctrl.change({value:$ctrl.filters})
        };
        $ctrl.openAltViewModal = function(){
          var modalInstance = $uibModal.open({
            animation: true,
            component: 'adjustmentsListingComponent',
            resolve: {
              title: function(){
                  return "Schedule Details"
              },
              body: function(){
                  // var body = "<course-listings-component courses=\"$ctrl.schedule\" icons=\"false\" show-crn-selections=\"false\" show-total-credits=\"true\" show-terms=\"true\"></course-listings-component>";
                  var body = "body";
                  return body;
              },
              // schedule: function(){
              //     return schedule;
              // }
            }
          });
        };
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
        $ctrl.updateFilters = function(){
          $ctrl.change({value:$ctrl.filters})
        };
      }
    });
    app.component("previewPage",{
      templateUrl: '/templates/preview.html',
      controllerAs: "$ctrl",
      controller: function($scope, $stateParams, $state, $location, userService, schedulizerService){
        var $ctrl = this;
        $ctrl.$onInit = function () {
          $ctrl.loading_schedule= true;
          $ctrl.scheduleOptions = node_generic_functions.merge_options(
          {
              favorite:true,
              details:true,
              preview:false,
              export:true
          },$ctrl.scheduleOptions);
          schedulizerService.get_schedule($location.search().crn,$location.search().semester)
          .then(function(courses){
            $ctrl.schedule = courses;
            $ctrl.loading_schedule = false;
          });
        };
      }
    });
    //TODO-KL
    app.component("visualFilterPage",{
      templateUrl: '/templates/visual-filter.html',
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
          $ctrl.favorites = userService.get_favorite_schedules();
          $ctrl.user_course_adjustments = userService.get_user_course_adjustments();
          $ctrl.scheduleOptions = node_generic_functions.merge_options(
          {
              favorite:false,
              details:true,
              preview:true,
              export:false
          },$ctrl.scheduleOptions);
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
          $ctrl.gen_course_combinations = [$ctrl.courses];//schedulizerHelperService.getCombinations($ctrl.courses, $ctrl.courses_selected, $ctrl.filters);
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
        $ctrl.onFavorite = function(schedule){
          console.log("generate page on favorite");
          $ctrl.favorites.push(schedule);
          userService.set_favorite_schedules($ctrl.favorites);
        };

        $ctrl.onUnfavorite = function(schedule){
          // $ctrl.favorites.splice(i,1);
          console.log("generate page on unfavorite");
          var favorite_index = schedulizerHelperService.findFavorite($ctrl.favorites, schedule);
          $ctrl.favorites.splice(favorite_index,1);
          userService.set_favorite_schedules($ctrl.favorites);
        };

        // $ctrl.toggleFavorite = function(value){
        //   userService.set_schedule_filters(value);
        // };

        $scope.$on('schedule_filters:set', function(event, data){
          $ctrl.filters = data;
          $ctrl.generateResults();
        });
        $scope.$on('favorite_schedules:set', function(event, data){
          $ctrl.favorites = data;
        });
      }
    });
    app.component("favoritesPage",{
      templateUrl: '/templates/favorites.html',
      controllerAs: "$ctrl",
      controller: function($scope, userService, schedulizerService, schedulizerHelperService){
        var $ctrl = this;
        $ctrl.displayed_schedules = [];
        $ctrl.$onInit = function () {
          $ctrl.semester = userService.get_semester();
          $ctrl.courses_selected = userService.get_courses_selected();
          $ctrl.favorites = userService.get_favorite_schedules();
          $ctrl.displayed_schedules = $ctrl.favorites.slice(0, 10);
        };

        $ctrl.showMoreSchedules = function(){
          var last_index = $ctrl.displayed_schedules.length - 1;
          var item_to_load = $ctrl.favorites.slice(last_index + 1,last_index + 2);
          if(item_to_load && item_to_load.length > 0){
            $ctrl.displayed_schedules.push(item_to_load[0]);
          }
        };
        
        $ctrl.updateFilters = function(value){
          userService.set_schedule_filters(value);
        };
        $ctrl.onFavorite = function(schedule){
          $ctrl.favorites.push(schedule);
          userService.set_favorite_schedules($ctrl.favorites);
        };

        $ctrl.onUnfavorite = function(schedule){
          var favorite_index = schedulizerHelperService.findFavorite($ctrl.favorites, schedule);
          $ctrl.favorites.splice(favorite_index,1);
          $ctrl.displayed_schedules.splice(favorite_index,1);
          userService.set_favorite_schedules($ctrl.favorites);
        };

        $scope.$on('schedule_filters:set', function(event, data){
          $ctrl.filters = data;
        });
        $scope.$on('favorite_schedules:set', function(event, data){
          $ctrl.favorites = data;
        });
      }
    });
    angular.bootstrap(document, ['app']);
});
