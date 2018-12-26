define(['angular','node_generic_functions','moment','combinatorics'], function (angular, node_generic_functions, moment, Combinatorics) {

    var service = angular.module("schedulizerHelperService", []);

    service.factory('schedulizerHelperService', function () {
        var base_url = "https://schedulizer-api.morrisville.edu";
        var factory = {};
        
        factory.applyUserModificationsToCourses = function(courses, user_course_adjustments, user_schedule_filters){
            var department_courses = JSON.parse(JSON.stringify(courses));
            department_courses = factory.applyUserAdjustments(department_courses,user_course_adjustments);
            //Filter out sections based on user's filters
            for (var c = department_courses.length-1; c >= 0; c--) {
                for (var s = department_courses[c].Sections.length-1; s >= 0; s--) {
                    // Apply filters to section function
                    if(factory.applyFiltersToSection(department_courses[c].Sections[s],user_schedule_filters)){
                        department_courses[c].Sections.splice(s, 1);
                    }
                }
            }
            return department_courses;
        };
        factory.groupMeetings = function(meetings){
            groupedMeetings = [];
            for (var m in meetings) {
                var meeting = meetings[m];
                var index = node_generic_functions.searchListDictionaries(groupedMeetings,{CourseCRN:meeting.CourseCRN,StartTime:meeting.StartTime,EndTime:meeting.EndTime},true);
                if(index !== -1){
                    groupedMeetings[index] = factory.mergeDays(groupedMeetings[index],meeting);
                }
                else{
                    groupedMeetings.push(meeting);
                }
            }
            return  groupedMeetings;
        };

        factory.mergeDays = function(meeting1,meeting2){
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
        };

        factory.daysList = function(meeting, include_empty){
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
        };

        factory.doBlockDaysOverlap = function(meeting1,days){
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
        };

        factory.doDaysOverlap = function(meeting1,meeting2){
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
        };

        factory.doTimesOverlap = function(timeblock1,timeblock2){
            if((parseInt(timeblock1.StartTime) <= parseInt(timeblock2.StartTime) && parseInt(timeblock1.EndTime) > parseInt(timeblock2.StartTime))||((parseInt(timeblock2.StartTime) <= parseInt(timeblock1.StartTime) && parseInt(timeblock2.EndTime) > parseInt(timeblock1.StartTime)))){
                return true;
            }
            return false;
        };

        factory.doTermsOverlap = function(term1,term2){
            if((term1.TermStart <= term2.TermStart && term1.TermEnd > term2.TermStart)||((term2.TermStart <= term1.TermStart && term2.TermEnd > term1.TermStart))){
                return true;
            }
            return false;
        };

        factory.doMeetingDatesOverlap = function(meeting1,meeting2){
            // One-day meetings have the same start and end date, in which case they should overlap
            if(meeting1.StartDate !== null && meeting1.EndDate !== null && meeting2.StartDate !== null && meeting2.EndDate !== null){
              if((meeting1.StartDate <= meeting2.StartDate && meeting1.EndDate >= meeting2.StartDate)||((meeting2.StartDate <= meeting1.StartDate && meeting2.EndDate >= meeting1.StartDate))){
                  return true;
              }
            }
            return false;
        };

        factory.doMeetingsOverlap = function(section1meetings,section2meetings){
            //for each meeting in section1
            if(typeof section1meetings !== 'undefined' && typeof section2meetings !== 'undefined'){
                for (var i = section1meetings.length-1; i >= 0; i--) {
                    var s1meeting = section1meetings[i];
                    //for each meeting in section2
                    for (var m = section2meetings.length-1; m >= 0; m--) {
                        var s2meeting = section2meetings[m];
                        if(factory.doTimesOverlap({StartTime:s1meeting.StartTime,EndTime:s1meeting.EndTime},{StartTime:s2meeting.StartTime,EndTime:s2meeting.EndTime})){
                            if(factory.doDaysOverlap(s1meeting,s2meeting)){
                                if(factory.doMeetingDatesOverlap(s1meeting,s2meeting)){
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };

        factory.doSectionsOverlap = function(section1,section2){
            if(factory.doMeetingsOverlap(section1.Meetings,section2.Meetings)){
                return true;
            }
            return false;
        };

        factory.concurrentEnrollmentFilter = function(section,filters){
            if(section.SectionAttributes !== null){
                var attributes = section.SectionAttributes.split(";");
                if(node_generic_functions.inList("ETC", attributes) || node_generic_functions.inList("OCBB", attributes)){
                    return true;
                }
            }
            return false;
        };

        factory.removeAdministrativeSections = function(courses){
          for (var c = courses.length-1; c >= 0; c--) {
              if(typeof courses[c].Sections !== "undefined" && courses[c].Sections !== null){
                  for (var s = courses[c].Sections.length-1; s >= 0; s--) {
                      // Apply filters to section function
                      if(factory.requiredFilters(courses[c].Sections[s])){
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

        factory.requiredFilters = function(section){
          var filteredOut = false;
          filteredOut = factory.concurrentEnrollmentFilter(section);
          return filteredOut;
        };

        factory.applyFiltersToSection = function(section,filters){
            var filteredOut = false;
            filteredOut = factory.requiredFilters(section);
            if(typeof filters.Campuses !== "undefined" && filteredOut === false){
                filteredOut = factory.campusFilter(section,filters.Campuses);
            }
            // if(typeof filters.Professors !== "undefined" && filters.Professors != [] && filteredOut === false){
            //     filteredOut = factory.professorFilter(section,filters.Professors);
            // }
            if(typeof filters.TimeBlocks !== "undefined" && filters.TimeBlocks != [] && filteredOut === false){
                filteredOut = factory.timeBlockFilter(section,filters.TimeBlocks);
            }
            if(typeof filters.NotFull !== "undefined" && filters.NotFull !== false && filteredOut === false){
                filteredOut = factory.notFullFilter(section,filters.NotFull);
            }
            if((typeof filters.ShowOnline == "undefined" || filters.ShowOnline === false) && filteredOut === false){
                filteredOut = factory.hideOnlineFilter(section,filters.ShowOnline);
            }
            if((typeof filters.ShowInternational === "undefined" || filters.ShowInternational === false) && filteredOut === false){
                filteredOut = factory.hideInternationalFilter(section,filters.ShowInternational);
            }
            return filteredOut;
        };

        factory.professorFilter = function(section,filter){
            return false;
        };

        factory.hideOnlineFilter = function(section,filters){
            if(section.SectionAttributes !== null){
                var attributes = section.SectionAttributes.split(";");
                if(node_generic_functions.inList("ONLN", attributes)){
                    return true;
                }
            }
            return false;
        };

        factory.hideInternationalFilter = function(section,filters){
            if(section.SectionNumber.indexOf("OL") === 0 || section.SectionNumber.indexOf("OC") === 0){
                return true;
            }

            return false;
        };

        factory.campusFilter = function(section,filter){
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

        factory.timeBlockFilter = function(section,filter){
            try{
                for (var m in section.Meetings){
                    for (var i in filter) {
                        if(factory.doTimesOverlap(filter[i],section.Meetings[m])===true){
                            if(factory.doBlockDaysOverlap(section.Meetings[m],filter[i].Days.split(","))){
                                return true;
                            }
                        }
                    }
                }
            }
            catch (err){}
            return false;
        };

        factory.notFullFilter = function(section,filter){
            // 0 is NOT unlimited, 0 means manual registration
            // if(section.MaxEnrollment!=0){
                if(section.CurrentEnrollment>=section.MaxEnrollment){
                    return true;
                }
            // }
            return false;
        };

        factory.convertDate = function(dayOfWeek){
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
        };

        factory.splitMeetings = function(meeting){
            var meetups = [];
            var m_date;
            var st;
            var et;
            if(meeting.Monday == 1){
                m_date = factory.convertDate("M");
                st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
                et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
                meetups.push({StartTime: st,EndTime: et});
            }
            if(meeting.Tuesday == 1){
                m_date = factory.convertDate("T");
                st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
                et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
                meetups.push({StartTime: st,EndTime: et});
            }
            if(meeting.Wednesday == 1){
                m_date = factory.convertDate("W");
                st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
                et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
                meetups.push({StartTime: st,EndTime: et});
            }
            if(meeting.Thursday == 1){
                m_date = factory.convertDate("R");
                st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
                et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
                meetups.push({StartTime: st,EndTime: et});
            }
            if(meeting.Friday == 1){
                m_date = factory.convertDate("F");
                st = moment(m_date).format("YYYY-MM-DD") + moment(meeting.StartTime,"H:mm").format("THH:mm");
                et = moment(m_date).format("YYYY-MM-DD") + moment(meeting.EndTime,"H:mm").format("THH:mm");
                meetups.push({StartTime: st,EndTime: et});
            }
            return meetups;
        };

        factory.getCombinations = function(courses, user_selections, filters){
            var sectionCombinations = [];
            var courseslist = [];
            var outputCombinations = [];
            for (var i in courses) {
              var course = courses[i];
              var aSectionCombination = factory.getSectionCombinations(course.Sections, user_selections, filters);
              sectionCombinations.push(aSectionCombination);
              courseslist.push({DepartmentCode:course.DepartmentCode,CourseNumber:course.CourseNumber,CourseTitle:course.CourseTitle});
            }
            var scheduleCombinations = factory.getScheduleCombinations(sectionCombinations);
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
            //TODO-KL factory call
            // factory.gen_schedules = outputCombinations;
            return outputCombinations;
        };

        factory.getSectionCombinations = function(course_sections, user_selections, filters){
            var grouped_sections = factory.groupSections(course_sections, filters);
            // Use Identifiers to generate combinations
            var all_cp = [];
            // Sections should have uniform requirements per identifier
            var identifier_requirements = {};
            Object.keys(grouped_sections).forEach(function(campus) {
                identifier_requirements[campus] = [];
                Object.keys(grouped_sections[campus]).forEach(function(key) {
                    if(grouped_sections[campus][key].length > 0 && grouped_sections[campus][key][0].RequiredIdentifiers !== null){
                        identifier_requirements[campus].push(grouped_sections[campus][key][0].RequiredIdentifiers.split(";").concat(grouped_sections[campus][key][0].Identifier).sort());
                    }
                    else if(grouped_sections[campus][key].length > 0){
                        identifier_requirements[campus].push(grouped_sections[campus][key][0].Identifier === "" || grouped_sections[campus][key][0].Identifier === null ? ["empty"] : [grouped_sections[campus][key][0].Identifier]);
                    }
                });
            });
            Object.keys(identifier_requirements).forEach(function(campus) {
                var groupedIdentifierRequirements = [];
                for (var ra = identifier_requirements[campus].length-1; ra >= 0; ra--) {
                    if(!node_generic_functions.arrayContainsAnotherArray(identifier_requirements[campus][ra],groupedIdentifierRequirements)){
                        groupedIdentifierRequirements.push(identifier_requirements[campus][ra]);
                    }
                }
                IdentifierCombinations:
                for(var rq = groupedIdentifierRequirements.length-1; rq >= 0; rq--){
                    var cp_list = [];
                    for(var rqi = groupedIdentifierRequirements[rq].length-1; rqi >= 0; rqi--){
                        if(typeof grouped_sections[campus][groupedIdentifierRequirements[rq][rqi]] === "undefined"){
                            //TODO-KL angularjs
                            // factory.errors.generate_errors.push("Could not find course: " + course_sections[0].DepartmentCode + " " + course_sections[0].CourseNumber + " with identifier: " + groupedIdentifierRequirements[rq][rqi]);
                            continue IdentifierCombinations;
                        }
                        cp_list.push(grouped_sections[campus][groupedIdentifierRequirements[rq][rqi]]);
                    }
                    if(cp_list.length > 0 ){
                        cp = Combinatorics.cartesianProduct.apply(null,cp_list);
                        cp = cp.toArray();
                        all_cp = all_cp.concat(cp);
                    }
                }
            });

            // Checking the CRN requirements within each combination search classes selected for the requirements for this course
            //TODO-KL factory call
            var crnrequirements = node_generic_functions.searchListDictionaries(user_selections,{DepartmentCode:course_sections[0].DepartmentCode,CourseNumber:course_sections[0].CourseNumber,CourseTitle:course_sections[0].CourseTitle},false,true);
            // crnrequirements = crnrequirements.filter(functiom(){return CourseCRN !== null});
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
                var groupedRequirements = factory.groupSectionsByIdentifier(crnrequirements);
                //for each requirement add to keys like campus required identifiers + identifiers - see groupsections function and do that for reqiuirement identifiers
                // get all requirement data by searching list dictionaries of course_sections with crn requirement
                //splice if combination does not include the number of required identifiers with CRN
                for (var cp = all_cp.length-1; cp >= 0; cp--) {
                    var section_combination = all_cp[cp];
                    var groupedSectionCombination = factory.groupSectionsByIdentifier(section_combination);
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
                        if(factory.doSectionsOverlap(section1,section2)){
                            //If they do overlap, remove combination and break
                            all_cp.splice(i, 1);
                            //break out of section loop
                            break combinationloop;
                        }
                    }
                }
            }
            return all_cp;
        };

        factory.applyUserAdjustments = function(courses,adjustments){
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
            return courses;
        };

        factory.groupSectionsByIdentifier = function(course_sections){
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
        };

        factory.getScheduleCombinations = function(section_combinations){
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
                                if(factory.doSectionsOverlap(section1,section2)){
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
        };

        factory.groupSections = function(course_sections, filters){
            // Sections are to be grouped by Campus and by identifier
            var grouped_sections = {};
            for (var i in course_sections) {
              var course_section = course_sections[i];
              var identifier = course_section.Identifier;
              var campus = course_section.Campus;
              // Apply Filters To SECTION
              //TODO-KL factory call
              if(!factory.applyFiltersToSection(course_section, filters)){
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
        };



        factory.sortSections = function(a,b){
            return node_generic_functions.alphaNumericSort(a.SectionNumber,b.SectionNumber);
        };

        factory.sortMeetings = function(a, b) {
            if(moment(a.StartTime,"Hmm").isValid() && moment(b.StartTime,"Hmm").isValid()){
                return moment(a.StartTime,"Hmm") - moment(b.StartTime,"Hmm");
            }
            return 0;
        };

        return factory;
    });

    return service;
});
