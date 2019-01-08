define(['angular', 'angular-ui-select', 'ngSanitize','../services/schedulizerService'], function (angular,uiselect,ngsanitize,schedulizerService) {
    angular.module("departmentDirective", ['ui.select','ngSanitize','schedulizerService'])
    .component("departmentSelector",{
        template: ' <ui-select ng-model="$ctrl.department" theme="bootstrap" title="Select a department" ng-change="$ctrl.changedValue($ctrl.department)">\
                        <ui-select-match placeholder="Select a department">{{$select.selected.Name}}</ui-select-match>\
                        <ui-select-choices repeat="department.DepartmentCode as department in $ctrl.departments | filter: $select.search">\
                            <div ng-bind-html="department.Name | highlight: $select.search"></div>\
                        </ui-select-choices>\
                    </ui-select>',
        bindings: { 
            department: '<',
            semester: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,schedulizerService) {
            var $ctrl = this;
            $ctrl.departments = [];
            $ctrl.changedValue = function(value){
                $ctrl.change({value:value});
            };
            $ctrl.$onChanges = function(changesObj){
                if(changesObj.semester && changesObj.semester.currentValue && $ctrl.department !== undefined){
                    $ctrl.get_departments();
                }
            };
            $ctrl.get_departments = function(){
                if(!$ctrl.semester){
                    return;
                }
                schedulizerService.get_departments($ctrl.semester)
                .then((departments)=>{
                    $ctrl.departments = departments;
                    $ctrl.department = ($ctrl.department ? $ctrl.department: "");

                    if($ctrl.departments.length > 0 && $ctrl.departments.filter(function(s){
                        return $ctrl.department === s.DepartmentCode;
                    }).length === 0){
                        $ctrl.department = $ctrl.departments[0].DepartmentCode;
                    }
                    $ctrl.changedValue($ctrl.department);
                });
                // .catch((err,data)=>{
                //     $ctrl.departments=[];
                // });
            }
        }
    }); 
});