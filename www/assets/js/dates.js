// https://feiertage-api.de/api/?jahr=2019&nur_daten

const dates_public_holidays_2020 = [
  "2020-01-01",
  "2020-01-06",
  "2020-03-08",
  "2020-04-09",
  "2020-04-10",
  "2020-04-12",
  "2020-04-13",
  "2020-05-01",
  "2020-05-21",
  "2020-05-31",
  "2020-06-01",
  "2020-06-11",
  "2020-08-08",
  "2020-08-15",
  "2020-09-20",
  "2020-10-03",
  "2020-10-31",
  "2020-11-01",
  "2020-11-18",
  "2020-12-25",
  "2020-12-26"
]
const dates_public_holidays_2019 = [
  "2019-01-01",
  "2019-01-06",
  "2019-03-08",
  "2019-04-18",
  "2019-04-19",
  "2019-04-21",
  "2019-04-22",
  "2019-05-01",
  "2019-05-30",
  "2019-06-09",
  "2019-06-10",
  "2019-06-20",
  "2019-08-08",
  "2019-08-15",
  "2019-09-20",
  "2019-10-03",
  "2019-10-31",
  "2019-11-01",
  "2019-11-20",
  "2019-12-25",
  "2019-12-26"
]

// https://ferien-api.de/api/v1/holidays/BE/2019

const school_holidays_berlin_2019 = [
  {
    start: "2019-02-04T00:00",
    end: "2019-02-10T00:00",
    year: 2019,
    stateCode: "BE",
    name: "winterferien",
    slug: "winterferien-2019-BE"
  },
  {
    start: "2019-04-15T00:00",
    end: "2019-04-27T00:00",
    year: 2019,
    stateCode: "BE",
    name: "osterferien",
    slug: "osterferien-2019-BE"
  },
  {
    start: "2019-06-20T00:00",
    end: "2019-08-03T00:00",
    year: 2019,
    stateCode: "BE",
    name: "sommerferien",
    slug: "sommerferien-2019-BE"
  },
  {
    start: "2019-10-04T00:00",
    end: "2019-10-05T00:00",
    year: 2019,
    stateCode: "BE",
    name: "herbstferien",
    slug: "herbstferien-2019-BE"
  },
  {
    start: "2019-12-23T00:00",
    end: "2020-01-01T00:00",
    year: 2019,
    stateCode: "BE",
    name: "weihnachtsferien",
    slug: "weihnachtsferien-2019-BE"
  }
]

// https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}

/* 
Transform function for the recommender!
Format that the recommender expects is:
  {
    "from": "2015-01-01",
    "to": "2015-01-01",
    "days": 1
  },

*/
const getDates = () => {
  const formated_dates_public_holidays_2019 = dates_public_holidays_2019.map(
    (date_as_string) => {
      return {
        'from': date_as_string,
        'to': date_as_string,
        'days': 1
      }
    }
  );

  const formated_school_holidays_berlin_2019 = school_holidays_berlin_2019.map(({ start, end }) => {
    const formated_start_date = start.slice(0, 10); // Cut time definition out of the raw values
    const formated_end_date = end.slice(0, 10); // Cut time definition out of the raw values

    // https://momentjs.com/docs/#/durations/as/
    const total_vacation_days = moment.duration(moment(formated_end_date).diff(formated_start_date)).as('days');

    const start_date = moment(formated_start_date);

    // Create an entry for every day of this range without weekends
    const flattenHolidaysWithoutweekends = [];
    for (let i = 0; i < total_vacation_days; i++) {
      const current_date = start_date.clone().add(i, 'd');
      const current_date_weekday = current_date.day();

      // Filter 0 SUNDAY && 6 SATURDAY
      if (current_date_weekday > 0 && current_date_weekday < 6) {
        flattenHolidaysWithoutweekends.push(
          {
            'from': current_date.format('YYYY-MM-DD'),
            'to': current_date.format('YYYY-MM-DD'),
            'days': 1
          }
        )
      }
    }

    return [...flattenHolidaysWithoutweekends]
  }).flat(1)

  const merged_dates = [
    ...formated_dates_public_holidays_2019,
    ...formated_school_holidays_berlin_2019
  ]

  return removeDuplicates(merged_dates, 'from');
}

var dates = getDates();
