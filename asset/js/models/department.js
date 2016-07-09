var Department = function(api_obj){
  var obj = Object.create(Department.prototype);
  try{
    obj.DepartmentCode = (api_obj.DepartmentCode !== undefined ? api_obj.DepartmentCode : "");
    obj.Name = (api_obj.Name !== undefined ? api_obj.Name : "");
    obj.Semester = (api_obj.Semester !== undefined ? api_obj.Semester : "");
    obj.SemesterObject = (new Semester(api_obj.SemesterObject) !== undefined ? new Semester(api_obj.SemesterObject) : null);
  }
  catch(err){
      return null;
  }
  return obj;
};

Department.departmentsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return list_obj;
  }
  for(var i in list_json){
    var obj = new Department(list_json[i]);
    if(obj !== null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};

Department.getDepartments = function(semester){
  return new Promise(function(resolve, reject) {
    // console.log("GETTING dept for semester",semester);
    httpplease.get(Config.api_host + "/departments/?semester="+semester, function (err, response) {
      if(err){
        reject("Something went wrong fetching departments");
      }
      resolve(Department.departmentsFactory(JSON.parse(response.body)));
    });
  });
};

Department.departmentsSelect = function(departments){
  var output = "";
  for (var i in departments) {
      var department = departments[i];
      output += "<option class='a_department' value='" + escape(JSON.stringify(department)) + "' " + (Storage.Department() !== null && department.DepartmentCode === Storage.Department().DepartmentCode ? "selected=selected" : "") + ">" + department.DepartmentCode + ' ' + department.Name + "</option>";
  }
  return output;
};

// getDetpartmentCourses
Department.prototype.getCourses = function(){
  console.log("getting courses");
  var department = this;
  return new Promise(function(resolve, reject) {
    // console.log("GETTING dept for semester",semester);
    httpplease.get(Config.api_host + "/courses/?department_code=" + department.DepartmentCode + "&semester="+department.Semester, function (err, response) {
      if(err){
        reject("Something went wrong fetching courses");
      }
      resolve(Course.coursesFactory(JSON.parse(response.body)));
    });
  });
};