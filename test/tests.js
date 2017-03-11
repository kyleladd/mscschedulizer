QUnit.config.reorder = false;
var sandbox;
var clock;
var courseList = [];
var aCourse= {};
QUnit.module("professorFilter");
    QUnit.test("test the startsWith function", function(assert) {
      var result = mscSchedulizer.professorFilter();
      // Not implemented
      assert.equal(result, false, "should return false");
    });

QUnit.module("notFullFilter");
    QUnit.test("should return true if current enrollment greater than max enrollment", function(assert) {
        var section = {
            'CurrentEnrollment': 11,
            'MaxEnrollment': 10
        };
        var result = mscSchedulizer.notFullFilter(section, NaN);

        assert.equal(result, true, "should return true");
    });
    QUnit.test("should return true if current enrollment equal to max enrollment", function(assert) {
        var section = {
            'CurrentEnrollment': 10,
            'MaxEnrollment': 10
        };
        var result = mscSchedulizer.notFullFilter(section, NaN);

        assert.equal(result, true, "should be true when equal"); 
    });
    QUnit.test("should return false if current enrollment less than max enrollment", function(assert) {
        var section = {
            'CurrentEnrollment': 9,
            'MaxEnrollment': 10
        };
        var result = mscSchedulizer.notFullFilter(section, NaN);

        assert.equal(result, false, "should be false when not full"); 
    });

QUnit.module("campusFilter");
    QUnit.test("should not be filtered out when it does not have meetings", function(assert) {
        var section = {};
        var filter = {Morrisville:true,Norwich:true};
        var result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, false, "should be false when Campus is undefined no matter the filter settings");
        
        filter = {Morrisville:false,Norwich:false};
        result = mscSchedulizer.campusFilter(section, filter);
        assert.equal(result, false, "should be false when Campus is undefined no matter the filter settings");
    });
    QUnit.test("should not be filtered out when it has meetings that do not have times even though campuses are false", function(assert) {
        var section = {Meetings:[{StartTime:null,EndTime:null,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        var filter = {Morrisville:false,Norwich:false};
        var result = mscSchedulizer.campusFilter(section, filter);
        assert.equal(result, false, "should be false when Campus is undefined");        

        section = {Meetings:[{StartTime:null,EndTime:null,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, false, "should be false when Campus is undefined");

        section = {Meetings:[{StartTime:1000,EndTime:1200,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, false, "should be false when Campus is undefined");
    });
    QUnit.test("should not be filtered out when meeting is missing time/day", function(assert) {
        var section = {Meetings:[{StartTime:null,EndTime:null,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        var filter = {Morrisville:false,Norwich:false};
        var result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, false, "should be false when Campus is undefined"); 
        
        section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0}]};
        assert.equal(result, false, "should be false when Campus is undefined"); 
    });
    QUnit.test("should not be filtered out when it has meetings that have times,days and campus but filters are true", function(assert) {
        var section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}],Campus:'M'};
        var filter = {Morrisville:true,Norwich:true};
        var result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, false, "should be false when matching campus is true in filter"); 
        
        section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1,Campus:'N'}]};
        assert.equal(result, false, "should be false when matching campus is true in filter"); 
    });
    QUnit.test("should be filtered out when it has meetings that have times,days and campus is set but matching campus filter is false", function(assert) {
        var section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}],Campus:'N'};
        var filter = {Morrisville:true,Norwich:false};
        var result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, true, "should be true when matching Campus is false in filter"); 
        section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}],Campus:'M'};
        filter = {Morrisville:false,Norwich:true};
        result = mscSchedulizer.campusFilter(section, filter);

        assert.equal(result, true, "should be true when matching Campus is false in filter"); 
    });

