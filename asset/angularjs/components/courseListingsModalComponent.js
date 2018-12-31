define(['angular','../directives/courseListingsDirective'], function (angular) {
  angular.module('uibootstrapcourselistingsmodalcomponent',['courseListingsDirective']).component('courseListingsModalComponent', {
    template: '<div class="modal-header">\
                  <h3 class="modal-title" ng-bind-html="$ctrl.resolve.title"></h3>\
              </div>\
              <div class="modal-body"><course-listings-component courses=\"$ctrl.schedule\" icons=\"false\" show-crn-selections=\"false\" show-total-credits=\"true\"></course-listings-component>\
              </div>\
              <div class="modal-footer">\
                  <button class="btn btn-primary" type="button" ng-click="$ctrl.close()">Close</button>\
                  <!--<button class="btn btn-warning" type="button" ng-click="$ctrl.cancel()">Cancel</button>-->\
              </div>',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&',
      schedule: '<'
    },
    controller: function () {
      var $ctrl = this;
      console.log("course listings modal component");
      $ctrl.$onInit = function () {
        console.log("ctrl.schedule",$ctrl.schedule, $ctrl, $ctrl.resolve.schedule);
        if($ctrl.schedule === undefined && $ctrl.resolve !== undefined && $ctrl.resolve.schedule !== undefined){
          $ctrl.schedule = $ctrl.resolve.schedule;
        }
        console.log("ctrl.schedule overriden",$ctrl.schedule);
      };

      $ctrl.close = function () {
        $ctrl.close({$value: 'close'});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
  });
});