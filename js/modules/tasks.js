// Clés d'identification pour la sauvegarde locale dans le navigateur
const TASKS_STORAGE_KEY = "dashboard_tasks";
const LAST_CLEANUP_KEY = "dashboard_tasks_last_cleanup";

// Stocke temporairement l'index de la tâche en cours de déplacement (Drag & Drop)
let draggedIndex = null;

// Fonction d'initialisation du widget de tâches, appelée au chargement de la page
export function initTasks() {
  const tasksCard = document.getElementById('tasks-widget');
  if (!tasksCard) return;

  checkDailyCleanup();

  renderTasksWidget(tasksCard);
}

//Gestion des tâches : récupération, sauvegarde, nettoyage quotidien

// Récupère les tâches depuis le stockage local ou initialise avec des tâches par défaut
function getTasks() {
  const saved = localStorage.getItem(TASKS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  // Tâches par défaut (chargées une seule fois lors de la première ouverture)
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

// Enregistre les tâches dans le stockage local du navigateur
function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

// Nettoie les tâches terminées une fois par jour pour éviter l'encombrement
function checkDailyCleanup() {
  const today = new Date().toDateString(); // Format chaîne lisible : "Thu Oct 01 2026"
  const lastCleanup = localStorage.getItem(LAST_CLEANUP_KEY);

  // Si la date enregistrée diffère de la date d'aujourd'hui, on fait le ménage
  if (lastCleanup !== today) {
    clearCompletedTasksSilently();
    localStorage.setItem(LAST_CLEANUP_KEY, today); // Met à jour la date du dernier nettoyage
  }
}

// Supprime silencieusement toutes les tâches complétées sans réafficher le widget
function clearCompletedTasksSilently() {
  const tasks = getTasks();
  const activeTasks = tasks.filter((t) => !t.completed); // Garde uniquement les non complétées
  saveTasks(activeTasks);
}

// Fonction utilitaire pour formater le temps restant avant une date cible
window.handleDragStart = function (index, event) {
  draggedIndex = index; // On retient l'index de l'élément attrapé
  event.dataTransfer.effectAllowed = "move";
  event.target.style.opacity = "0.4"; // Effet visuel de transparence pendant le transport
};

// Gestion de l'événement de survol lors du glissement
window.handleDragOver = function (event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

// Gestion du dépôt de l'élément déplacé
window.handleDrop = function (targetIndex, event) {
  event.preventDefault();

  // Si aucun élément n'est en cours de déplacement ou si l'élément est déposé à sa position d'origine, on ne fait rien
  if (draggedIndex === null || draggedIndex === targetIndex) return;

  const tasks = getTasks();

  // Retire l'élément déplacé de sa position initiale
  const [movedTask] = tasks.splice(draggedIndex, 1);

  // Réinsère l'élément à sa nouvelle position
  tasks.splice(targetIndex, 0, movedTask);

  draggedIndex = null;
  saveTasks(tasks); // Enregistre le nouvel ordre
  initTasks(); // Réaffiche la liste réordonnée
};

// Gestion de la fin du glissement (Drag & Drop)
window.handleDragEnd = function (event) {
  event.target.style.opacity = "1";
  draggedIndex = null;
};

// Action de suppression d'une tâche via le clic droit ou le bouton ✕
window.toggleTask = function (id) {
  const tasks = getTasks();
  const updated = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  );
  saveTasks(updated);
  initTasks();
};

// Traitement de l'ajout d'une nouvelle tâche via le formulaire
window.handleAddTask = function (event) {
  event.preventDefault(); // Empêche le rechargement de la page par le formulaire

  const input = document.getElementById('task-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return; // Évite d'ajouter des tâches vides

  const tasks = getTasks();
  tasks.push({
    id: Date.now(), // ID unique basé sur l'horodatage actuel
    text: text,
    completed: false,
  });

  saveTasks(tasks);
  initTasks();
};

// Fonction pour modifier le texte d'une tâche existante via un double-clic
window.editTask = function (id, event) {
  // Empêche le déclenchement simultané de la coche/décoche au double-clic
  event.stopPropagation();

  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const newText = prompt("Modifier la tâche :", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks(tasks);
    initTasks();
  }
};

// Supprime une tâche spécifique en fonction de son ID
window.deleteTask = function (id, event) {
  // Empêche l'événement de remonter au <li> (évite de cocher la tâche quand on clique sur ✕)
  if (event) event.stopPropagation();

  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  initTasks();
};

// Supprime toutes les tâches complétées et réinitialise l'affichage
window.clearCompleted = function () {
  clearCompletedTasksSilently();
  initTasks();
};

// Fonction utilitaire pour formater le temps restant avant une date cible

function renderTasksWidget(tasksCard) {
  const tasks = getTasks();
  const completedCount = tasks.filter((t) => t.completed).length;

  // Construction dynamique des lignes de tâches <li>
  const tasksListHtml =
    tasks.length === 0
      ? `<li style="list-style: none; color: var(--text-secondary); text-align: center; padding: 0.5rem 0; font-size: 0.9rem;">Aucune tâche pour le moment</li>`
      : tasks
          .map(
            (task, index) => `
        <li 
          draggable="true"
          ondragstart="handleDragStart(${index}, event)"
          ondragover="handleDragOver(event)"
          ondrop="handleDrop(${index}, event)"
          ondragend="handleDragEnd(event)"
          onclick="toggleTask(${task.id})"
          ondblclick="editTask(${task.id}, event)"
          oncontextmenu="deleteTask(${task.id}, event); return false;" 
          title="Glisser: réordonner | Clic: cocher | Double-clic: modifier | Clic droit: supprimer"
          style="display: flex; align-items: center; justify-content: space-between; list-style: none; margin-bottom: 0.5rem; cursor: grab; user-select: none; transition: opacity 0.2s;"
        >
          <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden;">
            <!-- Poignée visuelle de glissement -->
            <span style="color: var(--text-secondary); opacity: 0.4; font-size: 0.8rem; cursor: grab;">⋮⋮</span>

            <!-- Case à cocher (lecture seule car l'action est gérée par le <li> parent) -->
            <input 
              type="checkbox" 
              ${task.completed ? "checked" : ""} 
              style="accent-color: var(--accent-color); width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;"
              readonly
            >
            
            <!-- Libellé de la tâche -->
            <span style="${task.completed ? "text-decoration: line-through; color: var(--text-secondary); opacity: 0.7;" : "color: var(--text-primary);"} transition: all 0.2s;">
              ${task.text}
            </span>
          </div>
          
          <!-- Bouton de suppression rapide -->
          <button 
            onclick="deleteTask(${task.id}, event)" 
            style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; opacity: 0.4; padding: 0.2rem 0.4rem; border-radius: 4px; flex-shrink: 0;"
            onmouseover="this.style.opacity='1'; this.style.color='#ef4444';"
            onmouseout="this.style.opacity='0.4'; this.style.color='var(--text-secondary)';"
            title="Supprimer la tâche"
          >
            ✕
          </button>
        </li>
      `,
          )
          .join("");

  // Rendu final du widget de tâches
  tasksCard.innerHTML = `
    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 class="card-title">TÂCHES</h2>
        <span class="card-subtitle">${completedCount} / ${tasks.length} complétée(s)</span>
      </div>
      ${
        completedCount > 0
          ? `
        <button 
          onclick="clearCompleted()" 
          style="background: none; border: none; color: var(--text-secondary); font-size: 0.75rem; cursor: pointer; text-decoration: underline; opacity: 0.8;"
          title="Effacer les tâches terminées"
        >
          Purger
        </button>
      `
          : ""
      }
    </div>

    <div class="card-content">
      <!-- Zone de saisie rapide -->
      <form onsubmit="handleAddTask(event)" style="display: flex; gap: 0.5rem; margin-bottom: 0.8rem;">
        <input 
          id="task-input" 
          type="text" 
          placeholder="Ajouter une tâche..." 
          autocomplete="off"
          style="flex: 1; padding: 0.4rem 0.6rem; border-radius: var(--border-radius-sm, 4px); border: 1px solid rgba(255,255,255,0.1); background: var(--bg-color); color: var(--text-primary); font-size: 0.85rem; outline: none;"
        />
        <button 
          type="submit" 
          style="padding: 0.4rem 0.75rem; background: var(--accent-color); color: white; border: none; border-radius: var(--border-radius-sm, 4px); cursor: pointer; font-weight: 600; font-size: 0.85rem;"
        >
          +
        </button>
      </form>

      <!-- Liste des tâches Scrollable -->
      <ul style="padding: 0; margin: 0; max-height: 200px; overflow-y: auto;">${tasksListHtml}</ul>
    </div>
  `;
}
