// ===================================
// BUS SCHEDULE FINDER - MAIN APP
// ===================================

document.addEventListener("DOMContentLoaded", () => {

  // ===================================
  // GET ELEMENTS
  // ===================================

  const menuBtn = document.getElementById("menuBtn");
  const closeMenu = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const themeToggle = document.getElementById("themeToggle");
  const yearElement = document.getElementById("year");

  const fromSelect = document.getElementById("fromSelect");
  const toSelect = document.getElementById("toSelect");
  const daySelect = document.getElementById("daySelect");
  const searchBtn = document.getElementById("searchBtn");

  const resultCard = document.getElementById("resultCard");
  const message = document.getElementById("message");
  const routeResult = document.getElementById("routeResult");
  const dayResult = document.getElementById("dayResult");
  const departureTime = document.getElementById("departureTime");
  const allBusTimes = document.getElementById("allBusTimes");

  const quickSearch = document.getElementById("quickSearch");
  const quickSearchBtn = document.getElementById("quickSearchBtn");
  const suggestions = document.getElementById("suggestions");

  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackName = document.getElementById("feedbackName");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const feedbackStatus = document.getElementById("feedbackStatus");
  const feedbackSubmitBtn =
    document.getElementById("feedbackSubmitBtn");


  // ===================================
  // CURRENT YEAR
  // ===================================

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ===================================
  // MENU SYSTEM
  // ===================================

  function openMenu() {

    if (sideMenu) {
      sideMenu.classList.add("open");
    }

    if (menuOverlay) {
      menuOverlay.classList.add("show");
    }

    document.body.style.overflow = "hidden";
  }


  function closeSideMenu() {

    if (sideMenu) {
      sideMenu.classList.remove("open");
    }

    if (menuOverlay) {
      menuOverlay.classList.remove("show");
    }

    document.body.style.overflow = "";
  }


  if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
  }


  if (closeMenu) {
    closeMenu.addEventListener("click", closeSideMenu);
  }


  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeSideMenu);
  }


  document.querySelectorAll(".menu-links a").forEach((link) => {

    link.addEventListener("click", closeSideMenu);

  });


  // ===================================
  // DARK MODE
  // ===================================

  function setTheme(theme) {

    if (theme === "dark") {

      document.body.classList.add("dark-mode");

      if (themeToggle) {
        themeToggle.textContent = "☀️ Light Mode";
      }

    } else {

      document.body.classList.remove("dark-mode");

      if (themeToggle) {
        themeToggle.textContent = "🌙 Dark Mode";
      }

    }

  }


  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setTheme(savedTheme);
  }


  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const isDark =
        document.body.classList.contains("dark-mode");

      const newTheme =
        isDark ? "light" : "dark";

      setTheme(newTheme);

      localStorage.setItem("theme", newTheme);

    });

  }


  // ===================================
  // MESSAGE HELPERS
  // ===================================

  function showMessage(text) {

    if (message) {
      message.textContent = text;
    }

  }


  function clearMessage() {

    if (message) {
      message.textContent = "";
    }

  }


  // ===================================
  // FORMAT TIME
  // ===================================

  function formatTime(time) {

    if (!time) {
      return "--:--";
    }

    const [hour, minute] =
      time.split(":").map(Number);

    const date = new Date();

    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

  }


  // ===================================
  // CHECK SPECIAL BUS DAY
  // ===================================

  function isBusAvailableToday(bus) {

    if (!bus.note) {
      return true;
    }

    const note =
      bus.note.toLowerCase();

    const today =
      new Date().getDay();

    // Friday = 5
    if (note.includes("friday")) {
      return today === 5;
    }

    // Saturday = 6
    if (note.includes("saturday")) {
      return today === 6;
    }

    return true;

  }


  // ===================================
  // FILTER AVAILABLE BUSES
  // ===================================

  function getAvailableBuses(buses) {

    if (!Array.isArray(buses)) {
      return [];
    }

    return buses.filter((bus) => {

      return isBusAvailableToday(bus);

    });

  }


  // ===================================
  // SEARCH HISTORY
  // ===================================

  function getSearchHistory() {

    try {

      return JSON.parse(
        localStorage.getItem("busSearchHistory")
      ) || [];

    } catch (error) {

      return [];

    }

  }


  function saveSearchHistory(from, to, day) {

    let history =
      getSearchHistory();


    history = history.filter((item) => {

      return !(
        item.from === from &&
        item.to === to &&
        item.day === day
      );

    });


    history.unshift({

      from,
      to,
      day,

      savedAt:
        Date.now()

    });


    history =
      history.slice(0, 5);


    localStorage.setItem(
      "busSearchHistory",
      JSON.stringify(history)
    );


    renderSearchHistory();

  }


  function renderSearchHistory() {

    if (!historyList) {
      return;
    }


    const history =
      getSearchHistory();


    if (history.length === 0) {

      historyList.innerHTML = `
        <p class="empty-history">
          এখনো কোনো Route Search করা হয়নি।
        </p>
      `;

      return;

    }


    historyList.innerHTML =
      history.map((item) => {

        const dayText =
          item.day === "working"
            ? "Working Day"
            : "Holiday";


        const savedDate =
          new Date(item.savedAt);


        const timeText =
          savedDate.toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            }
          );


        return `
          <div
            class="history-item"
            data-from="${item.from}"
            data-to="${item.to}"
            data-day="${item.day}"
          >

            <div>

              <span class="history-route">
                ${item.from} → ${item.to}
              </span>

              <span class="history-day">
                ${dayText}
              </span>

            </div>

            <span class="history-time">
              ${timeText}
            </span>

          </div>
        `;

      }).join("");


    document
      .querySelectorAll(".history-item")
      .forEach((item) => {

        item.addEventListener("click", () => {

          if (fromSelect) {
            fromSelect.value =
              item.dataset.from;
          }

          if (toSelect) {
            toSelect.value =
              item.dataset.to;
          }

          if (daySelect) {
            daySelect.value =
              item.dataset.day;
          }


          showMessage(
            "আগের Search নির্বাচন করা হয়েছে। এখন Search Bus চাপুন।"
          );

        });

      });

  }


  if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener("click", () => {

      localStorage.removeItem(
        "busSearchHistory"
      );

      renderSearchHistory();

      showMessage(
        "Search History মুছে ফেলা হয়েছে।"
      );

    });

  }


  // ===================================
  // FEEDBACK SYSTEM
  // LOCAL STORAGE VERSION
  // ===================================

  function getFeedbacks() {

    try {

      return JSON.parse(
        localStorage.getItem("busFeedbacks")
      ) || [];

    } catch (error) {

      return [];

    }

  }


  function saveFeedback(name, text) {

    const feedbacks =
      getFeedbacks();


    feedbacks.unshift({

      id: Date.now(),

      name:
        name.trim() || "Anonymous",

      message:
        text.trim(),

      createdAt:
        new Date().toISOString()

    });


    localStorage.setItem(
      "busFeedbacks",
      JSON.stringify(feedbacks)
    );

  }


  if (feedbackForm) {

    feedbackForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const name =
          feedbackName
            ? feedbackName.value
            : "";


        const text =
          feedbackMessage
            ? feedbackMessage.value
            : "";


        if (!text.trim()) {

          if (feedbackStatus) {

            feedbackStatus.textContent =
              "অনুগ্রহ করে আপনার মতামত লিখুন।";

          }

          return;

        }


        if (feedbackSubmitBtn) {

          feedbackSubmitBtn.disabled =
            true;

          feedbackSubmitBtn.textContent =
            "⏳ পাঠানো হচ্ছে...";

        }


        saveFeedback(name, text);


        if (feedbackName) {
          feedbackName.value = "";
        }


        if (feedbackMessage) {
          feedbackMessage.value = "";
        }


        if (feedbackStatus) {

          feedbackStatus.textContent =
            "✅ আপনার মতামত সফলভাবে সংরক্ষণ করা হয়েছে। ধন্যবাদ!";

        }


        if (feedbackSubmitBtn) {

          setTimeout(() => {

            feedbackSubmitBtn.disabled =
              false;

            feedbackSubmitBtn.textContent =
              "📩 মতামত পাঠান";

          }, 700);

        }

      }
    );

  }


  // ===================================
  // SHOW ALL BUS TIMES
  // SAME TIME = SEPARATE BUSES
  // ===================================

  function showAllBusTimes(buses) {

    if (!allBusTimes) {
      return;
    }


    if (!Array.isArray(buses) ||
        buses.length === 0) {

      allBusTimes.innerHTML = `
        <p>
          কোনো Bus Schedule পাওয়া যায়নি।
        </p>
      `;

      return;

    }


    allBusTimes.innerHTML =
      buses.map((bus, index) => {

        const specialNote =
          bus.note
            ? `<small>${bus.note}</small>`
            : "";


        const availableToday =
          isBusAvailableToday(bus);


        const unavailableText =
          availableToday
            ? ""
            : `<small class="special-day-note">
                 আজ চলবে না
               </small>`;


        return `
          <div class="bus-time-item">

            <span class="bus-number">
              🚌 Bus ${index + 1}
            </span>

            <strong>
              ${formatTime(bus.time)}
            </strong>

            ${specialNote}

            ${unavailableText}

          </div>
        `;

      }).join("");

  }


  // ===================================
  // RESET SEARCH BUTTON
  // ===================================

  function resetSearchButton() {

    if (!searchBtn) {
      return;
    }

    searchBtn.disabled = false;

    searchBtn.innerHTML =
      "<span>🚌</span> Search Bus";

  }


  // ===================================
  // MAIN BUS SEARCH
  // ===================================

  function searchBus() {

    if (!fromSelect ||
        !toSelect ||
        !daySelect) {

      showMessage(
        "Search form পাওয়া যায়নি।"
      );

      return;

    }


    const from =
      fromSelect.value;

    const to =
      toSelect.value;

    const day =
      daySelect.value;


    clearMessage();


    // VALIDATION

    if (!from || !to || !day) {

      if (resultCard) {
        resultCard.style.display =
          "none";
      }

      showMessage(
        "অনুগ্রহ করে From, To এবং Day নির্বাচন করুন।"
      );

      return;

    }


    if (from === to) {

      if (resultCard) {
        resultCard.style.display =
          "none";
      }

      showMessage(
        "From এবং To একই হতে পারবে না।"
      );

      return;

    }


    // CHECK SCHEDULE SYSTEM

    if (typeof findSchedule !== "function") {

      showMessage(
        "Schedule system load হয়নি। Page refresh করে আবার চেষ্টা করুন।"
      );

      return;

    }


    // LOADING BUTTON

    if (searchBtn) {

      searchBtn.disabled = true;

      searchBtn.textContent =
        "⏳ Searching...";

    }


    setTimeout(() => {

      const schedule =
        findSchedule(from, to, day);


      // NO SCHEDULE

      if (!schedule) {

        if (resultCard) {
          resultCard.style.display =
            "none";
        }

        showMessage(
          "দুঃখিত, এই রুটের কোনো Schedule পাওয়া যায়নি।"
        );

        resetSearchButton();

        return;

      }


      // SAVE HISTORY

      saveSearchHistory(
        from,
        to,
        day
      );


      // SHOW ALL BUSES
      // Duplicate times remain visible

      showAllBusTimes(
        schedule.buses
      );


      // UPDATE RESULT HEADER

      if (routeResult) {

        routeResult.textContent =
          `${from} → ${to}`;

      }


      if (dayResult) {

        dayResult.textContent =
          day === "working"
            ? "Working Day"
            : "Holiday";

      }


      // GET NEXT BUS FUNCTION CHECK

      if (typeof getNextBus !== "function") {

        showMessage(
          "Next Bus system load হয়নি।"
        );

        resetSearchButton();

        return;

      }


      // FILTER SPECIAL DAY BUSES

      const availableBuses =
        getAvailableBuses(
          schedule.buses
        );


      // GET NEXT BUS

      const nextBus =
        getNextBus(
          availableBuses
        );


      if (!nextBus) {

        if (resultCard) {
          resultCard.style.display =
            "none";
        }

        showMessage(
          "আজকের জন্য কোনো Bus Time পাওয়া যায়নি।"
        );

        resetSearchButton();

        return;

      }


      // SHOW RESULT

      if (resultCard) {

        resultCard.style.display =
          "block";

      }


      if (departureTime) {

        if (nextBus.isTomorrow) {

          departureTime.textContent =
            `আগামীকাল ${formatTime(nextBus.time)}`;

        } else {

          departureTime.textContent =
            `আজ ${formatTime(nextBus.time)}`;

        }

      }


      // START COUNTDOWN

      if (typeof startCountdown === "function") {

        startCountdown(
          nextBus.date
        );

      } else {

        console.error(
          "startCountdown function পাওয়া যায়নি।"
        );

      }


      // SCROLL TO RESULT

      if (resultCard) {

        resultCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

      }


      resetSearchButton();

    }, 300);

  }


  // ===================================
  // SEARCH BUTTON EVENT
  // ===================================

  if (searchBtn) {

    searchBtn.addEventListener(
      "click",
      searchBus
    );

  }


  // ===================================
  // QUICK TEXT SEARCH
  // ===================================

  const locations = [
    "HQ",
    "BSR",
    "AKR",
    "RECORD",
    "74",
    "216"
  ];


  function normalizeQuickSearch(text) {

    return text
      .toUpperCase()
      .replace(/RECORD OFFICE/g, "RECORD")
      .replace(/REC/g, "RECORD");

  }


  function processQuickSearch() {

    if (!quickSearch) {
      return;
    }


    const query =
      normalizeQuickSearch(
        quickSearch.value.trim()
      );


    clearMessage();


    if (!query) {

      showMessage(
        "একটি রুট লিখুন। যেমন: AKR to BSR"
      );

      return;

    }


    const foundLocations =
      locations.filter((location) =>
        query.includes(location)
      );


    if (foundLocations.length >= 2) {

      if (fromSelect) {

        fromSelect.value =
          foundLocations[0];

      }


      if (toSelect) {

        toSelect.value =
          foundLocations[1];

      }


      showMessage(
        `রুট নির্বাচন করা হয়েছে: ${foundLocations[0]} → ${foundLocations[1]}। এখন Day নির্বাচন করুন।`
      );

      hideSuggestions();

      return;

    }


    if (foundLocations.length === 1) {

      if (fromSelect) {

        fromSelect.value =
          foundLocations[0];

      }


      showMessage(
        `${foundLocations[0]} নির্বাচন করা হয়েছে। এখন To এবং Day নির্বাচন করুন।`
      );

      return;

    }


    showMessage(
      "কোনো পরিচিত Location পাওয়া যায়নি। যেমন: AKR to BSR"
    );

  }


  if (quickSearchBtn) {

    quickSearchBtn.addEventListener(
      "click",
      processQuickSearch
    );

  }


  if (quickSearch) {

    quickSearch.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          processQuickSearch();

        }

      }
    );

  }


  // ===================================
  // LIVE ROUTE SUGGESTIONS
  // GENERATED FROM REAL SCHEDULE DATA
  // ===================================

  function getRouteSuggestions() {

    if (typeof schedules === "undefined" ||
        !Array.isArray(schedules)) {

      return [];

    }


    const uniqueRoutes = [];


    schedules.forEach((schedule) => {

      const alreadyExists =
        uniqueRoutes.some((route) => {

          return (
            route.from === schedule.from &&
            route.to === schedule.to
          );

        });


      if (!alreadyExists) {

        uniqueRoutes.push({

          from: schedule.from,
          to: schedule.to

        });

      }

    });


    return uniqueRoutes;

  }


  const routeSuggestions =
    getRouteSuggestions();


  function hideSuggestions() {

    if (!suggestions) {
      return;
    }

    suggestions.classList.remove(
      "show"
    );

    suggestions.innerHTML = "";

  }


  function showSuggestions() {

    if (!quickSearch ||
        !suggestions) {

      return;

    }


    const query =
      normalizeQuickSearch(
        quickSearch.value.trim()
      );


    if (!query) {

      hideSuggestions();

      return;

    }


    const matchedRoutes =
      routeSuggestions.filter((route) => {

        const routeText =
          `${route.from} TO ${route.to}`;

        const compactRoute =
          `${route.from}${route.to}`;


        return (

          routeText.includes(query) ||

          compactRoute.includes(
            query.replace(/\s/g, "")
          ) ||

          route.from.includes(query) ||

          route.to.includes(query)

        );

      });


    if (matchedRoutes.length === 0) {

      suggestions.innerHTML = `
        <div class="suggestion-empty">
          কোনো Route পাওয়া যায়নি
        </div>
      `;

      suggestions.classList.add(
        "show"
      );

      return;

    }


    suggestions.innerHTML =
      matchedRoutes.map((route) => {

        return `
          <button
            type="button"
            class="suggestion-item"
            data-from="${route.from}"
            data-to="${route.to}"
          >

            <span class="suggestion-icon">
              🚌
            </span>

            <span class="suggestion-route">
              ${route.from} → ${route.to}
            </span>

          </button>
        `;

      }).join("");


    suggestions.classList.add(
      "show"
    );


    suggestions
      .querySelectorAll(
        ".suggestion-item"
      )
      .forEach((item) => {

        item.addEventListener(
          "click",
          () => {

            const from =
              item.dataset.from;

            const to =
              item.dataset.to;


            if (fromSelect) {

              fromSelect.value =
                from;

            }


            if (toSelect) {

              toSelect.value =
                to;

            }


            if (quickSearch) {

              quickSearch.value =
                `${from} to ${to}`;

            }


            hideSuggestions();


            showMessage(
              `রুট নির্বাচন করা হয়েছে: ${from} → ${to}। এখন Day নির্বাচন করুন।`
            );

          }
        );

      });

  }


  // ===================================
  // SUGGESTIONS EVENTS
  // ===================================

  if (quickSearch) {

    quickSearch.addEventListener(
      "input",
      showSuggestions
    );


    quickSearch.addEventListener(
      "focus",
      showSuggestions
    );

  }


  // ===================================
  // HIDE SUGGESTIONS OUTSIDE
  // ===================================

  document.addEventListener(
    "click",
    (event) => {

      if (!event.target.closest(
        ".quick-search-wrapper"
      )) {

        hideSuggestions();

      }

    }
  );


  // ===================================
  // INITIAL LOAD
  // ===================================

  renderSearchHistory();

});
