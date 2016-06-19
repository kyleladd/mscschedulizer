var node_generic_functions = require('node_generic_functions');
var mscSchedulizer_config = require('./config.js');
var Course = require('./models/course.js').Course;
// var Department = require('./models/department.js').Department;
// var Section = require('./models/coursesection.js').Section;
var Semester = require('./models/semester.js').Semester;
// var Term = require('./models/term.js').Term;
// var Meeting = require('./models/meeting.js').Meeting;
module.exports = {
  Course: Course,
  Semester: Semester
};
