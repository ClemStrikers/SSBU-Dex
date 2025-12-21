import './style.css';
import type { Character, Move } from "./types"; 
import { renderMatchups } from './views/matchups';
// IMPORTANT : On importe aussi getFighterColor maintenant
import { renderRoster, getFighterColor } from './views/roster';

interface RosterItem {
  id: string;
  name: string;
  thumbnail: string;
  isEcho?: boolean;
}

let roster: RosterItem[] = [];
const app = document.getElementById('app') as HTMLElement;

// --- 1. SYSTÈME DE NAVIGATION ---

function navigateTo(page: string, param?: string) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-link') === page) {
      link.classList.add('active');
    }
  });

  switch (page) {
    case 'home': renderHome(); break;
    case 'roster': loadAndRenderRosterView(); break;
    case 'matchups': renderMatchups(); break;
    case 'detail': if (param) loadAndRenderCharacter(param); break;
    default: renderHome();
  }
}

// --- 2. LOGIQUE DE CHARGEMENT ---

async function loadAndRenderRosterView() {
    app.innerHTML = '<h2 style="text-align:center; color:white; margin-top: 50px;">Chargement du Roster...</h2>';
    const html = await renderRoster();
    app.innerHTML = html;
    const cards = document.querySelectorAll('.fighter-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            if (id) navigateTo('detail', id);
        });
    });
}

async function loadRoster() {
  try {
    const response = await fetch('/assets/data/roster.json');
    if (!response.ok) throw new Error("Erreur chargement roster");
    roster = await response.json();
    renderHome(); 
  } catch (error) {
    console.error("Erreur:", error);
    app.innerHTML = "<h2 style='text-align:center; padding:2rem;'>Impossible de charger la liste des combattants.</h2>";
  }
}

