// src/views/matchups.ts

interface Fighter {
  id: string;
  name: string;
  thumbnail: string;
}

interface FighterDetails {
  id: string;
  name: string;
  matchups?: {
    winning_hard: string[]; // +2
    winning_soft: string[]; // +1
    even: string[];         // 0
    losing_soft: string[];  // -1
    losing_hard: string[];  // -2
  };
}

// On garde le roster en mémoire pour retrouver les images des adversaires
let globalRoster: Fighter[] = [];

export async function renderMatchups() {
  const app = document.getElementById("app");
  if (!app) return;

  // 1. Charger le Roster global si pas encore fait
  if (globalRoster.length === 0) {
    try {
      const response = await fetch("/assets/data/roster.json");
      globalRoster = await response.json();
    } catch (error) {
      console.error("Erreur chargement roster", error);
      app.innerHTML = "<p>Erreur de chargement des données.</p>";
      return;
    }
  }

  // 2. Afficher la grille de sélection (Titre + Grille)
  app.innerHTML = `
    <div class="fade-in">
      <h1 style="text-align:center;">SÉLECTIONNEZ UN COMBATTANT</h1>
      <p style="text-align:center; margin-bottom:2rem;">Pour voir son tableau des matchups</p>
      <div class="roster-grid" id="matchup-selection-grid"></div>
    </div>
    <div id="matchup-chart-container" style="display:none;"></div>
  `;

  const grid = document.getElementById("matchup-selection-grid");
  
  // Générer les cartes
  globalRoster.forEach((fighter) => {
    const card = document.createElement("div");
    card.classList.add("fighter-card");
    card.innerHTML = `
      <div class="card-image" style="background-image: url('/assets/images/${fighter.thumbnail}')"></div>
      <div class="card-name">${fighter.name}</div>
    `;
    // Au clic, on lance l'affichage du chart
    card.addEventListener("click", () => showMatchupChart(fighter.id));
    grid?.appendChild(card);
  });
}

// Fonction pour afficher le tableau (Tier List)
async function showMatchupChart(fighterId: string) {
  const container = document.getElementById("matchup-chart-container");
  const selectionGrid = document.querySelector(".fade-in") as HTMLElement;
  
  if (!container || !selectionGrid) return;

  // Masquer la grille, afficher le loader ou vide
  selectionGrid.style.display = "none";
  container.style.display = "block";
  container.innerHTML = "<p style='text-align:center;'>Analyse des données...</p>";

  try {
    // Récupérer les détails du perso (avec ses matchups)
    const res = await fetch(`/assets/data/fighters/${fighterId}.json`);
    const data: FighterDetails = await res.json();

    if (!data.matchups) {
      container.innerHTML = `
        <h2 style="text-align:center; margin-top:2rem;">Données indisponibles</h2>
        <p style="text-align:center;">Aucun matchup enregistré pour ${data.name}.</p>
        <button class="ssbu-button" id="back-btn" style="display:block; margin: 2rem auto;">RETOUR</button>
      `;
      document.getElementById("back-btn")?.addEventListener("click", renderMatchups);
      return;
    }

    // Construire le HTML du Chart
    // On utilise une fonction helper pour générer chaque ligne (row)
    const renderRow = (label: string, ids: string[], colorClass: string) => {
      const iconsHtml = ids.map(id => {
        const opponent = globalRoster.find(r => r.id === id);
        if (!opponent) return ""; // Si ID inconnu
        return `<img src="/assets/images/${opponent.thumbnail}" alt="${opponent.name}" title="${opponent.name}" class="tier-icon">`;
      }).join("");

      return `
        <div class="tier-row">
          <div class="tier-label ${colorClass}">${label}</div>
          <div class="tier-content">${iconsHtml || "<span style='opacity:0.3; padding-left:1rem;'>-</span>"}</div>
        </div>
      `;
    };

    container.innerHTML = `
      <div class="matchup-header" style="text-align:center; margin-bottom:2rem;">
        <h1 class="char-name">${data.name.toUpperCase()}</h1>
        <p>Tableau des Matchups</p>
        <button class="ssbu-button" id="back-btn-chart" style="padding: 0.5rem 1.5rem; font-size:1rem;">Changer de perso</button>
      </div>

      <div class="tier-list-wrapper">
        ${renderRow("WINNING (+2)", data.matchups.winning_hard, "bg-green-dark")}
        ${renderRow("WINNING (+1)", data.matchups.winning_soft, "bg-green-light")}
        ${renderRow("EVEN (0)", data.matchups.even, "bg-yellow")}
        ${renderRow("LOSING (-1)", data.matchups.losing_soft, "bg-orange")}
        ${renderRow("LOSING (-2)", data.matchups.losing_hard, "bg-red")}
      </div>
    `;

    document.getElementById("back-btn-chart")?.addEventListener("click", renderMatchups);

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erreur lors du chargement du fichier personnage.</p>";
  }
}