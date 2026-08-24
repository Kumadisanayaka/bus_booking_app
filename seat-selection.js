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

loadSeatPage();





