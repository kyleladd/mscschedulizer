var Course = function(api_obj){
  var obj = Object.create(Course.prototype);
  try
  {
    obj.DepartmentCode = (api_obj.DepartmentCode !== undefined ?  api_obj.DepartmentCode: "");
    obj.CourseNumber = (api_obj.CourseNumber !== undefined ?  api_obj.CourseNumber: "");
    obj.CourseTitle = (api_obj.CourseTitle !== undefined ?  api_obj.CourseTitle: "");
    obj.Description = (api_obj.Description !== undefined ?  api_obj.Description: "");
    obj.Semester = (api_obj.Semester !== undefined ?  api_obj.Semester: "");
    obj.Sections = (api_obj.Sections !== undefined ?  Section.sectionsFactory(api_obj.Sections): []);
    obj.Department = (api_obj.Department !== undefined ?  new Department(api_obj.Department): null);
    obj.SemesterObject = (api_obj.SemesterObject !== undefined ?  new Semester(api_obj.SemesterObject): null);
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
Course.DisplayShort = function(courses){
  var output = "";
  for (var i in courses) {
      var course = courses[i];
      //Change to just one html output set
      output += "<li><a class='a_course' data-value='"+escape(JSON.stringify({'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':null}))+"'>"+course.DepartmentCode+" " + course.CourseNumber +" - " + course.CourseTitle +"</a></li>";
  }
  return output;
}