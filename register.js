import { registerUser } from "./api.js";

//---------------Elements---------------------//

const registerForm = document.getElementById("register-form");
const fullName = document.getElementById("full-name");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const registerError = document.getElementById("register-error");

//--------------Register Form Action---------------//

registerForm.addEventListener("submit",async(event)=>{

    event.preventDefault();

    registerError.textContent = "";

    //------------Validation------------//

    if (fullName.value.trim() === "") {
        
        registerError.textContent = "Please enter your full name.";

        fullName.focus();

        return;

    }

    if(userName.value.trim() === ""){

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

});