define(['angular'], function (angular) {
  angular.module('uibootstrapmodalcomponent',[]).component('modalComponent', {
    template: '<div class="modal-header">\
                  <h3 class="modal-title" ng-bind-html="$ctrl.resolve.title"></h3>\
              </div>\
              <div class="modal-body" ng-bind-html="$ctrl.resolve.body">\
              </div>\
              <div class="modal-footer">\
                  <button class="btn btn-primary" type="button" ng-click="$ctrl.close()">Close</button>\
                  <!--<button class="btn btn-warning" type="button" ng-click="$ctrl.cancel()">Cancel</button>-->\
              </div>',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
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