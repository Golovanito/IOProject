// Global parameters needed
let temp = 1
let snow = -1

function replacePolishChars (text) {
  const polishToAscii = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ó: 'O',
    Ś: 'S',
    Ź: 'Z',
    Ż: 'Z'
  }
  return text.replace(
    /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
    (char) => polishToAscii[char] || char
  )
}

function capitalizeFirstLetter (word) {
  if (word.length === 0) { return word }
  return word.charAt(0).toUpperCase() + word.slice(1)
}

async function updateWeatherWidget (cityNamePolish, i) {
  const apiKey = '77c3a88dfaefeb225ff57827b1b21db9'
  const cityName = replacePolishChars(cityNamePolish)

  // Fetch city ID for the selected city name
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('City not found')
      }
      return response.json()
    })
    .then((data) => {
      const cityId = data.id // Extract city ID

      const buttonModal = document.getElementById(`modal-button-${i}`)

      buttonModal.value = cityNamePolish

      // Update the widget container
      const widgetContainer = document.getElementById(
        `openweathermap-widget-container${i}`
      )

      widgetContainer.innerHTML = `<div id="openweathermap-widget-15-${i}"></div>`

      // Add new parameters to the widget
      window.myWidgetParam = [
        {
          id: 15,
          cityid: cityId,
          appid: apiKey,
          units: 'metric',
          containerid: `openweathermap-widget-15-${i}`
        }
      ]

      // Load the widget script
      const script = document.createElement('script')
      script.async = true
      script.src =
        '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js'
      document.body.appendChild(script)
      // Update weather information on the page
      snow = data.snow ? data.snow['1h'] + ' mm' || data.snow['3h'] + ' mm' : -1
      temp = data.main.temp
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error)
      alert('City not found or API error. Please check the city name.')
    })
  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('City not found')
      }
      return response.json()
    }) // Set weather data for next 6 days
    .then((data) => {
      const modalData = [
        data.list[7],
        data.list[15],
        data.list[23],
        data.list[31],
        data.list[39]
      ]
      for (let j = 1; j <= modalData.length; j++) {
        const arr = String(modalData[j - 1].dt_txt)
          .slice(5, 10)
          .split('-')
        document.getElementById(`forecastDate${i}${j}`).innerHTML =
          `${arr[1]} - ${arr[0]}`
        document.getElementById(`forecast${i}${j}`).innerHTML =
          `${modalData[j - 1].main.temp}°C ${modalData[j - 1].main.pressure}
          hPa<img id="icon" src="https://openweathermap.org/img/wn/${modalData[j - 1].weather[0].icon}@2x.png" style="transform: scale(0.5)"></img>`
      }
    })
}

