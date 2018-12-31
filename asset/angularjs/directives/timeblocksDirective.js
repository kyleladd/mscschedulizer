define(['angular','ui.bootstrap','./timeblockDirective'], function (angular) {
    angular.module("timeblocksDirective", ["timeblockDirective","ui.bootstrap"])
    .component("timeBlocksComponent",{
        template: '<span uib-tooltip="By adding time blocks filters, you can block out times that you do not want to have classes.">Time block filters: <a ng-click="$ctrl.addTimeBlockFilter()">Add</a></span>\
        <div ng-repeat="timeblock in $ctrl.timeblocks">\
            <time-block-component timeblock="timeblock" change="$ctrl.onUpdate(value, $index)" on-remove="$ctrl.onRemove(value, $index)"></time-block-component>\
        </div>',
        bindings: { 
            timeblocks: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope) {
            var $ctrl = this;
            $ctrl.changedValue = function(value){
                $ctrl.change({value:value});
            };
            $ctrl.addTimeBlockFilter = function(){
                $ctrl.timeblocks.push({StartTime:"0000",EndTime:"2330",Days:""});
            };
            $ctrl.onUpdate = function(timeblock, index){
                $ctrl.timeblocks[index] = timeblock;
                $ctrl.changedValue($ctrl.timeblocks);
            };
            $ctrl.onRemove = function(timeblock, index){
                $ctrl.timeblocks.splice(index,1);
                $ctrl.changedValue($ctrl.timeblocks);
            }
        }
    }); 
});