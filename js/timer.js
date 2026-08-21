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


  if (
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  // পুরোনো timer বন্ধ
  if (countdownInterval) {

    clearInterval(
      countdownInterval
    );

  }


  function updateCountdown() {

    const now = new Date();

    const difference =
      targetDate.getTime() -
      now.getTime();


    if (difference <= 0) {

      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";


      if (labelElement) {
        labelElement.textContent =
          "Bus time reached";
      }


      clearInterval(
        countdownInterval
      );

      return;
    }


    const totalSeconds =
      Math.floor(difference / 1000);


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    const seconds =
      totalSeconds % 60;


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


  updateCountdown();


  countdownInterval =
    setInterval(
      updateCountdown,
      search-icon

}
