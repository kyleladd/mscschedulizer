var lscache = require('lscache');
var request = require("request");
var RSVP = require('rsvp');

var Semester = require('./semester.js').Semester;
var mscSchedulizer_config = require('../config.js');

var Department = function(api_obj){
  var obj = Object.create(Department.prototype);
  try{
    obj.DepartmentCode = api_obj.DepartmentCode;
    obj.Name = api_obj.Name;
    obj.Semester = api_obj.Semester;
    obj.SemesterObject = null;
    if(api_obj.SemesterObject !== null){
      obj.SemesterObject = new Semester(api_obj.SemesterObject);
    }
  }
  catch(err){
      return null;
  }
  return obj;
};

Department.departmentsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return null;
  }
  for(var i in list_json){
    var obj = new Department(list_json[i]);
    if(obj != null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Department.getDepartments = function(semester){
  return new RSVP.Promise(function(resolve, reject) {
    request({
      uri: mscSchedulizer_config.api_host + "/departments/?semester="+semester,
      method: "GET"
    }, function(error, response, body) {
      resolve(Department.departmentsFactory(JSON.parse(body)));
    });
  });
};
Department.departmentsSelect = function(departments){
  var output = "";
  for (var i in departments) {
      var department = departments[i];
      //  " + (department.DepartmentCode === mscSchedulizer.department ? "selected=selected" : "") + "
      output += "<option class='a_department' value='"+ department.DepartmentCode + "'>" + department.DepartmentCode + ' ' + department.Name + "</option>";
  }
  return output;
};
// getDetpartmentCourses
Department.prototype.getCourses = function(){
//     department = typeof department !== 'undefined' ?  department : $("#"+mscSchedulizer_config.html_elements.departments_select).val();
//     $.getJSON(mscSchedulizer_config.api_host + "/courses/?department_code=" + department + "&semester="+mscSchedulizer.semester.TermCode , function(results){
//         //remove this later
//         var output = "";
//         // Remove sections that are administrative entry
//         results = mscSchedulizer.removeAdministrativeSections(results);
//         for (var i in results) {
//             var course = results[i];
//             //Change to just one html output set
//             output += "<li><a class='a_course' data-value='"+escape(JSON.stringify({'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':null}))+"'>"+course.DepartmentCode+" " + course.CourseNumber +" - " + course.CourseTitle +"</a></li>";
//         }
//         $("#"+mscSchedulizer_config.html_elements.department_class_list).html(output);
//     })
//     .fail(function() {
//         $("#"+mscSchedulizer_config.html_elements.department_class_list).html("<li>Unable to load courses.</li>");
//     });
};
module.exports = {
  Department: Department
};
