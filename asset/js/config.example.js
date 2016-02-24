module.exports = {
    api_host:"http://schedulizer-api.morrisville.edu",
    html_elements:{
        // All elements are By ID
        course_selections_list:"course_selections",
        departments_select:"departments",
        semesters_select:"semesters",
        department_class_list:"dept_class_list",
        schedules_container:"schedules",
        filters_container:"filters",
        filters:{
            not_full:"notFullFilter",
            morrisville_campus:"morrisville_campus_filter",
            norwich_campus:"norwich_campus_filter"
        }
    },
    colors: ["#22B548","#2293B5","#3222B5","#B58122","#B52222","#B522B0","#686967","#433050","#B3B522"],
    numToLoad:10,
    generateLocation:'Local'//["Local","Remote"] //Deprecating remote
}