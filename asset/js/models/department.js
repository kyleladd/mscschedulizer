var lscache = require('lscache');
var request = require("request");

var Semester = require('./semester.js').Semester;
var mscSchedulizer_config = require('../config.js');

var Department = function(api_obj){
  var obj = Object.create(Department.prototype);
  try{
    obj.DepartmentCode = api_obj.DepartmentCode;
    obj.Name = api_obj.Name;
    obj.Semester = api_obj.Semester;
    obj.SemesterObject = null;
    if(api_obj.SemesterObject !== null){
      obj.SemesterObject = new Semester(api_obj.SemesterObject);
    }
  }
  catch(err){
      return null;
  }
  return obj;
};

Department.departmentsFactory= function(list_json){
  var list_obj = [];
  if(list_json === null){
    return null;
  }
  for(var i in list_json){
    var obj = new Department(list_json[i]);
    if(obj != null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Department.getDepartments= function(semester){
  return new Promise(function(resolve, reject) {
    request({
      uri: mscSchedulizer_config.api_host + "/departments/?semester="+semester,
      method: "GET"
    }, function(error, response, body) {
      resolve(Department.departmentsFactory(JSON.parse(body)));
    });
  });
};
module.exports = {
  Department: Department
};
