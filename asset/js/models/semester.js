var lscache = require('lscache');
var request = require("request");

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

Semester.semestersFactory= function(list_json){
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
      resolve(Semester.semestersFactory(json));
    } else {
      Semester.fetchCurrentList().then(function(response) {
        //Cache semesters for 1 day
        lscache.set("semesters", response, 1440);
        resolve(Semester.semestersFactory(response));
      }, function(error) {
        console.error("Failed!", error);
        // resolve(null);
      });
    }
  });
};
Semester.fetchCurrentList= function(){
  return new Promise(function(resolve, reject) {
    request({
      uri: mscSchedulizer_config.api_host + "/semesters/",
      method: "GET"
    }, function(error, response, body) {
      resolve(JSON.parse(body));
    });
  });
};
module.exports = {
  Semester: Semester
};
