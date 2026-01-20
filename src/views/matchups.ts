// src/views/matchups.ts

interface Fighter {
  id: string;
  name: string;
  thumbnail: string;
  // Si tu as une couleur dans ton JSON, ajoute-la ici : color?: string;
}

interface FighterDetails {
  id: string;
  name: string;
  matchups?: {
    winning_very_hard: string[];
    winning_hard: string[];
    winning: string[];
    winning_soft: string[];
    even: string[];
    losing_soft: string[];
    losing: string[];
    losing_hard: string[];
    losing_very_hard: string[];
  };
}

let globalRoster: Fighter[] = [];

// Fonction utilitaire pour donner une couleur style Smash si elle n'est pas dans le JSON
function getFighterColor(id: string): string {
  // Palette de couleurs inspirée des series Smash (Mario Red, Link Green, etc.)
  const colors = ["#e60012", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#1abc9c", "#e91e63"];
  // On utilise l'ID pour toujours avoir la même couleur pour le même perso
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export async function renderMatchups() {
  const app = document.getElementById("app");
  if (!app) return;

  if (globalRoster.length === 0) {
    try {
      const response = await fetch("/assets/data/roster.json");
      globalRoster = await response.json();
    } catch (error) {
      console.error("Erreur chargement roster", error);
      return;
    }
  }

  function getCleanFileName(name: string): string {
  return name
    .toLowerCase()                   // Tout en minuscule
    .replace(/\./g, '')              // Enlève les points (Dr.)
    .replace(/\s+/g, '')             // Enlève tous les espaces
    .replace(/&/g, '')               // Enlève les esperluettes (Pyra & Mythra)
    .replace(/[^a-z0-9]/g, '');      // Sécurité : enlève tout ce qui n'est pas lettre ou chiffre
}

  // Structure principale
  app.innerHTML = `
    <div class="fade-in">
      <div style="text-align:center; margin-bottom: 2rem;">
        <h1>SÉLECTIONNEZ UN COMBATTANT</h1>
        <p>Analysez les pourcentages de victoire et les contres</p>
      </div>
      <div class="roster-grid" id="matchup-selection-grid"></div>
    </div>
    <div id="matchup-chart-container" style="display:none;"></div>
  `;

  const grid = document.getElementById("matchup-selection-grid");
  
  globalRoster.forEach((fighter, index) => {
  const card = document.createElement("div");
  card.classList.add("fighter-card");
  
  const color = getFighterColor(fighter.id);
  card.style.setProperty('--char-color', color);

  // --- CORRECTION DU NOM DE FICHIER ---
  // 1. On met en minuscule
  // 2. On enlève les points (ex: Dr. -> dr)
  // 3. On enlève les espaces (ex: dark samus -> darksamus)
  const cleanId = fighter.name
    .toLowerCase()
    .replace(/\./g, '') 
    .replace(/\s+/g, '');
    
  const cleanName = getCleanFileName(fighter.name);
  const imagePath = `/assets/images/${cleanName}_icon.png`;

  card.innerHTML = `
    <div class="card-header">#${index + 1}</div>
    <div class="card-image-container">
      <img src="${imagePath}" 
           alt="${fighter.name}" 
           style="width: 100%; height: auto; display:block;"
           onerror="this.src='/assets/images/placeholder_icon.png'">
    </div>
    <div class="fighter-name">${fighter.name}</div>
  `;

  card.innerHTML = `
    <div class="card-header">#${index + 1}</div>
    <div class="card-image-container">
      <img src="${imagePath}" alt="${fighter.name}" style="width: 100%; height: auto; display:block;">
    </div>
    <div class="fighter-name">${fighter.name}</div>
  `;
  
  card.addEventListener("click", () => showMatchupChart(fighter.id));
  grid?.appendChild(card);
});

async function showMatchupChart(fighterId: string) {
  const container = document.getElementById("matchup-chart-container");
  const selectionGrid = document.querySelector(".fade-in") as HTMLElement;
  
  if (!container || !selectionGrid) return;

  selectionGrid.style.display = "none";
  container.style.display = "block";
  
  // Loader temporaire
  container.innerHTML = "<p style='text-align:center; font-size:2rem;'>LOADING...</p>";

  try {
    const res = await fetch(`/assets/data/fighters/${fighterId}.json`);
    const data: FighterDetails = await res.json();

    // Bouton retour générique
    const backButtonHtml = `<button class="ssbu-button" id="back-btn-chart" style="margin-top:2rem;">RETOUR AU ROSTER</button>`;

    if (!data.matchups) {
      container.innerHTML = `
        <div style="text-align:center; padding: 4rem;">
            <h2>Données manquantes</h2>
            <p>Pas de données pour ${data.name}</p>
            ${backButtonHtml}
        </div>
      `;
      document.getElementById("back-btn-chart")?.addEventListener("click", renderMatchups);
      return;
    }

    const renderRow = (label: string, ids: string[], color: string) => {
  const iconsHtml = ids.map(id => {
    const opponent = globalRoster.find(r => r.id === id);
    if (!opponent) return "";
    
    // Nettoyage de l'ID pour l'image
    const cleanOpponentId = opponent.name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
    const iconPath = `/assets/images/${cleanOpponentId}_icon.png`;

    return `<img src="${iconPath}" alt="${opponent.name}" title="${opponent.name}" class="tier-icon">`;
  }).join("");

  return `
    <div class="tier-row">
      <div class="tier-label" style="background-color: ${color}; color: #000; font-weight: bold;">
        ${label}
      </div>
      <div class="tier-content">${iconsHtml}</div>
    </div>
  `;
};

    // Affichage du tableau
    container.innerHTML = `
  <div class="tier-list-wrapper">
    ${renderRow("+2 / Gros Avantage", data.matchups.winning_very_hard, "#0e56f0ff")}
    ${renderRow("+1.5 / Avantage", data.matchups.winning_hard, "#28ecfaff")} 
    ${renderRow("+1 / Léger avantage", data.matchups.winning, "#2af857ff")}
    ${renderRow("+0.5 / Très léger", data.matchups.winning_soft, "#a7f52aff")}
    ${renderRow("0 / Even", data.matchups.even, "#ffef0cff")}
    ${renderRow("-0.5 / Très léger", data.matchups.losing_soft, "#f1aa40ff")}
    ${renderRow("-1 / Léger désavantage", data.matchups.losing, "#f58320ff")}
    ${renderRow("-1.5 / Désavantage", data.matchups.losing_hard, "#e74c3c")}
    ${renderRow("-2 / Gros désavantage", data.matchups.losing_very_hard, "#ff0c0cff")}
  </div>

      <div style="text-align:center;">
        ${backButtonHtml}
      </div>
    `;

    document.getElementById("back-btn-chart")?.addEventListener("click", renderMatchups);

  } catch (error) {
    console.error(error);
  }
}}