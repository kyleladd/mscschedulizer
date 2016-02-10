var mscSchedulizer = mscSchedulizer === undefined ? {} : mscSchedulizer;
$.extend(mscSchedulizer, {
    classes_selected: JSON.parse(localStorage.getItem('classes_selected')) || [],
    favorite_schedules: JSON.parse(localStorage.getItem('favorite_schedules')) || [],
    schedule_filters: JSON.parse(localStorage.getItem('schedule_filters')) || {TimeBlocks:[],Professors:[],Campuses:{Morrisville:true,Norwich:false},NotFull:false},
    gen_courses :[],
    gen_schedules:[],
    num_loaded:0,
    searchListDictionaries:function (list,keyvaluelist,bool_index){
        var bool_index = typeof bool_index !== 'undefined' ?  bool_index : false;
        try{
            var numcriterion = 0;
            for (var key in keyvaluelist) {
                numcriterion++;
            }
            for(var i = 0; i < list.length; i++){
                var counter = 0;
                for (var key in keyvaluelist) {
                    if(list[i][key] == keyvaluelist[key]){
                        counter++;
                        if(counter == numcriterion){
                            if(bool_index){return i;}
                            else{return list[i];}
                        }
                    }
                }
            }
            if(bool_index){return -1;}else{return null;}
        }
        catch(err){
            if(bool_index){return -1;}else{return null;}
        }
    },
    searchListObjects:function (list,comp_object){
        try{
            for(var i = 0; i < list.length; i++){
                if(JSON.stringify(list[i]) == JSON.stringify(comp_object)){
                    return i;
                }
            }
            return -1;
        }
        catch(err){
            return -1;
        }
    },
    inList:function (needle, haystack) 
    {
        var i = haystack.length;
        while (i--) {
            if (haystack[i] === needle) return true;
        }
        return false;
    },
    queryData:function(queryString, preserveDuplicates){
      // http://code.stephenmorley.org/javascript/parsing-query-strings-for-get-data/
      var result = {};
      // if a query string wasn't specified, use the query string from the URL
      if (queryString == undefined){
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
          var value        = keyValuePair.length > 1
                           ? decodeURIComponent(keyValuePair[1])
                           : '';
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
    },
    loadSelections: function(){
        var output = "";
        for (var i in mscSchedulizer.classes_selected) {
            var course = mscSchedulizer.classes_selected[i];
            output += "<a href=\"#\" data-value='"+JSON.stringify(course)+"' class=\"a_selection\">"+course.DepartmentCode+" " + course.CourseNumber + " <i class=\"fa fa-times\"></i></a>";
        }
        $("#"+mscSchedulizer.html_elements.course_selections_list).html(output);
    },
    getDepartmentCourses: function(department){
        department = typeof department !== 'undefined' ?  department : $("#"+mscSchedulizer.html_elements.departments_select).val();
        $.getJSON(mscSchedulizer.api_host + "/courses/?department_code=" + department, function(results){
            //remove this later
            var output = "";
            for (var i in results) {
                var course = results[i];
                //Change to just one html output set
                output += "<li><a class='a_course' data-value='"+JSON.stringify(course)+"'>"+course.DepartmentCode+" " + course.CourseNumber +" - " + course.CourseTitle +"</a></li>";
            }
            $("#"+mscSchedulizer.html_elements.department_class_list).html(output);
        })
        .fail(function() {
            $("#"+mscSchedulizer.html_elements.department_class_list).html("<li>Unable to load courses.</li>");
        })
        .always(function() {
            $("#"+mscSchedulizer.html_elements.department_class_list).removeClass("loader-large");
            $("#"+mscSchedulizer.html_elements.department_class_list).removeClass("loader");
        });
    },
    daysList: function(meeting, include_empty){
        include_empty = typeof include_empty !== 'undefined' ? include_empty : true;
        var result = [];
        if(Boolean(meeting.Monday)){
            result.push("M");
        }
        else if(include_empty)
        {
            result.push(" ");
        }
        if(Boolean(meeting.Tuesday)){
            result.push("T");
        }
        else if(include_empty)
        {
            result.push(" ");
        }
        if(Boolean(meeting.Wednesday)){
            result.push("W");
        }
        else if(include_empty)
        {
            result.push(" ");
        }
        if(Boolean(meeting.Thursday)){
            result.push("R");
        }
        else if(include_empty)
        {
            result.push(" ");
        }
        if(Boolean(meeting.Friday)){
            result.push("F");
        }
        else if(include_empty)
        {
            result.push(" ");
        }
        return result;
    },
    getDepartmentCoursesDetails: function(department){
        department = typeof department !== 'undefined' ?  department : $("#"+mscSchedulizer.html_elements.departments_select).val();
        $.getJSON(mscSchedulizer.api_host + "/courses/?department_code=" + department + "&include_objects=1", function(results){
            var output = mscSchedulizer.detailedCoursesOutput(results);
            $("#"+mscSchedulizer.html_elements.department_class_list).html(output);
        })
        .fail(function() {
            $("#"+mscSchedulizer.html_elements.department_class_list).html("<p>Unable to load course listings.</p>");
        })
        .always(function() {
            $("#"+mscSchedulizer.html_elements.department_class_list).removeClass("loader-large");
            $("#"+mscSchedulizer.html_elements.department_class_list).removeClass("loader");
        });
    },
    getDepartments:function(callback){
        $.getJSON(mscSchedulizer.api_host + "/departments/", function(results){
            var output = "";
            for (var i in results) {
                var department = results[i];
                output += "<option class='a_department' value='"+department.DepartmentCode + "'>" + department.DepartmentCode + ' ' + department.Name + "</option>";
            }
            $("#"+mscSchedulizer.html_elements.departments_select).html(output);
        })
        .fail(function() {
            $("#"+mscSchedulizer.html_elements.departments_select).html("<option>Unable to load departments.</option>");
        })
        .always(function() {
            $('.selectpicker').selectpicker({dropupAuto:false});
            $('.selectpicker').selectpicker('refresh');
            callback();
        });
    },
    getSchedules:function(callback){
        // /v1/schedule/?courses[]=343&courses[]=344&courses[]=345&courses[]=121
        var courses_list = "";
        for (var i in mscSchedulizer.classes_selected) {
            var course = mscSchedulizer.classes_selected[i];    
            courses_list += "&courses[]=" + course.DepartmentCode + ' ' + course.CourseNumber + ' ' + encodeURIComponent(course.CourseTitle);
        }
        courses_list = courses_list.replace('&','?');
        if(courses_list != ""){
            $.getJSON(mscSchedulizer.api_host + "/schedule/" + courses_list, function(schedules){
                return callback(schedules);
            })
            .fail(function() {
                return callback([]);
            });
        }
        else{
            $("#"+mscSchedulizer.html_elements.schedules_container).html("No courses selected. <a href=\"select-classes.html\">Click here to select courses</a>.");
        }
    },
    getScheduleDetails:function(crns,element){
        $.getJSON(mscSchedulizer.api_host + "/info/?crn=" + crns.join("&crn[]="), function(schedule){
            $(element).html(mscSchedulizer.detailedCoursesOutput(schedule,false));
        })
        .fail(function() {
            $(element).html(mscSchedulizer.detailedCoursesOutput([],false));
        })
        .always(function() {
            $(element).removeClass("loader-large");
            $(element).removeClass("loader");
        });
    },
    detailedCoursesOutput:function(courses,icon){
        if(typeof icon === "undefined"){
            icon = true;
        }
        var output = "";
        var terms = []; //List of term objects used in this department
        for (var i in courses) {
            var course = courses[i];
            //Order by Section Number
            course.Sections.sort(function(a, b) { 
                return a.SectionNumber - b.SectionNumber;
            });
            //Table Header
            var icon_str = "";
            if(icon === true){
                icon_str += "<a class=\"a_course\" data-value='"+JSON.stringify(course)+"'>";
                if(mscSchedulizer.searchListDictionaries(mscSchedulizer.classes_selected,{DepartmentCode:course.DepartmentCode,CourseNumber:course.CourseNumber,CourseTitle:course.CourseTitle},true) !== -1){
                    icon_str += "<i class=\"fa fa-minus-circle\"></i>";
                }
                else{
                    icon_str += "<i class=\"fa fa-plus-circle\"></i>";
                }
                icon_str += "</a> ";
            }
            output+="<h4 class=\"classic-title\"><span>" + icon_str + course.Department.DepartmentCode + " " + course.CourseNumber + " - " + course.CourseTitle + "</span></h4>";
            output+="<table class=\"course_details\">";
            output+="<thead><tr class=\"field-name\"><td>P/T</td><td>Campus</td><td>CRN</td><td>Sec</td><td>CrHr</td><td>Enrl/Max</td><td>Days</td><td>Time</td><td>Instructor</td></tr></thead>";
            for (var s in course.Sections) {
                var section = course.Sections[s];
                var meeting = {};
                try
                {
                    if(!moment(section.Meetings[0].StartTime,"Hmm").isValid() || !moment(section.Meetings[0].EndTime,"Hmm").isValid()){
                        throw("Not a valid date");
                    }
                    meeting.startTime = moment(section.Meetings[0].StartTime,"Hmm").format("h:mma");
                    meeting.endTime = moment(section.Meetings[0].EndTime,"Hmm").format("h:mma");
                    meeting.days = mscSchedulizer.daysList(section.Meetings[0]);
                }
                catch(err)
                {
                    meeting.startTime = "TBD";
                    meeting.endTime = "";
                    meeting.days = [];
                }
                if(mscSchedulizer.searchListDictionaries(terms,section.CourseTerm,true) == -1){
                    terms.push(section.CourseTerm);
                }
                output+="<tr><td>" + section.Term + "</td><td>" + section.Campus + "</td><td>" + section.CourseCRN + "</td><td>" + section.SectionNumber + "</td><td>" + section.Credits + "</td><td>" + section.CurrentEnrollment + "/" + section.MaxEnrollment + "</td><td>" + meeting.days.join(" ") + "&nbsp;</td><td>" + meeting.startTime + " - " + meeting.endTime + "</td><td>" + section.Instructor + "</td></tr>";           
            }
            output+="</table>";
        }          
        output += "</table>";

        // Term Table
        var term_output = "<table class=\"term_details\">"
                        + "<thead><tr class=\"field-name\">"
                        + "<td>Term Code</td><td>Start Date</td><td>End Date</td>"
                        + "</tr></thead>";
        for (var i in terms) {
          var term = terms[i];
          term_output+= "<tr><td>" + term.TermCode + "</td><td>" + moment(term.TermStart).format("M/D/YY") + "</td><td>" + moment(term.TermEnd).format("M/D/YY") + "</td></tr>";  
        }
        term_output += "</table>";
        output= term_output + output;
        return output;
    },
    getCourseInfos:function(callback,callback2){
        // /v1/schedule/?courses[]=343&courses[]=344&courses[]=345&courses[]=121
        var courses_list = "";
        for (var i in mscSchedulizer.classes_selected) {
            var course = mscSchedulizer.classes_selected[i];  
            courses_list += "&courses[]=" + course.DepartmentCode + ' ' + course.CourseNumber + ' ' + encodeURIComponent(course.CourseTitle);
        }
        courses_list = courses_list.replace('&','?');
        if(courses_list != ""){
            $.getJSON(mscSchedulizer.api_host + "/schedule/" + courses_list + "&generate_schedule=0", function(courses){
                mscSchedulizer.gen_courses = courses;
                return callback(courses,callback2);
            })
            .fail(function() {
                mscSchedulizer.gen_courses = [];
                return callback([]);
            });
        }
        else{
            $("#"+mscSchedulizer.html_elements.schedules_container).html("No courses selected. <a href=\"select-classes.html\">Click here to select courses</a>.");
        }
    },
    getCombinations:function(courses,callback){
        var sectionCombinations = [];
        var courseslist = [];
        var outputCombinations = [];
        for (var i in courses) {
          var course = courses[i];
          var aSectionCombination = mscSchedulizer.getSectionCombinations(course.Sections);
          sectionCombinations.push(aSectionCombination);
          courseslist.push({DepartmentCode:course.DepartmentCode,CourseNumber:course.CourseNumber,CourseTitle:course.CourseTitle});
        }
        var scheduleCombinations = mscSchedulizer.getScheduleCombinations(sectionCombinations);
        // For each schedule
        for (var h = scheduleCombinations.length-1; h >= 0; h--) {
            outputCombinations[h] = [];
            //for each class in the schedule
            for (var c = scheduleCombinations[h].length-1; c >= 0; c--) {
                var coursekey = mscSchedulizer.searchListDictionaries(courseslist,{DepartmentCode:scheduleCombinations[h][c][0].DepartmentCode,CourseNumber:scheduleCombinations[h][c][0].CourseNumber,CourseTitle:scheduleCombinations[h][c][0].CourseTitle});
                // Deep copy around ByRef
                outputCombinations[h][c] = JSON.parse(JSON.stringify(coursekey));
                outputCombinations[h][c].Sections = JSON.parse(JSON.stringify(scheduleCombinations[h][c]));
            }
        }
        callback(outputCombinations);
    },
    getSectionCombinations:function(course_sections){
        var grouped_sections = mscSchedulizer.groupSections(course_sections);
        var values = [];
        Object.keys(grouped_sections).forEach(function(campus) {
            values[campus] = [];
            Object.keys(grouped_sections[campus]).forEach(function(key) {
              var val = grouped_sections[campus][key];
              for (var s = grouped_sections[campus][key].length-1; s >= 0; s--) {
                if(mscSchedulizer.applyFiltersToSection(grouped_sections[campus][key][s],mscSchedulizer.schedule_filters)){
                    // If it gets filtered out
                    grouped_sections[campus][key].splice(s, 1);
                }
              }
              // ByRef to the Rescue: note what the filters are being applied to
              // Only push if there is a valid grouping (after filters)
              if(val.length>0){
                values[campus].push(val);
              }

            });
        });
        var all_cp = [];
        Object.keys(values).forEach(function(campus) {
            // Only if there is a grouping for the campus (After filters)
            if(values[campus].length>0){
                var cp = Combinatorics.cartesianProduct.apply(null,values[campus])
                cp = cp.toArray();
                all_cp = all_cp.concat(cp);
            }
        });
        //For each combination
        for (var i = all_cp.length-1; i >= 0; i--) {
            var combination = all_cp[i];
            for (var s = combination.length-1; s >= 1; s--) {
                var section1 = combination[s];
                for (var t = s-1; t >= 0; t--) {
                    var section2 = combination[t];
                    if(mscSchedulizer.doSectionsOverlap(section1,section2)){
                        //If they do overlap, remove combination and break
                        all_cp.splice(i, 1);
                        //break out of section loop
                    }
                }
            }
        }
        return all_cp;
    },
    getScheduleCombinations:function(section_combinations){
        // Make sure each class has at least one available section (After filters)
        for (var i = section_combinations.length-1; i >= 0; i--) {
            if(section_combinations[i].length === 0){
                return [];
            }
        }
        var cp = Combinatorics.cartesianProduct.apply(null,section_combinations)
        cp = cp.toArray();
        //filter based on overlapping
        // returns list of schedules containing 
        //  a list of classes containing
        //   a list of sections
        // http://localhost:8014/v1/schedule/?courses[]=121&courses[]=127
        
        //for each schedule
        for (var h = cp.length-1; h >= 0; h--) {
            //for each class in the schedule
            classloop:
            for (var c = cp[h].length-1; c >= 1; c--) {
                var course = cp[h][c];
                //for each section in the class
                for (var s = course.length-1; s >= 0; s--) {
                    var section1 = course[s];
                    // Compare against all other class sections within schedule
                    // don't need to compare against current class' sections because that was already done
                    for (var oc = c-1; oc >= 0; oc--) {
                        var acourse = cp[h][oc];
                        for (var os = acourse.length-1; os >= 0; os--) {
                            var section2 = acourse[os];
                            if(mscSchedulizer.doSectionsOverlap(section1,section2)){
                                //If they do overlap, remove combination and break
                                cp.splice(h, 1);
                                //Break out of course loop
                                break classloop;
                            }
                        }
                    }
                }
            }
        }
        return cp;
    },
    groupSections:function(course_sections){
        // Sections are to be grouped by Campus and by identifier
        var grouped_sections = {};
        for (var i in course_sections) {
          var course_section = course_sections[i];
          var identifier = course_section.Identifier;
          var campus = course_section.Campus;
          if(identifier == "" || identifier == null){
            identifier = "empty";
          }
          if (!(campus in grouped_sections)){
            grouped_sections[campus] = [];
          }
          if (!(identifier in grouped_sections[campus])){
            grouped_sections[campus][identifier] = [];
          }
          grouped_sections[campus][identifier].push(course_section);
        }
        return grouped_sections;
    },
    filtersDisplay:function(){
        var result = "";
        result += "<label><input type=\"checkbox\" name=\"notFull\" id=\""+mscSchedulizer.html_elements.filters.not_full+"\"> Not Full</label>";
        result += "<label><input type=\"checkbox\" name=\"morrisville\" id=\""+mscSchedulizer.html_elements.filters.morrisville_campus+"\"> Morrisville Campus</label>";
        result += "<label><input type=\"checkbox\" name=\"norwich\" id=\""+mscSchedulizer.html_elements.filters.norwich_campus+"\"> Norwich Campus</label>";
        return result;
    },
    updateFiltersDisplay:function(filters){
        mscSchedulizer.checkboxFilterDisplay(mscSchedulizer.schedule_filters.NotFull,mscSchedulizer.html_elements.filters.not_full);
        mscSchedulizer.checkboxFilterDisplay(mscSchedulizer.schedule_filters.Campuses.Morrisville,mscSchedulizer.html_elements.filters.morrisville_campus);
        mscSchedulizer.checkboxFilterDisplay(mscSchedulizer.schedule_filters.Campuses.Norwich,mscSchedulizer.html_elements.filters.norwich_campus);
    },
    checkboxFilterDisplay:function(filter,elementID){       
      if (filter) 
      {
          document.getElementById(elementID).checked = true;
      } 
      else
      {
          document.getElementById(elementID).checked = false;
      }
    },
    applyFiltersToSection:function(section,filters){
        var filteredOut = false;
        if(typeof filters.Campuses !== "undefined" && filters.Campuses != {}){
            filteredOut = mscSchedulizer.campusFilter(section,filters.Campuses);
        }
        if(typeof filters.Professors !== "undefined" && filters.Professors != [] && filteredOut === false){
            filteredOut = mscSchedulizer.professorFilter(section,filters.Professors);
        }
        if(typeof filters.TimeBlocks !== "undefined" && filters.TimeBlocks != [] && filteredOut === false){
            filteredOut = mscSchedulizer.timeBlockFilter(section,filters.TimeBlocks);
        }
        if(typeof filters.NotFull !== "undefined" && filters.NotFull !== false && filteredOut === false){
            filteredOut = mscSchedulizer.NotFullFilter(section,filters.NotFull);
        }
        return filteredOut;
    },
    professorFilter:function(section,filter){
        return false;
    },
    campusFilter:function(section,filter){
        if(filter.Morrisville === false && section.Campus == "M"){
            return true;
        }
        if(filter.Norwich === false && section.Campus == "N"){
            return true;
        }
        return false;
    },
    timeBlockFilter:function(section,filter){
        return false;
    },
    NotFullFilter:function(section,filter){
        // 0 is unlimited
        if(section.MaxEnrollment!=0){
            if(section.CurrentEnrollment>=section.MaxEnrollment){
                return true
            }
        }
        return false;
    },
    doDaysOverlap:function(meeting1,meeting2){
        if(meeting1.Monday==1&&meeting2.Monday==1){
            return true;
        }
        else if(meeting1.Tuesday==1&&meeting2.Tuesday==1){
            return true;
        }
        else if(meeting1.Wednesday==1&&meeting2.Wednesday==1){
            return true;
        }
        else if(meeting1.Thursday==1&&meeting2.Thursday==1){
            return true;
        }
        else if(meeting1.Friday==1&&meeting2.Friday==1){
            return true;
        }
        return false;
    },
    doTimesOverlap:function(timeblock1,timeblock2){
        if(timeblock1.StartTime != 0 && timeblock1.EndTime != 0 &&timeblock2.StartTime != 0 &&timeblock2.EndTime != 0){
            if((timeblock1.StartTime <= timeblock2.StartTime && timeblock1.EndTime > timeblock2.StartTime)||((timeblock2.StartTime <= timeblock1.StartTime && timeblock2.EndTime > timeblock1.StartTime))){
                return true;
            }
        }
        return false;
    },
    doTermsOverlap:function(term1,term2){
        if(term1.TermStart != 0 && term1.TermEnd != 0 &&term2.TermStart != 0 &&term2.TermEnd != 0){
            if((term1.TermStart <= term2.TermStart && term1.TermEnd > term2.TermStart)||((term2.TermStart <= term1.TermStart && term2.TermEnd > term1.TermStart))){
                return true;
            }
        }
        return false;
    },
    doMeetingsOverlap:function(section1meetings,section2meetings){
        //for each meeting in section1
        if(typeof section1meetings !== 'undefined' && typeof section2meetings !== 'undefined'){
            for (var i = section1meetings.length-1; i >= 0; i--) {
                var s1meeting = section1meetings[i];
                //for each meeting in section2
                for (var m = section2meetings.length-1; m >= 0; m--) {
                    var s2meeting = section2meetings[m];
                    if(mscSchedulizer.doTimesOverlap({StartTime:s1meeting.StartTime,EndTime:s1meeting.EndTime},{StartTime:s2meeting.StartTime,EndTime:s2meeting.EndTime})){
                        if(mscSchedulizer.doDaysOverlap(s1meeting,s2meeting)){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
    doSectionsOverlap:function(section1,section2){
        if(mscSchedulizer.doMeetingsOverlap(section1.Meetings,section2.Meetings)){
            if(mscSchedulizer.doTermsOverlap(section1.CourseTerm,section2.CourseTerm)){
                return true;
            }
        }
        return false;
    },
    convertDate:function(dayOfWeek){
        var today = new Date();
        var weekDate = new Date();
        if(dayOfWeek == "M"){
            weekDate.setDate(today.getDate() - today.getDay()+1);
        }
        else if(dayOfWeek == "T"){
            weekDate.setDate(today.getDate() - today.getDay()+2);
        }
        else if(dayOfWeek == "W"){
            weekDate.setDate(today.getDate() - today.getDay()+3);
        }
        else if(dayOfWeek == "R"){
            weekDate.setDate(today.getDate() - today.getDay()+4);
        }
        else if(dayOfWeek == "F"){
            weekDate.setDate(today.getDate() - today.getDay()+5);
        }
        return weekDate;
    },
    splitMeetings:function(meeting){
        var meetups = [];
        if(meeting.Monday == 1){
            var m_date = mscSchedulizer.convertDate("M");
            var st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            var et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Tuesday == 1){
            var m_date = mscSchedulizer.convertDate("T");
            var st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            var et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Wednesday == 1){
            var m_date = mscSchedulizer.convertDate("W");
            var st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            var et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Thursday == 1){
            var m_date = mscSchedulizer.convertDate("R");
            var st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            var et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Friday == 1){
            var m_date = mscSchedulizer.convertDate("F");
            var st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            var et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        return meetups;
    },
    createSchedules:function(schedules){
        mscSchedulizer.num_loaded = 0;
        if(schedules != null && schedules.length > 0 ){
            var outputSchedules = schedules.length + " schedule";
            if(schedules.length != 1){outputSchedules += "s";}
            for (var i in schedules) {
                var schedule = schedules[i];  
                var events = [];
                var noMeetings = [];
                var earlyStartTime = 2400;
                var lateEndTime = 0;
                for (var c in schedule) {
                    var course = schedule[c]; 
                    var allSectionsHaveMeeting = true;
                    for (var s in course.Sections) {
                        var section = course.Sections[s]; 
                        if(section.Meetings.length == 0){
                            allSectionsHaveMeeting = false;
                        }
                        for (var m in section.Meetings) {
                            var meeting = section.Meetings[m];
                            if(meeting.StartTime == null || meeting.EndTime == null || (meeting.Monday==0 && meeting.Tuesday==0 && meeting.Wednesday==0 && meeting.Thursday==0 && meeting.Friday==0)){
                                allSectionsHaveMeeting = false;
                            }    
                            if(parseInt(meeting.StartTime) < parseInt(earlyStartTime)){
                                earlyStartTime = meeting.StartTime;
                            }
                            if(parseInt(meeting.EndTime) > parseInt(lateEndTime)){
                                lateEndTime = meeting.EndTime;
                            }
                            //Meeting could be on multiple days, needs to be split into separate events
                            var meetups = mscSchedulizer.splitMeetings(meeting);
                            for (var u in meetups) {
                                var meetup = meetups[u]; 
                                events.push({title:course.DepartmentCode + " " + course.CourseNumber,start:meetup.StartTime,end:meetup.EndTime,color: mscSchedulizer.colors[c]});
                            }
                        }
                    }
                    if(!allSectionsHaveMeeting){
                        noMeetings.push(course);
                    }
                }
                if(parseInt(earlyStartTime)>parseInt(lateEndTime)){
                    //Schedule does not have any meeting times
                    earlyStartTime = 0;
                    lateEndTime = 100;
                }
                schedule.earlyStartTime = earlyStartTime;
                schedule.lateEndTime = lateEndTime;
                schedule.events = events;
                schedule.courseWithoutMeeting = noMeetings;
                outputSchedules += "<div id=\"schedule_" + i + "\"></div>";
            }
            mscSchedulizer.gen_schedules = schedules;
            $("#"+mscSchedulizer.html_elements.schedules_container).html(outputSchedules);
            mscSchedulizer.initSchedules(mscSchedulizer.num_loaded,mscSchedulizer.numToLoad);
        }
        else{
            $("#"+mscSchedulizer.html_elements.schedules_container).html("No schedules");
        }
    },
    initSchedules:function(start,count){
        for (i = 0; i < count ; i++) { 
            var num = start + i;
            if(mscSchedulizer.gen_schedules[num] !== undefined){
                $('#schedule_' + num).fullCalendar({                
                    editable: false,
                    handleWindowResize: true,
                    weekends: false, // Hide weekends
                    defaultView: 'agendaWeek', // Only show week view
                    header: false, // Hide buttons/titles
                    minTime: moment(mscSchedulizer.gen_schedules[num].earlyStartTime,"Hmm").format("HH:mm"), // Start time for the calendar
                    maxTime: moment(mscSchedulizer.gen_schedules[num].lateEndTime,"Hmm").format("HH:mm"), // End time for the calendar
                    columnFormat: {
                        week: 'ddd' // Only show day of the week names
                    },
                    displayEventTime: true,
                    height:'auto',
                    // allDayText: 'TBD',
                    allDaySlot: false,
                    events: mscSchedulizer.gen_schedules[num].events
                });
                var additionalOutput = "";
                if(mscSchedulizer.gen_schedules[num].courseWithoutMeeting.length > 0){
                    additionalOutput += mscSchedulizer.genNoMeetingsOutput(mscSchedulizer.gen_schedules[num].courseWithoutMeeting);
                }
                additionalOutput += mscSchedulizer.optionsOutput(mscSchedulizer.gen_schedules[num]);
                $('#schedule_' + num).append(additionalOutput); 
                mscSchedulizer.num_loaded++;
            }
        }
    },
    optionsOutput:function(schedule){
        var result = "<div class=\"options\">";
        result += mscSchedulizer.favoriteLinkOutput(schedule);
        result += mscSchedulizer.detailsLinkOutput(schedule);
        result += mscSchedulizer.previewLinkOutput(schedule);
        result+="</div>";
        return result;
    },
    favoriteLinkOutput:function(schedule){
        // If a favorite
        if(mscSchedulizer.searchListObjects(mscSchedulizer.favorite_schedules,schedule) !== -1){
            return "<a class=\"unfavorite_schedule favoriting\" data-value='" + JSON.stringify(schedule) + "'>Unfavorite</a>";
        }
        return "<a class=\"favorite_schedule favoriting\" data-value='" + JSON.stringify(schedule) + "'>Favorite</a>";
    },
    detailsLinkOutput:function(schedule){
        var crns = [];
        for(var i = 0; i < schedule.length; i++){
            for(var s = 0; s < schedule[i].Sections.length; s++){
                crns.push(schedule[i].Sections[s].CourseCRN);
            }
        }
       return "<a target=\"_blank\"href=\"schedule-details.html?crn[]="+crns.join("&crn[]=")+"\">Details</a>";
    },
    previewLinkOutput:function(schedule){
         return "<a target=\"_blank\" href=\"#\">Preview</a>";
    },
    genNoMeetingsOutput: function(courses){
        try{
            var output = "";
            for(var i = 0; i < courses.length; i++){
                var course = courses[i];
                output += course.DepartmentCode + ' ' + course.CourseNumber + ', ';
            }
            if(output != ""){
                output = output.replace(/,+\s*$/, '');
                output = "<div class='nomeetings'><h3>Online/TBD</h3>" + output + "</div>";
            }
            return output;
        }
        catch(err){
            return "";
        }
    },
    isScrolledIntoView:function(elem) {
        var $elem = $(elem);
        var $window = $(window);

        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();

        var elemTop = $elem.offset().top;
        var elemBottom = elemTop + $elem.height();
        // && for entire element || for any part of the element
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
});