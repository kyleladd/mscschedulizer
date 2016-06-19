var Course = function(api_obj){
  var obj = Object.create(Course.prototype);
  // obj.
  obj.DepartmentCode = api_obj.DepartmentCode;
  obj.CourseNumber = api_obj.CourseNumber;
  obj.CourseTitle = api_obj.CourseTitle;
  obj.Description = api_obj.Description;
  obj.Semester = api_obj.Semester;
  // obj.DepartmentCode = api_obj.DepartmentCode;
  // obj.DepartmentCode = api_obj.DepartmentCode;
  return obj;
};
module.exports = {
  Course: Course
};
