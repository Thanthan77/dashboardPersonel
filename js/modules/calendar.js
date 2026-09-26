export function initCalendar() {
  const agendaCard = document.getElementById('agenda-widget');
  if (!agendaCard) return;

  // Données fictives basées sur la maquette
  const events = [
    { time: '09:00', title: 'LOG200 — Laboratoire', category: 'Cours', type: 'course' },
    { time: '12:00', title: 'Lunch', category: 'Perso', type: 'perso' },
    { time: '14:30', title: 'Réunion équipe — Projet intégrateur', category: 'Projet', type: 'project' },
    { time: '19:00', title: 'Volleyball', category: 'Sport', type: 'sport' }
  ];

  const eventsHtml = events.map(event => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; background: var(--bg-color); border-radius: var(--border-radius-sm); margin-bottom: 0.5rem;">
      <div style="display: flex; align-items: center; gap: 0.8rem;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-color); background: rgba(99, 102, 241, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">${event.time}</span>
        <span style="font-size: 0.9rem; color: var(--text-primary);">${event.title}</span>
      </div>
      <span style="font-size: 0.75rem; color: var(--text-secondary); border: 1px solid var(--card-border); padding: 0.15rem 0.5rem; border-radius: 12px;">${event.category}</span>
    </div>
  `).join('');

  agendaCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">AGENDA DU JOUR</h2>
      <span class="card-subtitle">Vendredi</span>
    </div>
    <div class="card-content">
      <div style="display: flex; flex-direction: column;">
        ${eventsHtml}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-secondary);">
        <span>Prochain : <strong style="color: var(--accent-color);">LOG200</strong> dans 1h 20</span>
        <span>4 événements aujourd'hui</span>
      </div>
    </div>
  `;
}