const BASE_URL = "https://api.freeprojectapi.com/api";

//------------------search bus-------------------------//

export async function searchBus(from,to,date) {
    
    const url = `${BASE_URL}/BusBooking/searchBus?fromLocation=${from}&toLocation=${to}&travelDate=${date}`;
    
    console.log("API URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API Error : ${response.status}`);
        
    }
    const data = await response.json();

    return data;
}

//-------------Get Available Routes---------------//

export async function getAvailableRoutes() {
    
    const url = `${BASE_URL}/BusBooking/GetAvailableRoutes`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API Error : ${response.status}`);
    }

    const data = await response.json();

    return data;
}

//--------------Get Buses Schedules----------------//

export async function getBusesSchedules() {

    const url = `${BASE_URL}/BusBooking/GetBusSchedules`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API Error : ${response.status}`);
        
    }

    const data = await response.json();

    return data;
    
}

//-------------Get Bus schedule by ID--------------//

export async function getBusScheduleById(id) {

    const url = `${BASE_URL}/BusBooking/GetBusScheduleById?id=${id}`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`API Error : ${response.status}`);
        
    }

    const data = await response.json();

    return data;
    
}

//-------------------Get Booked Seats----------------------//

export async function getBookedSeats(id) {
    
    const url = `${BASE_URL}/BusBooking/getBookedSeats?shceduleId=${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API Error : ${response.status}`);
        
    }

    const data = await response.json();

    return data;
}

//--------------Get Bus Location By Id-------------------//

export async function getBusLocationById(locationId) {
    
    const url = `${BASE_URL}/BusBooking/GetBusLocationById?id=${locationId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API Error : ${response.status}`);
        
    }

    const data = await response.json();

    return data;
}

//----------------Add New User------------------//

export async function registerUser(userData) {
    
    const url = `${BASE_URL}/BusBooking/AddNewUser`;

    const response = await fetch(url,{

        method : "POST",

        headers : {
            "Content-Type" : "application/json"
        },

        body : JSON.stringify(userData)

    });

    if(!response.ok){

        throw new Error(`API Error : ${response.status}`);
        
    }

    return await response.json();

}

//-------------------User Login--------------------//

export async function loginUser(userName, password) {

    const url = `${BASE_URL}/BusBooking/login`;

    const response = await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            userName: userName,
            password: password
        })

    });

    if (!response.ok) {
        throw new Error(`API Error : ${response.status}`);
    }

    const data = await response.json();

    return data;
}

