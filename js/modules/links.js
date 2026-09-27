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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.45rem 0.5rem; display: flex; align-items: center; justify-content: space-between; transition: background 0.2s ease;"
             onmouseover="this.style.background='rgba(255, 255, 255, 0.06)'"
             onmouseout="this.style.background='rgba(255, 255, 255, 0.03)'">
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-decoration: none; color: var(--text-primary); flex: 1; min-width: 0;">
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 4px; padding: 0.2rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <img src="${faviconUrl}" alt="${link.name}" style="width: 14px; height: 14px;" />
            </div>
            <span style="font-weight: 500; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.name}</span>
          </a>
          <div style="display: flex; align-items: center; gap: 0.2rem; margin-left: 0.25rem; flex-shrink: 0;">
            <button class="link-delete-btn" data-index="${index}" title="Supprimer" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.75rem; padding: 0; opacity: 0.4; transition: color 0.2s ease, opacity 0.2s ease;" onmouseover="this.style.color='#ef4444'; this.style.opacity='1'" onmouseout="this.style.color='var(--text-secondary)'; this.style.opacity='0.4'">✕</button>
            <span style="color: var(--text-secondary); font-size: 0.75rem; opacity: 0.5;">→</span>
          </div>
        </div>
      `;
    }).join('');

    linksCard.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">LIENS RAPIDES</h2>
        <span class="card-subtitle">${linksData.length} raccourcis</span>
      </div>
      <div class="card-content" style="padding: 0;">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0; border-radius: var(--border-radius-sm); overflow: hidden;">
          ${linksHtml}
          <button id="add-link-trigger" style="background: rgba(255, 255, 255, 0.02); border: 1px dashed rgba(255, 255, 255, 0.15); color: var(--text-secondary); padding: 0.45rem 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem; cursor: pointer; font-size: 0.8rem; transition: background 0.2s ease, color 0.2s ease;" onmouseover="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.color='var(--text-primary)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='var(--text-secondary)'">
            + Ajouter
          </button>
        </div>
        <div id="add-link-form-container"></div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    linksCard.querySelectorAll('.link-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(btn.dataset.index, 10);
        linksData.splice(index, 1);
        saveAndRender();
      });
    });

    const triggerBtn = document.getElementById('add-link-trigger');
    const formContainer = document.getElementById('add-link-form-container');

    if (triggerBtn && formContainer) {
      triggerBtn.addEventListener('click', () => {
        formContainer.innerHTML = `
          <form id="add-link-form" style="display: flex; gap: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(0, 0, 0, 0.2); border-top: 1px solid rgba(255, 255, 255, 0.05);">
            <input type="text" id="link-name-input" placeholder="Nom" required style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-primary); padding: 0.35rem 0.5rem; border-radius: 4px; font-size: 0.8rem; outline: none; flex: 1;" />
            <input type="url" id="link-url-input" placeholder="https://..." required style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-primary); padding: 0.35rem 0.5rem; border-radius: 4px; font-size: 0.8rem; outline: none; flex: 1;" />
            <button type="submit" style="background: #818cf8; color: #fff; border: none; padding: 0.35rem 0.7rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Ajouter</button>
            <button type="button" id="cancel-link-btn" style="background: transparent; color: var(--text-secondary); border: none; padding: 0.35rem 0.7rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Annuler</button>
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