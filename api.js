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