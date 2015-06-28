'use strict';

(function () {
  // distance to time
  var FACTOR_TIME_DISTANCE = 0.0005;

  function factorTimeDistance(last, day) {
    var diff = Math.max(0, day.diff(last, 'days'));
    var f = Math.pow(diff, 1.1);
    return Math.max(0.99, Math.min(1, FACTOR_TIME_DISTANCE * f));
  }

  // blocked for work
  var FACTOR_BLOCKED_WORK = -1000;

  function factorBlocked(blockedDays, day) {
    return blockedDays[day.format('YYYY-MM-DD')] ? FACTOR_BLOCKED_WORK : 0;
  }

  // blocked for vacation
  var FACTOR_BLOCKED_VACATION = 200;

  function factorVacation(blockedVac, day) {
    return blockedVac[day.format('YYYY-MM-DD')] ? FACTOR_BLOCKED_VACATION : 0;
  }

  // free day
  var FACTOR_FREE_DAY = 90;

  function factorFreeDay(dates, day) {
    var score = 0;
    // 2x2 free day search
    for (var i = -2; i < 2; i += 1) {
      var d = moment(day).add(i, 'days');
      if (dates[d.format('YYYY-MM-DD')]) {
        score += Math.min(FACTOR_FREE_DAY, 10 / Math.pow(Math.abs(i), 2));
      }
    }

    return score;
  }

  function recommender(spec) {
    var dates = spec.dates;
    var lastVacation = spec.lastVacation;
    var blockedWork = spec.blockedWork;
    var blockedVac = spec.blockedVac;

    // dates to set
    function datesToSet(list) {
      var days = {};
      list.forEach(function (date) {
        var d = moment(date.from);
        for (var i = 0; i < date.days; i += 1) {
          var str = d.add(1, 'days').format('YYYY-MM-DD');
          days[str] = str;
        }
      });

      return days;
    }

    function max(a) {
      var maxStartIndex = 0;
      var maxEndIndex = 0;
      var maxSum = Number.MIN_VALUE;

      var cumulativeSum = 0;
      var maxStartIndexUntilNow = 0;
      var eachArrayItem;

      for (var index = 0; index < a.length; index += 1) {
        eachArrayItem = a[index].score - 50;

        cumulativeSum += eachArrayItem;

        if (cumulativeSum > maxSum) {
          maxSum = cumulativeSum;
          maxStartIndex = maxStartIndexUntilNow;
          maxEndIndex = index;
          continue;
        }

        if (cumulativeSum < 0) {
          maxStartIndexUntilNow = index + 1;
          cumulativeSum = 0;
        }
      }

      return {
        score: maxSum + 50 * (maxEndIndex - maxStartIndex),
        diff: maxEndIndex - maxStartIndex + 1,
        start: maxStartIndex,
        end: maxEndIndex
      };
    }

    function blocks(scores) {
      var list = [];
      for (var i = 0; i < 10; i += 1) {
        var block = max(scores);
        var dates = scores.splice(block.start, block.end - block.start + 1);
        block.start = dates[0];
        block.end = dates[dates.length - 1];
        list.push(block);
      }

      return list.sort(function (a, b) {
        if (a.score > b.score) {
          return -1;
        }
        if (b.score > a.score) {
          return 1;
        }
        return 0;
      });
    }

    function scores() {
      var days = [];
      var now = moment();
      var freeDays = datesToSet(dates);
      var blockedDays = datesToSet(blockedWork);
      var vacationDays = datesToSet(blockedVac);

      for (var i = 0; i < 365; i += 1) {
        var d = moment(now).add(i, 'days');

        days.push({
          date: d.format('YYYY-MM-DD'),
          free: freeDays[d.format('YYYY-MM-DD')] ? true : false,
          score: 1
        });
      }

      // distance to time
      days.forEach(function (day) {
        day.score += factorTimeDistance(lastVacation, moment(day.date));
      });

      // blocked
      days.forEach(function (day) {
        day.score += factorBlocked(blockedDays, moment(day.date));
      });

      // vacation
      days.forEach(function (day) {
        day.score += factorVacation(vacationDays, moment(day.date));
      });

      // free days
      days.forEach(function (day) {
        day.score += factorFreeDay(freeDays, moment(day.date));
      });
      return days;
    }

    return {
      blocks: blocks,
      scores: scores
    };
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return recommender;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = recommender;
  } else {
    window.recommender = recommender;
  }
})();
