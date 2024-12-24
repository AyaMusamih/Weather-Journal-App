const apiKey = '<your_api_key>&units=imperial';

const fetchWeatherData = async (zipCode) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data.');
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
};

const sendDataToServer = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to post data to server.');
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
};

const updateUI = async () => {
  try {
    const response = await fetch('/all');
    if (!response.ok) {
      throw new Error('Failed to fetch project data.');
    }
    const data = await response.json();
    document.getElementById('temp').textContent = `${Math.round(data.temperature)} degrees`;
    document.getElementById('content').textContent = data.userResponse;
    document.getElementById('date').textContent = data.date;
  } catch (error) {
    console.error(error.message);
  }
};

document.getElementById('generate').addEventListener('click', async () => {
  const zipCode = document.getElementById('zip').value.trim();
  const feelings = document.getElementById('feelings').value.trim();

  if (!zipCode) {
    alert('Please enter a zip code.');
    return;
  }

  if (!feelings) {
    alert('Please share your feelings.');
    return;
  }

  const weatherData = await fetchWeatherData(zipCode);
  if (weatherData && weatherData.main) {
    const newData = {
      temperature: weatherData.main.temp,
      date: new Date().toLocaleString(),
      userResponse: feelings,
    };
    await sendDataToServer('/add', newData);
    await updateUI();
  } else {
    alert('Unable to fetch weather data. Please check the zip code and try again.');
  }
});
