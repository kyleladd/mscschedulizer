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
      $ctrl.$onInit = function () {
        if($ctrl.schedule === undefined && $ctrl.resolve !== undefined && $ctrl.resolve.schedule !== undefined){
          $ctrl.schedule = $ctrl.resolve.schedule;
        }
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