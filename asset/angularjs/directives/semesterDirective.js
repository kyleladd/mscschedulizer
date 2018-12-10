// app.factory('settings', ['$http', function($http) {
//     return $http.get('/api/public/settings/get')
// }]);
define(['angular', 'angular-ui-select'], function (angular,uiselect) {
    angular.module("semesterDirective", [])
    .component("semesterSelector",{
        // template: '<select ng-model="$ctrl.value" ng-change="$ctrl.changedValue($ctrl.value)"><option ng-repeat="option in $ctrl.options" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        template: '<select ng-model="$ctrl.value" ng-change="$ctrl.changedValue($ctrl.value)"><option ng-repeat="option in $ctrl.semesters" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        bindings: { 
            semester: '=',
            semesters: '<',
        },
        controller: function() {
            this.value = "";
            this.$onInit = function () {
                console.log("semester directive controller");
                this.value = (this.semester ? this.semester.TermCode: "");
                // this.options = this.semesters;
            };
            this.changedValue = function(value){
                console.log("CHANGED value", value );
                this.semester = {TermCode:value};
            };
            this.$onChanges = function(changesObj){
                console.log("changes",changesObj);
            }
        }
    }); 
});