var Section = function(api_obj){
  // var obj = Object.create(Section.prototype);
  try{
    this.CourseCRN = (api_obj.CourseCRN !== undefined ? api_obj.CourseCRN : "");
    this.DepartmentCode = (api_obj.DepartmentCode !== undefined ? api_obj.DepartmentCode : "");
    this.CourseNumber = (api_obj.CourseNumber !== undefined ? api_obj.CourseNumber : "");
    this.CourseTitle = (api_obj.CourseTitle !== undefined ? api_obj.CourseTitle : "");
    this.SectionNumber = (api_obj.SectionNumber !== undefined ? api_obj.SectionNumber : "");
    this.Credits = (api_obj.Credits !== undefined ? api_obj.Credits : "");
    this.CurrentEnrollment = (api_obj.CurrentEnrollment !== undefined ? api_obj.CurrentEnrollment : "");
    this.MaxEnrollment = (api_obj.MaxEnrollment !== undefined ? api_obj.MaxEnrollment : "");
    this.Campus = (api_obj.Campus !== undefined ? api_obj.Campus : "");
    this.Identifier = (api_obj.Identifier !== undefined ? api_obj.Identifier : "");
    this.Term = (api_obj.Term !== undefined ? api_obj.Term : "");
    this.Instructor = (api_obj.Instructor !== undefined ? api_obj.Instructor : "");
    this.SectionAttributes = (api_obj.SectionAttributes !== undefined ? api_obj.SectionAttributes : "");
    this.RequiredIdentifiers = (api_obj.RequiredIdentifiers !== undefined ? api_obj.RequiredIdentifiers : "");
    this.Meetings = (Meeting.meetingsFactory(api_obj.Meetings) !== undefined ? Meeting.meetingsFactory(api_obj.Meetings) : []);
    this.CourseTerm = (new CourseTerm(api_obj.CourseTerm) !== undefined ? new CourseTerm(api_obj.CourseTerm) : null);
    this.Semester = (api_obj.Semester !== undefined ? api_obj.Semester : "");
    this.SemesterObject = (new Semester(api_obj.SemesterObject) !== undefined ? new Semester(api_obj.SemesterObject) : null);
  }
  catch(err){
      return null;
  }
  return this;
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
