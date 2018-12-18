define(['angular', 'angular-ui-select', 'ngSanitize','../services/schedulizerService'], function (angular,uiselect,ngsanitize,schedulizerService) {
    angular.module("semesterDirective", ['ui.select','ngSanitize','schedulizerService'])
    .component("semesterSelector",{
        template: ' <ui-select ng-model="$ctrl.semester" id="ptype" theme="bootstrap" title="Select a Semester" ng-change="$ctrl.changedValue($ctrl.semester)">\
                        <ui-select-match placeholder="Select a Semester">{{$select.selected.Description}}</ui-select-match>\
                        <ui-select-choices repeat="semester.TermCode as semester in $ctrl.semesters | filter: $select.search">\
                            <div ng-bind-html="semester.Description | highlight: $select.search"></div>\
                        </ui-select-choices>\
                    </ui-select>',
        bindings: { 
            semester: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,schedulizerService) {
            var $ctrl = this;
            $ctrl.semester = "";
            $ctrl.$onInit = function () {
                schedulizerService.get_semesters()
                .then((semesters)=>{
                    $ctrl.semesters = semesters;
                    $ctrl.semester = ($ctrl.semester ? $ctrl.semester: "");

                    if($ctrl.semesters.length > 0 && $ctrl.semesters.filter(function(s){
                        return $ctrl.semester === s.TermCode;
                    }).length === 0){
                        //TODO-KL Default to the one 6 months from now based on start and finish
                        $ctrl.semester = $ctrl.semesters[0].TermCode;
                    }
                    $ctrl.changedValue($ctrl.semester);
                });
                // .catch(function(){});
            };
            $ctrl.changedValue = function(value){
                $ctrl.change({value:value});
            };
        }
    }); 
});