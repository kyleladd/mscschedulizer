QUnit.module("professorFilter");
    QUnit.test("test the startsWith function", function(assert) {
      var result = mscSchedulizer['professorFilter']();

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
QUnit.module("campusFilter");

QUnit.module("timeBlockFilter");

QUnit.module("doDaysOverlap");
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {
            'Monday': 1
        };
        var meeting2 = {
            'Tuesday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {
            'Monday': 1
        };
        var meeting2 = {
            'Monday': 1
        };
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
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
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {};
        var meeting2 = {};
        var result = mscSchedulizer.doDaysOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
QUnit.module("doTimesOverlap");
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {StartTime:1200,EndTime:2400};
        var meeting2 = {StartTime:1200,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {StartTime:0,EndTime:1200};
        var meeting2 = {StartTime:1200,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {StartTime:0,EndTime:1000};
        var meeting2 = {StartTime:1200,EndTime:2400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {StartTime:1200,EndTime:2400};
        var meeting2 = {StartTime:1000,EndTime:1400};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {StartTime:1400,EndTime:2400};
        var meeting2 = {StartTime:1000,EndTime:1800};
        var result = mscSchedulizer.doTimesOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
QUnit.module("doTermsOverlap");
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {TermStart:'2015-08-12T00:00:00',TermEnd:'2016-08-11T00:00:00'};
        var meeting2 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-08-15T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-08-12T00:00:00'};
        var meeting2 = {TermStart:'2015-08-12T00:00:00',TermEnd:'2016-07-15T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, false, "should return false"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var meeting2 = {TermStart:'2016-10-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {TermStart:'2016-10-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var meeting2 = {TermStart:'2016-08-12T00:00:00',TermEnd:'2016-12-12T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
    QUnit.test("should return true if meeting is monday and monday in list of days", function(assert) {
        var meeting1 = {TermStart:'2014-08-12T00:00:00',TermEnd:'2017-08-12T00:00:00'};
        var meeting2 = {TermStart:'2015-08-12T00:00:00',TermEnd:'2016-08-12T00:00:00'};
        var result = mscSchedulizer.doTermsOverlap(meeting1, meeting2);

        assert.equal(result, true, "should return true"); 
    });
QUnit.module("doMeetingsOverlap");

QUnit.module("doSectionsOverlap");

QUnit.module("convertDate");

QUnit.module("splitMeetings");

QUnit.module("applyFiltersToSection");


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
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, ["F"], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 1
        };
        var result = mscSchedulizer.daysList(meeting);

        assert.deepEqual(result, [" "," "," "," ","F"], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Monday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, ["M"], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Tuesday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, ["T"], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Wednesday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, ["W"], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Thursday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, ["R"], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Friday': 0
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, [], "should return false"); 
    });
    QUnit.test("should return false if meeting is not thursday and thursday in list of days", function(assert) {
        var meeting = {
            'Thursday': 1,
            'Friday': 1
        };
        var result = mscSchedulizer.daysList(meeting,false);

        assert.deepEqual(result, ["R","F"], "should return false"); 
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

        assert.deepEqual(result, {'Friday': 1}, "should return false"); 
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

        assert.deepEqual(result, {'Thursday': 1,'Friday': 1}, "should return false"); 
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

        assert.deepEqual(result, {'Wednesday':1,'Thursday': 1,'Friday': 1}, "should return false"); 
    });