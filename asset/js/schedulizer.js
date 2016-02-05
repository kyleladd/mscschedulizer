var mscSchedulizer = mscSchedulizer === undefined ? {} : mscSchedulizer;
$.extend(mscSchedulizer, {
    classes_selected: JSON.parse(localStorage.getItem('classes_selected')) || [],
    favorite_schedules: JSON.parse(localStorage.getItem('favorite_schedules')) || [],
    gen_schedules:[],
    num_loaded:0,
    listContainsDictionaryIndex: function(list,keyvaluelist){
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
                            return i;
                        }
                    }
                }
            }
            return -1;
        }
        catch(err){
            return -1;
        }
    },
    loadSelections: function(){
        var output = "";
        $.each(mscSchedulizer.classes_selected, function(i, course){
            output += "<a href=\"#\" data-value='"+JSON.stringify(course)+"' class=\"a_selection\">"+course.DepartmentCode+" " + course.CourseNumber + " <i class=\"fa fa-times\"></i></a>";
        });
        $(mscSchedulizer.course_selections).html(output);
    },
    getDepartmentCourses: function(department){
        department = typeof department !== 'undefined' ?  department : $(mscSchedulizer.departments).val();
        $.getJSON(mscSchedulizer.api_host + "/courses/?department_id=" + department, function(results){
            //remove this later
            var output = "";
            $.each(results, function(i, course){
                //Change to just one html output set
                output += "<li><a class='a_course' data-value='"+JSON.stringify(course)+"'>"+course.DepartmentCode+" " + course.CourseNumber +" - " + course.CourseTitle +"</a></li>";
            });
            $(mscSchedulizer.department_class_list).html(output);
        })
        .fail(function() {
            $(mscSchedulizer.department_class_list).html("<li>Unable to load courses.</li>");
        })
        .always(function() {
            $(mscSchedulizer.department_class_list).removeClass("loader-large");
            $(mscSchedulizer.department_class_list).removeClass("loader");
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
        department = typeof department !== 'undefined' ?  department : $(mscSchedulizer.departments).val();
        $.getJSON(mscSchedulizer.api_host + "/courses/?department_id=" + department + "&include_objects=1", function(results){
            var output = "";
            var terms = []; //List of term objects used in this department
            $.each(results, function(i, course){
                //Table Header
                output+="<h4 class=\"classic-title\"><span><a class=\"a_course\" data-value='"+JSON.stringify(course)+"'><i class=\"fa fa-plus-circle\"></i></a> " + course.Department.DepartmentCode + " " + course.CourseNumber + " - " + course.CourseTitle + "</span></h4>";
                output+="<table class=\"course_details\">";
                output+="<thead><tr class=\"field-name\"><td>P/T</td><td>CRN</td><td>Sec</td><td>CrHr</td><td>Enrl/Max</td><td>Days</td><td>Time</td><td>Instructor</td></tr></thead>";
                $.each(course.Sections, function(i, section){
                    var meeting = {};
                    try
                    {
                        meeting.startTime = moment(section.Meetings[0].StartTime,"Hmm").format("HH:mm");
                        meeting.endTime = moment(section.Meetings[0].EndTime,"Hmm").format("HH:mm");
                        meeting.days = mscSchedulizer.daysList(section.Meetings[0]);
                    }
                    catch(err)
                    {
                        meeting.startTime = "TBD";
                        meeting.endTime = "";
                        meeting.days = [];
                    }
                    if(mscSchedulizer.listContainsDictionaryIndex(terms,section.CourseTerm) == -1){
                        terms.push(section.CourseTerm);
                    }
                    output+="<tr><td>" + section.Term + "</td><td>" + section.CourseCRN + "</td><td>" + section.SectionNumber + "</td><td>" + section.Credits + "</td><td>" + section.CurrentEnrollment + "/" + section.MaxEnrollment + "</td><td>" + meeting.days.join(" ") + "&nbsp;</td><td>" + meeting.startTime + "-" + meeting.endTime + "</td><td>" + section.Instructor + "</td></tr>";           
                });
                output+="</table>";
            });            
            output += "</table>";

            // Term Table
            var term_output = "<table class=\"term_details\">"
                            + "<thead><tr class=\"field-name\">"
                            + "<td>Term Code</td><td>Start Date</td><td>End Date</td>"
                            + "</tr></thead>";
            $.each(terms, function(i, term){
              term_output+= "<tr><td>" + term.TermCode + "</td><td>" + moment(term.TermStart).format("M/D/YY") + "</td><td>" + moment(term.TermEnd).format("M/D/YY") + "</td></tr>";  
            });
            term_output += "</table>";
            output= term_output + output;
            $(mscSchedulizer.department_class_list).html(output);
        })
        .fail(function() {
            $(mscSchedulizer.department_class_list).html("<p>Unable to load course listings.</p>");
        })
        .always(function() {
            $(mscSchedulizer.department_class_list).removeClass("loader-large");
            $(mscSchedulizer.department_class_list).removeClass("loader");
        });
    },
    getDepartments:function(callback){
        $.getJSON(mscSchedulizer.api_host + "/departments/", function(results){
            var output = "";
            $.each(results, function(i, department){
                output += "<option class='a_department' value='"+department.DepartmentCode + "'>" + department.DepartmentCode + ' ' + department.Name + "</option>";
            });
            $(mscSchedulizer.departments).html(output);
        })
        .fail(function() {
            $(mscSchedulizer.departments).html("<option>Unable to load departments.</option>");
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
        $.each(mscSchedulizer.classes_selected, function(i, course){
            courses_list += "&courses[]=" + course.DepartmentCode + ' ' + course.CourseNumber + ' ' + course.CourseTitle;
        });
        courses_list = courses_list.replace('&','?');
        if(courses_list != ""){
            $.getJSON(mscSchedulizer.api_host + "/schedule/" + courses_list, function(schedules){
                return callback(schedules);
            })
            .fail(function() {
                return callback(null);
            });
        }
        else{
            $(mscSchedulizer.schedules).html("No courses selected. <a href=\"select-classes.html\">Click here to select courses</a>.");
        }
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
        if(schedules != null){
            if(schedules.length > 0 ){
                var outputSchedules = schedules.length + " combinations";
                $.each(schedules, function(i, schedule){
                    var events = [];
                    var noMeetings = [];
                    var earlyStartTime = 2400;
                    var lateEndTime = 0;
                    $.each(schedule, function(c, course){
                        var allSectionsHaveMeeting = true;
                        $.each(course.Sections, function(s, section){
                            if(section.Meetings.length == 0){
                                allSectionsHaveMeeting = false;
                            }
                            $.each(section.Meetings, function(m, meeting){
                                if(parseInt(meeting.StartTime) < parseInt(earlyStartTime)){
                                    earlyStartTime = meeting.StartTime;
                                }
                                if(parseInt(meeting.EndTime) > parseInt(lateEndTime)){
                                    lateEndTime = meeting.EndTime;
                                }
                                //Meeting could be on multiple days, needs to be split into separate events
                                var meetups = mscSchedulizer.splitMeetings(meeting);
                                $.each(meetups, function(u, meetup){
                                    events.push({title:course.DepartmentCode + " " + course.CourseNumber,start:meetup.StartTime,end:meetup.EndTime,color: mscSchedulizer.colors[c]});
                                });
                            });
                        });
                        if(!allSectionsHaveMeeting){
                            noMeetings.push(course);
                        }
                    });
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
                });
                mscSchedulizer.gen_schedules = schedules;
                $(mscSchedulizer.schedules).html(outputSchedules);
                mscSchedulizer.initSchedules(0,mscSchedulizer.numToLoad);
            }
        }
        else{
            $(mscSchedulizer.schedules).html("No schedule combinations");
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
                if(mscSchedulizer.gen_schedules[num].courseWithoutMeeting.length > 0){
                    var noMeetingsOutput = mscSchedulizer.genNoMeetingsOutput(mscSchedulizer.gen_schedules[num].courseWithoutMeeting);
                   $('#schedule_' + num).append(noMeetingsOutput); 
                }
                mscSchedulizer.num_loaded++;
            }
        }
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