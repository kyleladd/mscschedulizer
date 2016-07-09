var Selection = function(api_obj){
  var obj = Object.create(Selection.prototype);
  try
  {
    obj.DepartmentCode = (api_obj.DepartmentCode !== undefined ?  api_obj.DepartmentCode: "");
    obj.CourseNumber = (api_obj.CourseNumber !== undefined ?  api_obj.CourseNumber: "");
    obj.CourseTitle = (api_obj.CourseTitle !== undefined ?  api_obj.CourseTitle: "");
    obj.Semester = (api_obj.Semester !== undefined ?  api_obj.Semester: "");
    obj.CourseCRN = (api_obj.CourseCRN !== undefined ?  api_obj.CourseCRN: "");
  }
  catch(err){
    console.log("Selection ERR", err);
    return null;
  }
  return obj;
};

Selection.SelectionsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return list_obj;
  }
  for(var i in list_json){
    var obj = new Selection(list_json[i]);
    if(obj !== null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};
Selection.prototype.Add = function(){
  return false;
};
Selection.prototype.Remove = function(){
  return false;
};