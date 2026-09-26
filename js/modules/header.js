export function initHeader() {
  const clockElement = document.getElementById('clock');
  const dateElement = document.getElementById('date');

  function updateClock() {
    const now = new Date();
    
    // Format Heure : 19:56:05
    if (clockElement) {
      clockElement.textContent = now.toLocaleTimeString('fr-CA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }

    // Format Date : Jeudi 24 Septembre 2026
    if (dateElement) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const dateStr = now.toLocaleDateString('fr-CA', options);
      // Capitaliser la première lettre du jour
      dateElement.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}