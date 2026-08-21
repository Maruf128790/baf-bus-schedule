// ===================================
// BUS SCHEDULE DATABASE
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
  // HQ - WORKING DAY
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
  // HQ - HOLIDAY
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

  const busList = buses.map((bus, index) => {

    const parts = bus.time.split(":");
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    const date = new Date();

    date.setHours(hour, minute, 0, 0);

    return {
      ...bus,
      index: index,
      date: date
    };

  });


  // একই সময়ের একাধিক বাস রাখা হবে
  busList.sort((a, b) => a.date - b.date);


  // আজকের পরবর্তী বাস
  const nextBus = busList.find((bus) => {

    return bus.date >= now;

  });


  if (nextBus) {

    return {
      ...nextBus,
      isTomorrow: false
    };

  }


  // আজ আর বাস না থাকলে আগামীকালের প্রথম বাস
  const firstBus = busList[0];

  const tomorrow = new Date(firstBus.date);

  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    ...firstBus,
    date: tomorrow,
    isTomorrow: true
  };

}
