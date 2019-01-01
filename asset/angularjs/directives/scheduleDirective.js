define(['angular', 'angular-ui-select', 'ngSanitize','moment','node_generic_functions','../services/schedulizerHelperService','../services/userService','ui.bootstrap','basictable','../components/courseListingsModalComponent','ui.calendar', '../directives/courseListingsDirective'], function (angular,uiselect,ngsanitize,moment,node_generic_functions,schedulizerHelperService,userService) {
    angular.module("scheduleDirective", ['ngSanitize','userService','schedulizerHelperService','ui.bootstrap','uibootstrapcourselistingsmodalcomponent','ui.calendar','courseListingsDirective'])
    .component("scheduleComponent",{
        templateUrl:'/asset/angularjs/directives/schedule.html',
        bindings: { 
            schedule: '<',
            options: '<',
            scheduleOptions: '<'
        },
        controllerAs: '$ctrl',
        controller: function($scope,$uibModal,$element,$timeout,userService,schedulizerHelperService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.schedule = schedulizerHelperService.calcScheduleDetails($ctrl.schedule, userService.colors);
                $ctrl.events = [];
            };
            $ctrl.$postLink = function () {
                $timeout(function() {
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
                            element.attr("data-event-id",event._id); //for converting fullcal js object to html element
                        },
                        eventMouseover: function( event, jsEvent, view ) {
                          var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
                            return el.section.CourseCRN === event.section.CourseCRN;
                          });
                          for(var i in matching_section_events){
                            $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").addClass("event-hover");
                          }
                        },
                        eventMouseout: function( event, jsEvent, view ) {
                          var matching_section_events = $(this).closest(".fc").fullCalendar('clientEvents').filter(function (el) {
                            return el.section.CourseCRN === event.section.CourseCRN;
                          });
                          for(var i in matching_section_events){
                            $(this).closest(".fc").find("[data-event-id='" + matching_section_events[i]._id + "']").removeClass("event-hover");
                          }
                        }
                    },{}); //TODO-KL options passed in param #2
                    $($element).removeClass("hidden");
                });
            };
        }
    })
    .component("optionsComponent",{
        templateUrl:'/asset/angularjs/directives/options.html',
        bindings: { 
            schedule: '<',
            options: '<'
        },
        controllerAs: '$ctrl',
        controller: function($scope,$element,$timeout,$state,$uibModal,userService,schedulizerHelperService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.schedule = schedulizerHelperService.calcScheduleDetails($ctrl.schedule, userService.colors);
                $ctrl.events = [];
            };
            $ctrl.$postLink = function () {
                $timeout(function() {
                    $ctrl.options = node_generic_functions.merge_options(
                    {
                        favorite:true,
                        details:true,
                        preview:true,
                        export:true
                    },$ctrl.options);
                });
            };
            $ctrl.openScheduleDetailsModal = function(schedule){
                var modalInstance = $uibModal.open({
                  animation: true,
                  component: 'courseListingsModalComponent',
                  resolve: {
                    title: function(){
                        return "Schedule Details"
                    },
                    body: function(){
                        var body = "<course-listings-component courses=\"$ctrl.schedule\" icons=\"false\" show-crn-selections=\"false\" show-total-credits=\"true\" show-terms=\"true\"></course-listings-component>";
                        return body;
                    },
                    schedule: function(){
                        return schedule;
                    }
                  }
                });
            };
            //TODO-KL Favorites should be passed in so they are only fetched once opposed to fetching for each generated combination schedule result
            $ctrl.isFavorite = function(schedule){
                return schedulizerHelperService.findFavorite(userService.get_favorite_schedules(), schedule) !== -1;
            };
            //TODO-KL Move logic out of here
            $ctrl.toggleFavorite = function(schedule){
                console.log("Toggling favorite");
                if(schedulizerHelperService.findFavorite(userService.get_favorite_schedules(), schedule) !== -1){

                }
                else{

                }
            };

            $ctrl.openPreview = function(schedule){
                console.log("preview",schedule);
                var crns = schedulizerHelperService.extractCourseCRNs(schedule);
                // var url = $state.href('preview?crn='+crns.join("&crn="));
                var url ='/preview.html/#!/preview?crn='+crns.join("&crn=") + "&semester=" + schedule[0].Sections[0].Semester;
                window.open(url,'_blank');
            };

            $ctrl.export = function(schedule){
                console.log("export",schedule);
            };
        }
    }); 
});