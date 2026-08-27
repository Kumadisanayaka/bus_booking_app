const SESSION_KEY = "busgoUser";

//-------------Set Logged User------------//

export function setCurrentUser(user) {

    const currentUser = {
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName,
        emailId: user.emailId,
        role: user.role
    };

    sessionStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));
    
}

//------------Get Logged User-------------//

export function getCurrentUser() {
    
    const user = sessionStorage.getItem(SESSION_KEY);

    if (!user) {
        
        return null;
    }

    return JSON.parse(user);
}

//----------Check Login------------//

export function isLoggedIn() {

    return sessionStorage.getItem(SESSION_KEY) !== null;
    
}

//---------Logout-----------//

export function logOutUser() {
    
    sessionStorage.removeItem(SESSION_KEY);

}

