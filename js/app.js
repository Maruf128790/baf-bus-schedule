// ===================================
// BUS SCHEDULE FINDER - MAIN APP
// ===================================

document.addEventListener("DOMContentLoaded", () => {

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
  const departureTime = document.getElementById("departureTime");
  const allBusTimes = document.getElementById("allBusTimes");
  const busTimesInfo = document.getElementById("busTimesInfo");

  const quickSearch = document.getElementById("quickSearch");
  const quickSearchBtn = document.getElementById("quickSearchBtn");
  const suggestions = document.getElementById("suggestions");

  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackName = document.getElementById("feedbackName");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const feedbackStatus = document.getElementById("feedbackStatus");
  const feedbackSubmitBtn = document.getElementById("feedbackSubmitBtn");


  // ===================================
  // CURRENT YEAR
  // ===================================

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ===================================
  // MENU
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

    const dark = theme === "dark";

    document.body.classList.toggle(
      "dark-mode",
      dark
    );

    if (themeToggle) {
      themeToggle.textContent =
        dark
          ? "☀️ Light Mode"
          : "🌙 Dark Mode";
    }

  }


  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setTheme(savedTheme);
  }


  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const newTheme =
        document.body.classList.contains("dark-mode")
          ? "light"
          : "dark";

      setTheme(newTheme);

      localStorage.setItem(
        "theme",
        newTheme
      );

    });

  }


  // ===================================
  // MESSAGE
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
  // TIME FORMAT
  // ===================================

  function formatTime(time) {

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


  function getBusDate(bus, baseDate) {

    const [hour, minute] =
      bus.time.split(":").map(Number);

    const date = new Date(baseDate);

    date.setHours(hour, minute, 0, 0);

    return date;

  }


  // ===================================
  // SPECIAL DAY CHECK
  // ===================================

  function isAvailableOnDate(bus, date) {

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
  // TODAY'S REMAINING BUSES
  // ===================================

  function getRemainingBusesToday(buses) {

    const now = new Date();

    return buses
      .map((bus, index) => {

        if (!isAvailableOnDate(bus, now)) {
          return null;
        }

        const date = getBusDate(bus, now);

        return {
          ...bus,
          index,
          date
        };

      })
      .filter(Boolean)
      .filter((bus) => bus.date >= now)
      .sort((a, b) => a.date - b.date);

  }


  // ===================================
  // NEXT BUS INCLUDING TOMORROW
  // ===================================

  function findNextAvailableBus(buses) {

    const now = new Date();

    const todayBuses =
      getRemainingBusesToday(buses);


    if (todayBuses.length > 0) {

      return {
        ...todayBuses[0],
        isTomorrow: false
      };

    }


    // আগামী 7 দিনের মধ্যে পরবর্তী valid bus খোঁজা
    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {

      const futureDate = new Date(now);

      futureDate.setDate(
        futureDate.getDate() + dayOffset
      );

      const futureBuses = buses
        .map((bus, index) => {

          if (!isAvailableOnDate(bus, futureDate)) {
            return null;
          }

          return {
            ...bus,
            index,
            date: getBusDate(bus, futureDate)
          };

        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);


      if (futureBuses.length > 0) {

        return {
          ...futureBuses[0],
          isTomorrow: true
        };

      }

    }


    return null;

  }


  // ===================================
  // SHOW BUS TIMES
  // ===================================

  function showAllBusTimes(buses) {

    if (!allBusTimes) return;


    const remainingBuses =
      getRemainingBusesToday(buses);


    if (busTimesInfo) {

      if (remainingBuses.length > 0) {
        busTimesInfo.textContent =
          `এখন থেকে আজ রাত ১২টা পর্যন্ত ${remainingBuses.length}টি বাস`;
      } else {
        busTimesInfo.textContent =
          "আজ আর কোনো বাস নেই";
      }

    }


    if (remainingBuses.length === 0) {

      allBusTimes.innerHTML = `
        <div class="empty-bus-times">
          আজকের জন্য আর কোনো Bus Schedule নেই।
        </div>
      `;

      return;
    }


    allBusTimes.innerHTML =
      remainingBuses.map((bus, index) => {

        const note = bus.note
          ? `<small class="bus-note">${bus.note}</small>`
          : "";


        return `
          <div class="bus-time-item">
            <div>
              <span class="bus-number">
                🚌 Bus ${index + 1}
              </span>
              ${note}
            </div>

            <strong class="bus-time">
              ${formatTime(bus.time)}
            </strong>
          </div>
        `;

      }).join("");

  }


  // ===================================
  // SEARCH HISTORY
  // ===================================

  function getSearchHistory() {

    try {

      return JSON.parse(
        localStorage.getItem("busSearchHistory")
      ) || [];

    } catch {

      return [];

    }

  }


  function saveSearchHistory(from, to, day) {

    let history = getSearchHistory();


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
      savedAt: Date.now()
    });


    history = history.slice(0, 5);


    localStorage.setItem(
      "busSearchHistory",
      JSON.stringify(history)
    );

    renderSearchHistory();

  }


  function renderSearchHistory() {

    if (!historyList) return;


    const history = getSearchHistory();


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


        return `
          <button
            type="button"
            class="history-item"
            data-from="${item.from}"
            data-to="${item.to}"
            data-day="${item.day}"
          >
            <span>
              <strong>${item.from} → ${item.to}</strong>
              <small>${dayText}</small>
            </span>

            <span>🚌</span>
          </button>
        `;

      }).join("");


    document
      .querySelectorAll(".history-item")
      .forEach((item) => {

        item.addEventListener("click", () => {

          fromSelect.value =
            item.dataset.from;

          toSelect.value =
            item.dataset.to;

          daySelect.value =
            item.dataset.day;


          showMessage(
            "আগের Route নির্বাচন করা হয়েছে। এখন Search Bus চাপুন।"
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
  // FEEDBACK
  // ===================================

  function getFeedbacks() {

    try {

      return JSON.parse(
        localStorage.getItem("busFeedbacks")
      ) || [];

    } catch {

      return [];

    }

  }


  function saveFeedback(name, text) {

    const feedbacks = getFeedbacks();


    feedbacks.unshift({
      id: Date.now(),
      name: name.trim() || "Anonymous",
      message: text.trim(),
      createdAt: new Date().toISOString()
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


        const name = feedbackName.value;
        const text = feedbackMessage.value;


        if (!text.trim()) {

          feedbackStatus.textContent =
            "অনুগ্রহ করে আপনার মতামত লিখুন।";

          return;
        }


        feedbackSubmitBtn.disabled = true;

        feedbackSubmitBtn.textContent =
          "⏳ পাঠানো হচ্ছে...";


        saveFeedback(name, text);


        feedbackName.value = "";
        feedbackMessage.value = "";


        feedbackStatus.textContent =
          "✅ আপনার মতামত সফলভাবে সংরক্ষণ করা হয়েছে।";


        setTimeout(() => {

          feedbackSubmitBtn.disabled = false;

          feedbackSubmitBtn.textContent =
            "📩 মতামত পাঠান";

        }, 700);

      }
    );

  }


  // ===================================
  // MAIN SEARCH
  // ===================================

  function resetSearchButton() {

    searchBtn.disabled = false;

    searchBtn.textContent =
      "🚌 Search Bus";

  }


  function searchBus() {

    const from = fromSelect.value;
    const to = toSelect.value;
    const day = daySelect.value;


    clearMessage();


    if (!from || !to || !day) {

      resultCard.style.display = "none";

      showMessage(
        "অনুগ্রহ করে From, To এবং Day নির্বাচন করুন।"
      );

      return;
    }


    if (from === to) {

      resultCard.style.display = "none";

      showMessage(
        "From এবং To একই হতে পারবে না।"
      );

      return;
    }


    const schedule =
      findSchedule(from, to, day);


    if (!schedule) {

      resultCard.style.display = "none";

      showMessage(
        "দুঃখিত, এই রুটের কোনো Schedule পাওয়া যায়নি।"
      );

      return;
    }


    searchBtn.disabled = true;

    searchBtn.textContent =
      "⏳ Searching...";


    setTimeout(() => {

      const nextBus =
        findNextAvailableBus(
          schedule.buses
        );


      showAllBusTimes(
        schedule.buses
      );


      if (!nextBus) {

        resultCard.style.display = "none";

        showMessage(
          "কোনো Available Bus পাওয়া যায়নি।"
        );

        resetSearchButton();

        return;
      }


      routeResult.textContent =
        `${from} → ${to}`;


      if (nextBus.isTomorrow) {

        departureTime.textContent =
          `আগামীকাল ${formatTime(nextBus.time)}`;

      } else {

        departureTime.textContent =
          `আজ ${formatTime(nextBus.time)}`;

      }


      if (
        typeof startCountdown === "function"
      ) {

        startCountdown(
          nextBus.date,
          nextBus.isTomorrow
        );

      }


      saveSearchHistory(
        from,
        to,
        day
      );


      resultCard.style.display =
        "block";


      resultCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });


      resetSearchButton();

    }, 250);

  }


  searchBtn.addEventListener(
    "click",
    searchBus
  );


  // ===================================
  // QUICK SEARCH
  // ===================================

  function normalizeText(text) {

    return text
      .toUpperCase()
      .replace(/→/g, " TO ")
      .replace(/-/g, " TO ")
      .replace(/\s+/g, " ")
      .trim();

  }


  function parseRoute(text) {

    const normalized =
      normalizeText(text);


    const match = normalized.match(
      /^(HQ|BSR|AKR|RECORD|74|216)\s+TO\s+(HQ|BSR|AKR|RECORD|74|216)$/
    );


    if (!match) {
      return null;
    }


    return {
      from: match[1],
      to: match[2]
    };

  }


  function processQuickSearch() {

    const route =
      parseRoute(
        quickSearch.value
      );


    if (!route) {

      showMessage(
        "সঠিক Route লিখুন। যেমন: BSR to AKR"
      );

      return;
    }


    fromSelect.value = route.from;
    toSelect.value = route.to;


    hideSuggestions();


    showMessage(
      `Route নির্বাচন করা হয়েছে: ${route.from} → ${route.to}। এখন Day নির্বাচন করুন।`
    );

  }


  quickSearchBtn.addEventListener(
    "click",
    processQuickSearch
  );


  quickSearch.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        processQuickSearch();

      }

    }
  );


  // ===================================
  // LIVE SUGGESTIONS
  // ===================================

  function getRouteSuggestions() {

    const routes = [];


    schedules.forEach((schedule) => {

      const exists = routes.some(
        (route) => {

          return (
            route.from === schedule.from &&
            route.to === schedule.to
          );

        }
      );


      if (!exists) {

        routes.push({
          from: schedule.from,
          to: schedule.to
        });

      }

    });


    return routes;

  }


  function hideSuggestions() {

    suggestions.classList.remove("show");

    suggestions.innerHTML = "";

  }


  function showSuggestions() {

    const query =
      normalizeText(
        quickSearch.value
      );


    if (!query) {

      hideSuggestions();

      return;
    }


    const matched =
      getRouteSuggestions().filter(
        (route) => {

          const text =
            `${route.from} TO ${route.to}`;

          return (
            text.includes(query) ||
            route.from.includes(query) ||
            route.to.includes(query)
          );

        }
      );


    if (matched.length === 0) {

      suggestions.innerHTML = `
        <div class="suggestion-empty">
          কোনো Route পাওয়া যায়নি
        </div>
      `;

      suggestions.classList.add("show");

      return;
    }


    suggestions.innerHTML =
      matched.map((route) => {

        return `
          <button
            type="button"
            class="suggestion-item"
            data-from="${route.from}"
            data-to="${route.to}"
          >
            🚌 ${route.from} → ${route.to}
          </button>
        `;

      }).join("");


    suggestions.classList.add("show");


    suggestions
      .querySelectorAll(".suggestion-item")
      .forEach((item) => {

        item.addEventListener("click", () => {

          const from =
            item.dataset.from;

          const to =
            item.dataset.to;


          fromSelect.value = from;
          toSelect.value = to;

          quickSearch.value =
            `${from} to ${to}`;


          hideSuggestions();

          showMessage(
            `Route নির্বাচন করা হয়েছে: ${from} → ${to}। এখন Day নির্বাচন করুন।`
          );

        });

      });

  }


  quickSearch.addEventListener(
    "input",
    showSuggestions
  );


  quickSearch.addEventListener(
    "focus",
    showSuggestions
  );


  document.addEventListener(
    "click",
    (event) => {

      if (
        !event.target.closest(
          ".quick-search-wrapper"
        )
      ) {

        hideSuggestions();

      }

    }
  );


  // ===================================
  // INITIAL LOAD
  // ===================================

  renderSearchHistory();

});
