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
