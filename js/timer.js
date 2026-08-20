// ===================================
// COUNTDOWN TIMER SYSTEM
// ===================================

let countdownInterval = null;


// Start countdown to next bus

function startCountdown(targetDate) {

  // Stop previous timer first
  stopCountdown();


  const countdownElement =
    document.getElementById("countdown");

  if (!countdownElement) return;


  function updateCountdown() {

    const now = new Date();

    const difference =
      targetDate.getTime() - now.getTime();


    // Bus departure time reached

    if (difference <= 0) {

      stopCountdown();

      countdownElement.innerHTML = `
        <span>00</span>
        <b>:</b>
        <span>00</span>
        <b>:</b>
        <span>00</span>
      `;

      return;

    }


    // Calculate time

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (difference % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (difference % (1000 * 60)) /
      1000
    );


    // Add leading zero

    const formatNumber = (number) =>
      String(number).padStart(2, "0");


    // Show countdown

    countdownElement.innerHTML = `
      <span>${formatNumber(hours)}</span>
      <b>:</b>
      <span>${formatNumber(minutes)}</span>
      <b>:</b>
      <span>${formatNumber(seconds)}</span>
    `;

  }


  // Run immediately
  updateCountdown();


  // Then update every second
  countdownInterval =
    setInterval(updateCountdown, 1000);

}


// Stop countdown

function stopCountdown() {

  if (countdownInterval) {

    clearInterval(countdownInterval);

    countdownInterval = null;

  }

}
