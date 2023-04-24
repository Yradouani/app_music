let tabs = document.querySelectorAll(".home_tab_link:not(.desactive)");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    unSelectAll();
    tab.classList.add("active");
    let ref = tab.getAttribute("data-ref");
    document
      .querySelector(`.tab-body[data-id="${ref}"]`)
      .classList.add("active");
  });
});

function unSelectAll() {
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  let tabbodies = document.querySelectorAll(".tab-body");
  tabbodies.forEach((tab) => {
    tab.classList.remove("active");
  });
}
document.querySelector(".home_tab_link.active").click();

// toggle show / hide
document.addEventListener("DOMContentLoaded", function() {
  const togglePasswords = document.querySelectorAll(".toggle-password");
  
  togglePasswords.forEach(function(togglePassword) {
    const password = togglePassword.parentNode.querySelector(".input[name='password']");
    const showPassword = togglePassword.querySelector(".show-password");
    const hidePassword = togglePassword.querySelector(".hide-password");

    hidePassword.style.display = "none";

    togglePassword.addEventListener("click", function() {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      showPassword.style.display = type === "password" ? "block" : "none";
      hidePassword.style.display = type === "password" ? "none" : "block";
    });
  });
});




