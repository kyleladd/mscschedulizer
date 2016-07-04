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

Schedule.prototype.exportSchedule = function(){
    var domain = mscSchedulizer.getTLD(window.location);
    mscSchedulizer.setCookie("MSCschedulizer",JSON.stringify(this.getCRNs()),1,domain);
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
};
Schedule.prototype.exportLink = function(){
    return '<a class=\'export_schedule\' onClick=\'mscSchedulizer.exportSchedule(mscSchedulizer.getScheduleCRNs("' + escape(JSON.stringify(schedule)) + '"));\'>Export Schedule</a>';
};
Schedule.prototype.getCRNs = function(){
    var crns = [];
    if(typeof schedule === 'string'){
        schedule = JSON.parse(unescape(schedule));
    }
    for(var i = 0; i < schedule.length; i++){
        for(var s = 0; s < schedule[i].Sections.length; s++){
            crns.push(schedule[i].Sections[s].CourseCRN);
        }
    }
   return crns;
};
Schedule.prototype.optionsOutput = function(){
    var result = "<div class=\"options\">";
    result += mscSchedulizer.favoriteLinkOutput(schedule);
    result += mscSchedulizer.detailsLinkOutput(schedule);
    result += mscSchedulizer.previewLinkOutput(schedule);
    result += mscSchedulizer.exportLink(schedule);
    result+="</div>";
    return result;
};
Schedule.prototype.favoriteLinkOutput = function(){
    // If a favorite
    if(node_generic_functions.searchListObjects(mscSchedulizer.favorite_schedules,schedule) !== -1){
        return "<a class=\"unfavorite_schedule favoriting\" data-value='" + escape(JSON.stringify(schedule)) + "'>Unfavorite</a>";
    }
    return "<a class=\"favorite_schedule favoriting\" data-value='" + escape(JSON.stringify(schedule)) + "'>Favorite</a>";
};
Schedule.prototype.detailsLinkOutput = function(){
   return '<a class=\'modal-trigger\'data-toggle=\'modal\' data-target=\'#modal_courseDetails\' data-schedule=\''+escape(JSON.stringify(schedule))+'\'>Details</a>';
};
Schedule.prototype.previewLinkOutput = function(){
    var crns = [];
    for(var i = 0; i < schedule.length; i++){
        for(var s = 0; s < schedule[i].Sections.length; s++){
            crns.push(schedule[i].Sections[s].CourseCRN);
        }
    }
    return "<a target=\"_blank\" href=\"preview.html?crn[]="+crns.join("&crn[]=")+"\">Preview</a>";
};
Schedule.prototype.genNoMeetingsOutput = function(){
    try{
        var output = "";
        for(var i = 0; i < this.courses.length; i++){
            var course = courses[i];
            output += course.DepartmentCode + ' ' + course.CourseNumber + ', ';
        }
        if(output !== ""){
            output = output.replace(/,+\s*$/, '');
            output = "<div class='nomeetings'><h3>Online/TBD</h3>" + output + "</div>";
        }
        return output;
    }
    catch(err){
        return "";
    }
};
module.exports = {
  Schedule: Schedule
};
