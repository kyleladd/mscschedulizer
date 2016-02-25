QUnit.module("Filters");
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