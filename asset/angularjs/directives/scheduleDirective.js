define(['angular', 'angular-ui-select', 'ngSanitize','moment','node_generic_functions','../services/schedulizerHelperService','ui.bootstrap','basictable','../components/modalComponent'], function (angular,uiselect,ngsanitize,moment,node_generic_functions,schedulizerHelperService) {
    angular.module("scheduleDirective", ['ngSanitize','schedulizerHelperService','ui.bootstrap','uibootstrapmodalcomponent'])
    .component("scheduleComponent",{
        templateUrl:'/asset/angularjs/directives/schedule.html',
        bindings: { 
            schedule: '<'
        },
        controllerAs: '$ctrl',
        controller: function($scope,$uibModal,$element,$timeout,schedulizerHelperService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {

            };
        }
    }); 
});