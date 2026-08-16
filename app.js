import { searchBus,getAvailableRoutes } from "./api.js";


//------------------Search form element catch-----------------//

const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const travelDate = document.getElementById("travel-date");

const searchBtn = document.getElementById("search-btn");
const searchError = document.getElementById("search-error");
const searchResult = document.getElementById("search-result");

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

                   <button id="view-buses-btn">
                        View Buses
                    </button>
                </div>
    `;

    const viewBusesBtn = document.getElementById("view-buses-btn");

    viewBusesBtn.addEventListener("click",()=>{
        loadBuses(route);
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

