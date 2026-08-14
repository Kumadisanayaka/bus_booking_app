const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const travelDate = document.getElementById("travel-date");

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click",()=>{
    const from = fromInput.value;
    const to = toInput.value;
    const date = travelDate.value;

    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Date: ${date}`);
    
});