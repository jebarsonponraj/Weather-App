
const locationText = document.querySelector(".location-text");
const weatherImage = document.querySelector(".weather-img");
const weatherDegree = document.querySelector(".weather-degree");
const weatherDescription = document.querySelector(".weather-description");
const windText = document.querySelector(".wind-text");
const rainText = document.querySelector(".rain-text");
const days = document.querySelectorAll(".day");
const hourlyTime = document.querySelectorAll(".hourly-time");
const hourlyDegree = document.querySelectorAll(".hourly-degree");
const weatherImg = document.querySelector(".weather-img");
const cloudImgs = document.querySelectorAll(".cloud-img");
const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clear = document.querySelector(".clear");

const searchInput = document.querySelector(".search-input");
const btn = document.querySelector(".submit-btn");








clear.addEventListener("click",function(){
    document.querySelector(".search-input").value = "";
    search.classList.toggle("active");
    clear.classList.toggle("active");
})

const day1 = document.querySelector(".day-1");
const day2 = document.querySelector(".day-2");
const day3 = document.querySelector(".day-3");

const apiKey = "c7df52cb38394593a2c91554222406";
let apiLink = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=london&days=3&aqi=no&alerts=no`;        

let dateArr = [ ];
let hourArr = [ ];
let tempArr = [ ];
let fiveHourTemp = [ ];
let fiveHourArr = [ ];
let currentImgArr = [ ];
let fiveImgArr = [];
let sortedImgArr = [];


const emptyArrays = function(){
        tempArr = [ ];
        fiveHourTemp = [ ];
        fiveHourArr = [ ];
        currentImgArr = [ ];
        fiveImgArr = [];
        sortedImgArr = [];
}

const generateDay = function(date){
    const d = new Date(`${date}`);
    // console.log(d);
    const comingDays = `${d.toString().split(' ')[0]}, ${d.toString().split(' ')[2]} ${d.toString().split(' ')[1]}`
    dateArr.push(comingDays);
}

// const now = new Date();
// const currentTime = now.toString().split(' ')[4].slice(0,2);
// console.log(currentTime);


const renderHtml = function(data){
        locationText.textContent = data.location.name;
        weatherDegree.innerHTML = `${data.current.temp_c} &deg`;
        weatherDescription.textContent = data.current.condition.text;
        windText.textContent = `${data.current.wind_kph} km/h`;
        rainText.textContent = `${data.current.precip_in} %`;
        // console.log(weatherImg.src);
        // console.log(data.current.is_day);
        if(data.current.is_day === 0){
            weatherImg.src = `/assets/images/Weather_Icons/moon/${data.current.condition.text}.png`;
        }
        else{
            weatherImg.src = `/assets/images/Weather_Icons/sun/${data.current.condition.text}.png`;
        }
}


const displayHours = function(currentHourPos){
    const newHourArr = [...hourArr.slice(currentHourPos, hourArr.length), ...hourArr.slice(0,currentHourPos)];
    // console.log(newHourArr);
    for(let i=0; i<4;i++){
        fiveHourArr.push(newHourArr[i])

    }
    console.log(fiveHourArr);
    
    // console.log(amPmArr);

    hourlyTime.forEach((hour,index) => {
        hour.textContent = fiveHourArr[index];
    });

}

const displayImg = function(day,currentHourPos,data){

    day.forEach(hour => {
        let currentImg = hour.condition.text;
        currentImgArr.push(currentImg);
    });

    sortedImgArr = [...currentImgArr.slice(currentHourPos, currentImgArr.length), ...currentImgArr.slice(0,currentHourPos)];

    for(let i=0; i<4;i++){
        fiveImgArr.push(sortedImgArr[i])
    }

    // console.log(fiveImgArr);

    cloudImgs.forEach((img,index) => {
        if(data.current.is_day === 0){
            img.src =  `./assets/images/Weather_Icons/moon/${fiveImgArr[index]}.png`;
        }
        else{
            img.src = `./assets/images/Weather_Icons/sun/${fiveImgArr[index]}.png`;
        }
        
    });
}



const displayTemp = function(day,currentHourPos){
    day.forEach((temp) => {
        let currTemp = temp.temp_c;
        tempArr.push(currTemp);
    });

const sortedTempArr = [...tempArr.slice(currentHourPos, tempArr.length), ...tempArr.slice(0,currentHourPos)];

for(let i=0; i<4;i++){
    fiveHourTemp.push(sortedTempArr[i])
}



hourlyDegree.forEach((degree,index) => {
    degree.innerHTML = `${fiveHourTemp[index]} &deg`;
})

};


// let countrys = searchField.value;








const fetchApi = function(api){
    fetch(api).then(response => response.json(),err => console.log(err)).then(data => {
        console.log(data);
        renderHtml(data);
        



        const time = new Date();
        // let convertedTime = time.toLocaleString('en-US', { hour: 'numeric', hour12: true });


        function formatAMPM(time) {
            var hours = time.getHours();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            hours = hours < 10 ? "0"+hours : hours
            var strTime = hours + ':' + '00' + ' ' + ampm;
             return strTime
          }

          const convertedTime = formatAMPM(time);
          console.log(convertedTime);


        


        const currentDayHour = data.forecast.forecastday[0].hour;
        const secondDayHour = data.forecast.forecastday[1].hour;
        const thirdDayHour = data.forecast.forecastday[2].hour;

        const daysArr =[currentDayHour, secondDayHour, thirdDayHour]

    
      
       
        
        currentDayHour.forEach((hour) => {
            const currentHour = new Date(`${hour.time}`)
            let hours = currentHour.toLocaleString('en-US', { hour: 'numeric', hour12: true }).split(' ')[0].slice(0,2);
            if(hours < 10){
                hourArr.push("0"+hours);
            }
            else hourArr.push(hours);
            
        });
        
        for(let i = 0; i < 12;i++){
            hourArr[i] = hourArr[i].slice(0,2) + ":00 AM" + hourArr[i].slice(2);
        }

        for(let j = hourArr.length-1;j >= 12;j--){
            hourArr[j] = hourArr[j].slice(0,2) + ":00 PM" + hourArr[j].slice(2);
        }

        // console.log(hourArr);

        const currentIndex = hourArr.indexOf(convertedTime);
        const nextIndex = currentIndex + 1;
        console.log(nextIndex);


        displayHours(nextIndex);
        displayTemp(currentDayHour ,nextIndex);
        displayImg(currentDayHour,nextIndex,data);


        const daysWeather = data.forecast.forecastday;
        daysWeather.forEach(day =>{
            generatedDate = generateDay(day.date);
        });

        

        days.forEach((day,index) => {
            day.addEventListener("click", function(){
                // It should change randomly like this displayImg(secondDayHour), displayImg(thirdDayHour)
                displayImg(daysArr[index]);
                displayTemp(daysArr[index],nextIndex);
                emptyArrays();

            })
        })
        


        hourArr = [ ];
        emptyArrays();

    });
}



// navigator.geolocation.getCurrentPosition(function(position){
//     const lat = position.coords.latitude;
//     const long = position.coords.longitude;
//     console.log(lat,long);
//     apiLink = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${long}&days=3&aqi=no&alerts=no`
//     fetchApi(apiLink);
//     console.log(apiLink);
// });



fetchApi(apiLink);


icon.addEventListener("click",function(){
    console.log(searchInput.value);
    search.classList.toggle("active");
    clear.classList.toggle("active");
    let searchValue = searchInput.value
    let searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`
    fetchApi(searchApi);
    searchInput.value= "";
})

searchInput.addEventListener("keydown",function(e){
    console.log(e);
    if(e.code === "Enter"){``
    search.classList.toggle("active");
    clear.classList.toggle("active");
    let searchValue = searchInput.value
    let searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`
    fetchApi(searchApi);
    searchInput.value= "";
    }
})



// btn.addEventListener("click",function(){
//     let searchValue = searchField.value
//     let searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`
//     fetchApi(searchApi);
//     searchField.value = " ";
// })



