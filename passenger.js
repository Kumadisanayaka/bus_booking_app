import { getBusScheduleById,postBusBooking } from "./api.js";
import { getCurrentUser } from "./session.js";

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

async function loadPassengerPage() {
    
    if (!scheduleId || selectedSeats.length === 0) {
        
        showAlert("No Seat Selected","Please select at least one seat first.");

        continuePassengerBtn.disabled = true;

        return;

    }



    //------------Get Selected Bus--------------//

    try {

        const bus = await getBusScheduleById(scheduleId);

        console.log("Bus : ",bus)

        displayBusInfo(bus);

        generatePassengerForms(selectedSeats);
        
    } catch (error) {

        console.error("Failed to load passenger page : ",error);

        showAlert("Error","Failed to load passenger details.");
    }
}

//----------Display Bus Information------------//

function displayBusInfo(bus) {
    
    passengerBusInfo.innerHTML = `
        <div class="passenger-bus-card">

            <div>

                <h2>
                    ${bus.busName}
                </h2>

                <p>
                    <i class="fa-solid fa-bus"></i>

                    ${bus.busVehicleNo}

                </p>

            </div>

            <div class="passenger-bus-price">

            RS.  ${bus.price}
                
            </div>

        </div>

    `;
}

//------------Genarate Passenger Form-----------------//

function generatePassengerForms(seats) {

    passengerList.innerHTML = "";

    seats.forEach((seatNumber,index) => {

        const passengerCard = document.createElement("div");

        passengerCard.classList.add("passenger-card");

        passengerCard.innerHTML = `
            <div class="passenger-card-header">

                    <h3>
                        Passenger ${index + 1}
                    </h3>

                    <span class="passenger-seat">
                        Seat ${seatNumber}
                    </span>

                </div>

                <div class="passenger-form">

                    <div class="passenger-input-group">

                        <label>Passenger Name</label>

                        <input type="text" class="passenger-name" placeholder="Enter passenger name" data-seat="${seatNumber}" >

                    </div>

                    <div class="passenger-input-group">

                        <label>Age</label>

                        <input type="number" class="passenger-age" placeholder="Age" min="1" max="120" data-seat="${seatNumber}">

                    </div>

                    <div class="passenger-input-group">

                        <label>Gender</label>

                        <select class="passenger-gender" data-seat="${seatNumber}">

                            <option value="">
                                Select 
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                        </select>

                    </div>

                </div>

        
        `;

        passengerList.appendChild(passengerCard);
        
    });
    
}

//---------------Get Passenger Data---------------//

function getPassengerData() {

    const passengerCards = document.querySelectorAll(".passenger-card");

    const passengers = [];

    passengerCards.forEach(card => {
        const name = card.querySelector(".passenger-name").value.trim();
        const age = Number(card.querySelector(".passenger-age").value);
        const gender = card.querySelector(".passenger-gender").value;
        const seatNo = Number(card.querySelector(".passenger-seat").textContent.replace("Seat","").trim());

        passengers.push({
            passengerName : name,
            age : age,
            gender : gender,
            seatNo : seatNo
        });

    });

    return passengers;
    
}

//------------------Validate Passengers Data----------------//

function validatePassengers(passengers) {
    
    for (let passenger of passengers) {

        if (!passenger.passengerName) {

            showAlert(
                "Missing Name",
                `Please enter the name for seat ${passenger.seatNo}.`
            );

            return false;
            
        }

        if (!passenger.age || passenger.age < 1) {

            showAlert(
                "Invalid Age",
                `Please enter a valid age for Seat ${passenger.seatNo}.`
            );

            return false;
            
        }

        if (!passenger.gender) {
            
            showAlert(
                "Missing gender",
                `Please select gender for seat ${passenger.seatNo}.`
            );

            return false;
        }
        
    }

    return true;
}

//--------------------Continue Button-----------------------//

continuePassengerBtn.addEventListener("click", ()=>{

    const passengers = getPassengerData();

    console.log("Passenger Data : ",passengers);

    if (!validatePassengers(passengers)) {

        return;
        
    }

    console.log("schedule Id : ",scheduleId);
    console.log("Selected Seats : ",selectedSeats);
    console.log("Passengers : ",passengers);

    showAlert(
        "Details Completed",
        "Passenger details are ready."
    );
    
});

//--------------Back Button Action---------------//

backPassengerBtn.addEventListener("click",()=>{

    window.history.back();

});

//-----------Show Alert------------//

function showAlert(title,message) {
    
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertModel.classList.add("show");
}

loadPassengerPage();