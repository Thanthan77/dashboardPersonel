export function initTasks() {
  const tasksCard = document.getElementById('tasks-widget');
  if (!tasksCard) return;

  const mockTasks = [
    { text: 'Réviser Java', completed: true },
    { text: 'Finir laboratoire', completed: true },
    { text: 'Répondre courriels équipe', completed: true },
    { text: 'Portfolio', completed: false },
    { text: 'Projet personnel', completed: false }
  ];

  const tasksListHtml = mockTasks.map(task => `
    <li style="display: flex; align-items: center; gap: 0.75rem; list-style: none; margin-bottom: 0.5rem;">
      <input type="checkbox" ${task.completed ? 'checked' : ''} style="accent-color: var(--accent-color); width: 18px; height: 18px;">
      <span style="${task.completed ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${task.text}</span>
    </li>
  `).join('');

  tasksCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">TÂCHES</h2>
      <span class="card-subtitle">3 / 5 complétées</span>
    </div>
    <div class="card-content">
      <ul style="padding: 0;">${tasksListHtml}</ul>
      <button style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem; cursor: pointer;">+ Ajouter une tâche</button>
    </div>
  `;
}