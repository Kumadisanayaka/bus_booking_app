import { getBusesSchedules,getAllBusBookings,getBusBooking } from "./api.js";
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

        console.log("Current User : ",currentUser);

        //---check Login---//

        if(!currentUser){
            
            window.location.href = "/login.html";

            return;
        }

        //---Get logged user's Email---//

        const userEmail = currentUser.emailId;

        console.log("Logged user's Email : ",userEmail);

        //---Get All bus schedules---//

        const schedules = await getBusesSchedules();

        console.log("All Bus schedules : ",schedules);

        //----Get unique vendor Id's---//

        const vendorIds = [...new Set(schedules.map(schedule => schedule.vendorId))];

        console.log("Vendor IDs : ",vendorIds);

        //----Get Bookings---//

        const allBookings = [];

        for (const vendorId of vendorIds) {

            try {

                const bookings = await getAllBusBookings(vendorId);

                if (Array.isArray(bookings)) {

                    allBookings.push(...bookings);
                    
                }
                
            } catch (error) {

                console.error(`Failed to load booking for vendor ${vendorId}`,error);
                
                
            }
            
        }

        console.log("All Bookings : ",allBookings);
        
        
        
        
        
        
    } catch (error) {
        
    }

}

loadMyBookings();