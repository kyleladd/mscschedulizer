var lscache = require('lscache');
var request = require("request");
var RSVP = require('rsvp');

var mscSchedulizer_config = require('../config.js');

var Filter = function(api_obj){
  var obj = Object.create(Filter.prototype);
  try{
    // obj.TermCode = api_obj.TermCode;
    // obj.Description = api_obj.Description;
    // obj.TermStart = api_obj.TermStart;
    // obj.TermEnd = api_obj.TermEnd;
  }
  catch(err){
      return null;
  }
  return obj;
};



module.exports = {
  Filter: Filter
};
