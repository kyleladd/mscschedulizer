var Meeting = function(api_obj){
  // var obj = Object.create(Meeting.prototype);
  try
  {
    this.Id = (api_obj.Id !== undefined ? api_obj.Id : "");
    this.CourseCRN = (api_obj.CourseCRN !== undefined ? api_obj.CourseCRN : "");
    this.Monday = (api_obj.Monday !== undefined ? api_obj.Monday : "");
    this.Tuesday = (api_obj.Tuesday !== undefined ? api_obj.Tuesday : "");
    this.Wednesday = (api_obj.Wednesday !== undefined ? api_obj.Wednesday : "");
    this.Thursday = (api_obj.Thursday !== undefined ? api_obj.Thursday : "");
    this.Friday = (api_obj.Friday !== undefined ? api_obj.Friday : "");
    this.StartTime = (api_obj.StartTime !== undefined ? api_obj.StartTime : "");
    this.EndTime = (api_obj.EndTime !== undefined ? api_obj.EndTime : "");
    this.Semester = (api_obj.Semester !== undefined ? api_obj.Semester : "");
  }
  catch(err){
    return null;
  }
  return this;
};

Meeting.meetingsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return list_obj;
  }
  for(var i in list_json){
    var obj = new Meeting(list_json[i]);
    if(obj !== null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Meeting.mergeDays = function(meeting1,meeting2){
    var meeting = meeting1;
    if(!Boolean(meeting.Monday) && Boolean(meeting2.Monday)){
        meeting.Monday = 1;
    }
    if(!Boolean(meeting.Tuesday) && Boolean(meeting2.Tuesday)){
        meeting.Tuesday = 1;
    }
    if(!Boolean(meeting.Wednesday) && Boolean(meeting2.Wednesday)){
        meeting.Wednesday = 1;
    }
    if(!Boolean(meeting.Thursday) && Boolean(meeting2.Thursday)){
        meeting.Thursday = 1;
    }
    if(!Boolean(meeting.Friday) && Boolean(meeting2.Friday)){
        meeting.Friday = 1;
    }
    return meeting;
};
Meeting.sort = function(a, b) {
    if(moment(a.StartTime,"Hmm").isValid() && moment(b.StartTime,"Hmm").isValid()){
        return moment(a.StartTime,"Hmm") - moment(b.StartTime,"Hmm");
    }
    return 0;
};
