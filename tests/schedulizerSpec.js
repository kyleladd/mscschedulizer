describe('mscSchedulizer', function () {

  describe('inList', function () {
    it('should return true if needle in haystack', function () {
      var needle = 5;
      var haystack = [1, 3, 5];

      result = mscSchedulizer['inList'](needle, haystack);
      expect(result).to.be.equal(true);
    });

    it('should return false if needle not in haystack', function () {
      var needle = 7;
      var haystack = [1, 3, 5];

      result = mscSchedulizer['inList'](needle, haystack);
      expect(result).to.be.equal(false);
    });
  });

  describe('padStr', function () {
    it('should pad string with leading zeros to length', function () {
      result = mscSchedulizer['padStr']('hhhhh', 10);
      expect(result).to.be.equal('00000hhhhh');
    });

    it('should return string', function () {
      result = mscSchedulizer['padStr']('hhhhh', 5);
      expect(result).to.be.equal('hhhhh');
    });
  });

  describe('professorFilter', function () {
    it('should return false', function () {
      result = mscSchedulizer['professorFilter']();
      expect(result).to.be.equal(false);
    });
  });

  describe('NotFullFilter', function () {
    it('should return true if current enrollment greater than max enrollment', function () {
      var section = {
        'CurrentEnrollment': 11,
        'MaxEnrollment': 10
      }
      result = mscSchedulizer['NotFullFilter'](section, NaN)
      expect(result).to.be.equal(true);
    });

    it('should return true if current enrollment equal to max enrollment', function () {
      var section = {
        'CurrentEnrollment': 10,
        'MaxEnrollment': 10
      }
      result = mscSchedulizer['NotFullFilter'](section, NaN)
      expect(result).to.be.equal(true);
    });

    it('should return false if current enrollment less than max enrollment', function () {
      var section = {
        'CurrentEnrollment': 9,
        'MaxEnrollment': 10
      }
      result = mscSchedulizer['NotFullFilter'](section, NaN)
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

  describe('convertIntToStrTime', function () {
    it('should return 12:00am when no time provided', function () {
      result = mscSchedulizer['convertIntToStrTime'](NaN);
      expect(result).to.be.equal('12:00am');
    });

    it('should return 11:59pm when time greater than 2359', function () {
      result = mscSchedulizer['convertIntToStrTime'](2360);
      expect(result).to.be.equal('11:59pm');
    });

    it('should return 11:58am when time less than 1159', function () {
      result = mscSchedulizer['convertIntToStrTime'](1158);
      expect(result).to.be.equal('11:58am');
    });
  });
});
