export function initWeather() {
  const weatherCard = document.getElementById('weather-widget');
  if (!weatherCard) return;

  weatherCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">MÉTÉO</h2>
      <span class="card-subtitle">Mis à jour 06:45</span>
    </div>
    <div class="card-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <span style="font-size: 3rem; font-weight: bold;">14°<span style="font-size: 1.5rem;">C</span></span>
        </div>
        <div style="text-align: right;">
          <strong style="display: block; font-size: 1.1rem;">Montréal</strong>
          <span style="color: var(--text-secondary); font-size: 0.9rem;">Nuageux, averses</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-color); padding: 0.75rem; border-radius: var(--border-radius-sm);">
        <div>💧 <strong>70%</strong> <br><small style="color: var(--text-secondary);">Pluie</small></div>
        <div>💨 <strong>18 km/h</strong> <br><small style="color: var(--text-secondary);">Vent</small></div>
        <div>🌡️ <strong>12°C</strong> <br><small style="color: var(--text-secondary);">Ressenti</small></div>
      </div>
    </div>
  `;
}