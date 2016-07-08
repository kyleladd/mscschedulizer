// var lscache = require('lscache');

var Storage = {};

Storage.GenCourses = [];

Storage.GenSchedules = [];

Storage.NumLoaded = 0;

// Getters
Storage.Department = function(){
    return lscache.get("department");
};
// Storage.Departments = function(){
//     return lscache.get("departments");
// };

// Storage.DepartmentCourses = function(){
//     return lscache.get("department_courses");
// };

Storage.Semester = function(){
    return lscache.get("semester");
};

Storage.Semesters = function(){
    return lscache.get("semesters");
};

Storage.Selections = function(){
    return lscache.get("selections");
};

Storage.Favorites = function(){
    return lscache.get("favorites");
};

Storage.Filters = function(){
    return lscache.get("filters");
};

// Setters
Storage.SetDepartment = function(data){
    return lscache.set("department",data);
};

// Storage.SetDepartments = function(data){
//     return lscache.set("departments",data);
// };

// Storage.SetDepartmentCourses = function(data){
//     return lscache.set("department_courses",data);
// };

Storage.SetSemester = function(data){
    return lscache.set("semester",data,1440);
};

Storage.SetSemesters = function(data){
    return lscache.set("semesters",data,1440);
};

Storage.SetSelections = function(data){
    return lscache.set("selections",data);
};

Storage.SetFavorites = function(data){
    return lscache.set("favorites",data);
};

Storage.SetFilters = function(data){
    return lscache.set("filters",data);
};

Storage.setCookie = function(c_name, value, exdays, domain) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    domain = (domain && domain !== 'localhost') ? '; domain=' + '.' + (domain) : '';
    var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString() + domain + ";");
    document.cookie = c_name + "=" + c_value;
};

Storage.getCookie = function(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
};

// module.exports = {
//   Storage: Storage
// };
