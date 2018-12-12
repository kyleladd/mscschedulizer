// app.factory('settings', ['$http', function($http) {
//     return $http.get('/api/public/settings/get')
// }]);
define(['angular', 'angular-ui-select', 'ngSanitize'], function (angular,uiselect) {
    angular.module("semesterDirective", ['ui.select','ngSanitize'])
    .component("semesterSelector",{
        // template: '<select ng-model="$ctrl.value" ng-change="$ctrl.changedValue($ctrl.value)"><option ng-repeat="option in $ctrl.options" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        // template: '<select ng-model="$ctrl.semester"><option ng-repeat="option in $ctrl.semesters" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        // template: '<input ng-model="$ctrl.semester" />',
        // template: 'inner: <input type="text" ng-model="$ctrl.semester">',
        // template: '<select ng-model="$ctrl.value" ng-change="{{$ctrl.change({value:$ctrl.value})}}"><option ng-repeat="option in $ctrl.options" value="{{option.TermCode}}">{{option.Description}}</option></select>',
        template: '<select ng-model="$ctrl.value" ng-change="{{$ctrl.changedValue($ctrl.value)}}">\
                    <option ng-repeat="option in $ctrl.semesters" value="{{option.TermCode}}">{{option.Description}}</option>\
                   </select>\
                    <ui-select ng-model="$ctrl.value" id="ptype" theme="bootstrap" title="Select a Semester" ng-change="{{$ctrl.changedValue($ctrl.value)}}">\
                        <ui-select-match placeholder="Select a Semester">{{$select.selected.Description}}</ui-select-match>\
                        <ui-select-choices repeat="semester.TermCode as semester in $ctrl.semesters | filter: $select.search">\
                            <div ng-bind-html="semester.Description | highlight: $select.search"></div>\
                        </ui-select-choices>\
                    </ui-select>',
        bindings: { 
            semester: '<',
            semesters: '<',
            change:'&'
        },
      //   <ui-select ng-model="$ctrl.value"\
      //            theme="bootstrap"\
      //            ng-disabled="$ctrl.disabled"\
      //            reset-search-input="false"\
      //            title="Choose an address" ng-change="{{$ctrl.changedValue($ctrl.value)}}">\
      //   <ui-select-match placeholder="Select a Semester...">{{$select.selected.TermCode}}</ui-select-match>\
      //   <ui-select-choices repeat="a_semester in $ctrl.semesters track by a_semester.TermCode">\
      //     <div ng-bind-html="a_semester.TermCode | highlight: $select.search"></div>\
      //   </ui-select-choices>\
      // </ui-select>
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

                if($ctrl.semesters.length > 0 && $ctrl.semesters.filter(function(s){
                    return $ctrl.value === s.TermCode;
                }).length === 0){
                    console.log("defaulting to first semester");
                    $ctrl.value = $ctrl.semesters[0].TermCode;
                }
                // $ctrl.options = $ctrl.semesters;
            };
            $ctrl.changedValue = function(value){
                // if(value){
                //     $ctrl.value = value.TermCode;
                // }
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