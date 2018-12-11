// app.factory('settings', ['$http', function($http) {
//     return $http.get('/api/public/settings/get')
// }]);
define(['angular', 'angular-ui-select'], function (angular,uiselect) {
    angular.module("semesterDirective", [])
    .component("semesterSelector",{
        // template: '<select ng-model="$ctrl.value" ng-change="$ctrl.changedValue($ctrl.value)"><option ng-repeat="option in $ctrl.options" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        // template: '<select ng-model="$ctrl.semester"><option ng-repeat="option in $ctrl.semesters" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        // template: '<input ng-model="$ctrl.semester" />',
        // template: 'inner: <input type="text" ng-model="$ctrl.semester">',
        // template: '<select ng-model="$ctrl.value" ng-change="{{$ctrl.change({value:$ctrl.value})}}"><option ng-repeat="option in $ctrl.options" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        template: '<select ng-model="$ctrl.value" ng-change="{{$ctrl.changedValue($ctrl.value)}}"><option ng-repeat="option in $ctrl.semesters" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        bindings: { 
            semester: '<',
            semesters: '<',
            change:'&'
        },
        // bindings: { connection: '=' },
        controllerAs: '$ctrl',
        controller: function($scope) {
            var $ctrl = this;
            $ctrl.value = "";
            $ctrl.$onInit = function () {
                console.log("semester directive controller");
                $ctrl.value = ($ctrl.semester ? $ctrl.semester: "");
                console.log("semester directive controller", $ctrl.value);
                console.log("semesters",$ctrl.semesters);
                // $ctrl.options = $ctrl.semesters;
            };
            $ctrl.changedValue = function(value){
                console.log("CHANGED value", value, $ctrl.value );
                $ctrl.change({value:$ctrl.value});
                // $ctrl.semester = value;
                // $scope.$apply();
            };
            // $ctrl.$onChanges = function(changesObj){
            //     console.log("changes",changesObj,changesObj.semesters.isFirstChange(),changesObj.semesters.currentValue);
            //      if (changesObj.semesters && !changesObj.semesters.isFirstChange()) {
            //         console.log("semesterschanges");
            //         $ctrl.semesters = changesObj.semesters.currentValue;
            //      }
            // }
        }
    }); 
});