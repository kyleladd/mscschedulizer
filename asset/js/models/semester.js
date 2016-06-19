var lscache = require('lscache');
var request = require("request");

var mscSchedulizer_config = require('../config.js');

var Semester = function(api_obj){
  var obj = Object.create(Semester.prototype);
  // obj.
  // obj.DepartmentCode = api_obj.DepartmentCode;
  // obj.SemesterNumber = api_obj.SemesterNumber;
  // obj.SemesterTitle = api_obj.SemesterTitle;
  // obj.Description = api_obj.Description;
  // obj.Semester = api_obj.Semester;
  // obj.DepartmentCode = api_obj.DepartmentCode;
  // obj.DepartmentCode = api_obj.DepartmentCode;
  return obj;
};
Semester.getCurrentList= function(){
  return new Promise(function(resolve, reject) {
    var json = lscache.get("semesters");
    console.log("semesters in cache",json);
    console.log("semesters in cache type",typeof json);
    if (typeof json !== 'undefined' && json !== null) {
      console.log("FROM CACHE", json);
      resolve(json);
    } else {
      // var semesters = Semester.fetchCurrentList();
      Semester.fetchCurrentList().then(function(response) {
        // console.log("Success!", response);
        console.log("SEMESTERS FROM API", response);
        lscache.set("semesters", response, 10);
        resolve(response);
      }, function(error) {
        console.error("Failed!", error);
      });
      // console.log("SEMESTERS FROM API", semesters);
      // lscache.set("semesters", semesters, 10);
      // resolve(semesters);
      // resolve(Semester.fetchCurrentList());
    }
  });
}
Semester.fetchCurrentList= function(){
  return new Promise(function(resolve, reject) {
    request({
      uri: mscSchedulizer_config.api_host + "/semesters/",
      method: "GET"
    }, function(error, response, body) {
      console.log("error",error);
      console.log("response",response);
      console.log("body",body);
      resolve(body);
      // return body;
    });
  });
}
module.exports = {
  Semester: Semester
};
