// app.factory('settings', ['$http', function($http) {
//     return $http.get('/api/public/settings/get')
// }]);
define(['angular', 'angular-ui-select', 'ngSanitize','../services/schedulizerService'], function (angular,uiselect,ngsanitize,schedulizerService) {
    angular.module("semesterDirective", ['ui.select','ngSanitize','schedulizerService'])
    .component("semesterSelector",{
        template: '<select ng-model="$ctrl.semester" ng-change="{{$ctrl.changedValue($ctrl.semester)}}">\
                    <option ng-repeat="option in $ctrl.semesters" value="{{option.TermCode}}">{{option.Description}}</option>\
                   </select>\
                    <ui-select ng-model="$ctrl.semester" id="ptype" theme="bootstrap" title="Select a Semester" ng-change="{{$ctrl.changedValue($ctrl.value)}}">\
                        <ui-select-match placeholder="Select a Semester">{{$select.selected.Description}}</ui-select-match>\
                        <ui-select-choices repeat="semester.TermCode as semester in $ctrl.semesters | filter: $select.search">\
                            <div ng-bind-html="semester.Description | highlight: $select.search"></div>\
                        </ui-select-choices>\
                    </ui-select>',
        bindings: { 
            semester: '<',
            // semesters: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,schedulizerService) {
            var $ctrl = this;
            $ctrl.semester = "";
            $ctrl.$onInit = function () {
                console.log("semester directive controller");
                schedulizerService.getSemesters()
                .then((semesters)=>{
                    console.log("semesters",semesters);
                    $ctrl.semesters = semesters;
                    // $ctrl.semester = userService.get_semester();
                    console.log("$ctrl.semester",$ctrl.semester);
                    $ctrl.semester = ($ctrl.semester ? $ctrl.semester: "");
                    console.log("semester directive controller", $ctrl.semester);
                    console.log("semesters",$ctrl.semesters);

                    if($ctrl.semesters.length > 0 && $ctrl.semesters.filter(function(s){
                        return $ctrl.semester === s.TermCode;
                    }).length === 0){
                        console.log("defaulting to first semester");
                        $ctrl.semester = $ctrl.semesters[0].TermCode;
                    }
                    // setInterval(function(){
                    //   console.log("SIsemester",$ctrl.semester);
                    // }, 2000);
                    // $ctrl.semester="201901";
                });
                // $ctrl.semester = ($ctrl.semester ? $ctrl.semester: "");
                // console.log("semester directive controller", $ctrl.semester);
                // console.log("semesters",$ctrl.semesters);

                // if($ctrl.semesters.length > 0 && $ctrl.semesters.filter(function(s){
                //     return $ctrl.semester === s.TermCode;
                // }).length === 0){
                //     console.log("defaulting to first semester");
                //     $ctrl.semester = $ctrl.semesters[0].TermCode;
                // }
                // $ctrl.options = $ctrl.semesters;
            };
            $ctrl.changedValue = function(value){
                // if(value){
                //     $ctrl.semester = value.TermCode;
                // }
                console.log("CHANGED value", value, $ctrl.semester );
                $ctrl.change({value:$ctrl.semester});
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