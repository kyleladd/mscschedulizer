var lscache = require('lscache');
var request = require("request");
var RSVP = require('rsvp');

var Semester = require('./semester.js').Semester;
var mscSchedulizer_config = require('../config.js');

var Schedule = function(api_obj){
  var obj = Object.create(Department.prototype);
  try{
    return obj;
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

Schedule.schedulesFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return null;
  }
  for(var i in list_json){
    var obj = new Schedule(list_json[i]);
    if(obj != null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Schedule.getSchedule = function(crns,semester){
  return new RSVP.Promise(function(resolve, reject) {
    request({
      uri: mscSchedulizer_config.api_host + "/info/?crn=" + crns.join("&crn[]=") + "&semester="+semester;
      method: "GET"
    }, function(error, response, body) {
      resolve(new Schedule(JSON.parse(body)));
    });
  });
};
Schedule.getSchedules = function(selections,semester){
  return new RSVP.Promise(function(resolve, reject) {
    request({
      uri: mscSchedulizer_config.api_host + "/departments/?semester="+semester,
      method: "GET"
    }, function(error, response, body) {
      resolve(Schedule.schedulesFactory(JSON.parse(body)));
    });
  });
};

Schedule.exportSchedule = function(crns){
    var domain = mscSchedulizer.getTLD(window.location);
    mscSchedulizer.setCookie("MSCschedulizer",JSON.stringify(crns),1,domain);
    new PNotify({
      title: 'Schedule Saved',
      text: 'Login to <a href="http://webfor.morrisville.edu/webfor/bwskfreg.P_AltPin" target="_blank">Web for Students</a> and import the schedule from the add/drop form.',
      type: 'success',
      buttons: {
        closer_hover: false,
        closer: true,
        sticker: false
      }
  });
},
module.exports = {
  Schedule: Schedule
};
