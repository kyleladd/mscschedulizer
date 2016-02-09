var mscSchedulizer = mscSchedulizer === undefined ? {} : mscSchedulizer;
$.extend(mscSchedulizer, {
    api_host:"http://schedulizer-api.morrisville.edu",
    course_selections_element:"#course_selections",
    departments_element:"#departments",
    department_class_list_element:"#dept_class_list",
    schedules:"#schedules",
    filters_element:"#filters",
    colors: ["#22B548","#2293B5","#3222B5","#B58122","#B52222","#B522B0","#686967","#433050","#B3B522"],
    numToLoad:10,
    generateLocation:'Local'//["Local","Remote"]
});
