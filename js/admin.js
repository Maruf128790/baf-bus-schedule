
// ===================================
// ADMIN PANEL
// ===================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const ADMIN_PASSWORD =
      "Maruf123";


    const adminLoginBox =
      document.getElementById(
        "adminLoginBox"
      );

    const adminPanel =
      document.getElementById(
        "adminPanel"
      );

    const adminPassword =
      document.getElementById(
        "adminPassword"
      );

    const adminLoginBtn =
      document.getElementById(
        "adminLoginBtn"
      );

    const adminLogoutBtn =
      document.getElementById(
        "adminLogoutBtn"
      );

    const adminLoginStatus =
      document.getElementById(
        "adminLoginStatus"
      );

    const adminFeedbackList =
      document.getElementById(
        "adminFeedbackList"
      );

    const clearAllFeedbackBtn =
      document.getElementById(
        "clearAllFeedbackBtn"
      );


    // ===================================
    // GET FEEDBACK
    // ===================================

    function getFeedbacks() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "busFeedbacks"
          )
        ) || [];

      } catch {

        return [];

      }

    }


    // ===================================
    // SAVE FEEDBACK
    // ===================================

    function saveFeedbacks(feedbacks) {

      localStorage.setItem(
        "busFeedbacks",
        JSON.stringify(feedbacks)
      );

    }


    // ===================================
    // RENDER FEEDBACK
    // ===================================

    function renderFeedbacks() {

      if (!adminFeedbackList) return;


      const feedbacks =
        getFeedbacks();


      if (feedbacks.length === 0) {

        adminFeedbackList.innerHTML = `
          <div class="admin-empty">
            এখনো কোনো Feedback নেই।
          </div>
        `;

        return;
      }


      adminFeedbackList.innerHTML =
        feedbacks.map((feedback) => {

          const date =
            new Date(
              feedback.createdAt
            ).toLocaleString(
              "en-GB"
            );


          return `
            <div class="admin-feedback-item">

              <div class="admin-feedback-content">

                <h4>
                  ${escapeHTML(
                    feedback.name
                  )}
                </h4>

                <p>
                  ${escapeHTML(
                    feedback.message
                  )}
                </p>

                <small>
                  ${date}
                </small>

              </div>

              <button
                type="button"
                class="delete-feedback-btn"
                data-id="${feedback.id}"
              >
                Delete
              </button>

            </div>
          `;

        }).join("");


      document
        .querySelectorAll(
          ".delete-feedback-btn"
        )
        .forEach((button) => {

          button.addEventListener(
            "click",
            () => {

              deleteFeedback(
                Number(
                  button.dataset.id
                )
              );

            }
          );

        });

    }


    // ===================================
    // DELETE ONE
    // ===================================

    function deleteFeedback(id) {

      const feedbacks =
        getFeedbacks().filter(
          (feedback) =>
            feedback.id !== id
        );


      saveFeedbacks(feedbacks);

      renderFeedbacks();

    }


    // ===================================
    // ESCAPE HTML
    // ===================================

    function escapeHTML(text) {

      const div =
        document.createElement("div");

      div.textContent = text;

      return div.innerHTML;

    }


    // ===================================
    // LOGIN
    // ===================================

    function loginAdmin() {

      if (
        adminPassword.value ===
        ADMIN_PASSWORD
      ) {

        sessionStorage.setItem(
          "busAdminLoggedIn",
          "true"
        );


        adminLoginBox.style.display =
          "none";

        adminPanel.style.display =
          "block";


        adminLoginStatus.textContent =
          "";

        adminPassword.value = "";


        renderFeedbacks();

      } else {

        adminLoginStatus.textContent =
          "❌ Incorrect password.";

      }

    }


    if (adminLoginBtn) {

      adminLoginBtn.addEventListener(
        "click",
        loginAdmin
      );

    }


    if (adminPassword) {

      adminPassword.addEventListener(
        "keydown",
        (event) => {

          if (event.key === "Enter") {

            event.preventDefault();

            loginAdmin();

          }

        }
      );

    }


    // ===================================
    // AUTO LOGIN
    // ===================================

    if (
      sessionStorage.getItem(
        "busAdminLoggedIn"
      ) === "true"
    ) {

      adminLoginBox.style.display =
        "none";

      adminPanel.style.display =
        "block";

      renderFeedbacks();

    }


    // ===================================
    // LOGOUT
    // ===================================

    if (adminLogoutBtn) {

      adminLogoutBtn.addEventListener(
        "click",
        () => {

          sessionStorage.removeItem(
            "busAdminLoggedIn"
          );


          adminPanel.style.display =
            "none";

          adminLoginBox.style.display =
            "block";

        }
      );

    }


    // ===================================
    // DELETE ALL
    // ===================================

    if (clearAllFeedbackBtn) {

      clearAllFeedbackBtn.addEventListener(
        "click",
        () => {

          const confirmed =
            confirm(
              "আপনি কি সব Feedback মুছে ফেলতে চান?"
            );


          if (!confirmed) {
            return;
          }


          localStorage.removeItem(
            "busFeedbacks"
          );


          renderFeedbacks();

        }
      );

    }

  }
);
