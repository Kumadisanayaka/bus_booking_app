import { getBusScheduleById,getBusLocationById,getBookedSeats } from "./api.js";

const selectedBus = document.getElementById("selected-bus");
const backBtn = document.getElementById("back-btn");
const continueBtn = document.getElementById("continue-btn");

//-----------------Get schedule ID--------------------//

const params = new URLSearchParams(window.location.search);

const scheduleId = params.get("id");

console.log("Schedule ID : ",scheduleId);

//----------------Load Selected Bus------------------//

async function loadSelectedBus() {
    
    if (!scheduleId) {
        selectedBus.innerHTML = `
            <p class="no-result">
                No bus selected.
            </p>
        `;

        continueBtn.disabled = true;

        return;
    }

    try {
        const bus = await getBusScheduleById(scheduleId);

        console.log("Selected Bus : ",bus);


        //------display bus details function call apear

        displaySelectedBus(bus);

    } catch (error) {

        console.error("Failed to load selected Bus : ",error);

        selectedBus.innerHTML = `
            <p class="no-result">
                No bus selected.
            </p>
        `;
        
        
    }
}

//------------Dispaly Bus--------------//

async function displaySelectedBus(bus) {

    const fromLocationName = await getBusLocationById(bus.fromLocation);
    const toLocationName = await getBusLocationById(bus.toLocation);

    selectedBus.innerHTML = "";
     
    selectedBus.innerHTML = `

        <div class="selected-bus-card">

            <div class="selected-bus-header">

                <div>

                    <h2>${bus.busName}</h2>

                    <p>
                        <i class="fa-solid fa-bus"></i>
                        ${bus.busVehicleNo}
                    </p>

                </div>

                <div class="selected-bus-price">

                    Rs. ${bus.price}

                </div>

            </div>


            <div class="selected-route">

                <div>

                    <span>From</span>

                    <strong>
                        ${fromLocationName.locationName}
                    </strong>

                </div>


                <i class="fa-solid fa-arrow-right"></i>


                <div>

                    <span>To</span>

                    <strong>
                        ${toLocationName.locationName}
                    </strong>

                </div>

            </div>


            <div class="selected-bus-times">

                <div>

                    <span>Departure</span>

                    <strong>
                        ${formatDateTime(bus.departureTime)}
                    </strong>

                </div>


                <div>

                    <span>Arrival</span>

                    <strong>
                        ${formatDateTime(bus.arrivalTime)}
                    </strong>

                </div>

            </div>


            <div class="selected-bus-info">

                <p>
                    <i class="fa-solid fa-chair"></i>

                    Total Seats:
                    ${bus.totalSeats}
                </p>

                <p>
                    <i class="fa-solid fa-calendar-days"></i>

                    ${formatDateTime(bus.scheduleDate)}
                </p>

            </div>

        </div>

    `;

}

//----------------Fomat Date---------------//

function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    return date.toLocaleString("en-GB", {

        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true

    });
}

//---------------Back Button Action--------------//

backBtn.addEventListener("click",()=>{
    
    window.location.href = "/buses.html";

});

//-----------Continue Button Action--------------//

continueBtn.addEventListener("click",async ()=>{

    window.location.href =  `/seat-selection.html?id=${scheduleId}`;
    
});


loadSelectedBus();