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
    const date = travelDate.value.trim();

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

        const buses = await searchBus(from,to,date);

        if (buses.length===0) {
            searchResult.innerHTML = `
            <p class="no-result">
                No buses available for this route and date.
            </p>
            `;
            return;
        }

        console.log("Available Buses : ",buses);
        
        
    } catch (error) {

        console.error("Search Failed : ",error);
        
    }
});

async function testRoutes() {
    try {
        const routes = await getAvailableRoutes();

        console.log("Available Routes : ",routes);
        
    } catch (error) {
        console.error("Failed to load routes : ",error);
        
    }
}

testRoutes();