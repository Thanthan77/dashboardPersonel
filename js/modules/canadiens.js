// URL du proxy Cloudflare Workers
const PROXY_URL = "https://proxy12.ethanqc-chea.workers.dev/?url=";

// Helper Fetch JSON
async function getJson(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error("Erreur fetch :", e);
    return null;
  }
}

// Récupération des données NHL des Canadiens
async function getMatchsCanadiens() {
  const team = "MTL";
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const seasonStart = month >= 9 ? year : year - 1;
  const seasonEnd = seasonStart + 1;
  const seasonId = `${seasonStart}${seasonEnd}`;

  const apiUrl = `${PROXY_URL}https://api-web.nhle.com/v1/club-schedule-season/${team}/${seasonId}`;
  const data = await getJson(apiUrl);

  if (!data?.games) return null;

  const frenchMonths = {
    "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
    "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril", "05": "Mai", "06": "Juin"
  };

  const result = { futurs_par_mois: {} };

  for (const match of data.games) {
    if (match.gameState !== "FUT") continue;

    const date = match.gameDate;
    if (!date) continue;

    const monthNum = date.substring(5, 7);
    const monthName = frenchMonths[monthNum] || `Mois ${monthNum}`;
    const home = match.homeTeam?.abbrev;
    const away = match.awayTeam?.abbrev;
    const isHome = home === team;

    const startTimeUtc = match.startTimeUTC;
    const localDate = new Date(startTimeUtc);
    const heureLocale = localDate.toLocaleTimeString("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Montreal"
    });

    const formattedFuture = {
      Date: date,
      StartTimeUTC: startTimeUtc,
      Heure: heureLocale,
      Adversaire: isHome ? away : home,
      LogoHome: match.homeTeam?.logo, // Logo de l'équipe à domicile
      LogoAway: match.awayTeam?.logo, // Logo de l'équipe visiteuse
      Domicile: isHome,
    };

    if (!result.futurs_par_mois[monthName]) {
      result.futurs_par_mois[monthName] = [];
    }

    result.futurs_par_mois[monthName].push(formattedFuture);
  }

  return result;
}

// Helper pour le texte de décompte
function getCountdownText(startTimeUtc) {
  if (!startTimeUtc) return "Prochainement";

  const matchDateTime = new Date(startTimeUtc);
  const now = new Date();
  const diffMs = matchDateTime - now;

  if (diffMs <= 0) return "Match imminent ou en cours";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `Dans ${days} jour${days > 1 ? "s" : ""}`;
  }

  return `Dans ${hours} heure${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`;
}

// Fonction exportée principale
export async function initCanadiens() {
  const canadiensCard = document.getElementById("canadiens-widget");
  if (!canadiensCard) return;

  // État de chargement initial
  canadiensCard.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">CANADIENS DE MONTRÉAL</h2>
      <span class="card-subtitle">LNH</span>
    </div>
    <div class="card-content" style="text-align: center; padding: 1.5rem 0; color: var(--text-secondary);">
      Chargement du prochain match...
    </div>
  `;

  try {
    const data = await getMatchsCanadiens();

    if (!data || !data.futurs_par_mois) {
      renderNoMatch(canadiensCard);
      return;
    }

    const allFutureMatches = Object.values(data.futurs_par_mois)
      .flat()
      .sort((a, b) => new Date(a.StartTimeUTC) - new Date(b.StartTimeUTC));

    if (allFutureMatches.length === 0) {
      renderNoMatch(canadiensCard);
      return;
    }

    const match = allFutureMatches[0];
    const isHome = match.Domicile;
    const locationText = isHome ? "Centre Bell" : `Extérieur (${match.Adversaire})`;

    // URLs des logos avec fallback SVG par défaut 
    const logoHomeUrl = match.LogoHome || "https://assets.nhle.com/logos/nhl/svg/MTL_light.svg";
    const logoAwayUrl = match.LogoAway || "https://assets.nhle.com/logos/nhl/svg/MTL_light.svg";

    // Format de date : Vendredi, 19 h 00
    const matchDate = new Date(`${match.Date}T12:00:00`);
    const dayName = matchDate.toLocaleDateString("fr-CA", { weekday: "long" });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dateAndHour = `${capitalizedDay}, ${match.Heure}`;

    const countdown = getCountdownText(match.StartTimeUTC);

    // Injection du HTML avec les images des logos
    canadiensCard.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">CANADIENS DE MONTRÉAL</h2>
        <span class="card-subtitle">LNH</span>
      </div>
      <div class="card-content" style="text-align: center;">
        <div style="display: flex; justify-content: space-around; align-items: center; margin: 1rem 0;">
          <img src="${logoHomeUrl}" alt="Équipe Domicile" style="width: 80px; height: 80px; object-fit: contain;">
          <span style="color: var(--text-secondary);">VS</span>
          <img src="${logoAwayUrl}" alt="Équipe Visiteuse" style="width: 80px; height: 80px; object-fit: contain;">
        </div>
        <p style="font-size: 0.9rem;">${dateAndHour} — <strong>${locationText}</strong></p>
        <p style="color: var(--accent-color); font-size: 0.85rem; font-weight: 600; margin-top: 0.25rem;">${countdown}</p>
      </div>
    `;

  } catch (error) {
    console.error("Erreur initCanadiens :", error);
    renderNoMatch(canadiensCard);
  }
}

function renderNoMatch(container) {
  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">CANADIENS DE MONTRÉAL</h2>
      <span class="card-subtitle">LNH</span>
    </div>
    <div class="card-content" style="text-align: center; padding: 1rem 0; color: var(--text-secondary);">
      Aucun match futur prévu.
    </div>
  `;
}