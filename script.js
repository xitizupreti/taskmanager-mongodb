document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const confirmationMessage = document.getElementById("confirmationMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    let isValid = true;

    // Clear previous error messages
    clearErrors();

    if (name === "") {
      displayError("name", "Name is required");
      isValid = false;
    }

    if (email === "") {
      displayError("email", "Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      displayError("email", "Please enter a valid email address");
      isValid = false;
    }

    if (message === "") {
      displayError("message", "Message is required");
      isValid = false;
    }

    return isValid;
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function displayError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = errorMessage;
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error");
    errorMessages.forEach(function (error) {
      error.remove();
    });
  }

  function submitForm() {
    const formData = new FormData(form);
    fetch("php/save.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          form.reset();
          form.style.display = "none";
          confirmationMessage.classList.remove("hidden");
        } else {
          alert(
            "Error: " +
              (data.error ||
                "There was an error submitting the form. Please try again.")
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error submitting the form. Please try again.");
      });
  }
});
