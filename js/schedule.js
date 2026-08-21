// ===================================
// BUS SCHEDULE DATA
// ===================================

const schedules = [

  // ===================================
  // WORKING DAY
  // ===================================

  // BSR → AKR
  {
    from: "BSR",
    to: "AKR",
    day: "working",
    buses: [
      { time: "08:30" },
      { time: "14:00" },
      { time: "14:30" },
      { time: "15:00" },
      { time: "15:30" },
      { time: "19:30" },
      { time: "20:30" }
    ]
  },

  // BSR → 74
  {
    from: "BSR",
    to: "74",
    day: "working",
    buses: [
      { time: "05:45" }
    ]
  },

  // 216 → AKR
  {
    from: "216",
    to: "AKR",
    day: "working",
    buses: [
      { time: "14:40" }
    ]
  },

  // 74 → AKR
  {
    from: "74",
    to: "AKR",
    day: "working",
    buses: [
      { time: "14:50" }
    ]
  },

  // RECORD → AKR
  {
    from: "RECORD",
    to: "AKR",
    day: "working",
    buses: [
      { time: "15:00" },
      { time: "16:00" },
      { time: "17:00" }
    ]
  },

  // AKR → BSR
  {
    from: "AKR",
    to: "BSR",
    day: "working",
    buses: [
      { time: "06:00" },
      { time: "06:50" },
      { time: "07:10" },
      { time: "07:10" },
      { time: "13:15" },
      { time: "17:30" },
      { time: "20:00" },
      { time: "21:00" }
    ]
  },

  // AKR → 216
  {
    from: "AKR",
    to: "216",
    day: "working",
    buses: [
      { time: "07:10" },
      { time: "07:10" },
      { time: "07:20" }
    ]
  },


  // ===================================
  // HOLIDAY
  // ===================================

  // BSR → AKR
  {
    from: "BSR",
    to: "AKR",
    day: "holiday",
    buses: [
      { time: "05:45" },
      { time: "08:30" },
      { time: "12:30", note: "Only Friday" },
      { time: "14:00" },
      { time: "17:00" },
      { time: "19:30" },
      { time: "20:30" }
    ]
  },

  // AKR → BSR
  {
    from: "AKR",
    to: "BSR",
    day: "holiday",
    buses: [
      { time: "06:00" },
      { time: "07:30" },
      { time: "09:15", note: "Only Saturday" },
      { time: "13:15" },
      { time: "17:30" },
      { time: "20:00" },
      { time: "21:00" }
    ]
  },


  // ===================================
  // AIR HQ - WORKING DAY
  // ===================================

  // HQ → AKR
  {
    from: "HQ",
    to: "AKR",
    day: "working",
    buses: [
      { time: "07:55" },
      { time: "10:30" },
      { time: "14:00" },
      { time: "14:30" },
      { time: "20:15" }
    ]
  },

  // AKR → HQ
  {
    from: "AKR",
    to: "HQ",
    day: "working",
    buses: [
      { time: "06:45" },
      { time: "07:00" },
      { time: "07:05" },
      { time: "07:10" },
      { time: "07:15" },
      { time: "07:20" },
      { time: "08:20", note: "AAUB" },
      { time: "13:15" },
      { time: "19:45" }
    ]
  },


  // ===================================
  // AIR HQ - HOLIDAY
  // ===================================

  // HQ → AKR
  {
    from: "HQ",
    to: "AKR",
    day: "holiday",
    buses: [
      { time: "08:00" },
      { time: "13:00", note: "Only Friday" },
      { time: "14:00" },
      { time: "20:15" }
    ]
  },

  // AKR → HQ
  {
    from: "AKR",
    to: "HQ",
    day: "holiday",
    buses: [
      { time: "07:30" },
      { time: "12:30", note: "Only Friday" },
      { time: "13:15" },
      { time: "19:45" }
    ]
  }

];


// ===================================
// FIND SCHEDULE
// ===================================

function findSchedule(from, to, day) {

  return schedules.find((schedule) => {

    return (
      schedule.from === from &&
      schedule.to === to &&
      schedule.day === day
    );

  }) || null;

}


// ===================================
// GET NEXT BUS
// ===================================

function getNextBus(buses) {

  if (!Array.isArray(buses) || buses.length === 0) {
    return null;
  }


  const now = new Date();


  // একই সময়ের একাধিক বাসও এখানে আলাদা থাকবে
  const busList = buses.map((bus, index) => {

    const [hour, minute] =
      bus.time.split(":").map(Number);


    const busDate = new Date();

    busDate.setHours(
      hour,
      minute,
      0,
      0
    );


    return {
      ...bus,
      index,
      date: busDate
    };

  });


  // সময় অনুযায়ী সাজানো হবে
  // একই সময় হলে original order বজায় থাকবে
  busList.sort((a, b) => {

    const timeDifference =
      a.date - b.date;

    if (timeDifference !== 0) {
      return timeDifference;
    }

    return a.index - b.index;

  });


  // ===================================
  // FIND TODAY'S NEXT BUS
  // ===================================

  const nextBus = busList.find((bus) => {

    return bus.date >= now;

  });


  if (nextBus) {

    return {
      ...nextBus,
      isTomorrow: false
    };

  }


  // ===================================
  // NO BUS LEFT TODAY
  // RETURN TOMORROW'S FIRST BUS
  // ===================================

  const firstBus = busList[0];

  const tomorrowDate =
    new Date(firstBus.date);

  tomorrowDate.setDate(
    tomorrowDate.getDate() + 1
  );


  return {
    ...firstBus,
    date: tomorrowDate,
    isTomorrow: true
  };

}
