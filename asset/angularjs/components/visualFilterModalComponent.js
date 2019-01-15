define(['angular'], function (angular) {
  angular.module('visualFilterModal',[]).component('visualFilterModalComponent', {
    templateUrl:'/templates/visual-filter-modal.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&',
      adjustments: '<'
    },
    transclude:true,
    replace:true,
    controller: function () {
      var $ctrl = this;
      $ctrl.close = function () {
        $ctrl.close({$value: 'close'});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
  });
});