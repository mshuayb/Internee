// DOM Elements
        const searchBtn = document.getElementById('searchBtn');
        const locationBtn = document.getElementById('locationBtn');
        const cityInput = document.getElementById('cityInput');
        const weatherInfo = document.getElementById('weatherInfo');
        const errorMsg = document.getElementById('errorMsg');
        const loader = document.getElementById('loader');
        const body = document.body;

        // Output Elements
        const cityNameEl = document.getElementById('cityName');
        const tempEl = document.getElementById('temp');
        const descEl = document.getElementById('description');
        const iconEl = document.getElementById('weatherIcon');
        const humidityEl = document.getElementById('humidity');
        const windEl = document.getElementById('windSpeed');

        // Event Listeners
        searchBtn.addEventListener('click', () => handleCitySearch());
        locationBtn.addEventListener('click', () => handleGeolocation());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCitySearch();
        });

        // Helper function for Quick Access Chips
        function searchCity(cityName) {
            cityInput.value = cityName;
            handleCitySearch();
        }

        // 1. Fetch Weather by City Name
        async function handleCitySearch() {
            const city = cityInput.value.trim();
            if (!city) {
                showError("Please enter a city name.");
                return;
            }

            showLoader(true);
            hideError();

            try {
                // Geocoding API (Text -> Lat/Lon)
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error("City not found. Check spelling.");
                }

                const { latitude, longitude, name, country } = geoData.results[0];
                await fetchWeather(latitude, longitude, `${name}, ${country}`);

            } catch (error) {
                showError(error.message);
                showLoader(false);
            }
        }

        // 2. Fetch Weather by Coordinates
        function handleGeolocation() {
            if (!navigator.geolocation) {
                showError("Geolocation not supported.");
                return;
            }

            showLoader(true);
            hideError();

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeather(latitude, longitude, "Your Location");
                },
                (error) => {
                    let msg = "Location access denied.";
                    if (error.code === 1) msg = "Please enable location permissions.";
                    showError(msg);
                    showLoader(false);
                }
            );
        }

        // 3. Generic Fetch Weather Function
        async function fetchWeather(lat, lon, displayName) {
            try {
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`;
                
                const res = await fetch(weatherUrl);
                if (!res.ok) throw new Error("Weather data unavailable.");
                
                const data = await res.json();
                updateUI(data.current, displayName);
                
            } catch (error) {
                showError(error.message);
            } finally {
                showLoader(false);
            }
        }

        // 4. Update the DOM
        function updateUI(current, locationName) {
            const { temperature_2m, relative_humidity_2m, weather_code, wind_speed_10m } = current;

            cityNameEl.textContent = locationName;
            tempEl.textContent = `${Math.round(temperature_2m)}°C`;
            humidityEl.textContent = `${relative_humidity_2m}%`;
            windEl.textContent = `${wind_speed_10m} km/h`;

            const weatherDetails = getWeatherInfo(weather_code);
            iconEl.textContent = weatherDetails.icon;
            descEl.textContent = weatherDetails.desc;

            updateBackground(weather_code);
            weatherInfo.style.display = 'block';
        }

        // 5. Map WMO Codes
        function getWeatherInfo(code) {
            if (code === 0) return { icon: '☀️', desc: 'Clear Sky' };
            if (code >= 1 && code <= 3) return { icon: '☁️', desc: 'Cloudy' };
            if (code >= 45 && code <= 48) return { icon: '🌫️', desc: 'Foggy' };
            if (code >= 51 && code <= 67) return { icon: '🌧️', desc: 'Rainy' };
            if (code >= 71 && code <= 77) return { icon: '❄️', desc: 'Snow' };
            if (code >= 80 && code <= 82) return { icon: '🌦️', desc: 'Showers' };
            if (code >= 95 && code <= 99) return { icon: '⛈️', desc: 'Thunderstorm' };
            return { icon: '🌤️', desc: 'Unknown' };
        }

        // 6. Update Background
        function updateBackground(code) {
            let bgVar = '--bg-sunny';
            if (code >= 1 && code <= 3 || (code >= 45 && code <= 48)) bgVar = '--bg-cloudy';
            if (code >= 51 && code <= 99) bgVar = '--bg-rainy';
            body.style.background = `var(${bgVar})`;
        }

        // UI Helpers
        function showError(msg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
            weatherInfo.style.display = 'none';
        }
        function hideError() { errorMsg.style.display = 'none'; }
        function showLoader(isLoading) {
            loader.style.display = isLoading ? 'block' : 'none';
            if (isLoading) weatherInfo.style.display = 'none';
        }