QUnit.module("timeBlockFilter");
    QUnit.test("should be false when timeblock filter is empty", function(assert) {
        var section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        var filter =  [];
        var result = mscSchedulizer.timeBlockFilter(section, filter);

        assert.equal(result, false, "should be false when timeblock filter is empty"); 
    });
    QUnit.test("should be false when timeblock filter does not overlap meetings due to time", function(assert) {
        var section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        var filter =  [{Days:"Mon,Tue,Wed,Thu,Fri",StartTime:"0000",EndTime:"1130"}];
        var result = mscSchedulizer.timeBlockFilter(section, filter);

        assert.equal(result, false, "should be false when timeblock filter is empty"); 
    });
    QUnit.test("should be false when timeblock filter does not overlap meetings due to days", function(assert) {
        var section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:0,Wednesday:1,Thursday:1,Friday:1}]};
        var filter =  [{Days:"Tue",StartTime:"0000",EndTime:"2330"}];
        var result = mscSchedulizer.timeBlockFilter(section, filter);

        assert.equal(result, false, "should be false when timeblock filter is empty"); 
    });
    QUnit.test("should be true when timeblock filter does overlap meetings", function(assert) {
        var section = {Meetings:[{StartTime:1200,EndTime:1300,Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1}]};
        var filter =  [{Days:"Mon,Tue,Wed,Thu,Fri",StartTime:"0000",EndTime:"2330"}];
        var result = mscSchedulizer.timeBlockFilter(section, filter);

        assert.equal(result, true, "should be true when timeblock filter is overlaps meeting day/time"); 
    });

