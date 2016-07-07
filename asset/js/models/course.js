var Department = require('./department.js').Department;
var Semester = require('./semester.js').Semester;
var Section = require('./section.js').Section;
var Filter = require('../filter.js').Filter;
// var mscSchedulizer_config = require('../config.js');

var Course = function(api_obj){
  var obj = Object.create(Course.prototype);
  try
  {
    obj.DepartmentCode = api_obj.DepartmentCode;
    obj.CourseNumber = api_obj.CourseNumber;
    obj.CourseTitle = api_obj.CourseTitle;
    obj.Description = api_obj.Description;
    obj.Semester = api_obj.Semester;
    obj.Sections = Section.sectionsFactory(api_obj.Sections);
    obj.Department = new Department(api_obj.Department);
    obj.SemesterObject = new Semester(api_obj.SemesterObject);
  }
  catch(err){
    console.log("COURSE ERR", err);
    return null;
  }
  return obj;
};

Course.coursesFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return list_obj;
  }
  for(var i in list_json){
    var obj = new Course(list_json[i]);
    if(obj !== null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Course.prototype.groupSections = function(){
    // Sections are to be grouped by Campus and by identifier
    var grouped_sections = {};
    for (var i in this.Sections) {
      var course_section = this.Sections[i];
      var identifier = course_section.Identifier;
      var campus = course_section.Campus;
      // Apply Filters To SECTION
      if(!mscSchedulizer.applyFiltersToSection(course_section,mscSchedulizer.schedule_filters)){
          if(identifier === "" || identifier === null){
            identifier = "empty";
          }
          if (!(campus in grouped_sections)){
            grouped_sections[campus] = [];
          }
          if (!(identifier in grouped_sections[campus])){
            grouped_sections[campus][identifier] = [];
          }
          grouped_sections[campus][identifier].push(course_section);
      }
    }
    return grouped_sections;
};
module.exports = {
  Course: Course
};
