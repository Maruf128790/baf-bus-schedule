// ===================================
// BUS COUNTDOWN TIMER
// ===================================

let countdownInterval = null;


// ===================================
// START COUNTDOWN
// ===================================

function startCountdown(targetDate) {

  const hoursElement =
    document.getElementById("countdownHours");

  const minutesElement =
    document.getElementById("countdownMinutes");

  const secondsElement =
    document.getElementById("countdownSeconds");

  const labelElement =
    document.getElementById("countdownLabel");


  // Countdown elements না থাকলে stop
  if (
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  // আগের timer বন্ধ
  if (countdownInterval) {

    clearInterval(countdownInterval);

    countdownInterval = null;

  }


  function updateCountdown() {

    const now = new Date();

    const difference =
      targetDate.getTime() -
      now.getTime();


    // Bus time চলে এলে
    if (difference <= 0) {

      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";


      if (labelElement) {

        labelElement.textContent =
          "Bus time reached";

      }


      clearInterval(countdownInterval);

      countdownInterval = null;

      return;
    }


    // মোট seconds
    const totalSeconds =
      Math.floor(difference / 1000);


    // Hours
    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    // Minutes
    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    // Seconds
    const seconds =
      totalSeconds % 60;


    // Display
    hoursElement.textContent =
      String(hours).padStart(2, "0");


    minutesElement.textContent =
      String(minutes).padStart(2, "0");


    secondsElement.textContent =
      String(seconds).padStart(2, "0");


    if (labelElement) {

      labelElement.textContent =
        "Bus leaves in";

    }

  }


  // সঙ্গে সঙ্গে একবার চালাবে
  updateCountdown();


  // প্রতি 1 second পরপর update
  countdownInterval =
    setInterval(
      updateCountdown,
      1000
    );

}
