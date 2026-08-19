import { getBusesSchedules } from "./api.js";

const busList = document.getElementById("bus-list");

async function loadBusSchedules() {

    try {

        const schedules = await getBusesSchedules();

        console.log("Bus Schedules : ", schedules);

        displayBusSchedules(schedules);

    } catch (error) {

        console.error("Failed load bus schedule : ", error);

        busList.innerHTML = `
            <p class="no-result">
                Failed to load bus schedules.
            </p>
        `;

    }
}

//-----------------Display Bus Schedules---------------------//

function displayBusSchedules(schedules) {

    if (schedules.length === 0) {
        busList.innerHTML = `
            <p class="no-result">
                Failed to load bus schedules.
            </p>
        `;
        return;
    }

    busList.innerHTML = "";

    schedules.forEach((bus) => {

        const card = document.createElement("div");

        card.classList.add("bus-card");

        card.innerHTML = `
            
            <div class="bus-card-header">

                <div>
                    <h3>${bus.busName}</h3>

                    <p>
                        <i class="fa-solid fa-bus"></i>
                        ${bus.busVehicleNo}
                    </p>
                </div>

                <div class="bus-price">
                    Rs. ${bus.price}
                </div>

            </div>


            <div class="bus-route">

                <div>
                    <span>From</span>
                    <strong>${bus.fromLocationName}</strong>
                </div>

                <i class="fa-solid fa-arrow-right"></i>

                <div>
                    <span>To</span>
                    <strong>${bus.toLocationName}</strong>
                </div>

            </div>


            <div class="bus-time">

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


            <div class="bus-card-footer">

                <div>
                    <i class="fa-solid fa-user"></i>
                    ${bus.vendorName}
                </div>

                <div>
                    <i class="fa-solid fa-chair"></i>
                    ${bus.availableSeats} / ${bus.totalSeats} seats
                </div>

                <button class="select-bus-btn" data-id="${bus.scheduleId}">
                    Select Bus
                </button>

            </div>

        `;

        busList.appendChild(card);

    });

    const selectButtons = document.querySelectorAll(".select-bus-btn");

    selectButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const scheduleId = button.dataset.id;

            console.log("Selected Schedule ID:", scheduleId);

            window.location.href = `/booking.html?id=${scheduleId}`;

        });

    });
}

//---------------- Format Date Time ----------------//

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

loadBusSchedules();

