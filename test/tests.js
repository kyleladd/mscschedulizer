// var chai = require('chai');
// var should = chai.should();
var expect = chai.expect;
// var mscSchedulizer = require('../asset/js/schedulizer.js');


describe('professorFilter', function () {
    it('should return false', function () {
      result = mscSchedulizer['professorFilter']();
      expect(result).to.be.equal(false);
    });
  });

  describe('notFullFilter', function () {
    it('should return true if current enrollment greater than max enrollment', function () {
      var section = {
        'CurrentEnrollment': 11,
        'MaxEnrollment': 10
      }
      result = mscSchedulizer['notFullFilter'](section, NaN)
      expect(result).to.be.equal(true);
    });

    it('should return true if current enrollment equal to max enrollment', function () {
      var section = {
        'CurrentEnrollment': 10,
        'MaxEnrollment': 10
      }
      result = mscSchedulizer['notFullFilter'](section, NaN)
      expect(result).to.be.equal(true);
    });

    it('should return false if current enrollment less than max enrollment', function () {
      var section = {
        'CurrentEnrollment': 9,
        'MaxEnrollment': 10
      }
      result = mscSchedulizer['notFullFilter'](section, NaN)
      expect(result).to.be.equal(false);
    });
  });

  describe('doBlockDaysOverlap', function () {
    it('should return true if meeting is monday and monday in list of days', function () {
      var meeting = {
        'Monday': 1
      };
      var days = ['Mon'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(true)
    });

    it('should return false if meeting is not monday and monday in list of days', function () {
      var meeting = {
        'Monday': 2
      };
      var days = ['Mon'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return false if meeting is monday and monday in list of days', function () {
      var meeting = {
        'Monday': 1
      };
      var days = ['Sat'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return true if meeting is tuesday and tuesday in list of days', function () {
      var meeting = {
        'Tuesday': 1
      };
      var days = ['Tue'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(true)
    });

    it('should return false if meeting is not tuesday and tuesday in list of days', function () {
      var meeting = {
        'Tuesday': 2
      };
      var days = ['Tue'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return false if meeting is tuesday and tuesday in list of days', function () {
      var meeting = {
        'Tuesday': 1
      };
      var days = ['Sat'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return true if meeting is wednesday and wednesday in list of days', function () {
      var meeting = {
        'Wednesday': 1
      };
      var days = ['Wed'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(true)
    });

    it('should return false if meeting is not wednesday and wednesday in list of days', function () {
      var meeting = {
        'Wednesday': 2
      };
      var days = ['Wed'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return false if meeting is wednesday and wednesday in list of days', function () {
      var meeting = {
        'Wednesday': 1
      };
      var days = ['Sat'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return true if meeting is thursday and thursday in list of days', function () {
      var meeting = {
        'Thursday': 1
      };
      var days = ['Thu'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(true)
    });

    it('should return false if meeting is not thursday and thursday in list of days', function () {
      var meeting = {
        'Thursday': 2
      };
      var days = ['Thu'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return false if meeting is thursday and thursday in list of days', function () {
      var meeting = {
        'Thursday': 1
      };
      var days = ['Sat'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return true if meeting is friday and friday in list of days', function () {
      var meeting = {
        'Friday': 1
      };
      var days = ['Fri'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(true)
    });

    it('should return false if meeting is not friday and friday in list of days', function () {
      var meeting = {
        'Friday': 2
      };
      var days = ['Fri'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });

    it('should return false if meeting is friday and friday in list of days', function () {
      var meeting = {
        'Friday': 1
      };
      var days = ['Sat'];
      result = mscSchedulizer.doBlockDaysOverlap(meeting, days);

      expect(result).to.be.equal(false)
    });
  });