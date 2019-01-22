define(['angular'], function (angular) {
  angular.module('visualFilterModal',[]).component('visualFilterModalComponent', {
    // templateUrl:'/templates/visual-filter-modal.html',
    template: '<div class="modal-header">\
                  <h3 class="modal-title" ng-bind-html="$ctrl.resolve.title"></h3>\
              </div>\
              <div class="modal-body"><course-listings-component courses=\"[$ctrl.course]\" icons=\"false\" show-crn-selections=\"false\" show-total-credits=\"true\" show-terms=\"true\"></course-listings-component>\
              </div>\
              <div class="modal-footer">\
                  <button class="btn btn-danger" type="button" ng-click="$ctrl.addRemoveAdjustment()">Remove</button>\
                  <button class="btn btn-primary" type="button" ng-click="$ctrl.close()">Close</button>\
              </div>',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&',
      course: '<',
      addRemoveAdjustment: '&'
    },
    transclude:true,
    replace:true,
    controller: function () {
      var $ctrl = this;
      $ctrl.close = function () {
        $ctrl.close({$value: 'close'});
      };

      // $ctrl.cancel = function () {
      //   $ctrl.dismiss({$value: 'cancel'});
      // };
    }
  });
});