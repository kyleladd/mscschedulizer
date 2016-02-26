var sandbox;
QUnit.module("professorFilter");
    QUnit.test("test the startsWith function", function(assert) {
      var result = mscSchedulizer['professorFilter']();
      // Not implemented
      assert.equal(result, false, "should return false");
    });

QUnit.module("notFullFilter");
    QUnit.test("should return true if current enrollment greater than max enrollment", function(assert) {
        var section = {
            'CurrentEnrollment': 11,
            'MaxEnrollment': 10
        };
        var result = mscSchedulizer['notFullFilter'](section, NaN);

        assert.equal(result, true, "should return true");
    });
    QUnit.test("should return true if current enrollment equal to max enrollment", function(assert) {
        var section = {
            'CurrentEnrollment': 10,
            'MaxEnrollment': 10
        };
        var result = mscSchedulizer['notFullFilter'](section, NaN);

        assert.equal(result, true, "should be true when equal"); 
    });
    QUnit.test("should return false if current enrollment less than max enrollment", function(assert) {
        var section = {
            'CurrentEnrollment': 9,
            'MaxEnrollment': 10
        };
        var result = mscSchedulizer['notFullFilter'](section, NaN);

        assert.equal(result, false, "should be false when not full"); 
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
    QUnit.test("should return true if meedays overlap and times overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doTimesOverlap");
        stub.returns(true);
        var stub2 = sandbox.stub(mscSchedulizer,"doDaysOverlap");
        stub2.returns(true);
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
    QUnit.test("should return false when meetings do not overlap and terms do not overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doMeetingsOverlap");
        stub.returns(false);
        var stub2 = sandbox.stub(mscSchedulizer,"doTermsOverlap");
        stub2.returns(false);
        var result = mscSchedulizer.doSectionsOverlap({}, {});

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false when meetings overlap and terms do not overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doMeetingsOverlap");
        stub.returns(true);
        var stub2 = sandbox.stub(mscSchedulizer,"doTermsOverlap");
        stub2.returns(false);
        var result = mscSchedulizer.doSectionsOverlap({}, {});

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return false when meetings do not overlap and terms overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doMeetingsOverlap");
        stub.returns(false);
        var stub2 = sandbox.stub(mscSchedulizer,"doTermsOverlap");
        stub2.returns(true);
        var result = mscSchedulizer.doSectionsOverlap({}, {});

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true when both meetings and terms overlap", function(assert) {
        var stub = sandbox.stub(mscSchedulizer,"doMeetingsOverlap");
        stub.returns(true);
        var stub2 = sandbox.stub(mscSchedulizer,"doTermsOverlap");
        stub2.returns(true);
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

// DOM TESTS
QUnit.module("convertDate");


QUnit.module("splitMeetings");


QUnit.module("applyFiltersToSection");


QUnit.module("campusFilter");


QUnit.module("timeBlockFilter");

