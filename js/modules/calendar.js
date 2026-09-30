const WORKER_URL = 'https://calandar.ethanqc-chea.workers.dev'; 

export async function initCalendar() {
  const agendaCard = document.getElementById('agenda-widget');
  if (!agendaCard) return;

  renderLoading(agendaCard);

  try {
    const response = await fetch(WORKER_URL);
    if (!response.ok) throw new Error('Erreur réseau');

    const icsData = await response.text();
    const { events, isFutureEvents } = parseICalData(icsData);

    renderCalendar(agendaCard, events, isFutureEvents);
  } catch (error) {
    console.error('Erreur Agenda:', error);
    renderError(agendaCard);
  }
}

function parseICalData(icsData) {
  const jcalData = ICAL.parse(icsData);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();

  // Limite de recherche pour les événements futurs (7 jours)
  const maxFutureDate = new Date();
  maxFutureDate.setDate(now.getDate() + 7);

  const todayEvents = [];
  const futureEvents = [];

  // Fonction interne pour traiter une instance d'événement
  function processEventInstance(event, startDate, eventStart) {
    // Événements d'aujourd'hui
    if (eventStart >= startOfDay && eventStart <= endOfDay) {
      const timeStr = event.startDate.isDate
        ? 'Toute la journée'
        : startDate.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });

      todayEvents.push({
        time: timeStr,
        title: event.summary || 'Sans titre',
        rawDate: startDate
      });
    }

    // Événements strictly futurs
    if (eventStart > now.getTime()) {
      const dateStr = startDate.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' });
      const timeStr = event.startDate.isDate
        ? 'Toute la journée'
        : startDate.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });

      futureEvents.push({
        time: `${dateStr} ${timeStr}`,
        title: event.summary || 'Sans titre',
        rawDate: startDate
      });
    }
  }

  vevents.forEach(vevent => {
    const event = new ICAL.Event(vevent);

    // Prise en charge des événements récurrents (cours, routines)
    if (event.isRecurring()) {
      const expand = new ICAL.RecurExpansion({
        component: vevent,
        dtstart: event.startDate
      });

      let next;
      while ((next = expand.next()) && next.toJSDate() <= maxFutureDate) {
        const startDate = next.toJSDate();
        processEventInstance(event, startDate, startDate.getTime());
      }
    } else {
      // Événement simple
      const startDate = event.startDate.toJSDate();
      processEventInstance(event, startDate, startDate.getTime());
    }
  });

  // Tri par ordre chronologique
  todayEvents.sort((a, b) => a.rawDate - b.rawDate);
  futureEvents.sort((a, b) => a.rawDate - b.rawDate);

  // Bascule sur les événements futurs si tous les événements d'aujourd'hui sont terminés
  const remainingTodayEvents = todayEvents.filter(e => e.rawDate.getTime() > now.getTime());

  if (remainingTodayEvents.length > 0) {
    return { events: todayEvents, isFutureEvents: false };
  }

  return { events: futureEvents.slice(0, 4), isFutureEvents: true };
}

function renderLoading(container) {
  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">AGENDA DU JOUR</h2>
      <span class="card-subtitle">Chargement...</span>
    </div>
    <div class="card-content" style="text-align: center; color: var(--text-secondary); padding: 1rem 0; font-size: 0.85rem;">
      Récupération des événements...
    </div>
  `;
}

function renderError(container) {
  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">AGENDA DU JOUR</h2>
      <span class="card-subtitle">Erreur</span>
    </div>
    <div class="card-content" style="text-align: center; color: #ef4444; padding: 1rem 0; font-size: 0.85rem;">
      Impossible de charger l'agenda.
    </div>
  `;
}

// Fonction utilitaire pour calculer la durée restante exacte
function formatTimeRemaining(targetDate) {
  const now = new Date();
  const diffMs = targetDate - now;

  if (diffMs <= 0) return 'maintenant';

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days}j ${remainingHours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function renderCalendar(container, events, isFutureEvents) {
  if (events.length === 0) {
    container.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">AGENDA DU JOUR</h2>
        <span class="card-subtitle">Événements du jour</span>
      </div>
      <div class="card-content" style="text-align: center; color: var(--text-secondary); padding: 1rem 0; font-size: 0.85rem;">
        Aucun événement à venir.
      </div>
    `;
    return;
  }

  // Rendu de la liste
  const eventsHtml = events.map(event => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; background: var(--bg-color); border-radius: var(--border-radius-sm); margin-bottom: 0.5rem;">
      <div style="display: flex; align-items: center; gap: 0.8rem;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-color); background: rgba(99, 102, 241, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">${event.time}</span>
        <span style="font-size: 0.9rem; color: var(--text-primary);">${event.title}</span>
      </div>
    </div>
  `).join('');

  // Gestion du pied de carte et du titre selon la situation
  let footerText = '';
  let headerSubtitle = 'Événements du jour';

  if (isFutureEvents) {
    headerSubtitle = 'Prochains événements';
    const nextFutureEvent = events[0];
    const timeRemainingStr = formatTimeRemaining(nextFutureEvent.rawDate);

    footerText = `<span>Prochain : <strong style="color: var(--accent-color);">${nextFutureEvent.title}</strong> dans ${timeRemainingStr}</span>`;
  } else {
    const now = new Date();
    const nextEvent = events.find(e => e.rawDate > now);

    if (nextEvent) {
      const timeRemainingStr = formatTimeRemaining(nextEvent.rawDate);

      footerText = `
        <span>Prochain : <strong style="color: var(--accent-color);">${nextEvent.title}</strong> dans ${timeRemainingStr}</span>
        <span>${events.length} aujourd'hui</span>
      `;
    } else {
      headerSubtitle = 'Prochains événements';
      footerText = `
        <span>Tous les événements d'aujourd'hui sont terminés</span>
        <span>${events.length} aujourd'hui</span>
      `;
    }
  }

  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">AGENDA</h2>
      <span class="card-subtitle">${headerSubtitle}</span>
    </div>
    <div class="card-content">
      <div style="display: flex; flex-direction: column;">
        ${eventsHtml}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-secondary);">
        ${footerText}
      </div>
    </div>
  `;
}