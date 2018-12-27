define(['angular', 'angular-ui-select', 'ngSanitize','moment','node_generic_functions','../services/schedulizerHelperService','../services/userService','ui.bootstrap','basictable','../components/modalComponent'], function (angular,uiselect,ngsanitize,moment,node_generic_functions,schedulizerHelperService,userService) {
    angular.module("scheduleDirective", ['ngSanitize','userService','schedulizerHelperService','ui.bootstrap','uibootstrapmodalcomponent'])
    .component("scheduleComponent",{
        templateUrl:'/asset/angularjs/directives/schedule.html',
        bindings: { 
            schedule: '<'
        },
        controllerAs: '$ctrl',
        controller: function($scope,$uibModal,$element,$timeout,userService,schedulizerHelperService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.schedule = schedulizerHelperService.calcScheduleDetails($ctrl.schedule, userService.colors);
            };
            $ctrl.$postLink = function () {
                // angular.element($element).ready(function () {
                $timeout(function() {
                    console.log("schedule directive",$element);
                });
            };
        }
    }); 
});