
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
const icon1 = document.querySelector(".icon1");
const icon2 = document.querySelector(".icon2");
const search = document.querySelector(".search");
const clear = document.querySelector(".clear");
const navLocation = document.querySelector(".nav-location");
const errorMsg = document.querySelector(".errorMsg");
const searchInput = document.querySelector(".search-input");
const btn = document.querySelector(".submit-btn");








clear.addEventListener("click",function(){
    document.querySelector(".search-input").value = "";
    navLocation.classList.toggle("active");
    search.classList.toggle("active");
    clear.classList.toggle("active");
})



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


        const displayImg = function(day,currentHourPos){

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

        // console.log(hourArr);

        const currentIndex = hourArr.indexOf(convertedTime);
        const nextIndex = currentIndex + 1;
        console.log(nextIndex);


        displayHours(nextIndex);
        displayTemp(currentDayHour ,nextIndex);
        displayImg(currentDayHour,nextIndex,data);


        const generateDay = function(date){
            const d = new Date(`${date}`);
            // console.log(d);
            const comingDays = `${d.toString().split(' ')[0]}, ${d.toString().split(' ')[2]} ${d.toString().split(' ')[1]}`;
            console.log(comingDays);
            dateArr.push(comingDays);
        }

        console.log(dateArr);

        


        const daysWeather = data.forecast.forecastday;
        daysWeather.forEach(day =>{
            generatedDate = generateDay(day.date);
        });


        days.forEach((day,index) => {
            day.textContent = `${dateArr[index]}`
        })
       

        days.forEach((day,index) => {
            day.addEventListener("click", function(){

                displayImg(daysArr[index]);
                displayTemp(daysArr[index],nextIndex);
                emptyArrays();

            })
        })
    
        days.forEach((day,_,buttons) => {
            day.addEventListener("click", function(){
                buttons.forEach(button => button.classList.toggle("activeDay",button === day))
            })
        })
        


        hourArr = [ ];
        emptyArrays();

    });
}



navigator.geolocation.getCurrentPosition(function(position){
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    console.log(lat,long);
    apiLink = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${long}&days=3&aqi=no&alerts=no`
    fetchApi(apiLink);
    console.log(apiLink);
});



fetchApi(apiLink);

const addClass = function(){
    navLocation.classList.toggle("active");
    search.classList.toggle("active");
    clear.classList.toggle("active");
    icon1.classList.toggle("active");
    icon2.classList.toggle("active");
};


icon1.addEventListener("click",function(){
    addClass();

    
})

icon2.addEventListener("click",function(){
    if(!searchInput.value){
        addClass();
        errorMsg.classList.toggle("active");
    }
    else{
        addClass();
        errorMsg.classList.toggle("active");
        let searchValue = searchInput.value
        let searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`
        fetchApi(searchApi);
        searchInput.value= "";
    }
    
})

searchInput.addEventListener("keydown",function(e){
    console.log(typeof(searchInput.value));
    if(e.keyCode == 13){
        e.preventDefault()
        addClass();
        errorMsg.classList.toggle("active");
        const searchValue = searchInput.value
        const searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`;
        fetchApi(searchApi);
        searchInput.value= "";
    }
    else{
        return
    }
})



// btn.addEventListener("click",function(){
//     let searchValue = searchField.value
//     let searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`
//     fetchApi(searchApi);
//     searchField.value = " ";
// })



