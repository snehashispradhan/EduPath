(function () {
  const ADMISSION_ENQUIRY_ENDPOINT = "https://script.google.com/macros/s/AKfycbzuXYdBQKrYB-3BL2_L-SCmBMEI9jUBywN4p51VcMy49y15Chfv__ZvLQRUT1GRm3PTJQ/exec";
  const BLOCKED_PATHS = ["/admin", "/login", "/dashboard", "/internal"];

  const path = window.location.pathname.toLowerCase();
  if (BLOCKED_PATHS.some(blocked => path.startsWith(blocked))) return;

  let isSubmitting = false;

  function buildPopup() {
    const shell = document.createElement("div");
    shell.className = "admission-popup";
    shell.innerHTML = `
      <button class="admission-popup-trigger" type="button">Admission Enquiry</button>
      <div class="admission-popup__overlay" data-popup-overlay hidden>
        <div class="admission-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="admission-popup-title">
          <button class="admission-popup__close" type="button" aria-label="Close admission enquiry form">&times;</button>
          <div class="admission-popup__head">
            <p class="eyebrow">Admission enquiry</p>
            <h2 id="admission-popup-title">Get Free Admission Guidance</h2>
            <p>Share your details and our admission counsellor will contact you shortly.</p>
          </div>
          <form class="admission-popup__form" novalidate>
            <label>Student Name
              <input name="studentName" autocomplete="name" maxlength="100" required>
            </label>
            <label>Mobile Number
              <input name="mobileNumber" inputmode="numeric" autocomplete="tel" maxlength="10" pattern="[6-9][0-9]{9}" required>
            </label>
            <label>Email Address
              <input name="emailAddress" type="email" autocomplete="email" maxlength="150">
            </label>
            <label>Interested Course
              <select name="interestedCourse" required>
                <option value="">Select course</option>
                <option>B.Tech</option>
                <option>MBA</option>
                <option>Nursing</option>
                <option>B.Sc</option>
                <option>BBA</option>
                <option>MCA</option>
                <option>Other</option>
              </select>
            </label>
            <label>Preferred College or Location
              <input name="preferredLocation" maxlength="150" autocomplete="off">
            </label>
            <label class="admission-popup__honeypot" aria-hidden="true">Website
              <input name="website" tabindex="-1" autocomplete="off">
            </label>
            <button class="btn btn--gold admission-popup__submit" type="submit">Request a Callback</button>
            <p class="admission-popup__message" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(shell);
    return shell;
  }

  const popup = buildPopup();
  const trigger = popup.querySelector(".admission-popup-trigger");
  const overlay = popup.querySelector("[data-popup-overlay]");
  const dialog = popup.querySelector(".admission-popup__dialog");
  const closeButton = popup.querySelector(".admission-popup__close");
  const form = popup.querySelector(".admission-popup__form");
  const submitButton = popup.querySelector(".admission-popup__submit");
  const message = popup.querySelector(".admission-popup__message");
  const firstInput = form.querySelector("input, select, textarea, button");

  function setMessage(text, type) {
    message.textContent = text || "";
    message.dataset.type = type || "";
  }

  function openPopup() {
    overlay.hidden = false;
    document.body.classList.add("admission-popup-open");
    setMessage("", "");
    setTimeout(() => firstInput.focus({ preventScroll: true }), 0);
  }

  function closePopup(remember) {
    overlay.hidden = true;
    document.body.classList.remove("admission-popup-open");
    trigger.focus({ preventScroll: true });
  }

  function validateForm() {
    const studentName = form.elements.studentName;
    const mobileNumber = form.elements.mobileNumber;
    const emailAddress = form.elements.emailAddress;
    const interestedCourse = form.elements.interestedCourse;

    studentName.setCustomValidity("");
    mobileNumber.setCustomValidity("");
    emailAddress.setCustomValidity("");
    interestedCourse.setCustomValidity("");

    if (!studentName.value.trim()) studentName.setCustomValidity("Please enter the student name.");
    if (!/^[6-9][0-9]{9}$/.test(mobileNumber.value.trim())) {
      mobileNumber.setCustomValidity("Please enter a valid 10-digit Indian mobile number.");
    }
    if (emailAddress.value.trim() && !emailAddress.validity.valid) {
      emailAddress.setCustomValidity("Please enter a valid email address.");
    }
    if (!interestedCourse.value) interestedCourse.setCustomValidity("Please select an interested course.");

    if (!form.checkValidity()) {
      form.reportValidity();
      setMessage("Please check the highlighted fields and try again.", "error");
      return false;
    }
    return true;
  }

  function getSubmissionData() {
    return {
      studentName: form.elements.studentName.value.trim(),
      mobileNumber: form.elements.mobileNumber.value.trim(),
      emailAddress: form.elements.emailAddress.value.trim(),
      interestedCourse: form.elements.interestedCourse.value,
      preferredLocation: form.elements.preferredLocation.value.trim()
    };
  }

  function validateAdmissionForm(targetForm, statusElement) {
    const studentName = targetForm.elements.studentName;
    const mobileNumber = targetForm.elements.mobileNumber;
    const emailAddress = targetForm.elements.emailAddress;
    const interestedCourse = targetForm.elements.interestedCourse;

    studentName.setCustomValidity("");
    mobileNumber.setCustomValidity("");
    emailAddress.setCustomValidity("");
    interestedCourse.setCustomValidity("");

    if (!studentName.value.trim()) studentName.setCustomValidity("Please enter the student name.");
    if (!/^[6-9][0-9]{9}$/.test(mobileNumber.value.trim())) {
      mobileNumber.setCustomValidity("Please enter a valid 10-digit Indian mobile number.");
    }
    if (emailAddress.value.trim() && !emailAddress.validity.valid) {
      emailAddress.setCustomValidity("Please enter a valid email address.");
    }
    if (!interestedCourse.value) interestedCourse.setCustomValidity("Please select an interested course.");

    if (!targetForm.checkValidity()) {
      targetForm.reportValidity();
      if (statusElement) {
        statusElement.textContent = "Please check the highlighted fields and try again.";
        statusElement.dataset.type = "error";
      }
      return false;
    }
    return true;
  }

  function getAdmissionFormData(targetForm) {
    return {
      studentName: targetForm.elements.studentName.value.trim(),
      mobileNumber: targetForm.elements.mobileNumber.value.trim(),
      emailAddress: targetForm.elements.emailAddress.value.trim(),
      interestedCourse: targetForm.elements.interestedCourse.value,
      preferredLocation: targetForm.elements.preferredLocation.value.trim()
    };
  }

  function getUrlEncodedBody(data) {
    const body = new URLSearchParams();
    Object.entries(data).forEach(([name, value]) => body.set(name, value));
    return body;
  }

  function submitWithHiddenForm(data) {
    return new Promise(resolve => {
      const id = `admission-popup-frame-${Date.now()}`;
      const iframe = document.createElement("iframe");
      iframe.name = id;
      iframe.title = "Admission enquiry submission";
      iframe.hidden = true;

      const postForm = document.createElement("form");
      postForm.hidden = true;
      postForm.method = "POST";
      postForm.action = ADMISSION_ENQUIRY_ENDPOINT;
      postForm.target = id;
      postForm.enctype = "application/x-www-form-urlencoded";

      Object.entries(data).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        postForm.appendChild(input);
      });

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        setTimeout(() => {
          iframe.remove();
          postForm.remove();
        }, 500);
        resolve();
      };

      iframe.addEventListener("load", finish, { once: true });
      try {
        document.body.append(iframe, postForm);
        postForm.submit();
        setTimeout(finish, 1800);
      } catch (error) {
        iframe.remove();
        postForm.remove();
        resolve();
      }
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    if (isSubmitting || !validateForm()) return;

    if (form.elements.website.value.trim()) {
      form.reset();
      closePopup(false);
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    setMessage("", "");

    try {
      await submitWithHiddenForm(getSubmissionData());
      form.reset();
      setMessage("Thank you! Our admission counsellor will contact you shortly.", "success");
    } catch (error) {
      setMessage("We could not submit the form right now. Please try again or contact us on WhatsApp.", "error");
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "Request a Callback";
    }
  }

  trigger.addEventListener("click", () => openPopup());
  closeButton.addEventListener("click", () => closePopup(true));
  overlay.addEventListener("click", event => {
    if (!dialog.contains(event.target)) closePopup(true);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !overlay.hidden) closePopup(true);
  });
  form.addEventListener("submit", submitForm);

  const contactForm = document.querySelector("#contact-admission-form");
  if (contactForm) {
    const contactButton = contactForm.querySelector('button[type="submit"]');
    const contactMessage = contactForm.querySelector(".contact-form__message");
    let contactSubmitting = false;

    contactForm.addEventListener("submit", async event => {
      event.preventDefault();
      if (contactSubmitting || !validateAdmissionForm(contactForm, contactMessage)) return;

      if (contactForm.elements.website.value.trim()) {
        contactForm.reset();
        return;
      }

      contactSubmitting = true;
      contactButton.disabled = true;
      contactButton.textContent = "Submitting...";
      contactMessage.textContent = "";
      contactMessage.dataset.type = "";

      try {
        await submitWithHiddenForm(getAdmissionFormData(contactForm));
        contactForm.reset();
        contactMessage.textContent = "Thank you! Our admission counsellor will contact you shortly.";
        contactMessage.dataset.type = "success";
      } catch (error) {
        contactMessage.textContent = "We could not submit the form right now. Please try again or contact us on WhatsApp.";
        contactMessage.dataset.type = "error";
      } finally {
        contactSubmitting = false;
        contactButton.disabled = false;
        contactButton.textContent = "Request a Callback";
      }
    });
  }

  openPopup();
})();
