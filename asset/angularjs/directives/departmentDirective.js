// app.factory('settings', ['$http', function($http) {
//     return $http.get('/api/public/settings/get')
// }]);
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
            // $ctrl.department = "";
            $ctrl.departments = [];
            // setInterval(function(){
            //   console.log("SIsemester in department directive",$ctrl.semester);
            //   console.log("$ctrl.attrs",$ctrl.attrs);
            // }, 2000);
            $ctrl.$onInit = function () {
                console.log("department directive controller");
                // $ctrl.get_departments();
                // if($ctrl.semester && $ctrl.department !== undefined){
                //     console.log("initting",$ctrl.semester,$ctrl.department);
                //     $ctrl.get_departments();
                // }
            };
            $ctrl.changedValue = function(value){
                // debugger;
                console.log("CHANGED value", value, $ctrl.department);
                $ctrl.change({value:value});
            };
            $ctrl.$onChanges = function(changesObj){
                // console.log("department onchanges semester ",changesObj,changesObj.semester.isFirstChange(),changesObj.semester.currentValue,changesObj.semester);
                // console.log("department onchanges department",changesObj,changesObj.department.isFirstChange(),changesObj.department.currentValue,changesObj.directive);
                // debugger;
                // if(changesObj.semester && changesObj.department && changesObj.semester.currentValue && !changesObj.semester.isFirstChange() ){
                    // debugger;
                if(changesObj.semester && changesObj.semester.currentValue && $ctrl.department !== undefined){
                    $ctrl.get_departments();
                }
            };
            $ctrl.get_departments = function(){
                console.log("directive getting departments");
                if(!$ctrl.semester){
                    return;
                }
                console.log("directive getting departments", $ctrl.semester, $ctrl.department);
                schedulizerService.get_departments($ctrl.semester)
                .then((departments)=>{
                    // debugger;
                    console.log("departments",departments);
                    $ctrl.departments = departments;
                    console.log("$ctrl.department",$ctrl.department);
                    $ctrl.department = ($ctrl.department ? $ctrl.department: "");
                    // debugger;
                    console.log("department directive controller", $ctrl.department);
                    console.log("departments",$ctrl.departments);

                    if($ctrl.departments.length > 0 && $ctrl.departments.filter(function(s){
                        return $ctrl.department === s.DepartmentCode;
                    }).length === 0){
                        console.log("defaulting to first department");
                        $ctrl.department = $ctrl.departments[0].DepartmentCode;
                        // $ctrl.changedValue($ctrl.department);
                    }
                    $ctrl.changedValue($ctrl.department);
                });
                // .catch((err,data)=>{
                //     debugger;
                //     $ctrl.departments=[];
                // });
            }
        }
    }); 
});