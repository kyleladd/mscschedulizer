var Item = function(api_obj){
  // this = Object.create(Item.prototype);
  try
  {
    this.DepartmentCode = (api_obj.DepartmentCode !== undefined ?  api_obj.DepartmentCode: "");
    this.CourseNumber = (api_obj.CourseNumber !== undefined ?  api_obj.CourseNumber: "");
    this.CourseTitle = (api_obj.CourseTitle !== undefined ?  api_obj.CourseTitle: "");
    this.Semester = (api_obj.Semester !== undefined ?  api_obj.Semester: "");
  }
  catch(err){
    console.log("ITEM ERR", err);
    return null;
  }
  return this;
};
Item.prototype.exportHTMLdata = function(){
    return this.DepartmentCode;
};