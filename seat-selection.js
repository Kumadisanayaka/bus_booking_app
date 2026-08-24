import { getBookedSeats, getBusScheduleById } from "./api.js";

//---------------Get Schedule ID-----------------//

const params = new URLSearchParams(window.location.search);

const scheduleId = params.get("id");

console.log("Schedule ID : ", scheduleId);

//----------------Elements-----------------------//

const seatBusInfo = document.getElementById("seat-bus-info");
const seatLayout = document.getElementById("seat-layout");
const selectedSeatCount = document.getElementById("selected-seat-count");
const continueSeatBtn = document.getElementById("continue-seat-btn");

//-------------Alert model Elements-------------//

const alertModel = document.getElementById("alert-model");
const alertMessage = document.getElementById("alert-message");
const alertOkBtn = document.getElementById("alert-ok-btn");

//-----------Selected Seats---------------//

let selectedSeat = [];

//--------------------Load Seat Page----------------------//

async function loadSeatPage() {

    if (!scheduleId) {

        seatBusInfo.innerHTML = `
            <p class="no-result">
                No bus selected.
            </p>
        `;
        return;
    }

    try {

        //Get bus schedule
        const bus = await getBusScheduleById(scheduleId);

        console.log("Bus : ", bus);

        //Get Booked Seats
        const bookedSeats = await getBookedSeats(scheduleId);

        console.log("Booked Seats : ", bookedSeats);

        //Display bus info
        displayBusInfo(bus);

        generateSeats(bus.totalSeats,bookedSeats);


    } catch (error) {

        console.error("Failed to load Seat page : ", error);


    }


}

//-----------------Bus infomation Display--------------------//

function displayBusInfo(bus) {
    seatBusInfo.innerHTML = `
        <div class="seat-bus-card">
            <div>
                <h2>
                    ${bus.busName}
                </h2>
                <p>
                    <i class="fa-solid fa-bus"></i>
                    ${bus.busVehicleNo}

                </p>
            </div>

            <div>
                <strong>RS. ${bus.price}</strong>
            </div>
        </div>
    `;
}

//-------------Generate Seats--------------//

function generateSeats(totalSeats, bookedSeats) {
    
    seatLayout.innerHTML = "";

    for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
        
        const seat = document.createElement("button");

        seat.classList.add("seat");

        // check booked seat

        if(bookedSeats.includes(seatNumber)){

            seat.classList.add("booked");

            seat.disabled = true;
        }else{

            seat.classList.add("available");

            seat.addEventListener("click",()=>{
                selectSeat(seatNumber,seat);
            });
        }

        seat.innerHTML = `
            ${seatNumber}
        `;

        seatLayout.appendChild(seat);
        
    }
}

//------------Select Seat-------------//

function selectSeat(seatNumber,seatElement) {
    
    if(selectedSeat.includes(seatNumber)){

        //Remove seat

        selectedSeat = selectedSeat.filter(seat => seat !== seatNumber);

        seatElement.classList.remove("selected");

        seatElement.classList.add("available");

    }else{

        //add seat

        selectedSeat.push(seatNumber);

        seatElement.classList.remove("available");

        seatElement.classList.add("selected");

    }

    updateSelectedSeatCount();

}


//----------------Update Selected Seat Count--------------//

function updateSelectedSeatCount() {

    selectedSeatCount.textContent = selectedSeat.length;
}

//---------------Continue button action------------------//

continueSeatBtn.addEventListener("click",()=>{

    if (selectedSeat.length === 0) {
        showAlert("Please select at least one seat.");
        return;
    }

    console.log("Selected Seat : ",selectedSeat);
    console.log("Schedule Id : ",scheduleId);

});

//-------------Alert show function----------------//

function showAlert(message) {
    
    alertMessage.textContent = message;

    alertModel.classList.add("show");
}

alertOkBtn.addEventListener("click",()=>{
    alertModel.classList.remove("show");
});

loadSeatPage();