async function setRainData (cityNamePolish) {
  // Get rain data from second API - requires non-polish lower-case characters
  const cityName = replacePolishChars(cityNamePolish)
  const cityNameNoSpace = cityName.toLocaleLowerCase().replace(/\s/g, '')
  await fetch(
    `https://danepubliczne.imgw.pl/api/data/synop/station/${cityNameNoSpace}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('City not found')
      }
      return response.json()
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error)
    })
}

async function setWeatherData () {
  let alertText = ''
  const list = [
    'Białystok',
    'Chojnice',
    'Częstochowa',
    'Elbląg',
    'Gdańsk',
    'Hel',
    'Jelenia Góra',
    'Kalisz',
    'Katowice',
    'Kętrzyn',
    'Kielce',
    'Kłodzko',
    'Koło',
    'Kołobrzeg',
    'Koszalin',
    'Kozienice',
    'Kraków',
    'Krosno',
    'Legnica',
    'Lesko',
    'Leszno',
    'Lębork',
    'Lublin',
    'Łeba',
    'Łódź',
    'Mikołajki',
    'Mława',
    'Nowy Sącz',
    'Olsztyn',
    'Opole',
    'Ostrołęka',
    'Piła',
    'Platforma',
    'Płock',
    'Poznań',
    'Przemyśl',
    'Racibórz',
    'Resko',
    'Rzeszów',
    'Sandomierz',
    'Siedlce',
    'Słubice',
    'Sulejów',
    'Suwałki',
    'Szczecin',
    'Szczecinek',
    'Świnoujście',
    'Tarnów',
    'Terespol',
    'Toruń',
    'Ustka',
    'Warszawa',
    'Wieluń',
    'Włodawa',
    'Wrocław',
    'Zakopane',
    'Zamość',
    'Zielona Góra'
  ]
  const dbData = {}
  
  const numOfSelectButtons =
    document.getElementsByClassName('selectContainer').length
  // Updating weather data
  for (let i = 1; i <= numOfSelectButtons; i++) {
    const cityNamePolish = document.getElementById(`citySelect${i}`).value
    // Hiding search buttons with incorrect information
    if (cityNamePolish === '') {
      const button = document.getElementById(`inputButton${i}`)
      button.click()
      continue
    }
    if (!list.includes(cityNamePolish)) {
      const button = document.getElementById(`inputButton${i}`)
      button.click()
      continue
    }

    dbData[i] = cityNamePolish
    await updateWeatherWidget(cityNamePolish, i)
    await setRainData(cityNamePolish)
    const cityNamePolishCapital = capitalizeFirstLetter(cityNamePolish)
    if (temp <= 0) {
      alertText += `${cityNamePolishCapital} - Uwaga niska temperatura!\n`
    }
    if (snow >= 0) {
      alertText += `${cityNamePolishCapital} - Uwaga występuje śnieg!\n`
    }
  }
  if (alertText !== '') {
    document.getElementById('alerts').textContent = alertText
  }
  checkForData(dbData)
}

function showDetails (cityName, weatherData) {
  // Show modal element with weather data
  const modal = document.getElementById('weatherModal')
  document.getElementById('modalCity').textContent = cityName
  document.getElementById('modalTemp').textContent = `${weatherData.temp} °C`
  document.getElementById('modalCondition').textContent = weatherData.weather
  document.getElementById('modalSnow').textContent = weatherData.snow
  document.getElementById('modalRain').textContent = weatherData.rain
  document.getElementById('modalPressure').textContent =
    `${weatherData.pressure} hPa`
  document.getElementById('modalHumidity').textContent =
    `${weatherData.humidity}%`
  document.getElementById('modalWindSpeed').textContent =
    `${weatherData.windSpeed} m/s`
  modal.style.display = 'block'
}

function closeModal () {
  document.getElementById('weatherModal').style.display = 'none'
}

async function showModal (widgetName) {
  const cityName = widgetName.value
  const weatherData = await fetchWeather(cityName)
  // Set weather data to modal
  showDetails(cityName, weatherData)
}

async function fetchWeather (cityName) {
  const apiKey = '77c3a88dfaefeb225ff57827b1b21db9'
  const cityNameAscii = replacePolishChars(cityName)
  const weatherData = {}

  // Fetch weather details from OpenWeatherMap
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityNameAscii}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      weatherData.id = data.id
      weatherData.temp = data.main.temp
      weatherData.weather = data.weather[0].description
      weatherData.pressure = data.main.pressure
      weatherData.humidity = data.main.humidity
      weatherData.windSpeed = data.wind.speed
      weatherData.cloudiness = data.clouds.all
      weatherData.snow = data.snow
        ? data.snow['1h'] || data.snow['3h']
        : 'Brak danych'
    })
    .catch((error) => {
      console.error('Error fetching OpenWeatherMap data:', error)
    })

  // Fetch precipitation details from the second API
  await fetch(
    `https://danepubliczne.imgw.pl/api/data/synop/station/${cityNameAscii.toLowerCase().replace(/\s/g, '')}`
  )
    .then((response) => response.json())
    .then((data) => {
      weatherData.rain = data.suma_opadu + ' mm' || 'Brak danych'
    })
    .catch((error) => {
      console.error('Error fetching IMGW data:', error)
      weatherData.rain = 'Brak danych'
    })

  return weatherData
}

function showSelectContainer () {
  const numOfSelectButtons =
    document.getElementsByClassName('selectContainer').length
  for (let i = 1; i <= numOfSelectButtons; i++) {
    const selectContainer = document.getElementById(`selectContainer${i}`)
    // Show first hidden selectContainer
    if (selectContainer.classList.contains('inputButtonHide')) {
      selectContainer.classList.add('selectContainerShow')
      selectContainer.classList.remove('inputButtonHide')
      selectContainer.style.display = 'block'
      const dataContainer = document.getElementById(`dataContainer${i}`)
      dataContainer.classList.add('column')
      dataContainer.classList.remove('disp-none')
      break
    }
  }
}

function hideSelectContainer (selectContainerButton) {
  const selectContainer = document.getElementById(
    `selectContainer${selectContainerButton.value}`
  )
  // Hiding selectContainer
  selectContainer.classList.add('inputButtonHide')
  selectContainer.classList.remove('selectContainerShow')
  selectContainer.style.display = 'none'
  const dataContainer = document.getElementById(
    `dataContainer${selectContainerButton.value}`
  )
  // Hiding search field
  dataContainer.classList.add('disp-none')
  dataContainer.classList.remove('column')
  const searchButton = document.getElementById(
    `citySelect${selectContainerButton.value}`
  )
  searchButton.value = ''
  const dbData = {}
  // Updating data that gets sent to database
  const numOfSelectButtons =
    document.getElementsByClassName('selectContainer').length
  for (let i = 1; i <= numOfSelectButtons; i++) {
    const cityNamePolish = document.getElementById(`citySelect${i}`).value
    dbData[i] = cityNamePolish
  }
  checkForData(dbData)
}

function checkForData (data) {
  // Send data to python (routes.py - call_python() method)
  fetch('/weather/get-selected-weather-cities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => console.error('Error:', error))
}

window.onload = setWeatherData
