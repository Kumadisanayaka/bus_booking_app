let currentUser = null;

//-------------Set Logged User------------//

export function setCurrentUser(user) {

    currentUser = {
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName,
        emailId: user.emailId,
        role: user.role
    };
    
}

//------------Get Logged User-------------//

export function getCurrentUser() {
    
    return currentUser;
}

//----------Check Login------------//

export function isLoggedIn() {

    return currentUser !== null;
    
}

//---------Logout-----------//

export function logOutUser() {
    
    currentUser = null;

}

