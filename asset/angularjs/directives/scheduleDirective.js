define(['angular', 'angular-ui-select', 'ngSanitize','moment','node_generic_functions','../services/schedulizerHelperService','../services/userService','ui.bootstrap','basictable','../components/modalComponent','ui.calendar'], function (angular,uiselect,ngsanitize,moment,node_generic_functions,schedulizerHelperService,userService) {
    angular.module("scheduleDirective", ['ngSanitize','userService','schedulizerHelperService','ui.bootstrap','uibootstrapmodalcomponent','ui.calendar'])
    .component("scheduleComponent",{
        templateUrl:'/asset/angularjs/directives/schedule.html',
        bindings: { 
            schedule: '<'
        },
        controllerAs: '$ctrl',
        controller: function($scope,$uibModal,$element,$timeout,userService,schedulizerHelperService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.schedule = schedulizerHelperService.calcScheduleDetails($ctrl.schedule, userService.colors);
                $ctrl.events = [];
            };
            $ctrl.$postLink = function () {
                // angular.element($element).ready(function () {
                $timeout(function() {
                    console.log("schedule directive",$element, $ctrl.schedule);
                    $ctrl.options = node_generic_functions.merge_options(
                    {
                        editable: false,
                        handleWindowResize: true,
                        slotEventOverlap:false,
                        weekends: false, // Hide weekends
                        defaultView: 'agendaWeek', // Only show week view
                        header: false, // Hide buttons/titles
                        minTime: moment($ctrl.schedule.earlyStartTime,"Hmm").format("HH:mm"), // Start time for the calendar
                        maxTime: moment($ctrl.schedule.lateEndTime,"Hmm").format("HH:mm"), // End time for the calendar
                        columnFormat: {
                            week: 'ddd' // Only show day of the week names
                        },
                        displayEventTime: true,
                        height:'auto',
                        // allDayText: 'TBD',
                        allDaySlot: false,
                        events: $ctrl.schedule.events,
                        eventRender: function (event, element) {
                            // element.attr("data-event-id",event._id); //for converting fullcal js object to html element
                        },
                        eventMouseover: function( event, jsEvent, view ) {
                          // var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
                          //   return el.section.CourseCRN === event.section.CourseCRN;
                          // });
                          // for(var i in matching_section_events){
                          //   $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").addClass("event-hover");
                          // }
                        },
                        eventMouseout: function( event, jsEvent, view ) {
                          // var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
                          //   return el.section.CourseCRN === event.section.CourseCRN;
                          // });
                          // for(var i in matching_section_events){
                          //   $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").removeClass("event-hover");
                          // }
                        }
                    },{});//options
                    // $('#schedule_' + num).fullCalendar(final_options);
                });
            };
        }
    }); 
});