async function loadAndRenderCharacter(id: string) {
  app.innerHTML = '<h2 style="text-align:center; margin-top:50px; color:white;">Chargement...</h2>';
  try {
    const response = await fetch(`/assets/data/fighters/${id}.json`);
    if (!response.ok) throw new Error("Fichier introuvable");
    const char: Character = await response.json();
    renderCharacterDetail(char);
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <div style="text-align:center; padding:3rem;">
        <h2>Erreur : Impossible de charger ce personnage.</h2>
        <button class="ssbu-button" id="retry">Retour au Roster</button>
      </div>
    `;
    document.getElementById('retry')?.addEventListener('click', () => navigateTo('roster'));
  }
}

// --- 3. VUES (RENDU HTML) ---

function renderHome() {
  app.innerHTML = `
    <div id="home" class="fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
      
      <img src="/assets/images/logo.png" 
           alt="SSBU Logo" 
           style="max-width: 450px; width: 90%; margin-bottom: 1rem; filter: drop-shadow(0 0 20px rgba(230, 0, 18, 0.6));"
      />

      <h1 style="margin-top: 0; font-size: 3rem;">Bienvenue sur le SSBU Dex</h1>
      
      <p>L'encyclopédie ultime des ${roster.length > 0 ? roster.length : '89'} combattants.</p>
      
      <button class="ssbu-button" id="btn-roster" style="margin-top: 2rem;">Voir le Roster</button>
    </div>
  `;
  
  document.getElementById('btn-roster')?.addEventListener('click', () => navigateTo('roster'));
}

function renderCharacterDetail(char: Character) {
  // 1. On récupère la couleur thématique du personnage
  const themeColor = getFighterColor(char.id);

  // 2. LOGIQUE DES COSTUMES (NOUVEAU)
  // On initialise le compteur de costume à 0 (défaut)
  let currentCostume = 0;
  
  // On prépare le nom du fichier pour pouvoir le modifier (ex: "link" et "png")
  // Cela permet de passer de "link.png" à "link_1.png", "link_2.png" etc.
  const baseImageName = char.image?.replace(/\.(png|jpg|jpeg|webp)$/i, '') || '';
  const fileExtension = char.image?.split('.').pop() || 'png';

  // Helper pour afficher les catégories de mouvements (inchangé)
  const renderCategory = (title: string, moves: Move[]) => {
      if (!moves || moves.length === 0) return '';
      
      const movesHtml = moves.map(m => `
        <div class="move-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
          <div style="flex: 1; padding-right: 1rem;">
            <h4 style="margin: 0; font-size: 1.2rem; color: #fff; text-transform:uppercase; font-style:italic;">${m.name}</h4>
            <p style="margin: 0.5rem 0 0 0; color: #ccc; font-size: 0.95rem;">${m.description}</p>
          </div>
          <div style="text-align: right; min-width: 110px;">
             <span style="display: inline-block; background: var(--theme-color); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-bottom: 4px; box-shadow: 0 0 5px var(--theme-color); text-shadow: 1px 1px 2px #000;">${m.input}</span>
             <div style="color: var(--theme-color); font-weight:900; font-size: 1.1rem; margin-top:5px; text-shadow: 0 0 10px var(--theme-color);">${m.damage}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="move-category" style="margin-top: 2.5rem;">
          <h3 style="color: var(--theme-color); text-transform: uppercase; border-bottom: 3px solid var(--theme-color); display: inline-block; margin-bottom: 1.5rem; font-size: 1.8rem; text-shadow: 2px 2px 0 #000;">${title}</h3>
          <div>${movesHtml}</div>
        </div>
      `;
  };

  // 3. Rendu HTML avec l'injection de la variable CSS
  app.innerHTML = `
    <div class="char-detail fade-in" style="--theme-color: ${themeColor}; max-width: 1000px; margin: 0 auto; padding: 2rem;">
      
      <button class="ssbu-button" id="back-btn" style="padding:0.5rem 1.5rem; margin-bottom:2rem; font-size:1rem;">← RETOUR</button>
      
      <div style="display:flex; justify-content: space-between; align-items:flex-end; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
         <div style="flex: 1; min-width: 300px;">
            <h1 style="font-size: 6rem; margin:0; line-height:0.8; opacity: 0.1; font-weight: 900; transform: translateY(30px);">#${char.id}</h1>
            <h2 style="font-size: 4rem; margin:0; color: var(--theme-color); text-transform: uppercase; text-shadow: 3px 3px 0 #000; transform: skewX(-10deg);">${char.name}</h2>
            <span style="color: #aaa; font-size: 1.5rem; letter-spacing: 2px; text-transform: uppercase;">${char.series}</span>
         </div>
         
         <div style="flex-shrink: 0; position: relative;">
            <span style="position: absolute; top: -20px; right: 0; color: #aaa; font-size: 0.8rem; font-style: italic; opacity: 0.7;">(Clique pour changer de costume)</span>
            
            <img id="char-main-img" 
                 src="/assets/images/${char.image}" 
                 alt="${char.name}" 
                 title="Cliquez pour changer de costume"
                 style="height: 350px; object-fit: contain; filter: drop-shadow(0 0 20px var(--theme-color)); cursor: pointer; transition: transform 0.1s ease-in-out;"
                 onerror="this.style.display='none'"
            />
         </div>
      </div>

      <div style="font-size: 1.2rem; line-height: 1.6; color: #eee; background: rgba(0,0,0,0.4); padding: 2rem; border-radius: 10px; border-left: 8px solid var(--theme-color); backdrop-filter: blur(5px); box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
        ${char.description}
      </div>

      ${renderCategory('Attaques Spéciales', char.moves.specials)}
      ${char.moves.command_inputs ? renderCategory('Command Inputs', char.moves.command_inputs) : ''}
      ${renderCategory('Attaques Smash', char.moves.smash)}
      ${renderCategory('Attaques Neutres', char.moves.neutral)}
      ${renderCategory('Attaques Aériennes', char.moves.aerials)}
      ${renderCategory('Projections', char.moves.throws)}
    </div>
  `;
  
  // 4. Gestion des événements
  document.getElementById('back-btn')?.addEventListener('click', () => navigateTo('roster'));

  // --- Événements pour le changement de costume ---
  const imgElement = document.getElementById('char-main-img') as HTMLImageElement;
  
  if (imgElement) {
      // Au clic sur l'image
      imgElement.addEventListener('click', () => {
          // Animation visuelle (petit rebond)
          imgElement.style.transform = "scale(0.95)";
          setTimeout(() => imgElement.style.transform = "scale(1)", 100);

          // On incrémente le numéro du costume
          currentCostume++;

          // Calcul du nouveau chemin :
          // Si costume > 0, on cherche "nom_1.png", "nom_2.png"...
          // Si on revient à 0, on remet l'image originale du JSON
          const newSrc = currentCostume === 0 
            ? `/assets/images/${char.image}`
            : `/assets/images/${baseImageName}_${currentCostume}.${fileExtension}`;
          
          imgElement.src = newSrc;
      });

      // Gestion d'erreur (si le costume n'existe pas)
      // Si on cherche "mario_8.png" et qu'il n'existe pas, on revient automatiquement au costume de base
      imgElement.addEventListener('error', () => {
          // On ne reset que si on n'est pas déjà sur l'image de base (pour éviter une boucle infinie si l'image de base manque aussi)
          if (currentCostume > 0) {
              console.log(`Costume ${currentCostume} introuvable, retour au début.`);
              currentCostume = 0;
              imgElement.src = `/assets/images/${char.image}`;
              // Réinitialise l'affichage au cas où le onerror précédent l'aurait caché
              imgElement.style.display = 'block'; 
          }
      });
  }
}

// --- 4. INITIALISATION ---

document.addEventListener('DOMContentLoaded', () => {
  loadRoster();
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('[data-link]');
    if (link) {
      e.preventDefault();
      const pageName = link.getAttribute('data-link');
      if (pageName) {
        navigateTo(pageName);
        navLinks?.classList.remove('active');
      }
    }
  });
});