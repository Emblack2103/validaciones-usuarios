const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const submitBtn = document.getElementById("submitBtn");

const users = [
  { email: "usuario@gmail.com", password: "usuario123", role: "user" },
  { email: "admin@gmail.com", password: "admin123", role: "admin" },
];

emailInput.addEventListener("input", checkFormValidity);
passwordInput.addEventListener("input", checkFormValidity);

submitBtn.addEventListener("click", function(event) {
  event.preventDefault(); 
  validateForm();
});

function checkFormValidity() {
  const isEmailValid = validateEmail(emailInput.value);
  const isPasswordValid = validatePassword(passwordInput.value);
  emailError.style.display = isEmailValid ? "none" : "block";
  passwordError.style.display = isPasswordValid ? "none" : "block";
  submitBtn.disabled = !(isEmailValid && isPasswordValid);
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validatePassword(password) {
  const passwordPattern = /^(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
}

function validateForm() {
  const isEmailValid = validateEmail(emailInput.value);
  const isPasswordValid = validatePassword(passwordInput.value);
  
  if (!isEmailValid) {
    emailError.style.display = "block";
    return false;
  }
  if (!isPasswordValid) {
    passwordError.style.display = "block";
    return false;
  }
  
  const user = users.find(
    (u) => u.email === emailInput.value && u.password === passwordInput.value
  );

  if (user) {
    sessionStorage.setItem("role", user.role);  
    
    if (user.role === "admin") {
      alert("Acceso de administrador exitoso");
      window.location.replace("../index.html"); 
      showAdminFeatures();
    } else {
      alert("Acceso de usuario exitoso");
      window.location.replace("../index.html"); 
      hideDataTableForUser(); 
    }
    return true;  
  } else {
    alert("Credenciales incorrectas");  
    return false;  
  }
}

function showAdminFeatures() {
  document.getElementById("dataTableLink").style.display = "block"; 
  document.getElementById("datatable-view").style.display = "block"; 
}


function hideDataTableForUser() {
  document.getElementById("dataTableLink").style.display = "none"; 
  document.getElementById("datatable-view").style.display = "none"; 
}
 