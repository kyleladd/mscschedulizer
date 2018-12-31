define(['angular', 'angular-ui-select', 'ngSanitize','node_generic_functions','../services/userService'], function (angular,uiselect,ngsanitize,node_generic_functions,userService) {
    angular.module("courseSelectionsDirective", ['ngSanitize','userService'])
    .component("courseSelections",{
        template: ' \
        <div class="tagcloud" id="course_selections">\
        	<a ng-repeat="course_selection in $ctrl.coursesselected" class="a_selection" ng-click="$ctrl.remove_course_selection(course_selection)">{{course_selection.DepartmentCode}} {{course_selection.CourseNumber}} {{course_selection.CourseCRN ? " - " + course_selection.CourseCRN : ""}} <i class="fa fa-times"></i></a>\
        </div>\
        ',
        bindings: { 
            coursesselected: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,schedulizerService) {
            var $ctrl = this;
            $ctrl.changedValue = function(value){
                $ctrl.change({value:value});
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