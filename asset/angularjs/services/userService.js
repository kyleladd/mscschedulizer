define(['angular', 'lscache'], function (angular,lscache) {
    var service = angular.module("userService", []);
    service.factory('userService', ['$http', function ($http) {
        var factory = {
            classes_selected: JSON.parse(localStorage.getItem('classes_selected')) || [],
            favorite_schedules: JSON.parse(localStorage.getItem('favorite_schedules')) || [],
            schedule_filters: JSON.parse(localStorage.getItem('schedule_filters')) || {TimeBlocks:[],Professors:[],Campuses:{Morrisville:true,Norwich:false},NotFull:false,ShowOnline:true,ShowInternational:false},
            // gen_courses: [],
            // fetched_courses: [],
            // semester: JSON.parse(localStorage.getItem('semester')) || {TermCode: "", Description: "", TermStart: "", TermEnd: ""},
            department: JSON.parse(localStorage.getItem('department')) || "",
            // department_courses: JSON.parse(localStorage.getItem('department_courses')) || "",
            // current_semester_list: JSON.parse(localStorage.getItem('current_semester_list')) || [],
            user_course_adjustments: JSON.parse(localStorage.getItem('user_course_adjustments')) || {Courses:[],Sections:[],Meetings:[]}, // type:add/remove/update update section by crn, update meeting by id - i believe meeting ids  are persistent and are not fake.
            // gen_schedules: [],
            // num_loaded: 0,
            // errors: JSON.parse(localStorage.getItem('errors')) || {generate_errors:[]},
            colors: ["#22B548","#2293B5","#3222B5","#B58122","#B52222","#B522B0","#686967","#433050","#B3B522"],
            numToLoad:10,
            get_semester: function(){
                var semester = lscache.get("semester");
                console.log("getting semester", semester);
                return (semester ? semester : {TermCode: "", Description: "", TermStart: "", TermEnd: ""});
            },
            set_semester: function(semester){
                lscache.set("semester",semester,1*1440);
            },
            setDepartment: function(department){
                lscache.set("department",department);
            }
        };
        return factory;
    }]);

    return service;
});
