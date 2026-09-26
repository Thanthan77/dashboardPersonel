export function initLinks() {
  const linksCard = document.getElementById('links-widget');
  if (!linksCard) return;

  // Liste des liens avec leurs URLs réelles
  const linksData = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Moodle', url: 'https://ena.etsmtl.ca/' },
    { name: 'Outlook', url: 'https://outlook.office.com' },
    { name: 'MonETS', url: 'https://portail.etsmtl.ca/' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'GoogleDrive', url: 'https://drive.google.com' }
  ];

  // Génération du HTML avec favicons dynamiques
  const linksHtml = linksData.map(link => {
    // API Google pour récupérer l'icône Favicon de chaque site
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`;

    return `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
         style="background: var(--bg-color); padding: 0.75rem 1rem; border-radius: var(--border-radius-sm); color: var(--text-primary); text-decoration: none; display: flex; align-items: center; justify-content: space-between; transition: transform 0.2s ease, background 0.2s ease;"
         onmouseover="this.style.transform='translateY(-2px)'"
         onmouseout="this.style.transform='translateY(0)'">
        <div style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden;">
          <img src="${faviconUrl}" alt="${link.name}" style="width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0;" />
          <span style="font-weight: 500; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.name}</span>
        </div>
        <span style="color: var(--text-secondary); font-size: 0.8rem; margin-left: 0.5rem;">➔</span>
      </a>
    `;
  }).join('');

  linksCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">LIENS RAPIDES</h2>
      <span class="card-subtitle">${linksData.length} raccourcis</span>
    </div>
    <div class="card-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem;">
        ${linksHtml}
      </div>
    </div>
  `;
}