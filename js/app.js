import { initHeader } from './modules/header.js';
import { initWeather } from './modules/weather.js';
import { initCalendar } from './modules/calendar.js';
import { initTasks } from './modules/tasks.js';
import { initCanadiens } from './modules/canadiens.js';
import { initLinks } from './modules/links.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initWeather();
  initCalendar();
  initTasks();
  initCanadiens();
  initLinks();
});