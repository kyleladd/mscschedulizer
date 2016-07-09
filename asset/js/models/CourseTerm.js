var CourseTerm = function(api_obj){
  var obj = Object.create(CourseTerm.prototype);
  try{
    obj.TermCode = (api_obj.TermCode !== undefined ? api_obj.TermCode : "");
    obj.TermStart = (api_obj.TermStart !== undefined ? api_obj.TermStart : "");
    obj.TermEnd = (api_obj.TermEnd !== undefined ? api_obj.TermEnd : "");
    obj.Semester = (api_obj.Semester !== undefined ? api_obj.Semester : "");
    obj.SemesterObject = (api_obj.SemesterObject !== undefined ? new Semester(api_obj.SemesterObject) : null);
  }
  catch(err){
      return null;
  }
  return obj;
};

CourseTerm.courseTermsFactory = function(list_json){
  var list_obj = [];
  if(list_json === null){
    return list_obj;
  }
  for(var i in list_json){
    var obj = new CourseTerm(list_json[i]);
    if(obj !== null){
      list_obj.push(obj);
    }
  }
  return list_obj;
};