// Course Selections
 // Remove Course Selections
$("#"+mscSchedulizer_config.html_elements.course_selections_list).on("click", "a.a_selection", function (event) {
    event.preventDefault();
    // //Remove Course
    var course = JSON.parse(unescape(this.getAttribute('data-value')));
    var index = node_generic_functions.searchListDictionaries(mscSchedulizer.classes_selected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,CourseTitle:course.CourseTitle,'CourseCRN':course.CourseCRN},true);
    if (index !== -1) {
        mscSchedulizer.classes_selected.splice(index,1);
        localStorage.setItem('classes_selected', JSON.stringify(mscSchedulizer.classes_selected));
        //reload selections area
        mscSchedulizer.loadSelections();
        if(node_generic_functions.inList(location.pathname.substr(location.pathname.lastIndexOf("/")+1), ["course-listings.html"])){
            mscSchedulizer.refreshDepartmentCoursesDetails(course);
        }
    }
});