const TASKS_STORAGE_KEY = "dashboard_tasks";
const LAST_CLEANUP_KEY = "dashboard_tasks_last_cleanup";

let draggedIndex = null;

export function initTasks() {
  const tasksCard = document.getElementById('tasks-widget');
  if (!tasksCard) return;

  checkDailyCleanup();
  renderTasksWidget(tasksCard);
}

// Gestion des tâches dans le localStorage

function getTasks() {
  const saved = localStorage.getItem(TASKS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const defaultTasks = [
    { id: 1, text: "Réviser Java", completed: true },
    { id: 2, text: "Finir laboratoire", completed: true },
    { id: 3, text: "Répondre courriels équipe", completed: true },
    { id: 4, text: "Portfolio", completed: false },
    { id: 5, text: "Projet personnel", completed: false },
  ];

  saveTasks(defaultTasks);
  return defaultTasks;
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function checkDailyCleanup() {
  const today = new Date().toDateString();
  const lastCleanup = localStorage.getItem(LAST_CLEANUP_KEY);

  if (lastCleanup !== today) {
    clearCompletedTasksSilently();
    localStorage.setItem(LAST_CLEANUP_KEY, today);
  }
}

function clearCompletedTasksSilently() {
  const tasks = getTasks();
  const activeTasks = tasks.filter((t) => !t.completed);
  saveTasks(activeTasks);
}

// Html rendering

function renderTasksWidget(tasksCard) {
  const tasks = getTasks();
  const completedCount = tasks.filter((t) => t.completed).length;

  const tasksListHtml = tasks.length === 0
    ? `<li class="tasks-empty">Aucune tâche pour le moment</li>`
    : tasks.map((task, index) => `
        <li 
          class="task-item ${task.completed ? "completed" : ""}" 
          draggable="true"
          data-id="${task.id}"
          data-index="${index}"
          title="Glisser: réordonner | Clic: cocher | Double-clic: modifier | Clic droit: supprimer"
        >
          <div class="task-left">
            <span class="task-handle">⋮⋮</span>
            <input 
              type="checkbox" 
              class="task-checkbox"
              ${task.completed ? "checked" : ""} 
              readonly
            >
            <span class="task-text">${task.text}</span>
          </div>
          <button class="task-delete-btn" title="Supprimer la tâche">✕</button>
        </li>
      `).join("");

  tasksCard.innerHTML = `
    <div class="card-header">
      <div>
        <h2 class="card-title">TÂCHES</h2>
        <span class="card-subtitle">${completedCount} / ${tasks.length} complétée(s)</span>
      </div>
      ${completedCount > 0 ? `
        <button id="purge-tasks-btn" class="purge-btn" title="Effacer les tâches terminées">
          Purger
        </button>
      ` : ""}
    </div>

    <div class="card-content">
      <form id="task-form" class="task-form">
        <input 
          id="task-input" 
          type="text" 
          class="task-input"
          placeholder="Ajouter une tâche..." 
          autocomplete="off"
        />
        <button type="submit" class="task-add-btn">+</button>
      </form>

      <ul class="tasks-list">${tasksListHtml}</ul>
    </div>
  `;

  attachEvents(tasksCard);
}

// Events handling

function attachEvents(tasksCard) {
  // Formulaire d'ajout
  const form = tasksCard.querySelector('#task-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = tasksCard.querySelector('#task-input');
      const text = input?.value.trim();
      if (!text) return;

      const tasks = getTasks();
      tasks.push({ id: Date.now(), text, completed: false });
      saveTasks(tasks);
      initTasks();
    });
  }

  // Bouton Purger
  const purgeBtn = tasksCard.querySelector('#purge-tasks-btn');
  if (purgeBtn) {
    purgeBtn.addEventListener('click', () => {
      clearCompletedTasksSilently();
      initTasks();
    });
  }

  // Interactions sur la liste de tâches
  tasksCard.querySelectorAll('.task-item').forEach((li) => {
    const id = parseInt(li.dataset.id, 10);
    const index = parseInt(li.dataset.index, 10);

    // Clic : Cocher / Décoche
    li.addEventListener('click', () => {
      const tasks = getTasks().map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
      saveTasks(tasks);
      initTasks();
    });

    // Double clic : Editer
    li.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const tasks = getTasks();
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const newText = prompt("Modifier la tâche :", task.text);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks(tasks);
        initTasks();
      }
    });

    // Clic droit : Supprimer
    li.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteTask(id);
    });

    // Bouton de suppression ✕
    const deleteBtn = li.querySelector('.task-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(id);
      });
    }

    // Drag & Drop pour réordonner les tâches
    li.addEventListener('dragstart', (e) => {
      draggedIndex = index;
      e.dataTransfer.effectAllowed = "move";
      li.classList.add('dragging');
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const tasks = getTasks();
      const [movedTask] = tasks.splice(draggedIndex, 1);
      tasks.splice(index, 0, movedTask);

      draggedIndex = null;
      saveTasks(tasks);
      initTasks();
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      draggedIndex = null;
    });
  });
}

// Supprimer une tâche par son ID
function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  initTasks();
}