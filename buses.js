import { getBusesSchedules } from "./api.js";

async function loadBusSchedules() {
    
    try {

        const schedules = await getBusesSchedules();

        console.log("Bus Schedules : ",schedules);
        
    } catch (error) {
        
        console.error("Failed load bus schedule : ",error);
        
    }
}

loadBusSchedules();