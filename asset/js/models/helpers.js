var Helpers = {};

Helpers.getTLD =function(url_location){
    var parts = url_location.hostname.split('.');
    var sndleveldomain = parts.slice(-2).join('.');
    return sndleveldomain;
};
// Helpers.exportSchedule = function(crns){
//     var domain = mscSchedulizer.getTLD(window.location);
//     mscSchedulizer.setCookie("MSCschedulizer",JSON.stringify(crns),1,domain);
//     new PNotify({
//       title: 'Schedule Saved',
//       text: 'Login to <a href="http://webfor.morrisville.edu/webfor/bwskfreg.P_AltPin" target="_blank">Web for Students</a> and import the schedule from the add/drop form.',
//       type: 'success',
//       buttons: {
//         closer_hover: false,
//         closer: true,
//         sticker: false
//       }
//   });
// },
Helpers.exportURL = function(url,semester,department){
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "semester=" + semester + "&department=" + department;
};
Helpers.queryData = function(queryString, preserveDuplicates){
  // http://code.stephenmorley.org/javascript/parsing-query-strings-for-get-data/
  var result = {};
  // if a query string wasn't specified, use the query string from the URL
  if (queryString === undefined){
    queryString = location.search ? location.search : '';
  }
  // remove the leading question mark from the query string if it is present
  if (queryString.charAt(0) == '?') queryString = queryString.substring(1);
  // check whether the query string is empty
  if (queryString.length > 0){
    // replace plus signs in the query string with spaces
    queryString = queryString.replace(/\+/g, ' ');
    // split the query string around ampersands and semicolons
    var queryComponents = queryString.split(/[&;]/g);
    // loop over the query string components
    for (var index = 0; index < queryComponents.length; index ++){
      // extract this component's key-value pair
      var keyValuePair = queryComponents[index].split('=');
      var key          = decodeURIComponent(keyValuePair[0].replace(/[\[\]]/g, ""));
      var value        = keyValuePair.length > 1 ? decodeURIComponent(keyValuePair[1]) : '';
      // check whether duplicates should be preserved
      if (preserveDuplicates){
        // create the value array if necessary and store the value
        if (!(key in result)) result[key] = [];
        result[key].push(value);
      }else{
        // store the value
        result[key] = value;
      }
    }
  }
  return result;
};
Helpers.isScrolledIntoView = function(elem) {
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();
    // && for entire element || for any part of the element
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
};