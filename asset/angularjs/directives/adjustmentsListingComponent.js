define(['angular', 'angular-ui-select', 'ngSanitize','moment','node_generic_functions','../services/schedulizerHelperService','../services/userService','ui.bootstrap','basictable','../components/modalComponent'], function (angular,uiselect,ngsanitize,moment,node_generic_functions,schedulizerHelperService,userService) {
    angular.module("adjustmentsListingDirective", ['ngSanitize','schedulizerHelperService','userService','ui.bootstrap','uibootstrapmodalcomponent'])
    .component("adjustmentsListingComponent",{
        templateUrl:'/asset/angularjs/directives/adjustmentslisting.html',
        controllerAs: '$ctrl',
        bindings: {
          resolve: '<',
          close: '&',
          dismiss: '&',
          course: '<'
        },
        controller: function ($uibModal,$element,$timeout,schedulizerHelperService) {
          var $ctrl = this;
          $ctrl.$onInit = function () {
            if($ctrl.course === undefined && $ctrl.resolve !== undefined && $ctrl.resolve.course !== undefined){
              $ctrl.course = $ctrl.resolve.course;
            }

            // $ctrl.department_courses = angular.copy($ctrl.courses);
            // $ctrl.userCourseAdjustments = {Courses:[],Sections:[],Meetings:[]}; ///TODO-KL
            // $ctrl.courses = schedulizerHelperService.applyUserModificationsToCourses($ctrl.department_courses, $ctrl.userCourseAdjustments, $ctrl.filters);
            $ctrl.terms = $ctrl.getTerms([$ctrl.course]);
          };
          $ctrl.$postLink = function () {
              $timeout(function() {
                  $($element).find("table").basictable();
              });
          };
          
          $ctrl.getTerms = function(){
              return schedulizerHelperService.extractTerms($ctrl.courses);
          };

          $ctrl.mscSpecialMessages = function(){
              return schedulizerHelperService.mscSpecialMessages(node_generic_functions.endsWith("06",userService.get_semester().TermCode));
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

          $ctrl.close = function () {
            $ctrl.close({$value: 'close'});
          };

          $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
          };
        }
        // bindings: { 
        //     //i don't like this passed in, apply to courses beforehand
        //     filters: '<',
        //     courses: '<',
        //     //TODO-KL will probably need to listen to this event due to deep copy
        //     courseSelections: '<',
        //     icons: '<',
        //     showCrnSelections: '<',
        //     showTotalCredits: '<',
        //     showTerms: '<',
            
        //     //i don't like this passed in, apply to courses beforehand
        //     userCourseAdjustments: '<',
        //     change:'&'
        // },
        // controller: function($scope,$uibModal,$element,$timeout,schedulizerHelperService,userService) {
        //     var $ctrl = this;
        //     $ctrl.moment = moment;
        //     $ctrl.terms = [];
        //     $ctrl.$onInit = function () {
        //         if($ctrl.courses === undefined && $ctrl.resolve !== undefined && $ctrl.resolve.schedule !== undefined){
        //         $ctrl.department_courses = angular.copy($ctrl.courses);
        //         $ctrl.userCourseAdjustments = {Courses:[],Sections:[],Meetings:[]};
        //         $ctrl.courses = schedulizerHelperService.applyUserModificationsToCourses($ctrl.department_courses, $ctrl.userCourseAdjustments, $ctrl.filters);
        //         $ctrl.terms = $ctrl.getTerms($ctrl.courses);
        //     };
        //     $ctrl.changedValue = function(value){
        //         $ctrl.change({value:value});
        //     };
        //     $ctrl.$postLink = function () {
        //         $timeout(function() {
        //             $($element).find("table").basictable();
        //         });
        //     };
        //     $ctrl.selected_course_section = function(course, crn){
        //         var copy = angular.copy(course);
        //         copy.CourseCRN = crn;
        //         $ctrl.selected_course(copy);
        //     };
        //     $ctrl.selected_course = function(course){
        //         var index = node_generic_functions.searchListDictionaries($ctrl.courseSelections,{'DepartmentCode':course.DepartmentCode,'CourseNumber':course.CourseNumber,'CourseTitle':course.CourseTitle,'CourseCRN':course.CourseCRN},true);
        //         if (index === -1) {
        //             $ctrl.courseSelections.push(course);
        //         }
        //         else{
        //             $ctrl.courseSelections.splice(index,1);
        //         }
        //         $ctrl.changedValue($ctrl.courseSelections);
        //     };
        //     //We need to listen to the event because ngchanges will not be triggered on a deepcopy, only if the ref changes or is a primative
        //     $scope.$on('schedule_filters:set', function(event, data){
        //       $ctrl.filters = data;
        //       $ctrl.courses = schedulizerHelperService.applyUserModificationsToCourses($ctrl.department_courses, $ctrl.userCourseAdjustments, $ctrl.filters);
        //       //TODO-KL - reapply filters to listings
        //     });
        //     $ctrl.schedulizerHelperService = schedulizerHelperService;
        //     $ctrl.node_generic_functions = node_generic_functions;
        //     $ctrl.groupedSectionMeetings = function(course){
        //         var grouped_meeting_sections = [];
        //         course.Sections.sort(schedulizerHelperService.sortSections);
        //         for (var s in course.Sections) {
        //             var section = course.Sections[s];
        //             var groupedmeetings = schedulizerHelperService.groupMeetings(section.Meetings);
        //             groupedmeetings.sort(schedulizerHelperService.sortMeetings);
        //             for (var m in groupedmeetings) {
        //                 var meeting = groupedmeetings[m];
        //                 try
        //                 {
        //                     if(!moment(meeting.StartTime,"Hmm").isValid() || !moment(meeting.EndTime,"Hmm").isValid()){
        //                         throw("Not a valid date");
        //                     }
        //                     meeting.startTime = moment(meeting.StartTime,"Hmm").format("h:mma");
        //                     meeting.endTime = moment(meeting.EndTime,"Hmm").format("h:mma");
        //                     meeting.days = schedulizerHelperService.daysList(meeting);
        //                 }
        //                 catch(err)
        //                 {
        //                     meeting.startTime = "TBD";
        //                     meeting.endTime = "";
        //                     meeting.days = [];
        //                 }
        //                 // if(node_generic_functions.searchListDictionaries(terms,section.CourseTerm,true) == -1){
        //                 //     terms.push(section.CourseTerm);
        //                 // }
        //                 if(section.Credits === null){
        //                     section.Credits = "variable";
        //                 }
        //                 else{
        //                     // var credits = parseInt(section.Credits);
        //                     // if(!isNaN(credits)){
        //                     //     total_credits += credits;
        //                     // }
        //                 }
        //                 meeting.Section = section;
        //                 meeting.Course = course;
        //                 grouped_meeting_sections.push(meeting);
        //             }
        //         }
        //         return grouped_meeting_sections;
        //     };
        //     $ctrl.getTotalCredits = function(){
        //         return schedulizerHelperService.getTotalCredits($ctrl.courses);
        //     };
        //     $ctrl.getTerms = function(){
        //         return schedulizerHelperService.extractTerms($ctrl.courses);
        //     };
        //     //TODO-KL bad
        //     $ctrl.mscSpecialMessages = function(){
        //         return schedulizerHelperService.mscSpecialMessages(node_generic_functions.endsWith("06",userService.get_semester().TermCode));
        //     };
        //     $ctrl.openModal = function(course){
        //         var modalInstance = $uibModal.open({
        //           animation: true,
        //           component: 'modalComponent',
        //           resolve: {
        //             title: function(){
        //                 return course.DepartmentCode + ' ' + course.CourseNumber + ' - ' + course.CourseTitle
        //             },
        //             body: function(){
        //                 return course.Description;
        //             }
        //           }
        //         });
        //     };
        // }
    }); 
});