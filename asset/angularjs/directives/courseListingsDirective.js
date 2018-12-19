define(['angular', 'angular-ui-select', 'ngSanitize','node_generic_functions','../services/userService'], function (angular,uiselect,ngsanitize,node_generic_functions,userService) {
    angular.module("courseListingsDirective", ['ngSanitize','userService'])
    .component("courseListingsComponent",{
        template: ' \
        This is the detailed course listings\
        ',
        bindings: { 
            filters: '<',
            courses: '<',
            courseSelections: '<',
            icons: '<',
            showCrnSelections: '<',
            showTotalCredits: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,schedulizerService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {};
            $ctrl.changedValue = function(value){
                $ctrl.change({value:value});
            };
            $ctrl.$onChanges = function(changesObj){

            };
            $ctrl.remove_course_selection = function(course){
                var index = node_generic_functions.searchListDictionaries($ctrl.coursesselected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,CourseTitle:course.CourseTitle,'CourseCRN':course.CourseCRN},true);
                if (index !== -1) {
                  $ctrl.coursesselected.splice(index,1);
                  $ctrl.changedValue($ctrl.coursesselected);
                }
            }
        }
    }); 
});