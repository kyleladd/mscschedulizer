var node_generic_functions = require('node_generic_functions');
var mscSchedulizer_config = require('./config.js');
module.exports = {
    classes_selected: JSON.parse(localStorage.getItem('classes_selected')) || [],
    favorite_schedules: JSON.parse(localStorage.getItem('favorite_schedules')) || [],
    schedule_filters: JSON.parse(localStorage.getItem('schedule_filters')) || {TimeBlocks:[],Professors:[],Campuses:{Morrisville:true,Norwich:false},NotFull:false,ShowOnline:true,ShowInternational:false},
    gen_courses: [],
    semester: JSON.parse(localStorage.getItem('semester')) || {TermCode: "", Description: "", TermStart: "", TermEnd: ""},
    department: JSON.parse(localStorage.getItem('department')) || "",
    department_courses: JSON.parse(localStorage.getItem('department_courses')) || "",
    current_semester_list: JSON.parse(localStorage.getItem('current_semester_list')) || [],
    user_course_adjustments: JSON.parse(localStorage.getItem('user_course_adjustments')) || {Courses:[],Sections:[],Meetings:[]}, // type:add/remove/update update section by crn, update meeting by id - does meeting id change, i can't remember if it is a fake unique primary key. - i think it stays the same
    do_apply_user_adjustments: JSON.parse(localStorage.getItem('do_apply_user_adjustments')) || "true",
    gen_schedules: [],
    num_loaded: 0,
    getTLD:function(url_location){
        var parts = url_location.hostname.split('.');
        var sndleveldomain = parts.slice(-2).join('.');
        return sndleveldomain;
    },
    exportSchedule:function(crns){
        var domain = mscSchedulizer.getTLD(window.location);
        mscSchedulizer.setCookie("MSCschedulizer",JSON.stringify(crns),1,domain);
        new PNotify({
          title: 'Schedule Saved',
          text: 'Login to <a href="http://webfor.morrisville.edu/webfor/bwskfreg.P_AltPin" target="_blank">Web for Students</a> and import the schedule from the add/drop form.',
          type: 'success',
          buttons: {
            closer_hover: false,
            closer: true,
            sticker: false
          }
      });
    },
    exportURL:function(url,semester,department){
        return url + (url.indexOf("?") === -1 ? "?" : "&") + "semester=" + semester + "&department=" + department;
    },
    setCookie:function(c_name, value, exdays, domain) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        domain = (domain && domain !== 'localhost') ? '; domain=' + '.' + (domain) : '';
        var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString() + domain + ";");
        document.cookie = c_name + "=" + c_value;
    },
    getCookie:function(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },
    setSemesterCurrentList:function(callback){
        try{
            var current_semester_list = mscSchedulizer.current_semester_list;
            if(new Date()>new Date(current_semester_list[0].expires)){
                mscSchedulizer.getSemestersList(callback);
            }
            else{
                callback(current_semester_list);
            }
        }
        catch(err){
            mscSchedulizer.getSemestersList(callback);
        }
    },
    setCurrentSemesterListVar:function(semesters){
        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);
        for(var i = 0; i < semesters.length; i++){
            semesters[i].expires = expiration;
        }
        localStorage.setItem("current_semester_list", JSON.stringify(semesters));
        mscSchedulizer.current_semester_list = semesters;
    },
    setUserCourseAdjustments:function(user_course_adjustments){
        localStorage.setItem("user_course_adjustments", JSON.stringify(user_course_adjustments));
        mscSchedulizer.user_course_adjustments = user_course_adjustments;
    },
    setSemester:function(semester){
        try{
            if(typeof semester !== 'undefined'){
                var expiration = new Date();
                expiration.setDate(expiration.getDate() + 1);
                mscSchedulizer.semester.TermCode = semester;
                mscSchedulizer.semester.expires = expiration;
                mscSchedulizer.setSemesterVar(mscSchedulizer.semester);
            }
            else{
                semester = JSON.parse(localStorage.getItem('semester')) || {};
                if(new Date()>semester.expires){
                    mscSchedulizer.setSemesterVar(mscSchedulizer.current_semester_list[0]);
                }
                else if(node_generic_functions.isEmpty(semester)){
                    mscSchedulizer.setSemesterVar(mscSchedulizer.current_semester_list[0]);
                }
                else if(node_generic_functions.searchListDictionaries(mscSchedulizer.current_semester_list,{TermCode:mscSchedulizer.semester.TermCode},true)===-1){
                    mscSchedulizer.setSemesterVar(mscSchedulizer.current_semester_list[0]);
                }
            }
        }
        catch(err){
            mscSchedulizer.setSemesterVar(mscSchedulizer.current_semester_list[0]);
        }
    },
    setSemesterVar:function(semester){
        localStorage.setItem("semester", JSON.stringify(semester));
        mscSchedulizer.semester = semester;
    },
    setDepartmentVar:function(department){
        localStorage.setItem("department", JSON.stringify(department));
        mscSchedulizer.department = department;
    },
    queryData:function(queryString, preserveDuplicates){
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
    },
    loadSelections: function(){
        var output = "";
        for (var i in mscSchedulizer.classes_selected) {
            var course = mscSchedulizer.classes_selected[i];
            output += "<a href=\"#\" data-value='"+escape(JSON.stringify(course))+"' class=\"a_selection\">"+course.DepartmentCode+" " + course.CourseNumber + ((course.CourseCRN!==null) ? " - " + course.CourseCRN : "") + " <i class=\"fa fa-times\"></i></a>";
        }
        $("#"+mscSchedulizer_config.html_elements.course_selections_list).html(output);
    },
    getDepartmentCourses: function(department){
        department = typeof department !== 'undefined' ?  department : $("#"+mscSchedulizer_config.html_elements.departments_select).val();
        $.getJSON(mscSchedulizer_config.api_host + "/courses/?department_code=" + department + "&semester="+mscSchedulizer.semester.TermCode , function(courses){
            //not going to worry about department courses user adjustments in this version/ atm
            // if(mscSchedulizer.do_apply_user_adjustments === "true"){
            //     //Make users adjustments here
            //     courses = mscSchedulizer.applyUserAdjustments(courses,mscSchedulizer.user_course_adjustments);
            // }
            //remove this later
            var output = "";
            // Remove sections that are administrative entry
            courses = mscSchedulizer.removeAdministrativeSections(courses);
            for (var i in courses) {
                var course = courses[i];
                //Change to just one html output set
                output += "<li><a class='a_course' data-value='"+escape(JSON.stringify({'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':null}))+"'>"+course.DepartmentCode+" " + course.CourseNumber +" - " + course.CourseTitle +"</a></li>";
            }
            $("#"+mscSchedulizer_config.html_elements.department_class_list).html(output);
        })
        .fail(function() {
            $("#"+mscSchedulizer_config.html_elements.department_class_list).html("<li>Unable to load courses.</li>");
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
        department = typeof department !== 'undefined' ?  department : $("#"+mscSchedulizer_config.html_elements.departments_select).val();
        $.getJSON(mscSchedulizer_config.api_host + "/courses/?department_code=" + department + "&include_objects=1&semester="+mscSchedulizer.semester.TermCode, function(courses){
            
            
            // Remove sections that are administrative entry
            courses = mscSchedulizer.removeAdministrativeSections(courses);
            // Save courses to mscschedulizer variable in localstorage
            localStorage.setItem("department_courses", JSON.stringify(courses));
            mscSchedulizer.department_courses = courses;
            // TODO-KL: make user adjustments - nope, should be done in the getDepartmentCoursesOutput function
            // if(mscSchedulizer.do_apply_user_adjustments === "true"){
            //     //Make users adjustments here
            //     courses = mscSchedulizer.applyUserAdjustments(courses,mscSchedulizer.user_course_adjustments);
            // }
            var output = mscSchedulizer.getDepartmentCoursesOutput(courses);
            $("#"+mscSchedulizer_config.html_elements.department_class_list).html(output);
        })
        .fail(function() {
            $("#"+mscSchedulizer_config.html_elements.department_class_list).html("<p>Unable to load course listings.</p>");
        })
        .always(function() {
            $('.course_details').basictable();
            $('#modal_courseDescription').modal({show:false});
            $('#modal_courseDescription').on('show.bs.modal', function (event) {
                var trigger = $(event.relatedTarget); // Element that triggered the modal
                var course = JSON.parse(unescape(trigger.data('course'))); // Extract info from data-* attributes
                var modal = $(this);
                modal.find('.modal-title').text(course.DepartmentCode + ' ' + course.CourseNumber + ' - ' + course.CourseTitle);
                modal.find('.modal-body').text((course.Description !== null ? course.Description : 'The course description is currently unavailable.'));
            });
        });
    },
    getDepartmentCoursesOutput: function(courses){
        var department_courses = JSON.parse(JSON.stringify(courses));
        //TODO-KL: apply user adjustments here
        courses = mscSchedulizer.applyUserAdjustments(courses,mscSchedulizer.user_course_adjustments);
        //Filter out sections based on user's filters
        for (var c = department_courses.length-1; c >= 0; c--) {
            for (var s = department_courses[c].Sections.length-1; s >= 0; s--) {
                // Apply filters to section function
                if(mscSchedulizer.applyFiltersToSection(department_courses[c].Sections[s],mscSchedulizer.schedule_filters)){
                    department_courses[c].Sections.splice(s, 1);
                }
            }
        }
        // Send filtered courses into detailed courses output.
        var output = mscSchedulizer.detailedCoursesOutput(department_courses);
        return output;
    },
    refreshDepartmentCoursesDetails: function(course){ 
      if(course.CourseCRN === null)
      {
        var changedCourse = $(".a_course[data-value *= '" + escape(JSON.stringify(course)) + "']");
        changedCourse.html("<i class=\"fa fa-plus-circle\"></i>");
      }
      else
      {
        var changedSection = $(".a_course_section[data-value *= " + course.CourseCRN + "]");
        changedSection.removeClass('selected_section');
      }
    },
    getSemestersList:function(callback){
        $.getJSON(mscSchedulizer_config.api_host + "/semesters/", function(semesters){
            mscSchedulizer.setCurrentSemesterListVar(semesters);
            callback(semesters);
        })
        .fail(function() {
            mscSchedulizer.setCurrentSemesterListVar(null);
            callback(null);
        });
    },
    getSemestersSelect:function(semesters_list){
        var output = "";
        for (var i in semesters_list){
            var semester = semesters_list[i];
            if(semester.TermCode == mscSchedulizer.semester.TermCode){
                output += "<option class='a_semester' value='"+escape(JSON.stringify(semester)) + "' selected=\"selected\">" + semester.Description + "</option>";
            }
            else{
                output += "<option class='a_semester' value='"+escape(JSON.stringify(semester)) + "'>" + semester.Description + "</option>";
            }
        }
        $("#"+mscSchedulizer_config.html_elements.semesters_select).html(output);
    },
    getDepartments:function(callback){
        $.getJSON(mscSchedulizer_config.api_host + "/departments/?semester="+mscSchedulizer.semester.TermCode, function(departments){
            var output = "";
            for (var i in departments) {
                var department = departments[i];
                output += "<option class='a_department' value='"+department.DepartmentCode + "' " + (department.DepartmentCode === mscSchedulizer.department ? "selected=selected" : "") + ">" + department.DepartmentCode + ' ' + department.Name + "</option>";
            }
            $("#"+mscSchedulizer_config.html_elements.departments_select).html(output);
            mscSchedulizer.setDepartmentVar($("#"+mscSchedulizer_config.html_elements.departments_select).val());
        })
        .fail(function() {
            $("#"+mscSchedulizer_config.html_elements.departments_select).html("<option>Unable to load departments.</option>");
        })
        .always(function() {
            $('.selectpicker').selectpicker({dropupAuto:false});
            $('.selectpicker').selectpicker('refresh');
            $(".bootstrap-select .dropdown-menu").niceScroll({
                scrollspeed: 100,
                mousescrollstep: 38,
                cursorwidth: 10,
                cursorborder: 0,
                cursorcolor: '#333',
                autohidemode: false,
                zindex: 999999999,
                horizrailenabled: false,
                cursorborderradius: 0,
            });
            callback();
        });
    },
    getLargeSchedule:function(crns,callback){
        $.getJSON(mscSchedulizer_config.api_host + "/info/?crn=" + crns.join("&crn[]=") + "&semester="+mscSchedulizer.semester.TermCode, function(schedule){
            var schedules = [];
            schedules.push(schedule);
            callback(schedules);
        })
        .fail(function() {
            callback([]);
        });
    },
    groupMeetings:function(meetings){
        groupedMeetings = [];
        for (var m in meetings) {
            var meeting = meetings[m];
            var index = node_generic_functions.searchListDictionaries(groupedMeetings,{CourseCRN:meeting.CourseCRN,StartTime:meeting.StartTime,EndTime:meeting.EndTime},true);
            if(index !== -1){
                groupedMeetings[index] = mscSchedulizer.mergeDays(groupedMeetings[index],meeting);
            }
            else{
                groupedMeetings.push(meeting);
            }
        }
        return  groupedMeetings;
    },
    mergeDays:function(meeting1,meeting2){
        var meeting = meeting1;
        if(!Boolean(meeting.Monday) && Boolean(meeting2.Monday)){
            meeting.Monday = 1;
        }
        if(!Boolean(meeting.Tuesday) && Boolean(meeting2.Tuesday)){
            meeting.Tuesday = 1;
        }
        if(!Boolean(meeting.Wednesday) && Boolean(meeting2.Wednesday)){
            meeting.Wednesday = 1;
        }
        if(!Boolean(meeting.Thursday) && Boolean(meeting2.Thursday)){
            meeting.Thursday = 1;
        }
        if(!Boolean(meeting.Friday) && Boolean(meeting2.Friday)){
            meeting.Friday = 1;
        }
        return meeting;
    },
    detailedCoursesOutput:function(courses,icon,show_crn_selections){
        if(typeof icon === "undefined"){
            icon = true;
        }
        if(typeof show_crn_selections === "undefined"){
            show_crn_selections = true;
        }
        var output = "";
        var terms = []; //List of term objects used in this department
        for (var i in courses) {
            var course = courses[i];
            //Order by Section Number
            course.Sections.sort(mscSchedulizer.sortSections);
            //Table Header
            var icon_str = "";
            if(icon === true){
                icon_str += "<a class=\"a_course\" data-value='"+escape(JSON.stringify({'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':null}))+"'>";
                if(node_generic_functions.searchListDictionaries(mscSchedulizer.classes_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':null},true) !== -1){
                    icon_str += "<i class=\"fa fa-minus-circle\"></i>";
                }
                else{
                    icon_str += "<i class=\"fa fa-plus-circle\"></i>";
                }
                icon_str += "</a> ";
            }
            output+=mscSchedulizer.modalTemplate('modal_courseDescription');
            output+='<h4 class=\'classic-title\'><span>' + icon_str + '<span class=\'modal-trigger\'data-toggle=\'modal\' data-target=\'#modal_courseDescription\' data-course=\''+escape(JSON.stringify(course))+'\'>' + course.DepartmentCode + ' ' + course.CourseNumber + ' - ' + course.CourseTitle + '</span></span></h4>';
            output+="<table class=\"course_details table\">";
            output+="<thead><tr class=\"field-name\"><td>P/T</td><td>Campus</td><td>CRN</td><td>Sec</td><td>CrHr</td><td>Enrl/Max</td><td>Days</td><td>Time</td><td>Instructor</td></tr></thead><tbody>";
            if(course.Sections.length === 0){
              output += "<tr><td colspan=\"9\">All sections have been filtered out.</td></tr>";
            }
            for (var s in course.Sections) {
                var section = course.Sections[s];
                var groupedmeetings = mscSchedulizer.groupMeetings(section.Meetings);
                groupedmeetings.sort(mscSchedulizer.sortMeetings);
                for (var m in groupedmeetings) {
                    var meeting = groupedmeetings[m];
                    try
                    {
                        if(!moment(meeting.StartTime,"Hmm").isValid() || !moment(meeting.EndTime,"Hmm").isValid()){
                            throw("Not a valid date");
                        }
                        meeting.startTime = moment(meeting.StartTime,"Hmm").format("h:mma");
                        meeting.endTime = moment(meeting.EndTime,"Hmm").format("h:mma");
                        meeting.days = mscSchedulizer.daysList(meeting);
                    }
                    catch(err)
                    {
                        meeting.startTime = "TBD";
                        meeting.endTime = "";
                        meeting.days = [];
                    }
                    if(node_generic_functions.searchListDictionaries(terms,section.CourseTerm,true) == -1){
                        terms.push(section.CourseTerm);
                    }
                    if(section.Credits === null){
                        section.Credits = "variable";
                    }

                    output+="<tr class=\"a_course_section"+((node_generic_functions.searchListDictionaries(mscSchedulizer.classes_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':section.CourseCRN},true)!==-1 && show_crn_selections === true) ? " selected_section" : "") +"\" data-value='" + escape(JSON.stringify({'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':section.CourseCRN})) + "'><td>" + section.Term + "</td><td>" + section.Campus + "</td><td>" + section.CourseCRN + "</td><td>" + section.SectionNumber + "</td><td>" + section.Credits + "</td><td>" + section.CurrentEnrollment + "/" + section.MaxEnrollment + "</td><td>" + meeting.days.join(" ") + "&nbsp;</td><td>" + meeting.startTime + " - " + meeting.endTime + "</td><td>" + section.Instructor + "</td></tr>";
                }
            }
            output+="</tbody></table>";
        }

        // Term Table
        var term_output = "<table class=\"term_details table\">" +
                        "<thead><tr class=\"field-name\">" +
                        "<td>Term Code</td><td>Start Date</td><td>End Date</td>" +
                        "</tr></thead>";
        terms.sort(function(a, b) {
            return a.TermCode - b.TermCode;
        });
        for (var t in terms) {
          var term = terms[t];
          term_output+= "<tr><td>" + term.TermCode + "</td><td>" + moment(term.TermStart).format("M/D/YY") + "</td><td>" + moment(term.TermEnd).format("M/D/YY") + "</td></tr>";
        }
        term_output += "</table>";
        var special_msc_message = "";
        // If it is a summer term
        if(mscSchedulizer_config.msc_special_messages === true && node_generic_functions.endsWith("06",mscSchedulizer.semester.TermCode)){
            var d_poterm = node_generic_functions.searchListDictionaries(terms,{TermCode:"D"}) ;
            var e_poterm = node_generic_functions.searchListDictionaries(terms,{TermCode:"E"});
            // Make this a function
            if(d_poterm !== null){
                special_msc_message += "<strong>Part of Term D Classes meeting:</strong><br/>";
                special_msc_message += "Monday/Wednesday classes meet the following Fridays: " + moment(d_poterm.TermStart).day(5).format("MMMM D") + ", " + moment(d_poterm.TermStart).day(19).format("MMMM D") + ", " + moment(d_poterm.TermStart).day(33).format("MMMM D") + ". <br/>";
                special_msc_message += "Tuesday/Thursday classes meet the following Fridays: " + moment(d_poterm.TermStart).day(12).format("MMMM D") + ", " + moment(d_poterm.TermStart).day(26).format("MMMM D") + ", " + moment(d_poterm.TermStart).day(40).format("MMMM D") + ". <br />";

            }
            if(e_poterm !== null){
                special_msc_message += "<strong>Part of Term E Classes meeting:</strong><br/>";
                special_msc_message += "Monday/Wednesday classes meet the following Fridays: " + moment(e_poterm.TermStart).day(5).format("MMMM D") + ", " + moment(e_poterm.TermStart).day(19).format("MMMM D") + ", " + moment(e_poterm.TermStart).day(33).format("MMMM D") + ". <br/>";
                special_msc_message += "Tuesday/Thursday classes meet the following Fridays: " + moment(e_poterm.TermStart).day(12).format("MMMM D") + ", " + moment(e_poterm.TermStart).day(26).format("MMMM D") + ", " + moment(e_poterm.TermStart).day(40).format("MMMM D") + ". <br />";
            }
            special_msc_message += "<br/>";
        }
        output = term_output + special_msc_message + output;
        return output;
    },
    getCourseInfos:function(callback,callback2){
        // /info/?courses[]=343&courses[]=344&courses[]=345&courses[]=121
        var courses_list = "";
        for (var i in mscSchedulizer.classes_selected) {
            var course = mscSchedulizer.classes_selected[i];
            courses_list += "&courses[]=" + course.DepartmentCode + ' ' + course.CourseNumber + ' ' + encodeURIComponent(course.CourseTitle);
        }
        courses_list = courses_list.replace('&','?');
        if(courses_list !== ""){
            $.getJSON(mscSchedulizer_config.api_host + "/info/" + courses_list + "&semester=" + mscSchedulizer.semester.TermCode, function(courses){
                // if(mscSchedulizer.do_apply_user_adjustments === "true"){
                //     //Make users adjustments here
                //     courses = mscSchedulizer.applyUserAdjustments(courses,mscSchedulizer.user_course_adjustments);
                // }
                mscSchedulizer.gen_courses = courses;
                console.log("getcourseinfo json callback");
                return callback(mscSchedulizer.gen_courses,callback2);
            })
            .fail(function() {
                mscSchedulizer.gen_courses = [];
                $("#"+mscSchedulizer_config.html_elements.schedules_container).html("<p><span class=\"notice\">Unable to load combinations.</span></p>");
                // return callback(mscSchedulizer.gen_courses,callback2);
            });
        }
        else{
            $("#"+mscSchedulizer_config.html_elements.schedules_container).html("<p><strong>No courses selected. <a href=\"select-classes.html\">Click here to select courses</a>.</strong></p>");
        }filters
    },
    applyUserAdjustments: function(courses,adjustments){
        adjustments.Sections.forEach(function(section_adjustment){
            if(section_adjustment.type === "remove"){
                for (var c = courses.length-1; c >= 0; c--) {
                    for (var s = courses[c].Sections.length-1; s >= 0; s--) {
                        // Apply filters to section function
                        if(courses[c].Sections[s].CourseCRN === section_adjustment.Section.CourseCRN){
                            courses[c].Sections.splice(s, 1);
                        }
                        if(courses[c].Sections.length === 0){
                            courses.splice(c, 1);
                        }
                    }
                }
            }
        });
        console.log("COURSES",courses);
        return courses;
    },
    altViewFilterOutput: function(adjustments){
        var output = "";
        if(adjustments.Courses.length === 0 && adjustments.Sections.length === 0 && adjustments.Meetings.length === 0){
          return "Check out <a href=\"alternate_view.html\">the alternate view</a> to visually filter course sections.";
        }
        output+="<table class=\"course_details table\">";
        output+="<thead><tr class=\"field-name\"><td></td><td>P/T</td><td>Campus</td><td>CRN</td><td>Sec</td><td>CrHr</td><td>Enrl/Max</td><td>Days</td><td>Time</td><td>Instructor</td><td></td></tr></thead><tbody>";
            for (var s in adjustments.Sections) {
                var section = adjustments.Sections[s].Section;
                var groupedmeetings = mscSchedulizer.groupMeetings(section.Meetings);
                groupedmeetings.sort(mscSchedulizer.sortMeetings);
                console.log(groupedmeetings);
                for (var m in groupedmeetings) {
                    var meeting = groupedmeetings[m];
                    try
                    {
                        if(!moment(meeting.StartTime,"Hmm").isValid() || !moment(meeting.EndTime,"Hmm").isValid()){
                            throw("Not a valid date");
                        }
                        meeting.startTime = moment(meeting.StartTime,"Hmm").format("h:mma");
                        meeting.endTime = moment(meeting.EndTime,"Hmm").format("h:mma");
                        meeting.days = mscSchedulizer.daysList(meeting);
                    }
                    catch(err)
                    {
                        meeting.startTime = "TBD";
                        meeting.endTime = "";
                        meeting.days = [];
                    }
                    // if(node_generic_functions.searchListDictionaries(terms,section.CourseTerm,true) == -1){
                    //     terms.push(section.CourseTerm);
                    // }
                    if(section.Credits === null){
                        section.Credits = "variable";
                    }
                    console.log("output append");
                    output+="<tr class=\"a_course_section\"><td>" + ((adjustments.Sections[s].type === "remove") ? "R" : "" ) + "</td><td>" + section.Term + "</td><td>" + section.Campus + "</td><td>" + section.CourseCRN + "</td><td>" + section.SectionNumber + "</td><td>" + section.Credits + "</td><td>" + section.CurrentEnrollment + "/" + section.MaxEnrollment + "</td><td>" + meeting.days.join(" ") + "&nbsp;</td><td>" + meeting.startTime + " - " + meeting.endTime + "</td><td>" + section.Instructor + "</td><td><button class=\"user_course_filter remove\" data-value="+escape(JSON.stringify(adjustments.Sections[s]))+">Undo</button></td></tr>";
                }
            }
            output+="</tbody></table>";
        console.log("ADJUSTMENTS",adjustments);
        console.log("output",output);
        return output;
    },
    loadAll:function(courses,options,callback){
        if(typeof options === "undefined"){
            options = {editable:true};
        }
        var outputCombinations = [courses];
        mscSchedulizer.gen_schedules = outputCombinations;
        callback(outputCombinations, options);
    },
    loadFullSchedule: function(schedule){
      var courses = JSON.parse(JSON.stringify(schedule[0])); //avoid byref
      for (var c = courses.length-1; c >= 0; c--) {
        for (var s = courses[c].Sections.length-1; s >= 0; s--) {
          if(mscSchedulizer.applyFiltersToSection(courses[c].Sections[s],mscSchedulizer.schedule_filters)){
            courses[c].Sections.splice(s, 1);
          }
        } 
      }
      mscSchedulizer.createSchedules([courses], {
        favorite:false,
        details:true,
        preview:true,
        export:false,
        eventClick: function(calEvent, jsEvent, view) {
            var events = $(this).closest(".fc").fullCalendar('clientEvents', function(evt) {
                return true;
            });
            var myel = $('#section_details').length ? $('#section_details') : $(mscSchedulizer.modalTemplate("section_details")).appendTo("body");
            $('#section_details').on('show.bs.modal', function (event) {
                var modal = $(this);
                modal.find('.modal-title').text("Course Section Details");
                var section_output = JSON.parse(JSON.stringify(calEvent.course));//avoid byref
                section_output.Sections = [calEvent.section];
                modal.find('.modal-body').html(mscSchedulizer.detailedCoursesOutput([section_output],false,false));
                modal.find('.modal-footer').html("<button type=\"button\" class=\"btn btn-danger remove-from-consideration\" data-event-id=\"" + calEvent._id + "\" data-section=\"" + escape(JSON.stringify(calEvent.section)) + "\" data-dismiss=\"modal\">Remove</button><button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>");
                $('.course_details').basictable();
            });
            $('#section_details').modal({show:true});
        },
        eventDrop: function(event, delta, revertFunc) {
        },
        eventResize: function(event, delta, revertFunc) {
        },
        dayClick: function(date, jsEvent, view) {
        }
        // eventMouseover: function( event, jsEvent, view ) {
        //   var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
        //     return el.section.CourseCRN === event.section.CourseCRN;
        //   });
        //   for(var i in matching_section_events){
        //     $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").addClass("event-hover");
        //   }
        // },
        // eventMouseout: function( event, jsEvent, view ) {
        //   var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
        //     return el.section.CourseCRN === event.section.CourseCRN;
        //   });
        //   for(var i in matching_section_events){
        //     $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").removeClass("event-hover");
        //   }
        // }
      });
    },
    getCombinations:function(courses,callback){
        console.log("getting combinations");
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
                var coursekey = node_generic_functions.searchListDictionaries(courseslist,{DepartmentCode:scheduleCombinations[h][c][0].DepartmentCode,CourseNumber:scheduleCombinations[h][c][0].CourseNumber,CourseTitle:scheduleCombinations[h][c][0].CourseTitle});
                // Deep copy around ByRef
                outputCombinations[h][c] = JSON.parse(JSON.stringify(coursekey));
                outputCombinations[h][c].Sections = JSON.parse(JSON.stringify(scheduleCombinations[h][c]));
            }
        }
        mscSchedulizer.gen_schedules = outputCombinations;
        console.log("genned schedules",mscSchedulizer.gen_schedules);
        console.log("genned schedules no ref",JSON.parse(JSON.stringify(mscSchedulizer.gen_schedules)));
        callback(outputCombinations);
    },
    getSectionCombinations:function(course_sections){
        var grouped_sections = mscSchedulizer.groupSections(course_sections);
        // Use Identifiers to generate combinations
        var all_cp = [];
        Object.keys(grouped_sections).forEach(function(campus) {
            var identifiers_run = [];
            Object.keys(grouped_sections[campus]).forEach(function(key) {
                for (var s = grouped_sections[campus][key].length-1; s >= 0; s--) {
                    var section = grouped_sections[campus][key][s];
                    var cp_list = [];
                    if(identifiers_run.indexOf(section.Identifier) === -1 || identifiers_run.indexOf(section.Identifier) === identifiers_run.length - 1){
                        if(identifiers_run.indexOf(section.Identifier) === -1){
                          identifiers_run.push(section.Identifier);
                        }
                        if(section.RequiredIdentifiers !== null && typeof section.RequiredIdentifiers === 'string'){
                            var identifierRequirements = section.RequiredIdentifiers.split(";");
                            // for each requirement
                            for(var r in identifierRequirements){
                                var requirement = identifierRequirements[r];
                                identifiers_run.unshift(requirement);
                                // if key in object
                                if((requirement in grouped_sections[campus])){
                                    cp_list.push(grouped_sections[campus][requirement]);
                                }
                            }
                        }
                        cp_list.push([section]);
                        var cp = Combinatorics.cartesianProduct.apply(null,cp_list);
                        cp = cp.toArray();
                        all_cp = all_cp.concat(cp);
                    }
                }
            });
        });
        // Checking the CRN requirements within each combination search classes selected for the requirements for this course
        var crnrequirements = node_generic_functions.searchListDictionaries(mscSchedulizer.classes_selected,{DepartmentCode:course_sections[0].DepartmentCode,CourseNumber:course_sections[0].CourseNumber,CourseTitle:course_sections[0].CourseTitle},false,true);
        // crnrequirements = crnrequirements.filter(return CourseCRN !== null);
        if(crnrequirements.length > 0){
            //Group the requirements by identifier
            for (var c = crnrequirements.length-1; c >= 0; c--) {
                if(crnrequirements[c].CourseCRN !==null){
                    var requirement = node_generic_functions.searchListDictionaries(course_sections,{DepartmentCode:crnrequirements[c].DepartmentCode,CourseNumber:crnrequirements[c].CourseNumber,CourseTitle:crnrequirements[c].CourseTitle,CourseCRN:crnrequirements[c].CourseCRN},false,false);
                    if(requirement !== null){
                        crnrequirements[c] = requirement;
                    }
                }
            }
            var groupedRequirements = mscSchedulizer.groupSectionsByIdentifier(crnrequirements);
            //for each requirement add to keys like campus required identifiers + identifiers - see groupsections function and do that for reqiuirement identifiers
            // get all requirement data by searching list dictionaries of course_sections with crn requirement
            //splice if combination does not include the number of required identifiers with CRN
            for (var cp = all_cp.length-1; cp >= 0; cp--) {
                var section_combination = all_cp[cp];
                var groupedSectionCombination = mscSchedulizer.groupSectionsByIdentifier(section_combination);
                // Be sure to test optional requirements BIOL 105
                CourseSectionTypeLoop:
                for (var gs in groupedSectionCombination){
                    if (typeof groupedSectionCombination[gs] !== 'function') {
                        // if this section type has a requirement of the same type
                        if (typeof groupedRequirements[gs] !== 'undefined') {
                            for (var r = groupedSectionCombination[gs].length-1; r >= 0; r--) {
                                if(node_generic_functions.searchListDictionaries(groupedRequirements[gs],groupedSectionCombination[gs][r],false,false)!==null){
                                    continue CourseSectionTypeLoop;
                                }
                            }
                            all_cp.splice(cp, 1);
                        }
                    }
                }
            }
        }
        // Check to see if the combination has sections that overlap
        //For each combination
        for (var i = all_cp.length-1; i >= 0; i--) {
            var combination = all_cp[i];
            combinationloop:
            for (var s = combination.length-1; s >= 1; s--) {
                var section1 = combination[s];
                for (var z = s-1; z >= 0; z--) {
                    var section2 = combination[z];
                    if(mscSchedulizer.doSectionsOverlap(section1,section2)){
                        //If they do overlap, remove combination and break
                        all_cp.splice(i, 1);
                        //break out of section loop
                        break combinationloop;
                    }
                }
            }
        }
        return all_cp;
    },
    groupSectionsByIdentifier:function(course_sections){
        //GROUP BY CAMPUS?????? - i don't think so otherwise 'or' would turn into 'and' requirement

        // Sections are to be grouped by identifier
        var grouped_sections = {};
        for (var i in course_sections) {
            if (typeof course_sections[i] !== 'function') {
              var course_section = course_sections[i];
              var identifier = course_section.Identifier;
              if(identifier === "" || identifier === null){
                identifier = "empty";
              }
              if (!(identifier in grouped_sections)){
                grouped_sections[identifier] = [];
              }
              grouped_sections[identifier].push(course_section);
          }
        }
        return grouped_sections;
    },
    getScheduleCombinations:function(section_combinations){
        // Make sure each class has at least one available section (After filters)
        if(section_combinations.length === 0){
            return [];
        }
        for (var i = section_combinations.length-1; i >= 0; i--) {
            if(section_combinations[i].length === 0){
                return [];
            }
        }

        var cp = Combinatorics.cartesianProduct.apply(null,section_combinations);
        cp = cp.toArray();
        //filter based on overlapping
        // returns list of schedules containing
        //  a list of classes containing
        //   a list of sections
        // /info/?courses[]=121&courses[]=127

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
          // Apply Filters To SECTION
          if(!mscSchedulizer.applyFiltersToSection(course_section,mscSchedulizer.schedule_filters)){
              if(identifier === "" || identifier === null){
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
        }
        return grouped_sections;
    },
    filtersDisplay:function(){
        var result = "<div id=\""+mscSchedulizer_config.html_elements.checkbox_filters+"\">";
        result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, only schedule combinations where all sections are not full (current enrollment is less than max enrollment) will be shown.\"><label><input type=\"checkbox\" name=\"notFull\" id=\""+mscSchedulizer_config.html_elements.filters.not_full+"\"> Hide Full</label></span>";
        result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations with Morrisville Campus sections will be shown.\"><label><input type=\"checkbox\" name=\"morrisville\" id=\""+mscSchedulizer_config.html_elements.filters.morrisville_campus+"\"> Morrisville Campus</label></span>";
        result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations with Norwich Campus sections will be shown.\"><label><input type=\"checkbox\" name=\"norwich\" id=\""+mscSchedulizer_config.html_elements.filters.norwich_campus+"\"> Norwich Campus</label></span>";
        result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations that include online sections will be shown.\"><label><input type=\"checkbox\" name=\"showOnline\" id=\""+mscSchedulizer_config.html_elements.filters.show_online+"\"> Online</label></span>";
        result += "<span class=\"filtertooltiptrigger\" title=\"When enabled, schedule combinations with ONCAMPUS SUNY sections will be shown.\"><label><input type=\"checkbox\" name=\"showInternational\" id=\""+mscSchedulizer_config.html_elements.filters.show_international+"\"> ONCAMPUS SUNY</label></span>";
        result += "<span class=\"filtertooltiptrigger\" title=\"Alternate view filtering of course sections.\"><label><button id=\""+mscSchedulizer_config.html_elements.alt_view_filter+"\"> Alt View</button></label></span>";
        result += "</div>";
        result += "<div id=\""+mscSchedulizer_config.html_elements.timeblock_filters+"\">";
        result += mscSchedulizer.timeBlockDisplay(mscSchedulizer.schedule_filters.TimeBlocks);
        result += "</div>";
        result += mscSchedulizer.modalTemplate('modal_alt_view_filters');
        return result;
    },
    updateFilters:function(schedule_filters){
        mscSchedulizer.schedule_filters = schedule_filters;
        localStorage.setItem('schedule_filters', JSON.stringify(schedule_filters));
        mscSchedulizer.updateFiltersDisplay(mscSchedulizer.schedule_filters);
    },
    updateFiltersDisplay:function(filters){
        mscSchedulizer.checkboxFilterDisplay(filters.NotFull,mscSchedulizer_config.html_elements.filters.not_full);
        mscSchedulizer.checkboxFilterDisplay(filters.Campuses.Morrisville,mscSchedulizer_config.html_elements.filters.morrisville_campus);
        mscSchedulizer.checkboxFilterDisplay(filters.Campuses.Norwich,mscSchedulizer_config.html_elements.filters.norwich_campus);
        mscSchedulizer.checkboxFilterDisplay(filters.ShowOnline,mscSchedulizer_config.html_elements.filters.show_online);
        mscSchedulizer.checkboxFilterDisplay(filters.ShowInternational,mscSchedulizer_config.html_elements.filters.show_international);
        $("#"+mscSchedulizer_config.html_elements.timeblock_filters).html(mscSchedulizer.timeBlockDisplay(mscSchedulizer.schedule_filters.TimeBlocks));
        mscSchedulizer.initTimeBlockPickers(filters.TimeBlocks);
        // Initialize the tooltips for filters
        $('.filtertooltiptrigger').tooltipster({ theme: 'tooltipster-punk',maxWidth:250,delay:750,iconTouch:true});
        $('#modal_alt_view_filters').on('show.bs.modal', function (event) {
            var trigger = $(event.relatedTarget); // Element that triggered the modal
            // var schedule = JSON.parse(unescape(trigger.data('schedule'))); // Extract info from data-* attributes
            var modal = $(this);
            modal.find('.modal-title').text("Alt View Filters");
            modal.find('.modal-body').html("<div style=\"display:block;\">" + mscSchedulizer.altViewFilterOutput(mscSchedulizer.user_course_adjustments) + "</div>");
            $('.course_details').basictable();
        });
        $(document).on("click", "#" + mscSchedulizer_config.html_elements.alt_view_filter,function() {
            $('#modal_alt_view_filters').modal({show:true});
        });
        $(document).on("click", ".user_course_filter.remove",function() {
            console.log($(this).data("value"));
            var adjustment = JSON.parse(unescape($(this).data("value")));
            console.log(adjustment);
            console.log(mscSchedulizer.user_course_adjustments.Sections);
            mscSchedulizer.user_course_adjustments.Sections = mscSchedulizer.user_course_adjustments.Sections.filter(function(user_adjustment){
                return !(JSON.stringify(user_adjustment) === JSON.stringify(adjustment));
            });
            mscSchedulizer.setUserCourseAdjustments(mscSchedulizer.user_course_adjustments);
        });
    },
    timeBlockDisplay:function(filters){
        var result = "<span class=\"filtertooltiptrigger\" title=\"By adding time blocks filters, you can block out times that you do not want to have classes.\">Time block filters: <a onclick=\"mscSchedulizer.addTimeBlockFilter()\">Add</a></span>";
        for(var i=0; i<filters.length;i++)
        {
            result += "<div id=\"timeOnly_"+i+"\"><span id=\"weekCal_"+i+"\"></span> " +
                    "<input type=\"text\" class=\"time start ui-timepicker-input\" autocomplete=\"off\"> to " +
                    "<input type=\"text\" class=\"time end ui-timepicker-input\" autocomplete=\"off\">" +
                "<a onclick=\"mscSchedulizer.updateDayTimeBlockFilter("+i+")\"> Apply </a> <a onclick=\"mscSchedulizer.removeTimeBlockFilter("+i+")\"> Remove</a></div>";
        }
        return result;
    },
    addTimeBlockFilter:function(){
        mscSchedulizer.schedule_filters.TimeBlocks[mscSchedulizer.schedule_filters.TimeBlocks.length] = {StartTime:"0000",EndTime:"2330",Days:""};
        mscSchedulizer.updateFilters(mscSchedulizer.schedule_filters);
    },
    removeTimeBlockFilter:function(index){
        mscSchedulizer.schedule_filters.TimeBlocks.splice(index, 1);
        mscSchedulizer.updateFilters(mscSchedulizer.schedule_filters);
        mscSchedulizer.getCombinations(mscSchedulizer.gen_courses,mscSchedulizer.createSchedules);
        $("#"+mscSchedulizer_config.html_elements.department_class_list).html(mscSchedulizer.getDepartmentCoursesOutput(mscSchedulizer.department_courses));
    },
    updateDayTimeBlockFilter:function(index){
        mscSchedulizer.schedule_filters.TimeBlocks[index] = {};
        var timeOnlyExampleEl = document.getElementById("timeOnly_"+index);
        var timeOnlyDatepair = new Datepair(timeOnlyExampleEl);
        mscSchedulizer.schedule_filters.TimeBlocks[index].StartTime = node_generic_functions.padStr(node_generic_functions.convertToInttime(timeOnlyDatepair.startTimeInput.value).toString(),3);
        mscSchedulizer.schedule_filters.TimeBlocks[index].EndTime = node_generic_functions.padStr(node_generic_functions.convertToInttime(timeOnlyDatepair.endTimeInput.value).toString(),3);
        mscSchedulizer.schedule_filters.TimeBlocks[index].Days = $("#weekCal_"+index).weekLine('getSelected');
        mscSchedulizer.updateFilters(mscSchedulizer.schedule_filters);
        mscSchedulizer.getCombinations(mscSchedulizer.gen_courses,mscSchedulizer.createSchedules);
        $("#"+mscSchedulizer_config.html_elements.department_class_list).html(mscSchedulizer.getDepartmentCoursesOutput(mscSchedulizer.department_courses));
    },
    initTimeBlockPickers:function(filters){
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
    concurrentEnrollmentFilter:function(section,filters){
        if(section.SectionAttributes !== null){
            var attributes = section.SectionAttributes.split(";");
            if(node_generic_functions.inList("CHS", attributes) || node_generic_functions.inList("NHS", attributes) || node_generic_functions.inList("ETC", attributes) || node_generic_functions.inList("OCBB", attributes)){
                return true;
            }
        }
        return false;
    },
    removeAdministrativeSections:function(courses){
      for (var c = courses.length-1; c >= 0; c--) {
          if(typeof courses[c].Sections !== "undefined" && courses[c].Sections !== null){
              for (var s = courses[c].Sections.length-1; s >= 0; s--) {
                  // Apply filters to section function
                  if(mscSchedulizer.requiredFilters(courses[c].Sections[s])){
                      courses[c].Sections.splice(s, 1);
                  }
              }
              if(courses[c].Sections.length === 0){
                  courses.splice(c, 1);
              }
          }
      }
      return courses;
    },
    requiredFilters:function(section){
      var filteredOut = false;
      filteredOut = mscSchedulizer.concurrentEnrollmentFilter(section);
      return filteredOut;
    },
    applyFiltersToSection:function(section,filters){
        var filteredOut = false;
        filteredOut = mscSchedulizer.requiredFilters(section);
        if(typeof filters.Campuses !== "undefined" && filteredOut === false){
            filteredOut = mscSchedulizer.campusFilter(section,filters.Campuses);
        }
        // if(typeof filters.Professors !== "undefined" && filters.Professors != [] && filteredOut === false){
        //     filteredOut = mscSchedulizer.professorFilter(section,filters.Professors);
        // }
        if(typeof filters.TimeBlocks !== "undefined" && filters.TimeBlocks != [] && filteredOut === false){
            filteredOut = mscSchedulizer.timeBlockFilter(section,filters.TimeBlocks);
        }
        if(typeof filters.NotFull !== "undefined" && filters.NotFull !== false && filteredOut === false){
            filteredOut = mscSchedulizer.notFullFilter(section,filters.NotFull);
        }
        if((typeof filters.ShowOnline == "undefined" || filters.ShowOnline === false) && filteredOut === false){
            filteredOut = mscSchedulizer.hideOnlineFilter(section,filters.ShowOnline);
        }
        if((typeof filters.ShowInternational === "undefined" || filters.ShowInternational === false) && filteredOut === false){
            filteredOut = mscSchedulizer.hideInternationalFilter(section,filters.ShowInternational);
        }
        return filteredOut;
    },
    professorFilter:function(section,filter){
        return false;
    },
    hideOnlineFilter:function(section,filters){
        if(section.SectionAttributes !== null){
            var attributes = section.SectionAttributes.split(";");
            if(node_generic_functions.inList("ONLN", attributes)){
                return true;
            }
        }
        return false;
    },
    hideInternationalFilter:function(section,filters){
        if(section.SectionNumber.indexOf("OL") === 0 || section.SectionNumber.indexOf("OC") === 0){
            return true;
        }

        return false;
    },
    campusFilter:function(section,filter){
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
    },
    timeBlockFilter:function(section,filter){
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
    },
    notFullFilter:function(section,filter){
        // 0 is NOT unlimited, 0 means manual registration
        // if(section.MaxEnrollment!=0){
            if(section.CurrentEnrollment>=section.MaxEnrollment){
                return true;
            }
        // }
        return false;
    },
    doBlockDaysOverlap:function(meeting1,days){
        if(meeting1.Monday==1 && node_generic_functions.inList("Mon",days)){
            return true;
        }
        else if(meeting1.Tuesday==1 && node_generic_functions.inList("Tue",days)){
            return true;
        }
        else if(meeting1.Wednesday==1 && node_generic_functions.inList("Wed",days)){
            return true;
        }
        else if(meeting1.Thursday==1 && node_generic_functions.inList("Thu",days)){
            return true;
        }
        else if(meeting1.Friday==1 && node_generic_functions.inList("Fri",days)){
            return true;
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
        if((parseInt(timeblock1.StartTime) <= parseInt(timeblock2.StartTime) && parseInt(timeblock1.EndTime) > parseInt(timeblock2.StartTime))||((parseInt(timeblock2.StartTime) <= parseInt(timeblock1.StartTime) && parseInt(timeblock2.EndTime) > parseInt(timeblock1.StartTime)))){
            return true;
        }
        return false;
    },
    doTermsOverlap:function(term1,term2){
        if((term1.TermStart <= term2.TermStart && term1.TermEnd > term2.TermStart)||((term2.TermStart <= term1.TermStart && term2.TermEnd > term1.TermStart))){
            return true;
        }
        return false;
    },
    doMeetingDatesOverlap:function(meeting1,meeting2){
        // One-day meetings have the same start and end date, in which case they should overlap
        if(meeting1.StartDate !== null && meeting1.EndDate !== null && meeting2.StartDate !== null && meeting2.EndDate !== null){
          if((meeting1.StartDate <= meeting2.StartDate && meeting1.EndDate >= meeting2.StartDate)||((meeting2.StartDate <= meeting1.StartDate && meeting2.EndDate >= meeting1.StartDate))){
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
                            if(mscSchedulizer.doMeetingDatesOverlap(s1meeting,s2meeting)){
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    doSectionsOverlap:function(section1,section2){
        if(mscSchedulizer.doMeetingsOverlap(section1.Meetings,section2.Meetings)){
            return true;
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
        var m_date;
        var st;
        var et;
        if(meeting.Monday == 1){
            m_date = mscSchedulizer.convertDate("M");
            st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Tuesday == 1){
            m_date = mscSchedulizer.convertDate("T");
            st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Wednesday == 1){
            m_date = mscSchedulizer.convertDate("W");
            st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Thursday == 1){
            m_date = mscSchedulizer.convertDate("R");
            st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        if(meeting.Friday == 1){
            m_date = mscSchedulizer.convertDate("F");
            st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
            et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
            meetups.push({StartTime: st,EndTime: et});
        }
        return meetups;
    },
    createSchedules:function(schedules,options){
        console.log("CREATE SCHED SCHEDS",schedules);
        mscSchedulizer.num_loaded = 0;
        if(schedules !== null && schedules.length > 0 ){
            var outputSchedules = "<span class=\"notice\">"+schedules.length + " schedule";
            if(schedules.length != 1){outputSchedules += "s";}
            outputSchedules +="</span>";
            outputSchedules += mscSchedulizer.modalTemplate("modal_courseDetails","modal-lg");
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
                        if(section.Meetings.length === 0){
                            allSectionsHaveMeeting = false;
                        }
                        for (var m in section.Meetings) {
                            var meeting = section.Meetings[m];
                            if(meeting.StartTime === null || meeting.EndTime === null || (meeting.Monday === 0 && meeting.Tuesday === 0 && meeting.Wednesday === 0 && meeting.Thursday === 0 && meeting.Friday === 0)){
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
                                events.push({title:course.DepartmentCode + " " + course.CourseNumber,start:meetup.StartTime,end:meetup.EndTime,color: mscSchedulizer_config.colors[c],course:course,section:section,meeting:meeting});
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
                outputSchedules += "<div id=\"schedule_" + i + "\" class=\"schedule_combination\"></div>";
            }
            $("#"+mscSchedulizer_config.html_elements.schedules_container).html(outputSchedules);

            $('#modal_courseDetails').modal({show:false});
            $('#modal_courseDetails').on('show.bs.modal', function (event) {
                var trigger = $(event.relatedTarget); // Element that triggered the modal
                var schedule = JSON.parse(unescape(trigger.data('schedule'))); // Extract info from data-* attributes
                var modal = $(this);
                modal.find('.modal-title').text("Schedule Details");
                modal.find('.modal-body').html('<div style=\'display:block;\'>' + mscSchedulizer.exportLink(schedule) + '</div>' + mscSchedulizer.detailedCoursesOutput(schedule,false,false));
                $('.course_details').basictable();
            });
            mscSchedulizer.initSchedules(schedules,mscSchedulizer.num_loaded,mscSchedulizer_config.numToLoad,options);
        }
        else{
            $("#"+mscSchedulizer_config.html_elements.schedules_container).html("<p><span class=\"notice\">No schedules. Adjust your selections and/or filters.</span> " + (!(node_generic_functions.inList(location.pathname.substr(location.pathname.lastIndexOf("/")+1).toLowerCase(), ["alternate_view.html"])) ? "<a href=\"alternate_view.html\">Try the alternate view</a>" : "") + "</p>");
        }
    },
    initSchedules:function(schedules,start,count,options){
        console.log("INIT SCHED SCHEDS",schedules);
        if(typeof options === 'undefined'){
            options = {};
        }
        for (var i = 0; i < count ; i++) {
            var num = start + i;
            if(schedules[num] !== undefined){
                var final_options = mscSchedulizer.merge_options(
                {
                    editable: false,
                    handleWindowResize: true,
                    slotEventOverlap:false,
                    weekends: false, // Hide weekends
                    defaultView: 'agendaWeek', // Only show week view
                    header: false, // Hide buttons/titles
                    minTime: moment(schedules[num].earlyStartTime,"Hmm").format("HH:mm"), // Start time for the calendar
                    maxTime: moment(schedules[num].lateEndTime,"Hmm").format("HH:mm"), // End time for the calendar
                    columnFormat: {
                        week: 'ddd' // Only show day of the week names
                    },
                    displayEventTime: true,
                    height:'auto',
                    // allDayText: 'TBD',
                    allDaySlot: false,
                    events: schedules[num].events,
                    eventRender: function (event, element) {
                        element.attr("data-event-id",event._id); //for converting fullcal js object to html element
                    },
                    eventMouseover: function( event, jsEvent, view ) {
                      var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
                        return el.section.CourseCRN === event.section.CourseCRN;
                      });
                      for(var i in matching_section_events){
                        $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").addClass("event-hover");
                      }
                    },
                    eventMouseout: function( event, jsEvent, view ) {
                      var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
                        return el.section.CourseCRN === event.section.CourseCRN;
                      });
                      for(var i in matching_section_events){
                        $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").removeClass("event-hover");
                      }
                    }
                },options);
                $('#schedule_' + num).fullCalendar(final_options);
                var additionalOutput = "";
                if(schedules[num].courseWithoutMeeting.length > 0){
                    additionalOutput += mscSchedulizer.genNoMeetingsOutput(schedules[num].courseWithoutMeeting);
                }
                additionalOutput += mscSchedulizer.optionsOutput(schedules[num],final_options);
                $('#schedule_' + num).append(additionalOutput);
                mscSchedulizer.num_loaded++;
            }
        }
    },
    optionsOutput:function(schedule,options){
        if(typeof(options) === "undefined"){
            options = {};
        }
        var final_options = mscSchedulizer.merge_options(
        {
            favorite:true,
            details:true,
            preview:true,
            export:true
        },options);
        //TODO-KL: not using these options, why?
        var result = "<div class=\"options\">";
        if(final_options.favorite){
            result += mscSchedulizer.favoriteLinkOutput(schedule);
        }

        if(final_options.details){
            result += mscSchedulizer.detailsLinkOutput(schedule);
        }

        if(final_options.preview){
            result += mscSchedulizer.previewLinkOutput(schedule);
        }

        if(final_options.export){
            result += mscSchedulizer.exportLink(schedule);
        }


        result+="</div>";
        return result;
    },
    favoriteLinkOutput:function(schedule){
        // If a favorite
        if(node_generic_functions.searchListObjects(mscSchedulizer.favorite_schedules,schedule) !== -1){
            return "<a class=\"unfavorite_schedule favoriting\" data-value='" + escape(JSON.stringify(schedule)) + "'>Unfavorite</a>";
        }
        return "<a class=\"favorite_schedule favoriting\" data-value='" + escape(JSON.stringify(schedule)) + "'>Favorite</a>";
    },
    detailsLinkOutput:function(schedule){
       return '<a class=\'modal-trigger\'data-toggle=\'modal\' data-target=\'#modal_courseDetails\' data-schedule=\''+escape(JSON.stringify(schedule))+'\'>Details</a>';
    },
    previewLinkOutput:function(schedule){
        var crns = [];
        for(var i = 0; i < schedule.length; i++){
            for(var s = 0; s < schedule[i].Sections.length; s++){
                crns.push(schedule[i].Sections[s].CourseCRN);
            }
        }
        return "<a target=\"_blank\" href=\"preview.html?crn[]="+crns.join("&crn[]=")+"\">Preview</a>";
    },
    genNoMeetingsOutput: function(courses){
        try{
            var output = "";
            for(var i = 0; i < courses.length; i++){
                var course = courses[i];
                output += course.DepartmentCode + ' ' + course.CourseNumber + ', ';
            }
            if(output !== ""){
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
    },
    modalTemplate:function(id,classes){
        classes = typeof classes !== 'undefined' ? classes : "";
        var output = "";
        //Modal
        output += '<!-- Modal -->';
        output += '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
        output += '  <div class="modal-dialog ' + classes + '" role="document">';
        output += '    <div class="modal-content">';
        output += '      <div class="modal-header">';
        output += '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        output += '        <h4 class="modal-title"></h4>';
        output += '      </div>';
        output += '      <div class="modal-body">';
        output += '      </div>';
        output += '      <div class="modal-footer">';
        output += '        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>';
        output += '      </div>';
        output += '    </div>';
        output += '  </div>';
        output += '</div>';
        //End modal
        return output;
    },
    exportLink:function(schedule){
        return '<a class=\'export_schedule\' onClick=\'mscSchedulizer.exportSchedule(mscSchedulizer.getScheduleCRNs("' + escape(JSON.stringify(schedule)) + '"));\'>Export Schedule</a>';
    },
    getScheduleCRNs:function(schedule){
        var crns = [];
        if(typeof schedule === 'string'){
            schedule = JSON.parse(unescape(schedule));
        }
        for(var i = 0; i < schedule.length; i++){
            for(var s = 0; s < schedule[i].Sections.length; s++){
                crns.push(schedule[i].Sections[s].CourseCRN);
            }
        }
       return crns;
    },
    sortSections:function(a,b){
        return node_generic_functions.alphaNumericSort(a.SectionNumber,b.SectionNumber);
    },
    sortMeetings:function(a, b) {
        if(moment(a.StartTime,"Hmm").isValid() && moment(b.StartTime,"Hmm").isValid()){
            return moment(a.StartTime,"Hmm") - moment(b.StartTime,"Hmm");
        }
        return 0;
    },
    /**
    * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
    * @param obj1
    * @param obj2
    * @returns obj3 a new object based on obj1 and obj2
    */
    merge_options: function(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attributename in obj2) { obj3[attributename] = obj2[attributename]; }
        return obj3;
    }
};
