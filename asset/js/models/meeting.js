var moment = require('moment');

var Meeting = function(api_obj){
  var obj = Object.create(Meeting.prototype);
  try
  {
    obj.Id = api_obj.Id;
    obj.CourseCRN = api_obj.CourseCRN;
    obj.Monday = api_obj.Monday;
    obj.Tuesday = api_obj.Tuesday;
    obj.Wednesday = api_obj.Wednesday;
    obj.Thursday = api_obj.Thursday;
    obj.Friday = api_obj.Friday;
    obj.StartTime = api_obj.StartTime;
    obj.EdnTime = api_obj.EdnTime;
    obj.Semester = api_obj.Semester;
  }
  catch(err){
    return null;
  }
  return obj;
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


module.exports = {
  Meeting: Meeting
};
