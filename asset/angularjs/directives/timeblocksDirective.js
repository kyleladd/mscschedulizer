define(['angular','./tooltipDirective','./timeblockDirective'], function (angular) {
    angular.module("timeblocksDirective", ["tooltipDirective","timeblockDirective"])
    .component("timeBlocksComponent",{
        template: '<span title="By adding time blocks filters, you can block out times that you do not want to have classes." tooltip>Time block filters: <a ng-click="$ctrl.addTimeBlockFilter()">Add</a></span>\
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
            $ctrl.$onInit = function () {
            };
            $ctrl.changedValue = function(value){
                console.log("timeblocks changed value",value);
                $ctrl.change({value:value});
                console.log("change should have been called",$ctrl.change({value:value}));
            };
            $ctrl.addTimeBlockFilter = function(){
                console.log("timeblocks add");
                $ctrl.timeblocks.push({StartTime:"0000",EndTime:"2330",Days:""});
            };
            $ctrl.onUpdate = function(timeblock, index){
                console.log("timeblocks on update",timeblock, index);
                $ctrl.timeblocks[index] = timeblock;
                $ctrl.changedValue($ctrl.timeblocks);
            };
            $ctrl.onRemove = function(timeblock, index){
                console.log("timeblocks on remove",timeblock,index);
                $ctrl.timeblocks.splice(index,1);
                $ctrl.changedValue($ctrl.timeblocks);
            }
        }
    }); 
});