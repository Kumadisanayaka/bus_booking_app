import { getBusesSchedules, getAllBusBookings, getBusBooking, deleteBusBooking } from "./api.js";
import { getCurrentUser } from "./session.js";

//--------------Elements---------------//

const bookingLoading = document.getElementById("booking-loading");
const bookingList = document.getElementById("booking-list");

//------------Show Alert window Elements------------//

const alertModel = document.getElementById("alert-model");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const alertOkBtn = document.getElementById("alert-ok-btn");

//----------Load My booking---------------//

async function loadMyBookings() {

    try {

        //---get logged-in user---//

        const currentUser = await getCurrentUser();

        console.log("Current User : ", currentUser);

        //---check Login---//

        if (!currentUser) {

            window.location.href = "/login.html";

            return;
        }

        //---Get logged user's Email---//

        const userEmail = currentUser.emailId;

        console.log("Logged user's Email : ", userEmail);

        //---Get All bus schedules---//

        const schedules = await getBusesSchedules();

        console.log("All Bus schedules : ", schedules);

        //----Get unique vendor Id's---//

        const vendorIds = [...new Set(schedules.map(schedule => schedule.vendorId))];

        console.log("Vendor IDs : ", vendorIds);

        //----Get Bookings---//

        const allBookings = [];

        for (const vendorId of vendorIds) {

            try {

                const bookings = await getAllBusBookings(vendorId);

                if (Array.isArray(bookings)) {

                    allBookings.push(...bookings);

                }

            } catch (error) {

                console.error(`Failed to load booking for vendor ${vendorId}`, error);


            }

        }

        console.log("All Bookings : ", allBookings);

        //---Filter user's booking using user Email---//

        const myBookings = allBookings.filter(booking => booking.emailId?.toLowerCase() === userEmail?.toLowerCase());

        console.log("my Bookings : ", myBookings);

        //---Get Bookings Details---//

        const completeBookings = [];

        for (const booking of myBookings) {

            try {

                const bookingDetails = await getBusBooking(booking.bookingId);

                completeBookings.push({
                    ...booking,
                    custId: bookingDetails.custId,
                    scheduleId: bookingDetails.scheduleId,
                    bookingDate: bookingDetails.bookingDate
                });

            } catch (error) {

                console.error(`Failed to load booking ${booking.bookingId}`, error);


            }

        }

        console.log("Complete Bookings : ", completeBookings);

        displayBookings(completeBookings);

    } catch (error) {

        console.error("Failed to loading my bookings...", error);

        showAlert(
            "Loading Failed",
            "Unable to load your bookings. Please try again."
        );
    } finally {
        bookingLoading.style.display = "none";
    }

}

//--------------Show Alert function-------------//

function showAlert(title, message) {

    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertModel.classList.add("show");

}

alertOkBtn.addEventListener("click", () => {

    alertModel.classList.remove("show");

});

//----------------Display Bookings----------------------//

function displayBookings(bookings) {

    //---------No Booking--------//

    if (bookings.length === 0) {

        bookingList.innerHTML = `
                <div class="no-bookings">

                <i class="fa-solid fa-ticket"></i>

                <h3>No Bookings Found</h3>

                <p>You don't have any bookings yet.</p>

            </div>
        `;

        return;

    }

    //----Display Bookings---//

    bookingList.innerHTML = bookings.map(booking => {

        const travelDate = new Date(booking.travelDate).toLocaleDateString("en-GB", {

            day: "2-digit",
            month: "short",
            year: "numeric"

        });

        const seats = booking.seatNos.map(seat => `<span class="seat">${seat}</span>`).join("");

        return `
            <div class="booking-card">

                <div class="booking-card-header">

                    <h3>
                        ${booking.busName}
                    </h3>

                    <span class="booking-id">
                        Booking #${booking.bookingId}
                    </span>

                </div>

                <div class="booking-route">

                    ${booking.fromLocation}
                    <i class="fa-solid fa-arrow-right"></i>
                     ${booking.toLocation}

                </div>

                <div class="booking-info">

                    <p>

                        <i class="fa-solid fa-calendar-days"></i>
                        ${travelDate}

                    </p>

                    <p>

                        <i class="fa-solid fa-bus"></i>
                        ${booking.busVehicleNo}

                    </p>

                    <p>

                        <i class="fa-solid fa-building"></i>
                        ${booking.vendorName}

                    </p>

                </div>

                <div class="booking-seats">

                    <strong>
                        Seats
                    </strong>

                    <div class="seat-list">
                        ${seats}
                    </div>

                </div>

                <div class="booking-actions">

                <button 
                    class="cancel-booking-btn"
                    data-booking-id="${booking.bookingId}">
                    <i class="fa-solid fa-xmark"></i>
                    Cancel Booking
                </button>

                </div>

            </div>
        `;

    }).join("");
}

bookingList.addEventListener("click", async (event) => {

    const cancelBtn = event.target.closest(".cancel-booking-btn");

    if (!cancelBtn) {
        return;
    }

    const bookingId = cancelBtn.dataset.bookingId;

    const confirmCancel = confirm(
        `Are you sure you want to cancel booking #${bookingId}?`
    );

    if (!confirmCancel) {
        return;
    }

    try {

        cancelBtn.disabled = true;
        cancelBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Cancelling...
        `;

        await deleteBusBooking(bookingId);

        showAlert(
            "Booking Cancelled",
            `Booking #${bookingId} has been cancelled successfully.`
        );

        // Reload bookings
        await loadMyBookings();

    } catch (error) {

        console.error("Failed to cancel booking:", error);

        showAlert(
            "Cancellation Failed",
            "Unable to cancel this booking. Please try again."
        );

        cancelBtn.disabled = false;

        cancelBtn.innerHTML = `
            <i class="fa-solid fa-xmark"></i>
            Cancel Booking
        `;
    }

});

loadMyBookings();