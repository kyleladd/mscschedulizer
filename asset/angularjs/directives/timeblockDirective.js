define(['angular','jquery','moment','node_generic_functions','jquery.timepicker','jquery.weekLine','datepair','jquery.datepair'], function (angular,$,moment,node_generic_functions) {
    angular.module("timeblockDirective", [])
    .component("timeBlockComponent",{
        template: '<div class="timeonly">\
                        <span class="weekCal"></span>\
                        <input type="text" class="time start ui-timepicker-input" autocomplete="off"> to \
                        <input type="text" class="time end ui-timepicker-input" autocomplete="off">\
                        <a ng-click="$ctrl.updateDayTimeBlockFilter($ctrl.timeblock)"> Apply </a> <a ng-click="$ctrl.removeTimeBlockFilter($ctrl.timeblock)"> Remove</a>\
                    </div>',
        bindings: { 
            timeblock: '<',
            change:'&',
            onRemove:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope, $element) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
            };
            $ctrl.$postLink = function () {
                console.log($element);
                $($element).find(".timeonly .time").timepicker({
                  'showDuration': true,
                  'timeFormat': 'g:ia',
                  "minTime":"12:00am",
                  "maxTime":"11:30pm"
                });
                var timeOnlyDatepair = new Datepair($($element).find(".timeonly").get(0));
                $($element).find(".weekCal").weekLine({theme:"jquery-ui",dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"]});
                $($element).find(".timeonly .start.time").timepicker('setTime',  moment($ctrl.timeblock.StartTime,"Hmm").format('h:mma'));
                $($element).find(".timeonly .end.time").timepicker('setTime',  moment($ctrl.timeblock.EndTime,"Hmm").format('h:mma'));
                $($element).find(".weekCal").weekLine("setSelected", $ctrl.timeblock.Days);
            };
            $ctrl.changedValue = function(value){
                console.log("timeblock changed",value);
                $ctrl.change({value:value});
            };
            $ctrl.updateDayTimeBlockFilter = function(value){
                var timeOnlyDatepair = new Datepair($($element).find(".timeonly").get(0));
                $ctrl.timeblock.StartTime = node_generic_functions.padStr(node_generic_functions.convertToInttime(timeOnlyDatepair.startTimeInput.value).toString(),3);
                $ctrl.timeblock.EndTime = node_generic_functions.padStr(node_generic_functions.convertToInttime(timeOnlyDatepair.endTimeInput.value).toString(),3);
                $ctrl.timeblock.Days = $($element).find(".weekCal").weekLine('getSelected');
                $ctrl.changedValue($ctrl.timeblock);
            }
            $ctrl.removeTimeBlockFilter = function(timeblock){
                console.log("timeblock remove",timeblock);
                $ctrl.onRemove({value:timeblock});
            }
        }
    }); 
});