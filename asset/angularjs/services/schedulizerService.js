define(['angular','./cacheInterceptor'], function (angular) {

    var service = angular.module("schedulizerService", ['cacheInterceptor']);

    service.factory('schedulizerService', ['$http', '$q', function ($http, $q) {
        var base_url = "https://schedulizer-api.morrisville.edu";
        var factory = {};
        factory.get_semesters = function() {
            return $http.get(base_url + "/semesters/", { 
                ttl: 15,
            })
            .then(function(data){
                var semesters = data.data;
                semesters.sort(function(a, b) { 
                    return new Date(a.TermStart) - new Date(b.TermStart);
                });
                return semesters;
            });
        };
        factory.get_departments = function(semester_termcode) {
            if(!semester_termcode){
                return $q.reject("Semester term code required.");
            }
            return $http.get(base_url + "/departments/",
                {
                    params:{
                        semester: semester_termcode
                    },
                    ttl: 15,
                }
            )
            .then(function(data){
                var departments = data.data;
                departments.sort(function(a, b) { 
                    return a.Name - b.Name;
                });
                return departments;
            });
        };
        factory.get_department_courses = function(department, semester_termcode, detailed) {
            if(!department || !semester_termcode){
                return $q.reject("Semester term code and department code required.");
            }
            detailed = (detailed === 1 || detailed === true) ? 1 : 0;
            return $http.get(base_url + "/courses/",{
                params:{
                    department_code: department,
                    semester: semester_termcode,
                    include_objects: detailed
                }
            })
            .then(function(data){
                var courses = data.data;
                courses.sort(function(a, b) { 
                    return a.CourseNumber - b.CourseNumber;
                });
                return courses;
            });
        };
        factory.get_schedule = function(crns, semester_termcode) {
            if(!crns || !semester_termcode){
                return $q.reject("A semester term code and course crns are required"); //TODO-KL Double check intended response obj or list
            }
            return $http.get(base_url + "/info/?crn=" + crns.join("&crn[]=") + "&semester=" + semester_termcode);
        };
        factory.get_course_infos = function(courses, semester_termcode) {
            if(!courses || ! semester_termcode){
                return $q.reject("Semester term code and courses required.");
            }
            var courses_list = "";
            for (var i in courses) {
                var course = courses[i];
                courses_list += "&courses[]=" + course.DepartmentCode + ' ' + course.CourseNumber + ' ' + encodeURIComponent(course.CourseTitle);
            }
            return $http.get({
                url: base_url + "/info/" + "?semester=" + semester_termcode + courses_list,
            });
        };
        return factory;
    }]);

    return service;
});
