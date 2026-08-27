import { loginUser } from "./api.js";
import { setCurrentUser } from "./session.js";

//---------------------Elements----------------------//

const loginForm = document.getElementById("login-form");
const userName = document.getElementById("username");
const password = document.getElementById("password");
const loginError = document.getElementById("login-error");

//-------------------Login success alert window Elements------------------//

const alertModel = document.getElementById("alert-model");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const alertOkBtn = document.getElementById("alert-ok-btn");

//--------------Login Form Action----------------//

loginForm.addEventListener("submit",async(event)=>{

    event.preventDefault();

    loginError.textContent = "";

    //--------------Validation--------------//

    if (userName.value.trim() === "") {
        
        loginError.textContent = "Please enter your username.";

        userName.focus();

        return;
    }

    if (password.value.trim() === "") {
        
        loginError.textContent = "Please enter your password.";

        password.focus();

        return;
    }

    try {

        const result = await loginUser(userName.value.trim(),password.value.trim());

        console.log("Login Response : ",result);

        if (!result.result) {
            
            showAlert("Login Failed",result.message || "Invalid username or password.",false);

        }

        const user = result.data;

        setCurrentUser(user);

        console.log("Logged User : ",user);
        

        showAlert("Login Successful",`Welcom ${user.fullName}`,true);
        
        
    } catch (error) {

        console.error("Login Failed : ",error);

        showAlert("Login Failed","Something went wrong. Please try again.",false);
        
    }
    

});
//--------------Show Alert function-------------//
let loginSuccess = false;

function showAlert(title,message,success) {
    
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    loginSuccess = success;

    alertModel.classList.add("show");

}

alertOkBtn.addEventListener("click",()=>{

    alertModel.classList.remove("show");

    if(loginSuccess){
        window.location.href = "/index.html";
    }

});