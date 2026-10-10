import { Icons } from "../../assets/icons/icon.js";
const DEFAULT_LINKS = [
  { name: "GitHub", url: "https://github.com" },
  { name: "Moodle", url: "https://ena.etsmtl.ca/" },
  { name: "Outlook", url: "https://outlook.office365.com/mail/" },
  { name: "MonETS", url: "https://portail.etsmtl.ca/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/feed/" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Drive", url: "https://drive.google.com/drive/home" },
  { name: "Overleaf", url: "https://www.overleaf.com" },
];

export function initLinks() {
  const linksCard = document.getElementById("links-widget");
  if (!linksCard) return;

  let linksData =
    JSON.parse(localStorage.getItem("dashboard_links")) || DEFAULT_LINKS;

  function render() {
    const linksHtml = linksData
      .map((link, index) => {
        let hostname = "";
        try {
          hostname = new URL(link.url).hostname;
        } catch (e) {
          hostname = link.url;
        }

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

        return `
        <div class="link-item">
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-anchor">
            <div class="favicon-wrapper">
              <img src="${faviconUrl}" alt="${link.name}" class="favicon-img" />
            </div>
            <span class="link-title">${link.name}</span>
          </a>
          <div class="link-actions">
            <button class="link-delete-btn" data-index="${index}" title="Supprimer">${Icons.trash}</button>
            <span class="link-arrow">${Icons.external}</span>
          </div>
        </div>
      `;
      })
      .join("");

    linksCard.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">LIENS RAPIDES</h2>
        <span class="card-subtitle">${linksData.length} raccourcis</span>
      </div>
      <div class="card-content">
        <div class="links-grid">
          ${linksHtml}
          <button id="add-link-trigger" class="add-link-trigger-btn">
            ${Icons.plus} Ajouter
          </button>
        </div>
        <div id="add-link-form-container"></div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    linksCard.querySelectorAll(".link-delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(btn.dataset.index, 10);
        linksData.splice(index, 1);
        saveAndRender();
      });
    });

    const triggerBtn = document.getElementById("add-link-trigger");
    const formContainer = document.getElementById("add-link-form-container");

    if (triggerBtn && formContainer) {
      triggerBtn.addEventListener("click", () => {
        formContainer.innerHTML = `
          <form id="add-link-form" class="add-link-form">
            <input type="text" id="link-name-input" placeholder="Nom" required />
            <input type="url" id="link-url-input" placeholder="https://..." required />
            <button type="submit" class="btn-submit-link">Ajouter</button>
            <button type="button" id="cancel-link-btn" class="btn-cancel-link">Annuler</button>
          </form>
        `;

        document.getElementById("link-name-input")?.focus();

        document
          .getElementById("cancel-link-btn")
          ?.addEventListener("click", () => {
            formContainer.innerHTML = "";
          });

        document
          .getElementById("add-link-form")
          ?.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document
              .getElementById("link-name-input")
              .value.trim();
            let url = document.getElementById("link-url-input").value.trim();

            if (!url.startsWith("http://") && !url.startsWith("https://")) {
              url = "https://" + url;
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
    localStorage.setItem("dashboard_links", JSON.stringify(linksData));
    render();
  }

  render();
}
