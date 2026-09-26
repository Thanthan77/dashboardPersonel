export function initCanadiens() {
  const canadiensCard = document.getElementById('canadiens-widget');
  if (!canadiensCard) return;

  canadiensCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">CANADIENS DE MONTRÉAL</h2>
      <span class="card-subtitle">LNH</span>
    </div>
    <div class="card-content" style="text-align: center;">
      <div style="display: flex; justify-content: space-around; align-items: center; margin: 1rem 0;">
        <div style="background: #a23434; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">MTL</div>
        <span style="color: var(--text-secondary);">VS</span>
        <div style="background: #2b4c7e; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">TOR</div>
      </div>
      <p style="font-size: 0.9rem;">Vendredi, 19 h 00 — <strong>Centre Bell</strong></p>
      <p style="color: var(--accent-color); font-size: 0.85rem; font-weight: 600; margin-top: 0.25rem;">Dans 23 heures 4 minutes</p>
    </div>
  `;
}