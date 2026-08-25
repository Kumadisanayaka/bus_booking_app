import { registerUser } from "./api.js";

//---------------Elements---------------------//

const registerForm = document.getElementById("register-form");
const fullName = document.getElementById("full-name");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const registerError = document.getElementById("register-error");

//------------Alert model Elements-----------------//

const alertModel = document.getElementById("alert-model");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const alertOkBtn = document.getElementById("alert-ok-btn");

//--------------Register Form Action---------------//

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    registerError.textContent = "";

    //------------Validation------------//

    if (fullName.value.trim() === "") {

        registerError.textContent = "Please enter your full name.";

        fullName.focus();

        return;

    }

    if (userName.value.trim() === "") {

        registerError.textContent = "Please enter a username.";

        userName.focus();

        return;
    }

    if (email.value.trim() === "") {

        registerError.textContent = "Please enter your email.";

        email.focus();

        return;
    }

    if (password.value === "") {

        registerError.textContent = "Please enter a password."

        password.focus();

        return;
    }

    if (password.value !== confirmPassword.value) {

        registerError.textContent = "Password do not match."

        confirmPassword.focus();

        return;
    }


    //-------------User Data--------------//

    const userData = {
        userId: 0,
        userName: userName.value.trim(),
        emailId: email.value.trim(),
        fullName: fullName.value.trim(),
        role: "Customer",
        createdDate: new Date().toISOString(),
        password: password.value,
        projectName: "BusBooking",
        refreshToken: null,
        refreshTokenExpiryTime: null
    };

    console.log("Register Data : ", userData);

    //-------------- API Call ----------------//

    try {

        const result = await registerUser(userData);

        console.log("Register Response : ", result);

        if (!result.result) {

            showAlert("Registration Failed",result.message);

            return;
        }

        showAlert("Registration Successful","Your BUSGO account has been created successfully.");

        registerForm.reset();

        // window.location.href = "/login.html";

    } catch (error) {

        console.error("Registration Failed : ",error);

        registerError.textContent = "Something went wrong. Please try again.";
        
    }

});

function showAlert(title,message) {
    
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertModel.classList.add("show");
}

alertOkBtn.addEventListener("click",()=>{

    alertModel.classList.remove("show");

});