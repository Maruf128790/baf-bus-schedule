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
  const departureTime = document.getElementById("departureTime");
const allBusTimes = document.getElementById("allBusTimes");
  const quickSearch = document.getElementById("quickSearch");
  const quickSearchBtn = document.getElementById("quickSearchBtn");

  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");


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
    if (sideMenu) sideMenu.classList.add("open");
    if (menuOverlay) menuOverlay.classList.add("show");

    document.body.style.overflow = "hidden";
  }


  function closeSideMenu() {
    if (sideMenu) sideMenu.classList.remove("open");
    if (menuOverlay) menuOverlay.classList.remove("show");

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

    let history = getSearchHistory();

    // একই search থাকলে পুরোনোটা remove
    history = history.filter((item) => {

      return !(
        item.from === from &&
        item.to === to &&
        item.day === day
      );
    });


    // নতুন search শুরুতে যোগ
    history.unshift({
      from: from,
      to: to,
      day: day,
      savedAt: Date.now()
    });


    // সর্বোচ্চ 5টি
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


    historyList.innerHTML = history.map((item) => {

      const dayText =
        item.day === "working"
          ? "Working Day"
          : "Holiday";


      const savedDate =
        new Date(item.savedAt);


      const timeText =
        savedDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });


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
            fromSelect.value = item.dataset.from;
          }

          if (toSelect) {
            toSelect.value = item.dataset.to;
          }

          if (daySelect) {
            daySelect.value = item.dataset.day;
          }

          showMessage(
            "আগের Search নির্বাচন করা হয়েছে। এখন Search Bus চাপুন।"
          );

        });

      });

  }


  if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener("click", () => {

      localStorage.removeItem("busSearchHistory");

      renderSearchHistory();

      showMessage("Search History মুছে ফেলা হয়েছে।");

    });

  }
  // ===================================
  // FEEDBACK SYSTEM - LOCAL TEST
  // ===================================

  const feedbackForm =
    document.getElementById("feedbackForm");

  const feedbackName =
    document.getElementById("feedbackName");

  const feedbackMessage =
    document.getElementById("feedbackMessage");

  const feedbackStatus =
    document.getElementById("feedbackStatus");

  const feedbackSubmitBtn =
    document.getElementById("feedbackSubmitBtn");


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


        // Validation

        if (!text.trim()) {

          if (feedbackStatus) {

            feedbackStatus.textContent =
              "অনুগ্রহ করে আপনার মতামত লিখুন।";

          }

          return;

        }


        // Button loading

        if (feedbackSubmitBtn) {

          feedbackSubmitBtn.disabled =
            true;

          feedbackSubmitBtn.textContent =
            "⏳ পাঠানো হচ্ছে...";

        }


        // Save feedback

        saveFeedback(name, text);


        // Clear form

        if (feedbackName) {
          feedbackName.value = "";
        }

        if (feedbackMessage) {
          feedbackMessage.value = "";
        }


        // Success message

        if (feedbackStatus) {

          feedbackStatus.textContent =
            "✅ আপনার মতামত সফলভাবে সংরক্ষণ করা হয়েছে। ধন্যবাদ!";

        }


        // Reset button

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
// ===================================

