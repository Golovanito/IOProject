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

async function updatePreviewWeatherWidget (i) {
  const apiKey = '77c3a88dfaefeb225ff57827b1b21db9'
  const widget = document.getElementById(`openweathermap-widget-container${i}`)
  const cityNamePolish = widget.getAttribute('data-city')
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
      console.log(data)
      // Update the widget container
      const widgetContainer = document.getElementById(
        `openweathermap-widget-container${i}`
      )
      // Set icon and temperature data to widget
      widgetContainer.innerHTML = `<div id="openweathermap-widget-16-${i}"><h4>${cityNamePolish}</h4><p>Temp: ${data.main.temp}°C</p><img id="icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></img></div>`
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error)
      alert('City not found or API error. Please check the city name.')
    })
}

async function setPreviewWeatherData () {
  // Update 5 widgets
  for (let i = 1; i <= 5; i++) {
    await updatePreviewWeatherWidget(i)
  }
}

window.onload = setPreviewWeatherData
