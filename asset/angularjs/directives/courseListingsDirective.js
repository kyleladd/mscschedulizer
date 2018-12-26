define(['angular', 'angular-ui-select', 'ngSanitize','moment','node_generic_functions','../services/schedulizerHelperService','ui.bootstrap','basictable','../components/modalComponent'], function (angular,uiselect,ngsanitize,moment,node_generic_functions,schedulizerHelperService) {
    angular.module("courseListingsDirective", ['ngSanitize','schedulizerHelperService','ui.bootstrap','uibootstrapmodalcomponent'])
    .component("courseListingsComponent",{
        templateUrl:'/asset/angularjs/directives/courselistings.html',
        bindings: { 
            //i don't like this passed in, apply to courses beforehand
            filters: '<',
            courses: '<',
            //TODO-KL will probably need to listen to this event due to deep copy
            courseSelections: '<',
            icons: '<',
            showCrnSelections: '<',
            showTotalCredits: '<',
            //i don't like this passed in, apply to courses beforehand
            userCourseAdjustments: '<',
            change:'&'
        },
        controllerAs: '$ctrl',
        controller: function($scope,$uibModal,$element,$timeout,schedulizerHelperService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.department_courses = angular.copy($ctrl.courses);
                $ctrl.userCourseAdjustments = {Courses:[],Sections:[],Meetings:[]};
                $ctrl.showCrnSelections = true;//TODO-KL
                //TODO-KL pass in user modifications
                $ctrl.courses = schedulizerHelperService.applyUserModificationsToCourses($ctrl.department_courses, $ctrl.userCourseAdjustments, $ctrl.filters);
            };
            $ctrl.changedValue = function(value){
                $ctrl.change({value:value});
            };
            $ctrl.$onChanges = function(changesObj){
                console.log("changes",changesObj);
            };
            $ctrl.$doCheck =function(changes) {
                console.log("docheck",changes);
            };

            $ctrl.$postLink = function () {
                console.log("postlink course listings");
                console.log($element);
                $timeout(function() {
                    console.log("TIMEOUT RUNNING WORKS");
                    $($element).find("table").basictable();
                    console.log("basictable called",$($element).find("table"));
                });
                angular.element(document).ready(function () {
                    console.log("ANGULAR DOCUMENT READY STILL RUNS TOO EARLY ON THE DOCUMENT");
                    // $($element).find("table").basictable();
                    // console.log("basictable called",$($element).find("table"));
                });
                angular.element($element).ready(function () {
                    console.log("ANGULAR element ready WORKS, but not all the time - ex when screen is wide and then is shrinked", $element);
                    // $($element).find("table").basictable();
                    // console.log("basictable called",$($element).find("table"));
                });
                // setTimeout(function(){
                //     $($element).find("table").basictable();
                //     console.log("basictable called",$($element).find("table"));
                // },5000);
            };
            // $ctrl.remove_course_selection = function(course){
            //     var index = node_generic_functions.searchListDictionaries($ctrl.coursesselected,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,CourseTitle:course.CourseTitle,'CourseCRN':course.CourseCRN},true);
            //     if (index !== -1) {
            //       $ctrl.coursesselected.splice(index,1);
            //       $ctrl.changedValue($ctrl.coursesselected);
            //     }
            // };
            $ctrl.selected_course_section = function(course, crn){
                console.log("clicked section");
                var copy = angular.copy(course);
                copy.CourseCRN = crn;
                $ctrl.selected_course(copy);
            };
            $ctrl.selected_course = function(course){
                console.log("clicked");
                var index = node_generic_functions.searchListDictionaries($ctrl.courseSelections,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
                if (index === -1) {
                    $ctrl.courseSelections.push(course);
                }
                else{
                    $ctrl.courseSelections.splice(index,1);
                }
                $ctrl.changedValue($ctrl.courseSelections);
            };
            //We need to listen to the event because ngchanges will not be triggered on a deepcopy, only if the ref changes or is a primative
            $scope.$on('schedule_filters:set', function(event, data){
              $ctrl.filters = data;
              console.log("filters data applied to course listings directive", $ctrl.filters);
              $ctrl.courses = schedulizerHelperService.applyUserModificationsToCourses($ctrl.department_courses, $ctrl.userCourseAdjustments, $ctrl.filters);
              //TODO-KL - reapply filters to listings
            });
            // $scope.$on('courses_selected:set', function(event, data){
            //   $ctrl.courseSelections = data;
            //   console.log("courseSelections data applied to course listings directive", $ctrl.courseSelections);
            //   //TODO-KL - reapply filters to listings
            // });
            $ctrl.schedulizerHelperService = schedulizerHelperService;
            $ctrl.node_generic_functions = node_generic_functions;
            $ctrl.groupedSectionMeetings = function(course){
                var grouped_meeting_sections = [];
                course.Sections.sort(schedulizerHelperService.sortSections);
                for (var s in course.Sections) {
                    var section = course.Sections[s];
                    var groupedmeetings = schedulizerHelperService.groupMeetings(section.Meetings);
                    groupedmeetings.sort(schedulizerHelperService.sortMeetings);
                    for (var m in groupedmeetings) {
                        var meeting = groupedmeetings[m];
                        try
                        {
                            if(!moment(meeting.StartTime,"Hmm").isValid() || !moment(meeting.EndTime,"Hmm").isValid()){
                                throw("Not a valid date");
                            }
                            meeting.startTime = moment(meeting.StartTime,"Hmm").format("h:mma");
                            meeting.endTime = moment(meeting.EndTime,"Hmm").format("h:mma");
                            meeting.days = schedulizerHelperService.daysList(meeting);
                        }
                        catch(err)
                        {
                            meeting.startTime = "TBD";
                            meeting.endTime = "";
                            meeting.days = [];
                        }
                        // if(node_generic_functions.searchListDictionaries(terms,section.CourseTerm,true) == -1){
                        //     terms.push(section.CourseTerm);
                        // }
                        if(section.Credits === null){
                            section.Credits = "variable";
                        }
                        else{
                            // var credits = parseInt(section.Credits);
                            // if(!isNaN(credits)){
                            //     total_credits += credits;
                            // }
                        }
                        meeting.Section = section;
                        meeting.Course = course;
                        grouped_meeting_sections.push(meeting);
                    }
                }
                return grouped_meeting_sections;
            };
            $ctrl.openModal = function(course){
                var modalInstance = $uibModal.open({
                  animation: true,
                  component: 'modalComponent',
                  resolve: {
                    title: function(){
                        return course.DepartmentCode + ' ' + course.CourseNumber + ' - ' + course.CourseTitle
                    },
                    body: function(){
                        return course.Description;
                    }
                  }
                });
            };
        }
    }); 
});