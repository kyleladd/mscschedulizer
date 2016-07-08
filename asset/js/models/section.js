var Section = function(api_obj){
  var obj = Object.create(Section.prototype);
  try{
    obj.CourseCRN = api_obj.CourseCRN;
    obj.DepartmentCode = api_obj.DepartmentCode;
    obj.CourseNumber = api_obj.CourseNumber;
    obj.CourseTitle = api_obj.CourseTitle;
    obj.SectionNumber = api_obj.SectionNumber;
    obj.Credits = api_obj.Credits;
    obj.CurrentEnrollment = api_obj.CurrentEnrollment;
    obj.MaxEnrollment = api_obj.MaxEnrollment;
    obj.Campus = api_obj.Campus;
    obj.Identifier = api_obj.Identifier;
    obj.Term = api_obj.Term;
    obj.Instructor = api_obj.Instructor;
    obj.SectionAttributes = api_obj.SectionAttributes;
    obj.RequiredIdentifiers = api_obj.RequiredIdentifiers;
    obj.Meetings = Meeting.meetingsFactory(api_obj.Meetings);
    obj.CourseTerm = new CourseTerm(api_obj.CourseTerm);
    obj.Semester = api_obj.Semester;
    obj.SemesterObject = new Semester(api_obj.SemesterObject);
  }
  catch(err){
      return null;
  }
  return obj;
};

Section.sectionsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return list_obj;
  }
  for(var i in list_json){
    var obj = new Section(list_json[i]);
    if(obj !== null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Section.prototype.groupMeetings = function(){
    groupedMeetings = [];
    for (var m in meetings) {
        var meeting = meetings[m];
        var index = node_generic_functions.searchListDictionaries(groupedMeetings,{CourseCRN:meeting.CourseCRN,StartTime:meeting.StartTime,EndTime:meeting.EndTime},true);
        if(index !== -1){
            groupedMeetings[index] = mscSchedulizer.mergeDays(groupedMeetings[index],meeting);
        }
        else{
            groupedMeetings.push(meeting);
        }
    }
    return groupedMeetings;
};
Section.prototype.applyFilters = function(filters){
    var section = this;
    var filteredOut = false;
    filteredOut = mscSchedulizer.requiredFilters(section);
    if(typeof filters.Campuses !== "undefined" && filteredOut === false){
        filteredOut = mscSchedulizer.campusFilter(section,filters.Campuses);
    }
    // if(typeof filters.Professors !== "undefined" && filters.Professors != [] && filteredOut === false){
    //     filteredOut = mscSchedulizer.professorFilter(section,filters.Professors);
    // }
    if(typeof filters.TimeBlocks !== "undefined" && filters.TimeBlocks != [] && filteredOut === false){
        filteredOut = mscSchedulizer.timeBlockFilter(section,filters.TimeBlocks);
    }
    if(typeof filters.NotFull !== "undefined" && filters.NotFull !== false && filteredOut === false){
        filteredOut = mscSchedulizer.notFullFilter(section,filters.NotFull);
    }
    if((typeof filters.ShowOnline == "undefined" || filters.ShowOnline === false) && filteredOut === false){
        filteredOut = mscSchedulizer.hideOnlineFilter(section,filters.ShowOnline);
    }
    if((typeof filters.ShowInternational === "undefined" || filters.ShowInternational === false) && filteredOut === false){
        filteredOut = mscSchedulizer.hideInternationalFilter(section,filters.ShowInternational);
    }
    return filteredOut;
};
// This might need some work because days list is somethimes merged if a section has more than one meeting
// Perhaps this will go within the section.js?
Section.prototype.daysList = function(include_empty){
    include_empty = typeof include_empty !== 'undefined' ? include_empty : true;
    var result = [];
    if(Boolean(meeting.Monday)){
        result.push("M");
    }
    else if(include_empty)
    {
        result.push(" ");
    }
    if(Boolean(meeting.Tuesday)){
        result.push("T");
    }
    else if(include_empty)
    {
        result.push(" ");
    }
    if(Boolean(meeting.Wednesday)){
        result.push("W");
    }
    else if(include_empty)
    {
        result.push(" ");
    }
    if(Boolean(meeting.Thursday)){
        result.push("R");
    }
    else if(include_empty)
    {
        result.push(" ");
    }
    if(Boolean(meeting.Friday)){
        result.push("F");
    }
    else if(include_empty)
    {
        result.push(" ");
    }
    return result;
};
Section.sort = function(a,b){
    return node_generic_functions.alphaNumericSort(a.SectionNumber,b.SectionNumber);
};