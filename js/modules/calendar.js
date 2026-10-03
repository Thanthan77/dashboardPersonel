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

  const maxFutureDate = new Date();
  maxFutureDate.setDate(now.getDate() + 7);

  const todayEvents = [];
  const futureEvents = [];

  function processEventInstance(event, startDate, eventStart) {
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
      const startDate = event.startDate.toJSDate();
      processEventInstance(event, startDate, startDate.getTime());
    }
  });

  todayEvents.sort((a, b) => a.rawDate - b.rawDate);
  futureEvents.sort((a, b) => a.rawDate - b.rawDate);

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
    <div class="card-content">
      <div class="agenda-status-message">Récupération des événements...</div>
    </div>
  `;
}

function renderError(container) {
  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">AGENDA DU JOUR</h2>
      <span class="card-subtitle">Erreur</span>
    </div>
    <div class="card-content">
      <div class="agenda-status-message error">Impossible de charger l'agenda.</div>
    </div>
  `;
}

function formatTimeRemaining(targetDate) {
  const now = new Date();
  const diffMs = targetDate - now;

  if (diffMs <= 0) return 'maintenant';

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) return `${days}j ${remainingHours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function renderCalendar(container, events, isFutureEvents) {
  if (events.length === 0) {
    container.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">AGENDA DU JOUR</h2>
        <span class="card-subtitle">Événements du jour</span>
      </div>
      <div class="card-content">
        <div class="agenda-status-message">Aucun événement à venir.</div>
      </div>
    `;
    return;
  }

  const eventsHtml = events.map(event => `
    <div class="agenda-item">
      <div class="agenda-item-left">
        <span class="agenda-time-badge">${event.time}</span>
        <span class="agenda-event-title">${event.title}</span>
      </div>
    </div>
  `).join('');

  let footerText = '';
  let headerSubtitle = 'Événements du jour';

  if (isFutureEvents) {
    headerSubtitle = 'Prochains événements';
    const nextFutureEvent = events[0];
    const timeRemainingStr = formatTimeRemaining(nextFutureEvent.rawDate);

    footerText = `<span>Prochain : <strong>${nextFutureEvent.title}</strong> dans ${timeRemainingStr}</span>`;
  } else {
    const now = new Date();
    const nextEvent = events.find(e => e.rawDate > now);

    if (nextEvent) {
      const timeRemainingStr = formatTimeRemaining(nextEvent.rawDate);
      footerText = `
        <span>Prochain : <strong>${nextEvent.title}</strong> dans ${timeRemainingStr}</span>
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
      <div class="agenda-list">
        ${eventsHtml}
      </div>
      <div class="agenda-footer">
        ${footerText}
      </div>
    </div>
  `;
}