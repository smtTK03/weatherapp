let weatherData;
const detailsElement=document.querySelector(".details");
const API_KEY="a9b0e371be4ccd956dc09fac31c03d0a";
const cityInput=document.querySelector(".city-input");
const searchButton=document.querySelector(".search-button");
const locationButton=document.querySelector(".location-button");
const iconElement=document.querySelector(".icon");

const showPosition =position=>{
  reverseGeoCodingUrl=`http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}`
  fetch(reverseGeoCodingUrl)
  .then(response=>response.json())
  .then(data=>{
    getWheatherForecast(position.coords.longitude,position.coords.latitude,data[0].name)
  })

  
}
  const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Could not get current location.Geolocation is not supported by this browser.");
  }
}


const updateScreen = (weatherData,localCityName) =>{
  var myDate = new Date(Number(weatherData.dt)*1000)
  let time=(myDate.toLocaleString()).split(" ")[0]
  let convertedTemp=Number(weatherData.main.temp)-272.15
  convertedTemp=convertedTemp.toFixed(2)
  let convertedWind=Number(weatherData.wind.speed)*3.6
  convertedWind=convertedWind.toFixed(2)
  //console.log(weatherData) 
  detailsElement.innerHTML=`
  <h2>${localCityName} - ${weatherData.sys.country} - ${time}</h2>
  <h4>Sıcaklık: ${convertedTemp} &deg;C</h4>
  <h4>Rüzgar: ${convertedWind} Km/h</h4>
  <h4>Nem: ${weatherData.main.humidity}%</h4>
  `
  iconElement.innerHTML=`
  <img src="https://openweathermap.org/img/wn/${(weatherData.weather)[0].icon}@4x.png" alt="icon">
  <h6>${(weatherData.weather)[0].description}</h4>
  `
}


const getWheatherForecast=(lon,lat,localCityName)=>{
  weatherUrl=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  fetch(weatherUrl)
  .then(response => response.json())
  .then(data => {
    updateScreen(data,localCityName)
  })
  .catch(()=>alert("an error occured while fetching with openweather.com"))
}



const getCityCoordinates =()=>{
  const cityName=cityInput.value.trim();
  if(!cityName) return;
  cityInput.value="";
  coordinatesUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  fetch(coordinatesUrl)
  .then(response => response.json())
  .then(data =>{
    //console.log(data)
    lat=data[0]["lat"]
    lon=data[0]["lon"] 
    if(data[0].local_names.tr)
      localName=data[0].local_names.tr
    else
      localName=data[0].name
    getWheatherForecast(lon,lat,localName)
    })
  .catch(()=> alert("Konum bulunamadı"))

}
 
window.onkeydown= (event)=>{
  if (event.keyCode==13){
    getCityCoordinates()
  }
} 
locationButton.addEventListener("click",getLocation);
searchButton.addEventListener("click",getCityCoordinates);
