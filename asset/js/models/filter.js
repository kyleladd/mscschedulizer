var Filter = function(api_obj){
  // var obj = Object.create(Filter.prototype);
  try{
    // obj.TermCode = api_obj.TermCode;
    // obj.Description = api_obj.Description;
    // obj.TermStart = api_obj.TermStart;
    // obj.TermEnd = api_obj.TermEnd;
  }
  catch(err){
      return null;
  }
  return this;
};

Filter.Display = function(){
    var result = "<div id=\""+mscSchedulizer_config.html_elements.checkbox_filters+"\">";
    result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, only schedule combinations where all sections are not full (current enrollment is less than max enrollment) will be shown.\"><label><input type=\"checkbox\" name=\"notFull\" id=\""+mscSchedulizer_config.html_elements.filters.not_full+"\"> Hide Full</label></span>";
    result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations with Morrisville Campus sections will be shown.\"><label><input type=\"checkbox\" name=\"morrisville\" id=\""+mscSchedulizer_config.html_elements.filters.morrisville_campus+"\"> Morrisville Campus</label></span>";
    result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations with Norwich Campus sections will be shown.\"><label><input type=\"checkbox\" name=\"norwich\" id=\""+mscSchedulizer_config.html_elements.filters.norwich_campus+"\"> Norwich Campus</label></span>";
    result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations that include online sections will be shown.\"><label><input type=\"checkbox\" name=\"showOnline\" id=\""+mscSchedulizer_config.html_elements.filters.show_online+"\"> Online</label></span>";
    result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations with ONCAMPUS SUNY sections will be shown.\"><label><input type=\"checkbox\" name=\"showInternational\" id=\""+mscSchedulizer_config.html_elements.filters.show_international+"\"> ONCAMPUS SUNY</label></span>";
    result += "</div>";
    result += "<div id=\""+mscSchedulizer_config.html_elements.timeblock_filters+"\">";
    result += mscSchedulizer.timeBlockDisplay(mscSchedulizer.schedule_filters.TimeBlocks);
    result += "</div>";
    return result;
};
Filter.update = function(schedule_filters){
    mscSchedulizer.schedule_filters = schedule_filters;
    localStorage.setItem('schedule_filters', JSON.stringify(schedule_filters));
    mscSchedulizer.updateFiltersDisplay(mscSchedulizer.schedule_filters);
};
Filter.updateDisplay = function(filters){
    mscSchedulizer.checkboxFilterDisplay(filters.NotFull,mscSchedulizer_config.html_elements.filters.not_full);
    mscSchedulizer.checkboxFilterDisplay(filters.Campuses.Morrisville,mscSchedulizer_config.html_elements.filters.morrisville_campus);
    mscSchedulizer.checkboxFilterDisplay(filters.Campuses.Norwich,mscSchedulizer_config.html_elements.filters.norwich_campus);
    mscSchedulizer.checkboxFilterDisplay(filters.ShowOnline,mscSchedulizer_config.html_elements.filters.show_online);
    mscSchedulizer.checkboxFilterDisplay(filters.ShowInternational,mscSchedulizer_config.html_elements.filters.show_international);
    $("#"+mscSchedulizer_config.html_elements.timeblock_filters).html(mscSchedulizer.timeBlockDisplay(mscSchedulizer.schedule_filters.TimeBlocks));
    mscSchedulizer.initTimeBlockPickers(filters.TimeBlocks);
    // Initialize the tooltips for filters
    $('.filtertooltiptrigger').tooltipster({ theme: 'tooltipster-punk',maxWidth:250,delay:750,iconTouch:true});
};
Filter.timeBlockDisplay = function(filters){
    var result = "<span class=\"filtertooltiptrigger\" title=\"By adding time blocks filters, you can block out times that you do not want to have classes.\">Time block filters: <a onclick=\"mscSchedulizer.addTimeBlockFilter()\">Add</a></span>";
    for(var i=0; i<filters.length;i++)
    {
        result += "<div id=\"timeOnly_"+i+"\"><span id=\"weekCal_"+i+"\"></span> " +
                "<input type=\"text\" class=\"time start ui-timepicker-input\" autocomplete=\"off\"> to " +
                "<input type=\"text\" class=\"time end ui-timepicker-input\" autocomplete=\"off\">" +
            "<a onclick=\"mscSchedulizer.updateDayTimeBlockFilter("+i+")\"> Apply </a> <a onclick=\"mscSchedulizer.removeTimeBlockFilter("+i+")\"> Remove</a></div>";
    }
    return result;
};
Filter.addTimeBlock = function(){
    mscSchedulizer.schedule_filters.TimeBlocks[mscSchedulizer.schedule_filters.TimeBlocks.length] = {StartTime:"0000",EndTime:"2330",Days:""};
    mscSchedulizer.updateFilters(mscSchedulizer.schedule_filters);
};
Filter.removeTimeBlock = function(index){
    mscSchedulizer.schedule_filters.TimeBlocks.splice(index, 1);
    mscSchedulizer.updateFilters(mscSchedulizer.schedule_filters);
    mscSchedulizer.getCombinations(mscSchedulizer.gen_courses,mscSchedulizer.createSchedules);
    $("#"+mscSchedulizer_config.html_elements.department_class_list).html(mscSchedulizer.getDepartmentCoursesOutput(mscSchedulizer.department_courses));
};
Filter.updateDayTimeBlock = function(index){
    mscSchedulizer.schedule_filters.TimeBlocks[index] = {};
    var timeOnlyExampleEl = document.getElementById("timeOnly_"+index);
    var timeOnlyDatepair = new Datepair(timeOnlyExampleEl);
    mscSchedulizer.schedule_filters.TimeBlocks[index].StartTime = node_generic_functions.padStr(node_generic_functions.convertToInttime(timeOnlyDatepair.startTimeInput.value).toString(),3);
    mscSchedulizer.schedule_filters.TimeBlocks[index].EndTime = node_generic_functions.padStr(node_generic_functions.convertToInttime(timeOnlyDatepair.endTimeInput.value).toString(),3);
    mscSchedulizer.schedule_filters.TimeBlocks[index].Days = $("#weekCal_"+index).weekLine('getSelected');
    mscSchedulizer.updateFilters(mscSchedulizer.schedule_filters);
    mscSchedulizer.getCombinations(mscSchedulizer.gen_courses,mscSchedulizer.createSchedules);
    $("#"+mscSchedulizer_config.html_elements.department_class_list).html(mscSchedulizer.getDepartmentCoursesOutput(mscSchedulizer.department_courses));
};
Filter.initTimeBlockPickers = function(filters){
    for(var i=0; i<filters.length;i++){
        $("#timeOnly_"+i+" .time").timepicker({
          'showDuration': true,
          'timeFormat': 'g:ia',
          "minTime":"12:00am",
          "maxTime":"11:30pm"
        });
        $("#weekCal_"+i).weekLine({theme:"jquery-ui",dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"]});
        var timeOnlyExampleEl = document.getElementById("timeOnly_"+i);
        var timeOnlyDatepair = new Datepair(timeOnlyExampleEl);
            $("#timeOnly_"+i+" .start.time").timepicker('setTime',  moment(filters[i].StartTime,"Hmm").format('h:mma'));
            $("#timeOnly_"+i+" .end.time").timepicker('setTime',  moment(filters[i].EndTime,"Hmm").format('h:mma'));
            $("#weekCal_"+i).weekLine("setSelected", filters[i].Days);
    }
},
Filter.checkboxDisplay = function(filter,elementID){
  if (filter)
  {
      document.getElementById(elementID).checked = true;
  }
  else
  {
      document.getElementById(elementID).checked = false;
  }
},
Filter.concurrentEnrollment = function(section,filters){
    if(section.SectionAttributes !== null){
        var attributes = section.SectionAttributes.split(";");
        console.log("GF",node_generic_functions);
        if(node_generic_functions.inList("CHS", attributes) || node_generic_functions.inList("NHS", attributes) || node_generic_functions.inList("ETC", attributes) || node_generic_functions.inList("OCBB", attributes)){
            return true;
        }
    }
    return false;
};
Filter.AdministrativeSections = function(courses){
  for (var c = courses.length-1; c >= 0; c--) {
      if(typeof courses[c].Sections !== "undefined" && courses[c].Sections !== null && courses[c].Sections.length !== 0){
          for (var s = courses[c].Sections.length-1; s >= 0; s--) {
              // Apply filters to section function
              if(this.requiredFilters(courses[c].Sections[s])){
                  courses[c].Sections.splice(s, 1);
              }
          }
          if(courses[c].Sections.length === 0){
              courses.splice(c, 1);
          }
      }
  }
  return courses;
};
Filter.requiredFilters = function(section){
  var filteredOut = false;
  filteredOut = this.concurrentEnrollmentFilter(section);
  return filteredOut;
};
Filter.professor = function(section,filter){
    return false;
};
Filter.hideOnline = function(section,filters){
    if(section.SectionAttributes !== null){
        var attributes = section.SectionAttributes.split(";");
        if(node_generic_functions.inList("ONLN", attributes)){
            return true;
        }
    }
    return false;
};
Filter.hideInternational = function(section,filters){
    if(section.SectionNumber.indexOf("OL") === 0 || section.SectionNumber.indexOf("OC") === 0){
        return true;
    }

    return false;
};
Filter.campus = function(section,filter){
    // Only filter out if it has a meeting location
    try{
        if(section.Meetings.length>0){
            var count = 0;
            for (var m in section.Meetings) {
                var meeting = section.Meetings[m];
                if(meeting.StartTime === null || meeting.EndTime === null || (meeting.Monday === 0 && meeting.Tuesday === 0 && meeting.Wednesday === 0 && meeting.Thursday === 0 && meeting.Friday === 0)){
                    count++;
                }
            }
            if(count !== section.Meetings.length){
                if((filter.Morrisville === false && section.Campus == "M")||(filter.Norwich === false && section.Campus == "N")){
                    return true;
                }
            }
        }
    }
    catch (err){}
    return false;
};
Filter.timeBlock = function(section,filter){
    try{
        for (var m in section.Meetings){
            for (var i in filter) {
                if(mscSchedulizer.doTimesOverlap(filter[i],section.Meetings[m])===true){
                    if(mscSchedulizer.doBlockDaysOverlap(section.Meetings[m],filter[i].Days.split(","))){
                        return true;
                    }
                }
            }
        }
    }
    catch (err){}
    return false;
};
Filter.notFull = function(section,filter){
    // 0 is NOT unlimited, 0 means manual registration
    // if(section.MaxEnrollment!=0){
        if(section.CurrentEnrollment>=section.MaxEnrollment){
            return true;
        }
    // }
    return false;
};


module.exports = {
  Filter: Filter
};
