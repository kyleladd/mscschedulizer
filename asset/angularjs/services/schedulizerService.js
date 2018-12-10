// app.factory('settings', ['$http', function($http) {
//     return $http.get('/api/public/settings/get')
// }]);
define(['angular'], function (angular) {

    var service = angular.module("schedulizerService", []);

    service.factory('schedulizerService', ['$http', '$q', function ($http, $q) {
        var base_url = "https://schedulizer-api.morrisville.edu";
        var factory = {};
        factory.getSemesters = function() {
            return $http.get(base_url + "/semesters/", { 
                // url: base_url + "/semesters/",
                cache: true
            });
        };
        factory.getDepartments = function(semester_termcode) {
            if(!semester_termcode){
                return $q.reject([]);
            }
            return $http.get({
                url: base_url + "/departments/",
                params:{
                    semester: semester_termcode
                }
            });
        };
        factory.getDepartmentCourses = function(department, semester_termcode, detailed) {
            if(!department || !semester_termcode){
                return $q.reject([]);
            }
            detailed = detailed === 1 ? detailed : 0;
            return $http.get({
                url: base_url + "/courses/",
                params:{
                    department_code: department,
                    semester: semester_termcode,
                    include_objects: detailed
                }
            });
        };
        factory.getSchedule = function(crns, semester_termcode) {
            if(!crns || !semester_termcode){
                return $q.reject([]); //TODO-KL Double check intended response obj or list
            }
            return $http.get({
                url: base_url + "/info/?crn=" + crns.join("&crn[]=") + "&semester=" + semester_termcode,
            });
        };
        factory.getCourseInfos = function(courses, semester_termcode) {
            if(!courses || ! semester_termcode){
                return $q.reject([]);
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
