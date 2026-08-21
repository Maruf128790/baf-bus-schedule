// ===================================
// BUS SCHEDULE DATA
// ===================================

const schedules = [

  // ===================================
  // WORKING DAY
  // ===================================

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

  {
    from: "BSR",
    to: "74",
    day: "working",
    buses: [
      { time: "05:45" }
    ]
  },

  {
    from: "74",
    to: "AKR",
    day: "working",
    buses: [
      { time: "14:50" }
    ]
  },

  {
    from: "216",
    to: "AKR",
    day: "working",
    buses: [
      { time: "14:40" }
    ]
  },

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
// CHECK SPECIAL DAY
// ===================================

function isBusAvailableToday(bus, date) {

  if (!bus.note) {
    return true;
  }

  const note = bus.note.toLowerCase();

  if (note === "only friday") {
    return date.getDay() === 5;
  }

  if (note === "only saturday") {
    return date.getDay() === 6;
  }

  return true;

}


// ===================================
// GET NEXT BUS
// ===================================

function getNextBus(buses) {

  if (!Array.isArray(buses) || buses.length === 0) {
    return null;
  }

  const now = new Date();

  const availableBuses = buses
    .map((bus, index) => {

      if (!isBusAvailableToday(bus, now)) {
        return null;
      }

      const [hour, minute] =
        bus.time.split(":").map(Number);

      const date = new Date(now);

      date.setHours(hour, minute, 0, 0);

      return {
        ...bus,
        index,
        date
      };

    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);


  const nextBus = availableBuses.find(
    (bus) => bus.date >= now
  );


  if (nextBus) {

    return {
      ...nextBus,
      isTomorrow: false
    };

  }


  return null;

}
