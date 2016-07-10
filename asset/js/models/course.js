var Course = function(api_obj){
  // this = Object.create(Course.prototype);
  try
  {
    Item.call(this,api_obj);
    // this.DepartmentCode = (api_obj.DepartmentCode !== undefined ?  api_obj.DepartmentCode: "");
    // this.CourseNumber = (api_obj.CourseNumber !== undefined ?  api_obj.CourseNumber: "");
    // this.CourseTitle = (api_obj.CourseTitle !== undefined ?  api_obj.CourseTitle: "");
    this.Description = (api_obj.Description !== undefined ?  api_obj.Description: "");
    // this.Semester = (api_obj.Semester !== undefined ?  api_obj.Semester: "");
    this.Sections = (api_obj.Sections !== undefined ?  Section.sectionsFactory(api_obj.Sections): []);
    this.Department = (api_obj.Department !== undefined ?  new Department(api_obj.Department): null);
    this.SemesterObject = (api_obj.SemesterObject !== undefined ?  new Semester(api_obj.SemesterObject): null);
  }
  catch(err){
    console.log("COURSE ERR", err);
    return null;
  }
  return this;
};
Course.prototype = Object.create(Item.prototype);
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
Course.prototype.getDepartment = function(){
    return this.DepartmentCode;
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