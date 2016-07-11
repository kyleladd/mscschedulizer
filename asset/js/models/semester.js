var Semester = function(api_obj){
  // var obj = Object.create(Semester.prototype);
  try{
    this.TermCode = (api_obj.TermCode !== undefined ? api_obj.TermCode : "");
    this.Description = (api_obj.Description !== undefined ? api_obj.Description : "");
    this.TermStart = (api_obj.TermStart !== undefined ? api_obj.TermStart : "");
    this.TermEnd = (api_obj.TermEnd !== undefined ? api_obj.TermEnd : "");
  }
  catch(err){
      return null;
  }
  return this;
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
        reject(error);
      });
    }
  });
};

Semester.fetchCurrentList = function(){
  console.log("Fetching semesters from API");
  console.log(Config);
  return new Promise(function(resolve, reject) {
    httpplease.get(Config.api_host + "/semesters/", function (err, response) {
      if(err){
         reject("Something went wrong fetching current semesters");
      }
      resolve(Semester.semestersFactory(JSON.parse(response.body)));
    });
  });
};

Semester.semestersSelect = function(semesters_list){
    var output = "";
    for (var i in semesters_list){
      var semester = semesters_list[i];
      output += "<option class='a_semester' value='"+escape(JSON.stringify(semester)) + "' " + (Storage.Semester() !== null && semester.TermCode === Storage.Semester().TermCode ? "selected=selected" : "") + ">" + semester.Description + "</option>";
    }
    return output;
};
