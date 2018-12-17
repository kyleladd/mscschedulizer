define(['angular', 'lscache'], function (angular,lscache) {
    var service = angular.module("userService", []);
    service.factory('userService', ['$rootScope','$http', function ($rootScope,$http) {
        var factory = {
            // classes_selected: JSON.parse(localStorage.getItem('classes_selected')) || [],
            // favorite_schedules: JSON.parse(localStorage.getItem('favorite_schedules')) || [],
            // schedule_filters: JSON.parse(localStorage.getItem('schedule_filters')) || {TimeBlocks:[],Professors:[],Campuses:{Morrisville:true,Norwich:false},NotFull:false,ShowOnline:true,ShowInternational:false},
            // gen_courses: [],
            // fetched_courses: [],
            // semester: JSON.parse(localStorage.getItem('semester')) || {TermCode: "", Description: "", TermStart: "", TermEnd: ""},
            // department: JSON.parse(localStorage.getItem('department')) || "",
            // department_courses: JSON.parse(localStorage.getItem('department_courses')) || "",
            // current_semester_list: JSON.parse(localStorage.getItem('current_semester_list')) || [],
            // user_course_adjustments: JSON.parse(localStorage.getItem('user_course_adjustments')) || {Courses:[],Sections:[],Meetings:[]}, // type:add/remove/update update section by crn, update meeting by id - i believe meeting ids  are persistent and are not fake.
            // gen_schedules: [],
            // num_loaded: 0,
            // errors: JSON.parse(localStorage.getItem('errors')) || {generate_errors:[]},
            colors: ["#22B548","#2293B5","#3222B5","#B58122","#B52222","#B522B0","#686967","#433050","#B3B522"],
            numToLoad:10,
            get_semester: function(){
                var semester = lscache.get("semester");
                console.log("getting semester", semester);
                return (semester ? semester : "");
                // return (semester ? semester : {TermCode: "", Description: "", TermStart: "", TermEnd: ""});
            },
            set_semester: function(semester){
                console.log("settings semester", semester);
                lscache.set("semester",semester,1*24*60);
                $rootScope.$broadcast('semester:set', semester);
            },
            get_department: function(){
                var department = lscache.get("department");
                console.log("getting department", department);
                return (department ? department : "");
                // return (department ? department : {TermCode: "", Description: "", TermStart: "", TermEnd: ""});
            },
            set_department: function(department){
                console.log("settings department", department);
                lscache.set("department",department,1*24*60);
                $rootScope.$broadcast('department:set', department);
            },
            get_classes_selected: function(){
                var classes_selected = lscache.get("classes_selected");
                console.log("getting classes_selected", classes_selected);
                return (classes_selected ? classes_selected : []);
            },
            set_classes_selected: function(classes_selected){
                console.log("settings classes_selected", classes_selected);
                lscache.set("classes_selected",classes_selected,1*24*60);
                $rootScope.$broadcast('classes_selected:set', classes_selected);
            },
            get_favorite_schedules: function(){
                var favorite_schedules = lscache.get("favorite_schedules");
                console.log("getting favorite_schedules", favorite_schedules);
                return (favorite_schedules ? favorite_schedules : []);
            },
            set_favorite_schedules: function(favorite_schedules){
                console.log("settings favorite_schedules", favorite_schedules);
                lscache.set("favorite_schedules",favorite_schedules,1*24*60);
                $rootScope.$broadcast('favorite_schedules:set', classes_selected);
            },
            get_schedule_filters: function(){
                var schedule_filters = lscache.get("schedule_filters");
                console.log("getting schedule_filters", schedule_filters);
                return (schedule_filters ? schedule_filters : {TimeBlocks:[],Professors:[],Campuses:{Morrisville:true,Norwich:false},NotFull:false,ShowOnline:true,ShowInternational:false});
            },
            set_schedule_filters: function(schedule_filters){
                console.log("settings schedule_filters", schedule_filters);
                lscache.set("schedule_filters",schedule_filters,1*24*60);
                $rootScope.$broadcast('schedule_filters:set', classes_selected);
            },
            get_user_course_adjustments: function(){
                var user_course_adjustments = lscache.get("user_course_adjustments");
                console.log("getting user_course_adjustments", user_course_adjustments);
                return (user_course_adjustments ? user_course_adjustments : {Courses:[],Sections:[],Meetings:[]});
            },
            set_user_course_adjustments: function(user_course_adjustments){
                console.log("settings user_course_adjustments", user_course_adjustments);
                lscache.set("user_course_adjustments",user_course_adjustments,1*24*60);
                $rootScope.$broadcast('user_course_adjustments:set', classes_selected);
            }
        };
        return factory;
    }]);

    return service;
});
