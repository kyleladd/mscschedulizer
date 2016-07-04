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

Course.prototype.groupSections = function(){
    // Sections are to be grouped by Campus and by identifier
    var grouped_sections = {};
    for (var i in course_sections) {
      var course_section = course_sections[i];
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
