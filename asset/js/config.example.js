var mscSchedulizer = mscSchedulizer === undefined ? {} : mscSchedulizer;
$.extend(mscSchedulizer, {
    api_host:"http://schedulizer-api.kyleladd.us/v1",
    course_selections:"#course_selections",
    departments:"#departments",
    department_class_list:"#dept_class_list",
    schedules:"#schedules",
    colors: ["#22B548","#2293B5","#3222B5","#B58122","#B52222","#B522B0","#686967","#433050","#B3B522"],
    numToLoad:10,
    generateLocation:'Local'//["Local","Remote"]
});
