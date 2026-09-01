import { searchBus,getAvailableRoutes } from "./api.js";


//------------------Search form element catch-----------------//

const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const travelDate = document.getElementById("travel-date");

const searchBtn = document.getElementById("search-btn");
const searchError = document.getElementById("search-error");
const searchResult = document.getElementById("search-result");

//--------------------------POPULER ROUTES ELEMENTS------------------------------//

const popularRoutesContainer = document.getElementById("popular-routes-container");
const bookingSection = document.getElementById("booking-section");

//---------------- Popular Routes ----------------//

async function loadPopularRoutes() {

    try {

        const routes = await getAvailableRoutes();

        console.log("Popular Routes:", routes);

        if (!Array.isArray(routes) || routes.length === 0) {

            popularRoutesContainer.innerHTML = `
                <p class="no-routes">
                    No popular routes available.
                </p>
            `;

            return;
        }

        // Get unique routes
        const uniqueRoutes = [];

        routes.forEach(route => {

            const exists = uniqueRoutes.some(item =>
                item.fromLocationName === route.fromLocationName &&
                item.toLocationName === route.toLocationName
            );

            if (!exists) {
                uniqueRoutes.push(route);
            }

        });

        // Display first 3 routes
        const popularRoutes = uniqueRoutes.slice(0, 3);

        popularRoutesContainer.innerHTML =
            popularRoutes.map(route => {

                return `
                    <div class="route-card">

                        <h3>
                            ${route.fromLocationName}
                            →
                            ${route.toLocationName}
                        </h3>

                        <p>
                            <i class="fa-solid fa-bus"></i>
                            ${route.busCount} buses available
                        </p>

                        <p>
                            <i class="fa-solid fa-calendar-days"></i>
                            ${formatScheduleDate(route.scheduleDate)}
                        </p>

                        <button
                            class="view-route-btn"
                            data-from="${route.fromLocationName}"
                            data-to="${route.toLocationName}">

                            View Buses

                        </button>

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Failed to load popular routes:", error);

        popularRoutesContainer.innerHTML = `
            <p class="no-routes">
                Unable to load popular routes.
            </p>
        `;
    }
}

loadPopularRoutes();

popularRoutesContainer.addEventListener("click", (event) => {

    const button = event.target.closest(".view-route-btn");

    if (!button) {
        return;
    }

    const from = button.dataset.from;
    const to = button.dataset.to;

    fromInput.value = from;
    toInput.value = to;

    fromInput.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

//-----------------search button action--------------------//

searchBtn.addEventListener("click", async ()=>{
    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    const dateTime = travelDate.value.trim();
    const date = dateTime.split("T")[0].replaceAll("-", "/");

    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    travelDate.min = todayDate;

    //----------form validation-----------//

    if (from === "") {
        searchError.textContent = "Please enter departure city";
        fromInput.focus();
        return;
    }

    if (to === "") {
        searchError.textContent = "Please enter destination city";
        toInput.focus();
        return;
    }

    if (date === "") {
        searchError.textContent = "Please select travel date";
        travelDate.focus();
        return;
    }

    if(date < todayDate){
        searchError.textContent = "Travel date cannot be before today";
        travelDate.focus();
        return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
        searchError.textContent = "Departure and destination cannot be the same";
        return;
    }
    searchError.textContent = "";
    console.log("Validation Successfully!");

    try {

        const routes = await getAvailableRoutes();
 
        console.log("Available : ",routes);
        
        const normalizedDate = date.replaceAll("/", "-");

        console.log(normalizedDate);
        

        const matchingRoute = findMatchingRoute(routes,from,to,normalizedDate);

        console.log("Matching Route: ",matchingRoute);

        displaySearchResult(matchingRoute);
        
        
    } catch (error) {

        console.error("Search Failed : ",error);
        
    }
});

//------------------format Schedule Date---------------//

function formatScheduleDate(dateTime) {
    
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

//---------------Display Search Result---------------//

function displaySearchResult(route) {
    
    if (!route) {
            searchResult.innerHTML = `
            <p class="no-result">
                No buses available for this route and date.
            </p>
            `;
            return;
    }

    const schedule = formatScheduleDate(route.scheduleDate);

    searchResult.innerHTML = `
                <div class="search-result-card">
                    <h3>
                        ${route.fromLocationName} → ${route.toLocationName}
                    </h3>
                    
                    <p>
                        <i class="fa-solid fa-calendar-days"></i>
                        ${schedule}
                    </p>

                    <p>
                        <i class="fa-solid fa-bus"></i>
                        ${route.busCount} Bus Available
                    </p>

                   <button id="select-route-btn">
                        Select Route
                    </button>
                </div>
    `;

    const selectRouteBtn = document.getElementById("select-route-btn");

    selectRouteBtn.addEventListener("click",()=>{
        displayBookingSelection(route);
        
    })

    //console.log("Available Buses : ",buses);
}

//-----------------Load Buses----------------------//

async function loadBuses(route) {
    try {

        const travelDate = route.scheduleDate.split("T")[0].replaceAll("-","/");

         console.log("Searching buses for:", {
            from: route.fromLocationName,
            to: route.toLocationName,
            date: travelDate
        });

        const buses = await searchBus(
            route.fromLocationName,
            route.toLocationName,
            travelDate
        );

        console.log("Bus Data : ",buses);
        
        
    } catch (error) {
        console.error("Bus Search Failed : ",error);
        
    }
}

// async function testRoutes() {
//     try {
//         const routes = await getAvailableRoutes();

//         console.log("Available Routes : ",routes);
        
//     } catch (error) {
//         console.error("Failed to load routes : ",error);
        
//     }
// }

// testRoutes();


//--------------Find Matching Route--------------//


function findMatchingRoute(routes,from,to,date) {

    const normalizedDate = date.replaceAll("/", "-");

    console.log("Search from : ",from);
    console.log("Search to : ",to);
    console.log("Date : ",date);
    
    
    
    return routes.find((route)=>{

        const routeDate = route.scheduleDate.split("T")[0];

        console.log("API from : ",route.fromLocationName);
        console.log("API to : ",route.toLocationName);
        console.log("API Date : ",routeDate);
        
        return(
            route.fromLocationName.toLowerCase() === from.toLowerCase() && 
            route.toLocationName.toLowerCase() === to.toLowerCase() &&
            routeDate === date
        );

    });
}

//---------------Display Booking Selection--------------//

function displayBookingSelection(route) {
    const bookingSection = document.getElementById("booking-section");
    const selectedRoute = document.getElementById("selected-route");

    const schedule = formatScheduleDate(route.scheduleDate);

    selectedRoute.innerHTML = `
        <div class="selected-route-card">

            <h3>
                ${route.fromLocationName} → ${route.toLocationName}
            </h3>

            <div class="booking-info">

                <p>
                    <i class="fa-solid fa-calendar-days"></i>
                    ${schedule}
                </p>

                <p>
                    <i class="fa-solid fa-bus"></i>
                    ${route.busCount} Bus Available
                </p>

            </div>

            <button id="continue-booking-btn">
                Continue
            </button>

        </div>
    `;

    bookingSection.scrollIntoView({
        behavior: "smooth"
    });
}
