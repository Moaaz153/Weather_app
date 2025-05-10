var forecastTaple = document.querySelector("#forecastTable");
var myInput = document.querySelector("#findInput")
var btnMenue=document.querySelector("#btnMenue")
var navMenue=document.querySelector("#navMenue")
var layer = document.querySelector("#layer")
var allLocation = [];

layer.addEventListener("click" , function(e){
        layer.classList.add('d-none')
    
})
btnMenue.addEventListener("click",function(){
    if(window.innerWidth < 1000){
        navMenue.classList.toggle("d-none")
    }
})
window.addEventListener("resize", function () {
    if (window.innerWidth >= 1000) {
        navMenue.classList.add("d-none"); 
    } 
});

var days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

navigator.geolocation.getCurrentPosition(
    function(position){
        var lat =position.coords.latitude
        var lon =position.coords.longitude
        var location = lat + "," + lon
        getTemperature(location);
    }
)
myInput.addEventListener("input", function(){
    var city = myInput.value
    if (city.length>=2){
        getTemperature(city);
    }
})
async function getTemperature(location) {
    try {
        allLocation = []
        var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=46f5782ed82d40a0ad1225701250905&q=${location}&days=3`)

        if (response.status === 200) {
            var data = await response.json()
            allLocation.push(data)
            displayTemperature()
        }
    } catch (error) {
        console.log(error)
    }
}

function displayTemperature() {
    var cartona = ""
    for (var i = 0; i < allLocation.length; i++) {
         var todayDate = new Date(allLocation[i].location.localtime);
         
        cartona += `
        <div class="col-lg-4">
            <div class="forecast-today h-100">
                <div class="date d-flex justify-content-between rounded-top-3">
                    <span>${days[todayDate.getDay()]}</span>
                    <span>${todayDate.getDate()} ${months[todayDate.getMonth()]}</span>
                </div>
                <div class="forecast-content rounded-bottom-3">
                    <div>
                        <span>${allLocation[i].location.country} ${allLocation[i].location.name}</span>
                        <p class="num-1">${allLocation[i].current.temp_c}<sup>o</sup>C</p>
                    </div>
                    <div>
                        <img src="https:${allLocation[i].current.condition.icon}" alt="weather">
                    </div>
                    <p class="custom">${allLocation[i].current.condition.text}</p>
                    <div class="forecast-content-icons d-flex justify-content-around">
                        <span><img src="images/icon-umberella.png" alt="umberella">${allLocation[i].current.wind_degree}%</span>
                        <span><img src="images/icon-wind.png" alt="wind"> ${allLocation[i].current.wind_kph} km/h</span>
                        <span><img src="images/icon-compass.png" alt="compass"> ${allLocation[i].current.wind_dir}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        var forecastDays = allLocation[i].forecast.forecastday;
        for(var j =1 ;j<forecastDays.length ; j++){
             var forecast = forecastDays[j];
             var dateObj = new Date(forecast.date);
            cartona +=`
                <div class="col-lg-4">
                    <div class="forecast-tomorrow h-100 ">
                        <div class="tomorrow-date text-center rounded-top-3">
                            <span>${days[dateObj.getDay()]}</span>
                        </div>
                        <div class="tomorrow-content text-center rounded-bottom-3">
                            <img src="https:${forecast.day.condition.icon}" alt="weather">
                            <p class="num m-0">${forecast.day.maxtemp_c}<sub>o</sub>C</p>
                            <span>${forecast.day.mintemp_c}<sub>o</sub></span>
                            <p class="custom mt-3">${forecast.day.condition.text}</p>
                        </div>
                    </div>
                </div>
            
            `
        }

    }
    forecastTaple.innerHTML = cartona
}