export async function initWeather() {
  const weatherCard = document.getElementById('weather-widget');
  if (!weatherCard) return;

  // Affichage pendant le chargement
  weatherCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">MÉTÉO</h2>
      <span class="card-subtitle">Chargement...</span>
    </div>
    <div class="card-content" style="text-align: center; color: var(--text-secondary); padding: 1.5rem 0;">
      Récupération de la météo...
    </div>
  `;

  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=45.49902&longitude=-73.59793&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m&daily=precipitation_probability_max&wind_speed_unit=kmh&timezone=America%2FToronto";
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.current || !data?.daily) {
      renderError(weatherCard);
      return;
    }

    // Extraction et formatage des données
    const temp = Math.round(data.current.temperature_2m);
    const feelsLike = Math.round(data.current.apparent_temperature);
    const windSpeed = Math.round(data.current.wind_speed_10m);
    const rainProb = data.daily.precipitation_probability_max[0] ?? 0;
    const weatherLabel = getWeatherLabel(data.current.weather_code);

    // Heure actuelle au format HH:MM (ex: 06:45)
    const now = new Date();
    const updatedTime = now.toLocaleTimeString('fr-CA', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Montreal' 
    });

    // Rendu respectant exactement la structure de ton exemple
    weatherCard.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">MÉTÉO</h2>
        <span class="card-subtitle">Mis à jour ${updatedTime}</span>
      </div>
      <div class="card-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <span style="font-size: 3rem; font-weight: bold;">${temp}°<span style="font-size: 1.5rem;">C</span></span>
          </div>
          <div style="text-align: right;">
            <strong style="display: block; font-size: 1.1rem;">Montréal</strong>
            <span style="color: var(--text-secondary); font-size: 0.9rem;">${weatherLabel}</span>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-color); padding: 0.75rem; border-radius: var(--border-radius-sm); text-align: center;">
          <div>💧 <strong>${rainProb}%</strong> <br><small style="color: var(--text-secondary);">Pluie</small></div>
          <div>💨 <strong>${windSpeed} km/h</strong> <br><small style="color: var(--text-secondary);">Vent</small></div>
          <div>🌡️ <strong>${feelsLike}°C</strong> <br><small style="color: var(--text-secondary);">Ressenti</small></div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Erreur météo :", error);
    renderError(weatherCard);
  }
}

// Convertisseur de code WMO vers un libellé lisible
function getWeatherLabel(code) {
  if (code === 0) return "Dégagé";
  if (code >= 1 && code <= 3) return "Nuageux";
  if (code >= 45 && code <= 48) return "Brouillard";
  if (code >= 51 && code <= 67) return "Pluie";
  if (code >= 71 && code <= 77) return "Neige";
  if (code >= 80 && code <= 82) return "Averses";
  if (code >= 95) return "Orage";
  return "Variable";
}

function renderError(container) {
  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">MÉTÉO</h2>
      <span class="card-subtitle">Montréal</span>
    </div>
    <div class="card-content" style="text-align: center; color: var(--text-secondary); padding: 1rem 0;">
      Météo indisponible
    </div>
  `;
}