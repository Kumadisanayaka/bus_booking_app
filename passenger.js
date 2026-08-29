import { getBusScheduleById } from "./api.js";

//----------Get Seat selection page true Parametes----------//

const params = new URLSearchParams(window.location.search);

const scheduleId = params.get("id");
const seats = params.get("seats");

//-------------Convert seats--------------//

const selectedSeats = seats ? seats.split(",").map(Number) : [];

console.log("scheduleId : ",scheduleId);
console.log("Selected Seats : ",selectedSeats);

//--------------Get Elements--------------//

const passengerBusInfo = document.getElementById("passenger-bus-info");
const passengerList = document.getElementById("passenger-list");
const backPassengerBtn = document.getElementById("back-passenger-btn");
const continuePassengerBtn = document.getElementById("continue-passenger-btn");
        
//-----------Alert Box Element------------//

const alertModel = document.getElementById("alert-model");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const alertOkBtn = document.getElementById("alert-ok-btn");

//--------------Load Passenger Page---------------//


