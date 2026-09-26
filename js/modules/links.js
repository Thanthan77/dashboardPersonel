export function initLinks() {
  const linksCard = document.getElementById('links-widget');
  if (!linksCard) return;

  const mockLinks = ['GitHub', 'Moodle', 'Outlook', 'Teams', 'Discord', 'YouTube', 'ChatGPT'];

  const linksHtml = mockLinks.map(link => `
    <a href="#" style="background: var(--bg-color); padding: 0.75rem 1rem; border-radius: var(--border-radius-sm); color: var(--text-primary); text-decoration: none; display: flex; justify-content: space-between; align-items: center;">
      <span>${link}</span>
      <span style="color: var(--text-secondary); font-size: 0.8rem;">➔</span>
    </a>
  `).join('');

  linksCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">LIENS RAPIDES</h2>
      <span class="card-subtitle">${mockLinks.length} raccourcis</span>
    </div>
    <div class="card-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem;">
        ${linksHtml}
      </div>
    </div>
  `;
}