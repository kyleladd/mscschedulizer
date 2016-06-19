var lscache = require('lscache');
var Semester = function(api_obj){
  var obj = Object.create(Semester.prototype);
  // obj.
  // obj.DepartmentCode = api_obj.DepartmentCode;
  // obj.SemesterNumber = api_obj.SemesterNumber;
  // obj.SemesterTitle = api_obj.SemesterTitle;
  // obj.Description = api_obj.Description;
  // obj.Semester = api_obj.Semester;
  // obj.DepartmentCode = api_obj.DepartmentCode;
  // obj.DepartmentCode = api_obj.DepartmentCode;
  return obj;
};
Semester.getCurrentList= function(){

}
module.exports = {
  Semester: Semester
};
