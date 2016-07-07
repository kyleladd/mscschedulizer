var lscache = require('lscache');
var httpplease = require("httpplease");
var Promise = require('rsvp').Promise;

var Storage = require('./storage.js').Storage;
var mscSchedulizer_config = require('../config.js');

var Semester = function(api_obj){
  var obj = Object.create(Semester.prototype);
  try{
    obj.TermCode = api_obj.TermCode;
    obj.Description = api_obj.Description;
    obj.TermStart = api_obj.TermStart;
    obj.TermEnd = api_obj.TermEnd;
  }
  catch(err){
      return null;
  }
  return obj;
};

Semester.semestersFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return null;
  }
    for(var i in list_json){
      var obj = new Semester(list_json[i]);
      if(obj != null){
        list_obj.push(obj);
      }
    }
  return list_obj;
};

Semester.getCurrentList = function(){
  return new Promise(function(resolve, reject) {
    var json = lscache.get("semesters");
    if (typeof json !== 'undefined' && json !== null) {
      console.log("Fetching semesters from Cache");
      resolve(Semester.semestersFactory(json));
    } else {
      Semester.fetchCurrentList().then(function(response) {
        //Cache semesters for 1 day
        Storage.SetSemesters(response);
        resolve(Semester.semestersFactory(response));
      }, function(error) {
        console.error("Failed!", error);
        // resolve(null);
      });
    }
  });
};

Semester.fetchCurrentList = function(){
  console.log("Fetching semesters from API");
  return new Promise(function(resolve, reject) {
    httpplease.get(mscSchedulizer_config.api_host + "/semesters/", function (err, response) {
      if(err){
         reject("Something went wrong fetching current semesters");
      }
      resolve(Semester.semestersFactory(JSON.parse(response.body)));
      // If error, reject
    });
    // needle.get(mscSchedulizer_config.api_host + "/semesters/", function(error, response) {
    //   if (!error && response.statusCode == 200){
    //     console.log(response.body);
    //     resolve(JSON.parse(response.body));
    //   }
    //   else{
    //     reject("Something went wrong fetching current semesters");
    //   }
    // });
    // request({
    //   uri: mscSchedulizer_config.api_host + "/semesters/",
    //   method: "GET"
    // }, function(error, response, body) {
    //   resolve(JSON.parse(body));
    // });
  });
};

Semester.semestersSelect = function(semesters_list){
    var output = "";
    for (var i in semesters_list){
        var semester = semesters_list[i];
        // if(semester.TermCode ==  lscache.get("semester").TermCode){
        //     output += "<option class='a_semester' value='"+escape(JSON.stringify(semester)) + "' selected=\"selected\">" + semester.Description + "</option>";
        // }
        // else{
          // console.log("SEMESTER LOOP", semester);
          // console.log("Stored SEMESTER", Storage.Semester());
            output += "<option class='a_semester' value='"+semester.TermCode + "' " + (semester.TermCode === Storage.Semester().toString() ? "selected=selected" : "") + ">" + semester.Description + "</option>";
        // }
    }
    // $("#"+mscSchedulizer_config.html_elements.semesters_select).html(output);
    return output;
};

module.exports = {
  Semester: Semester
};