QUnit.module("doDaysOverlap");
    QUnit.test("should return false when the two meetings are on different days (don't overlap)", function(assert) {
        var meeting1 = {
            'Monday': 1
        };
        var meeting2 = {
            'Tuesday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true when the meetings are on the same day", function(assert) {
        var meeting1 = {
            'Monday': 1
        };
        var meeting2 = {
            'Monday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true when a day in meeting1 is within meeting2", function(assert) {
        var meeting1 = {
            'Monday': 1
        };
        var meeting2 = {
            'Monday': 1,
            'Tuesday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true when a day in meeting2 is within meeting1", function(assert) {
        var meeting1 = {
            'Monday': 1,
            'Tuesday':1
        };
        var meeting2 = {
            'Monday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false when a day in meeting2 is within meeting1 but is false", function(assert) {
        var meeting1 = {
            'Monday': 0,
            'Tuesday':1
        };
        var meeting2 = {
            'Monday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false when both meeting days are empty", function(assert) {
        var meeting1 = {};
        var meeting2 = {};
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });

QUnit.module("doTimesOverlap");
    QUnit.test("should return true if meeting times overlap/ are the same", function(assert) {
        var meeting1 = {StartTime:1200,EndTime:2400};
        var meeting2 = {StartTime:1200,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false if an endtime is the same as the other meeting's start time", function(assert) {
        var meeting1 = {StartTime:0,EndTime:1200};
        var meeting2 = {StartTime:1200,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {StartTime:0,EndTime:1000};
        var meeting2 = {StartTime:1200,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting1 starts before meeting 2 ends", function(assert) {
        var meeting1 = {StartTime:1200,EndTime:2400};
        var meeting2 = {StartTime:1000,EndTime:1400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting1 ends after meeting 1 starts", function(assert) {
        var meeting1 = {StartTime:1000,EndTime:1600};
        var meeting2 = {StartTime:1400,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });

QUnit.module("doTermsOverlap");
    QUnit.test("should return false if term starts and term ends do not overlap", function(assert) {
        var meeting1 = {TermStart:'2015-08-12T00:00:00',TermEnd:'2016-08-11T00:00:00'};
        var meeting2 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-08-15T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if term starts and term ends do not overlap", function(assert) {
        var meeting1 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-08-12T00:00:00'};
        var meeting2 = {TermStart:'2015-08-12T00:00:00',TermEnd:'2016-07-15T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if term starts and term ends overlap", function(assert) {
        var meeting1 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var meeting2 = {TermStart:'2016-10-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if term starts and term ends overlap", function(assert) {
        var meeting1 = {TermStart:'2016-10-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var meeting2 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if term starts and term ends overlap", function(assert) {
        var meeting1 = {TermStart:'2014-08-12T00:00:00',TermEnd:'2017-08-12T00:00:00'};
        var meeting2 = {TermStart:'2015-08-12T00:00:00',TermEnd:'2016-08-12T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });

QUnit.module("doMeetingDatesOverlap");
    QUnit.test("should return false if meeting start date and end date do not overlap", function(assert) {
        var meeting1 = {StartDate:'2015-08-12T00:00:00',EndDate:'2016-08-11T00:00:00'};
        var meeting2 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-08-15T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if meeting start date and end date do not overlap", function(assert) {
        var meeting1 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-08-12T00:00:00'};
        var meeting2 = {StartDate:'2015-08-12T00:00:00',EndDate:'2016-07-15T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting start date and end date overlap", function(assert) {
        var meeting1 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-12-12T00:00:00'};
        var meeting2 = {StartDate:'2016-10-12T00:00:00',EndDate:'2016-12-12T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting start date and end date overlap", function(assert) {
        var meeting1 = {StartDate:'2016-10-12T00:00:00',EndDate:'2016-12-12T00:00:00'};
        var meeting2 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-12-12T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting start date and end date overlap", function(assert) {
        var meeting1 = {StartDate:'2014-08-12T00:00:00',EndDate:'2017-08-12T00:00:00'};
        var meeting2 = {StartDate:'2015-08-12T00:00:00',EndDate:'2016-08-12T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting start date and end date for meetings are the same", function(assert) {
        var meeting1 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-08-22T00:00:00'};
        var meeting2 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-08-22T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting start date and end date for meetings are the same (singular day)", function(assert) {
        var meeting1 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-08-12T00:00:00'};
        var meeting2 = {StartDate:'2016-08-12T00:00:00',EndDate:'2016-08-12T00:00:00'};
        var result = mscSchedulizer.doMeetingDatesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });

QUnit.module("doMeetingsOverlap", {
  beforeEach: function() {
    // prepare something for all following tests
    sandbox = sinon.sandbox.create();
  },
  afterEach: function() {
    // clean up after each test
    sandbox.restore();
  }
});
    QUnit.test("should return false if meeting times and day do not overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doTimesOverlap");
        stub.returns(false);
        var stub2 = sandbox.stub(mscSchedulizer,"doDaysOverlap");
        stub2.returns(false);
        var section1meetings = [{StartTime:'1000',EndTime:'1200'}];
        var section2meetings = [{StartTime:'1000',EndTime:'1200'}];
        var result = mscSchedulizer.doMeetingsOverlap(section1meetings, section2meetings);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false when meetings times overlap but days do not overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doTimesOverlap");
        stub.returns(true);
        var stub2 = sandbox.stub(mscSchedulizer,"doDaysOverlap");
        stub2.returns(false);
        var section1meetings = [{StartTime:'1000',EndTime:'1200'}];
        var section2meetings = [{StartTime:'1000',EndTime:'1200'}];
        var result = mscSchedulizer.doMeetingsOverlap(section1meetings, section2meetings);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if times do not overlap and days do overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doTimesOverlap");
        stub.returns(false);
        var stub2 = sandbox.stub(mscSchedulizer,"doDaysOverlap");
        stub2.returns(true);
        var section1meetings = [{StartTime:'1000',EndTime:'1200'}];
        var section2meetings = [{StartTime:'1000',EndTime:'1200'}];
        var result = mscSchedulizer.doMeetingsOverlap(section1meetings, section2meetings);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meetdays overlap and times overlap and meeting dates overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doTimesOverlap");
        stub.returns(true);
        var stub2 = sandbox.stub(mscSchedulizer,"doDaysOverlap");
        stub2.returns(true);
        var stub3 = sandbox.stub(mscSchedulizer,"doMeetingDatesOverlap");
        stub3.returns(true);
        var section1meetings = [{StartTime:'1000',EndTime:'1200'}];
        var section2meetings = [{StartTime:'1000',EndTime:'1200'}];
        var result = mscSchedulizer.doMeetingsOverlap(section1meetings, section2meetings);

        assert.equal(result, true, "should return true"); 
    });

QUnit.module( "doSectionsOverlap", {
  beforeEach: function() {
    // prepare something for all following tests
    sandbox = sinon.sandbox.create();
  },
  afterEach: function() {
    // clean up after each test
    sandbox.restore();
  }
});
    QUnit.test("should return false when meetings do not overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doMeetingsOverlap");
        stub.returns(false);
        var result = mscSchedulizer.doSectionsOverlap({}, {});

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true when meetings overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doMeetingsOverlap");
        stub.returns(true);
        var result = mscSchedulizer.doSectionsOverlap({}, {});

        assert.equal(result, true, "should return true"); 
    });

QUnit.module("doBlockDaysOverlap");
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting = {
            'Monday': 1
        };
        var days = ['Mon'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false if meeting is not monday and monday in list of days", function(assert) {
        var meeting = {
            'Monday': 2
        };
        var days = ['Mon'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false");
    });
    QUnit.test("should return false if meeting is monday and monday not in list of days", function(assert) {
        var meeting = {
            'Monday': 1
        };
        var days = ['Sat'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is tuesday and tuesday in list of days", function(assert) {
        var meeting = {
            'Tuesday': 1
        };
        var days = ['Tue'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false if meeting is not tuesday and tuesday in list of days", function(assert) {
        var meeting = {
            'Tuesday': 2
        };
        var days = ['Tue'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if meeting is tuesday and tuesday in list of days", function(assert) {
        var meeting = {
            'Tuesday': 1
        };
        var days = ['Sat'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is wednesday and wednesday in list of days", function(assert) {
        var meeting = {
            'Wednesday': 1
        };
        var days = ['Wed'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false if meeting is not wednesday and wednesday in list of days", function(assert) {
        var meeting = {
            'Wednesday': 2
        };
        var days = ['Wed'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if meeting is wednesday and wednesday in list of days", function(assert) {
        var meeting = {
            'Wednesday': 1
        };
        var days = ['Sat'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Thursday': 1
        };
        var days = ['Thu'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Thursday': 2
        };
        var days = ['Thu'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Thursday': 1
        };
        var days = ['Sat'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 1
        };
        var days = ['Fri'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 2
        };
        var days = ['Fri'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 1
        };
        var days = ['Sat'];
        var result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

        assert.equal(result, false, "should return false"); 
    });

QUnit.module("daysList");
    QUnit.test("should return a list containing 'F' when meeting.Friday is true", function(assert) {
        var meeting = {
            'Friday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 1, "should return a list"); 
        assert.deepEqual(result, ["F"], "should return a list containing 'F'"); 
    });
    QUnit.test("should return a list containing empty spaces and 'F' when insert spaces is not passed as false", function(assert) {
        var meeting = {
            'Friday': 1
        };
        var result = mscSchedulizer.daysList(meeting);

        assert.equal(result.length, 5, "should return a list"); 
        assert.deepEqual(result, [" "," "," "," ","F"], "should return a list containing spaces and 'F'"); 
    });
    QUnit.test("should return a list containing 'M' when meeting.Monday is true", function(assert) {
        var meeting = {
            'Monday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 1, "should return a list"); 
        assert.deepEqual(result, ["M"], "should return a list containing 'M'"); 
    });
    QUnit.test("should return a list containing 'T' when meeting.Tuesday is true", function(assert) {
        var meeting = {
            'Tuesday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 1, "should return a list"); 
        assert.deepEqual(result, ["T"], "should return a list containing 'T'"); 
    });
    QUnit.test("should return a list containing 'W' when meeting.Wednesday is true", function(assert) {
        var meeting = {
            'Wednesday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 1, "should return a list"); 
        assert.deepEqual(result, ["W"], "should return a list containing 'W'"); 
    });
    QUnit.test("should return a list containing 'R' when meeting.Thursday is true", function(assert) {
        var meeting = {
            'Thursday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 1, "should return a list"); 
        assert.deepEqual(result, ["R"], "should return a list containing 'R'"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 0
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 0, "should return an empty list"); 
        assert.deepEqual(result, [], "should return an empty list"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Thursday': 1,
            'Friday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.equal(result.length, 2, "should return a list"); 
        assert.deepEqual(result, ["R","F"], "should return a list containing 'R' and F'"); 
    });

QUnit.module("mergeDays");
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting1 = {
            'Friday': 1
        };
        var meeting2 = {
            'Friday': 1
        };
        var result = mscSchedulizer.mergeDays(meeting1,meeting2);

        assert.deepEqual(result, {'Friday': 1}, "should return an object with Friday:1"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting1 = {
            'Friday': 1
        };
        var meeting2 = {
            'Thursday': 1,
            'Friday': 1
        };
        var result = mscSchedulizer.mergeDays(meeting1,meeting2);

        assert.deepEqual(result, {'Thursday': 1,'Friday': 1}, "should return an object with Thursday:1 and Friday:1"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting1 = {
            'Wednesday': 1,
            'Friday': 1
        };
        var meeting2 = {
            'Thursday': 1,
            'Friday': 1
        };
        var result = mscSchedulizer.mergeDays(meeting1,meeting2);

        assert.deepEqual(result, {'Wednesday':1,'Thursday': 1,'Friday': 1}, "should return an object with Wednesday:1, Thursday:1,Friday:1"); 
    });

QUnit.module("convertDate", {
  beforeEach: function() {
    // prepare something for all following tests
    clock = sinon.useFakeTimers(new Date(2016,1,26).getTime());
  },
  afterEach: function() {
    // clean up after each test
    clock.restore();
  }
});
    QUnit.test("should return the corresponding date based on day of week", function(assert) {
        var result = mscSchedulizer.convertDate("M");

        assert.deepEqual(result, new Date(2016,1,22), "should return the corresponding date based on day of week"); 
    });
    QUnit.test("should return the corresponding date based on day of week", function(assert) {
        var result = mscSchedulizer.convertDate("T");

        assert.deepEqual(result, new Date(2016,1,23), "should return the corresponding date based on day of week"); 
    });
    QUnit.test("should return the corresponding date based on day of week", function(assert) {
        var result = mscSchedulizer.convertDate("W");

        assert.deepEqual(result, new Date(2016,1,24), "should return the corresponding date based on day of week"); 
    });
    QUnit.test("should return the corresponding date based on day of week", function(assert) {
        var result = mscSchedulizer.convertDate("R");

        assert.deepEqual(result, new Date(2016,1,25), "should return the corresponding date based on day of week"); 
    });
    QUnit.test("should return the corresponding date based on day of week", function(assert) {
        var result = mscSchedulizer.convertDate("F");

        assert.deepEqual(result, new Date(2016,1,26), "should return the corresponding date based on day of week"); 
    });


QUnit.module("splitMeetings", {
  beforeEach: function() {
    // prepare something for all following tests
    clock = sinon.useFakeTimers(new Date(2016,1,26).getTime());
  },
  afterEach: function() {
    // clean up after each test
    clock.restore();
  }
});
    QUnit.test("should return the appropriate datetime format", function(assert) {
        var result = mscSchedulizer.splitMeetings({Monday:1,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,StartTime:1000,EndTime:1200});

        assert.deepEqual(result, [{StartTime:"2016-02-22T10:00",EndTime:"2016-02-22T12:00"}], "should return the appropriate datetime format"); 
    });
    QUnit.test("should return a list of the datetimes for each meeting in the appropriate format", function(assert) {
        var result = mscSchedulizer.splitMeetings({Monday:1,Tuesday:1,Wednesday:0,Thursday:0,Friday:0,StartTime:1000,EndTime:1200});

        assert.deepEqual(result, [{StartTime:"2016-02-22T10:00",EndTime:"2016-02-22T12:00"},{StartTime:"2016-02-23T10:00",EndTime:"2016-02-23T12:00"}], "should return the appropriate datetime format"); 
    });
    QUnit.test("should return a list of the datetimes for each meeting in the appropriate format", function(assert) {
        var result = mscSchedulizer.splitMeetings({Monday:1,Tuesday:1,Wednesday:1,Thursday:1,Friday:1,StartTime:1000,EndTime:1200});

        assert.deepEqual(result, [{StartTime:"2016-02-22T10:00",EndTime:"2016-02-22T12:00"},{StartTime:"2016-02-23T10:00",EndTime:"2016-02-23T12:00"},{StartTime:"2016-02-24T10:00",EndTime:"2016-02-24T12:00"},{StartTime:"2016-02-25T10:00",EndTime:"2016-02-25T12:00"},{StartTime:"2016-02-26T10:00",EndTime:"2016-02-26T12:00"}], "should return the appropriate datetime format"); 
    });
QUnit.module("getSectionCombinations", {
  beforeEach: function() {
    // prepare something for all following tests
    // CITA 120 - lab,lecture,campus
    sandbox = sinon.sandbox.create();
    mscSchedulizer.classes_selected = [];
    aCourse = testData.labLectureCourse;
  },
  afterEach: function() {
    // clean up after each test
    aCourse = {};
    sandbox.restore();
    mscSchedulizer.classes_selected = [];
  }
});
    QUnit.test("should return the number of section combinations", function(assert) {
        // Ignore filters, don't filter anything out
        sandbox.stub(mscSchedulizer,'applyFiltersToSection').returns(false);
        var result = mscSchedulizer.getSectionCombinations(aCourse.Sections);
        assert.deepEqual(result.length, 3, "should return valid generated combinations based on Identifiers"); 
    });
    QUnit.test("should return section combinations that don't include multiple campuses", function(assert) {
        // Ignore filters, don't filter anything out
        sandbox.stub(mscSchedulizer,'applyFiltersToSection').returns(false);
        aCourse = testData.courseMultipleCampuses;
        var result = mscSchedulizer.getSectionCombinations(aCourse.Sections);
        assert.equal(result.length,2,"There should be two combinations due to campus restrictions- no cross campus results allowed");
        result.forEach(function(combination){
            var campus = combination[0].Campus;
            combination.forEach(function(section){
                assert.equal(section.Campus,campus,"All sections of a combination should be on the same campus: " + campus);
            });
        });
    });
    QUnit.test("crn-specific selections should have 'or' functionality if multiple are selected with the same identifier", function(assert) {
        // Ignore filters, don't filter anything out
        sandbox.stub(mscSchedulizer,'applyFiltersToSection').returns(false);
        mscSchedulizer.classes_selected = [
            {
                CourseCRN: aCourse.Sections[0].CourseCRN,
                CourseNumber: aCourse.Sections[0].CourseNumber,
                CourseTitle: aCourse.Sections[0].CourseTitle,
                DepartmentCode: aCourse.Sections[0].DepartmentCode
            }
        ];
        var combinations = mscSchedulizer.getSectionCombinations(labLectureCourse.Sections);
        assert.equal(combinations.length,2,"Should return 2 combinations due because one section doesn't have any requirements"); // crn isn't in result, but then again, it isn't needed - should that be the intended logic
    });
    QUnit.test("crn-specific selections should have 'or' functionality if multiple are selected with the same identifier", function(assert) {
        mscSchedulizer.schedule_filters.Campuses.Norwich = false;
        mscSchedulizer.classes_selected = [
            {
                CourseCRN: aCourse.Sections[0].CourseCRN,
                CourseNumber: aCourse.Sections[0].CourseNumber,
                CourseTitle: aCourse.Sections[0].CourseTitle,
                DepartmentCode: aCourse.Sections[0].DepartmentCode
            }
        ];
        var combinations = mscSchedulizer.getSectionCombinations(labLectureCourse.Sections);
        assert.equal(combinations.length,1,"Should return 1 combination due to crn requirement");
    });

    QUnit.test("non crn-specific selections should have 'or' functionality if multiple are selected with the same identifier", function(assert) {
        // Ignore filters, don't filter anything out
        sandbox.stub(mscSchedulizer,'applyFiltersToSection').returns(false);
        mscSchedulizer.classes_selected = [
            {
                CourseCRN: null,
                CourseNumber: aCourse.Sections[0].CourseNumber,
                CourseTitle: aCourse.Sections[0].CourseTitle,
                DepartmentCode: aCourse.Sections[0].DepartmentCode
            }
        ];
        var combinations = mscSchedulizer.getSectionCombinations(labLectureCourse.Sections);
        assert.equal(combinations.length,3,"Should return 3 combinations");
    });

//Test the end result combinations
QUnit.module("groupSectionsByIdentifier", {
  beforeEach: function() {
    mscSchedulizer.classes_selected = [];
    aCourse = testData.labLectureCourse;
  },
  afterEach: function() {
    // clean up after each test
    aCourse = {};
    sandbox.restore();
    mscSchedulizer.classes_selected = [];
  }
});
    QUnit.test("should group sections based on their identifier", function(assert) {
        // Ignore filters, don't filter anything out
        sandbox.stub(mscSchedulizer,'applyFiltersToSection').returns(false);
        var result = mscSchedulizer.groupSectionsByIdentifier(aCourse.Sections);
        assert.equal(Object.keys(result).length, 3, "Should have a key for each campus");
        assert.notDeepEqual(result["A1"], undefined, "Should have a key for each A1");
        assert.notDeepEqual(result["A2"], undefined, "Should have a key for each A2");
        assert.notDeepEqual(result["empty"], undefined, "Should have a key for null or '' as Identifier which changes to empty");
        assert.deepEqual(result["A1"].length, 1, "Should have 1 section with a lecture identifier");
        assert.deepEqual(result["A2"].length, 2, "Should have 2 sections with lab identifiers");
        assert.deepEqual(result["empty"].length, 1, "Should have 1 course section with empty identifier");
    });