function showAllBusTimes(buses) {

  if (!allBusTimes) return;

  if (!buses || buses.length === 0) {

    allBusTimes.innerHTML =
      "<p>কোনো Bus Schedule পাওয়া যায়নি।</p>";

    return;
  }

  allBusTimes.innerHTML =
    buses.map((bus, index) => {

      const note = bus.note
        ? ` <small>(${bus.note})</small>`
        : "";

      return `
        <div class="bus-time-item">
          <span class="bus-number">
            🚌 Bus ${index + 1}
          </span>

          <strong>
            ${formatTime(bus.time)}
          </strong>

          ${note}
        </div>
      `;

    }).join("");

}

  // ===================================
  // MAIN BUS SEARCH
  // ===================================

  function resetSearchButton() {

    if (!searchBtn) return;

    searchBtn.disabled = false;

    searchBtn.innerHTML = "🚌 Search Bus";
  }


  function searchBus() {

    if (!fromSelect || !toSelect || !daySelect) {
      showMessage("Search form পাওয়া যায়নি।");
      return;
    }


    const from = fromSelect.value;
    const to = toSelect.value;
    const day = daySelect.value;


    clearMessage();


    // Validation

    if (!from || !to || !day) {

      if (resultCard) {
        resultCard.style.display = "none";
      }

      showMessage(
        "অনুগ্রহ করে From, To এবং Day নির্বাচন করুন।"
      );

      return;
    }


    if (from === to) {

      if (resultCard) {
        resultCard.style.display = "none";
      }

      showMessage(
        "From এবং To একই হতে পারবে না।"
      );

      return;
    }


    // Schedule system ready কিনা

    if (typeof findSchedule !== "function") {

      showMessage(
        "Schedule system load হয়নি। Page refresh করে আবার চেষ্টা করুন।"
      );

      return;
    }


    // Loading button

    if (searchBtn) {
      searchBtn.disabled = true;
      searchBtn.textContent = "⏳ Searching...";
    }


    setTimeout(() => {

      // আগে schedule খুঁজবে
      const schedule =
        findSchedule(from, to, day);


      // Schedule না পেলে

      if (!schedule) {

        if (resultCard) {
          resultCard.style.display = "none";
        }

        showMessage(
          "দুঃখিত, এই রুটের কোনো Schedule পাওয়া যায়নি।"
        );

        resetSearchButton();

        return;
      }


      // Schedule পাওয়া গেলে History save করবে
      saveSearchHistory(from, to, day);


      // Next bus function check

      if (typeof getNextBus !== "function") {

        showMessage(
          "Next Bus system load হয়নি।"
        );

        resetSearchButton();

        return;
      }


      const nextBus =
        getNextBus(schedule.buses);
      

showAllBusTimes(schedule.buses);
      // কোনো সময় না থাকলে

      if (!nextBus) {

        if (resultCard) {
          resultCard.style.display = "none";
        }

        showMessage(
          "এই রুটের জন্য কোনো Bus Time পাওয়া যায়নি।"
        );

        resetSearchButton();

        return;
      }


      // ===================================
      // SHOW RESULT
      // ===================================

      if (resultCard) {
        resultCard.style.display = "block";
      }


      if (routeResult) {
        routeResult.textContent =
          `${from} → ${to}`;
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


      // ===================================
      // START COUNTDOWN
      // ===================================

      if (typeof startCountdown === "function") {

        startCountdown(nextBus.date);

      } else {

        console.error(
          "startCountdown function পাওয়া যায়নি।"
        );

      }


      // Result-এ scroll

      if (resultCard) {

        resultCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

      }


      resetSearchButton();

    }, 300);

  }


  // Search Button Event

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
    "74",
    "216"
  ];


  function processQuickSearch() {

    if (!quickSearch) return;

    const query =
      quickSearch.value
        .trim()
        .toUpperCase();


    clearMessage();


    if (!query) {

      showMessage(
        "একটি রুট লিখুন। যেমন: HQ to BSR"
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
      "কোনো পরিচিত Location পাওয়া যায়নি। যেমন: HQ to BSR"
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
  // ===================================

  const suggestions =
    document.getElementById("suggestions");


  const routeSuggestions = [
    { from: "HQ",  to: "BSR" },
    { from: "HQ",  to: "AKR" },
    { from: "HQ",  to: "74" },
    { from: "HQ",  to: "216" },

    { from: "BSR", to: "HQ" },
    { from: "AKR", to: "HQ" },
    { from: "74",  to: "HQ" },
    { from: "216", to: "HQ" }
  ];


  function hideSuggestions() {

    if (!suggestions) return;

    suggestions.classList.remove("show");
    suggestions.innerHTML = "";

  }


  function showSuggestions() {

    if (!quickSearch || !suggestions) return;


    const query =
      quickSearch.value
        .trim()
        .toUpperCase();


    if (!query) {

      hideSuggestions();
      return;

    }


    // Route text match

    const matchedRoutes =
      routeSuggestions.filter((route) => {

        const routeText =
          `${route.from} ${route.to}`;

        return (
          routeText.includes(query) ||
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

      suggestions.classList.add("show");

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


    suggestions.classList.add("show");


    // Click a suggestion

    suggestions
      .querySelectorAll(".suggestion-item")
      .forEach((item) => {

        item.addEventListener("click", () => {

          const from =
            item.dataset.from;

          const to =
            item.dataset.to;


          if (fromSelect) {
            fromSelect.value = from;
          }

          if (toSelect) {
            toSelect.value = to;
          }


          quickSearch.value =
            `${from} to ${to}`;


          hideSuggestions();


          showMessage(
            `রুট নির্বাচন করা হয়েছে: ${from} → ${to}। এখন Day নির্বাচন করুন।`
          );

        });

      });

  }


  // Show suggestions while typing

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


  // Hide when clicking outside

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
