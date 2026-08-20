// ===================================
// SCHEDULE DATA SYSTEM
// ===================================

let scheduleDatabase = [];


// ===================================
// LOAD SCHEDULE DATA
// ===================================

async function loadSchedules() {

  try {

    const response =
      await fetch("data/schedules.json");

    if (!response.ok) {
      throw new Error(
        "Schedule data could not be loaded."
      );
    }

    const data =
      await response.json();

    scheduleDatabase =
      data.schedules || [];

    console.log(
      "Schedule database loaded."
    );

  } catch (error) {

    console.error(
      "Schedule Error:",
      error
    );

    scheduleDatabase = [];

  }

}


// ===================================
// FIND MATCHING ROUTE
// ===================================

function findSchedule(from, to, day) {

  return scheduleDatabase.find(
    (schedule) => {

      return (
        schedule.from === from &&
        schedule.to === to &&
        schedule.day === day
      );

    }
  );

}


// ===================================
// GET NEXT BUS
// ===================================

function getNextBus(times) {

  if (!times || times.length === 0) {
    return null;
  }


  const now = new Date();


  // Check today's buses first

  for (const time of times) {

    const [hours, minutes] =
      time.split(":").map(Number);

    const busTime =
      new Date();

    busTime.setHours(
      hours,
      minutes,
      0,
      0
    );


    if (busTime > now) {

      return {

        time: time,

        date: busTime,

        isTomorrow: false

      };

    }

  }


  // ===================================
  // TODAY'S ALL BUSES ARE FINISHED
  // USE TOMORROW'S FIRST BUS
  // ===================================

  const firstTime = times[0];

  const [hours, minutes] =
    firstTime.split(":").map(Number);

  const tomorrow =
    new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  tomorrow.setHours(
    hours,
    minutes,
    0,
    0
  );


  return {

    time: firstTime,

    date: tomorrow,

    isTomorrow: true

  };

}


// ===================================
// LOAD DATA
// ===================================

loadSchedules();
