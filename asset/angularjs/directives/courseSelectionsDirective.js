define(['angular', 'angular-ui-select', 'ngSanitize','../services/userService'], function (angular,uiselect,ngsanitize,userService) {
    angular.module("courseSelectionsDirective", ['ngSanitize','userService'])
    .component("courseSelections",{
        template: ' \
        <div class="tagcloud" id="course_selections">\
        	<a ng-repeat="course_selection in $ctrl.coursesselected" class=\"a_selection\">{{course_selection.DepartmentCode}} {{course_selection.CourseNumber}} ((course.CourseCRN!==null) ? " - " + course.CourseCRN : "") + " <i class=\"fa fa-times\"></i></a>\
        </div>\
        ',
        bindings: { 
            coursesselected: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,schedulizerService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                console.log("course selections directive controller");
            };
            $ctrl.changedValue = function(value){
                console.log("CHANGED value", value, $ctrl.coursesselected);
                $ctrl.change({value:value});
            };
            $ctrl.$onChanges = function(changesObj){

            };
        }
    }); 
});