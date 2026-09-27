const DEFAULT_LINKS = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Moodle', url: 'https://ena.etsmtl.ca/' },
  { name: 'Outlook', url: 'https://outlook.office365.com/mail/' },
  { name: 'MonETS', url: 'https://portail.etsmtl.ca/' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/feed/' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Drive', url: 'https://drive.google.com/drive/home' },
  { name: 'Overleaf', url: 'https://www.overleaf.com' }
];

export function initLinks() {
  const linksCard = document.getElementById('links-widget');
  if (!linksCard) return;

  // Récupération des liens stockés ou initialisation avec les liens par défaut
  let linksData = JSON.parse(localStorage.getItem('dashboard_links')) || DEFAULT_LINKS;

  function render() {
    const linksHtml = linksData.map((link, index) => {
      let hostname = '';
      try {
        hostname = new URL(link.url).hostname;
      } catch (e) {
        hostname = link.url;
      }

      const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

      return `
        <div style="background: var(--bg-color); padding: 0.75rem 1rem; border-radius: var(--border-radius-sm); color: var(--text-primary); display: flex; align-items: center; justify-content: space-between; transition: transform 0.2s ease, background 0.2s ease;"
             onmouseover="this.style.transform='translateY(-2px)'"
             onmouseout="this.style.transform='translateY(0)'">
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden; text-decoration: none; color: inherit; flex: 1;">
            <img src="${faviconUrl}" alt="${link.name}" style="width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0;" />
            <span style="font-weight: 500; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.name}</span>
          </a>
          <div style="display: flex; align-items: center; gap: 0.4rem; margin-left: 0.5rem;">
            <button class="link-delete-btn" data-index="${index}" title="Supprimer" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.8rem; padding: 0 0.2rem; transition: color 0.2s ease;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-secondary)'">✕</button>
            <span style="color: var(--text-secondary); font-size: 0.8rem;">➔</span>
          </div>
        </div>
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
          <button id="add-link-trigger" style="background: transparent; border: 1px dashed var(--text-secondary); color: var(--text-secondary); border-radius: var(--border-radius-sm); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: background 0.2s ease, color 0.2s ease;" onmouseover="this.style.borderColor='var(--text-primary)'; this.style.color='var(--text-primary)'" onmouseout="this.style.borderColor='var(--text-secondary)'; this.style.color='var(--text-secondary)'">
            + Ajouter
          </button>
        </div>
        <div id="add-link-form-container"></div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Supprimer un lien
    linksCard.querySelectorAll('.link-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(btn.dataset.index, 10);
        linksData.splice(index, 1);
        saveAndRender();
      });
    });

    // Afficher le formulaire d'ajout
    const triggerBtn = document.getElementById('add-link-trigger');
    const formContainer = document.getElementById('add-link-form-container');

    if (triggerBtn && formContainer) {
      triggerBtn.addEventListener('click', () => {
        formContainer.innerHTML = `
          <form id="add-link-form" style="display: flex; gap: 0.5rem; margin-top: 0.75rem; background: var(--bg-color); padding: 0.75rem; border-radius: var(--border-radius-sm);">
            <input type="text" id="link-name-input" placeholder="Nom (ex: Notion)" required style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-primary); padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; outline: none; flex: 1;" />
            <input type="url" id="link-url-input" placeholder="https://..." required style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-primary); padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; outline: none; flex: 1;" />
            <button type="submit" style="background: #818cf8; color: #fff; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">Ajouter</button>
            <button type="button" id="cancel-link-btn" style="background: transparent; color: var(--text-secondary); border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">Annuler</button>
          </form>
        `;

        document.getElementById('link-name-input')?.focus();

        document.getElementById('cancel-link-btn')?.addEventListener('click', () => {
          formContainer.innerHTML = '';
        });

        document.getElementById('add-link-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('link-name-input').value.trim();
          let url = document.getElementById('link-url-input').value.trim();

          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }

          if (name && url) {
            linksData.push({ name, url });
            saveAndRender();
          }
        });
      });
    }
  }

  function saveAndRender() {
    localStorage.setItem('dashboard_links', JSON.stringify(linksData));
    render();
  }

  render();
}