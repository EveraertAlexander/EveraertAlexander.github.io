let email = {},
  submitBtn,
  lblEmail,
  inputEmail;

const doubleCheckEmailAddress = function () {
  let errmsg;

  if (!isEmpty(email.input.value) && isValidEmailAddress(email.input.value)) {
    removeErrors(email);
    email.input.removeEventListener("input", doubleCheckEmailAddress);
  } else if (!isValidEmailAddress(email.input.value)) {
    if (isEmpty(email.input.value)) {
      errmsg = "This field is required";
    } else {
      errmsg = "Invalid Email Address";
    }

    addErrors(email, errmsg);
  }
};

const isValidEmailAddress = function (emailAddress) {
  // Basis manier om e-mailadres te checken.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function (fieldValue) {
  return !fieldValue || !fieldValue.length;
};

const addErrors = function (obj, errorMessage) {
  obj.field.classList.add("has-error");
  obj.errorMessage.innerHTML = `${errorMessage}`;
};

const removeErrors = function (obj) {
  obj.field.classList.remove("has-error");
  obj.errorMessage.innerHTML = null;
};

const enableListeners = () => {
  email.input.addEventListener("blur", () => {
    const text = email.input.value;
    let errmsg;
    if (!isValidEmailAddress(text)) {
      if (isEmpty(text)) {
        errmsg = "This field is required";
        addErrors(email, errmsg);
      } else {
        errmsg = "Invalid Email Address";
        addErrors(email, errmsg);
      }

      email.input.addEventListener("input", doubleCheckEmailAddress);
    }
  });

  submitBtn.addEventListener("click", (event) => {
    if (isEmpty(email.input.value)) {
      addErrors(email, "This field is required");
      email.input.addEventListener("input", doubleCheckEmailAddress);
    } else if (!isValidEmailAddress(email.input.value)) {
      addErrors(email, "Incorrect email");
      email.input.addEventListener("input", doubleCheckEmailAddress);
    } else {
      console.log(`Email: ${email.input.value}`);
    }
    event.preventDefault();
  });
};

const getDOMElements = (params) => {
  email.input = document.querySelector(".js-email-input");
  email.field = document.querySelector(".js-email-field");
  email.errorMessage = document.querySelector(".js-email-error-message");

  submitBtn = document.querySelector(".js-submit-btn");

  lblEmail = document.querySelector(".js-email-label");
  inputEmail = email.input;

  enableListeners();
};

document.addEventListener("DOMContentLoaded", function () {
  getDOMElements();
});
