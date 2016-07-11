var Generate = function(api_obj){
  // var obj = Object.create(Generate.prototype);
  try{
    // return obj;
    // obj.DepartmentCode = api_obj.DepartmentCode;
    // obj.Name = api_obj.Name;
    // obj.Semester = api_obj.Semester;
    // obj.SemesterObject = null;
    // if(api_obj.SemesterObject !== null){
    //   obj.SemesterObject = new Semester(api_obj.SemesterObject);
    // }
  }
  catch(err){
      return null;
  }
  return this;
};
Generate.getCombinations = function(courses,callback){
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
    callback(outputCombinations);
};
Generate.getSectionCombinations = function(course_sections){
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
    // Checking the CRN requirements within each combination
    var crnrequirements = node_generic_functions.searchListDictionaries(mscSchedulizer.classes_selected,{DepartmentCode:course_sections[0].DepartmentCode,CourseNumber:course_sections[0].CourseNumber,CourseTitle:course_sections[0].CourseTitle},false,true);
    if(crnrequirements.length > 0){
        for (var cp = all_cp.length-1; cp >= 0; cp--) {
            var section_combination = all_cp[cp];
            // If combination does not have all of the requirements
            for (var c = crnrequirements.length-1; c >= 0; c--) {
                // If CRN is not null, it is a crn requirement
                if(crnrequirements[c].CourseCRN !== null){
                    if(node_generic_functions.searchListDictionaries(section_combination,crnrequirements[c],false,true).length===0){
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
            for (var t = s-1; t >= 0; t--) {
                var section2 = combination[t];
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
};
Generate.getScheduleCombinations = function(section_combinations){
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
};
Generate.doBlockDaysOverlap = function(meeting1,days){
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
Generate.doDaysOverlap = function(meeting1,meeting2){
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
Generate.doTimesOverlap = function(timeblock1,timeblock2){
    if((parseInt(timeblock1.StartTime) <= parseInt(timeblock2.StartTime) && parseInt(timeblock1.EndTime) > parseInt(timeblock2.StartTime))||((parseInt(timeblock2.StartTime) <= parseInt(timeblock1.StartTime) && parseInt(timeblock2.EndTime) > parseInt(timeblock1.StartTime)))){
        return true;
    }
    return false;
};
Generate.doTermsOverlap = function(term1,term2){
    if((term1.TermStart <= term2.TermStart && term1.TermEnd > term2.TermStart)||((term2.TermStart <= term1.TermStart && term2.TermEnd > term1.TermStart))){
        return true;
    }
    return false;
};
Generate.doMeetingDatesOverlap = function(meeting1,meeting2){
    // One-day meetings have the same start and end date, in which case they should overlap
    if(meeting1.StartDate !== null && meeting1.EndDate !== null && meeting2.StartDate !== null && meeting2.EndDate !== null){
      if((meeting1.StartDate <= meeting2.StartDate && meeting1.EndDate >= meeting2.StartDate)||((meeting2.StartDate <= meeting1.StartDate && meeting2.EndDate >= meeting1.StartDate))){
          return true;
      }
    }
    return false;
};
Generate.doMeetingsOverlap = function(section1meetings,section2meetings){
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
};
Generate.doSectionsOverlap = function(section1,section2){
    if(mscSchedulizer.doMeetingsOverlap(section1.Meetings,section2.Meetings)){
        return true;
    }
    return false;
};
