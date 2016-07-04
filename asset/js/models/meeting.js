var lscache = require('lscache');
var request = require("request");
var RSVP = require('rsvp');

var Semester = require('./semester.js').Semester;
var mscSchedulizer_config = require('../config.js');

var Department = function(api_obj){
  var obj = Object.create(Meeting.prototype);
  try{
    // obj.DepartmentCode = api_obj.DepartmentCode;
    // obj.Name = api_obj.Name;
    // obj.Semester = api_obj.Semester;
    // obj.SemesterObject = null;
    // if(api_obj.SemesterObject !== null){
    //   obj.SemesterObject = new Semester(api_obj.SemesterObject);
    // }
  }
  catch(err){
      return null;
  }
  return obj;
};

Meeting.meetingsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return null;
  }
  for(var i in list_json){
    var obj = new Meeting(list_json[i]);
    if(obj != null){
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
},


module.exports = {
  Department: Department
};
