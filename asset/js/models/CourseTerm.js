var CourseTerm = function(api_obj){
  // var obj = Object.create(CourseTerm.prototype);
  try{
    this.TermCode = (api_obj.TermCode !== undefined ? api_obj.TermCode : "");
    this.TermStart = (api_obj.TermStart !== undefined ? api_obj.TermStart : "");
    this.TermEnd = (api_obj.TermEnd !== undefined ? api_obj.TermEnd : "");
    this.Semester = (api_obj.Semester !== undefined ? api_obj.Semester : "");
    this.SemesterObject = (api_obj.SemesterObject !== undefined ? new Semester(api_obj.SemesterObject) : null);
  }
  catch(err){
    console.log("CourseTerm err", err);
    return null;
  }
  return this;
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
