// src/views/roster.ts

// Interface définissant un combattant tel qu'il apparaît dans ton roster.json
interface Fighter {
  id: string;
  name: string;
  image?: string; // Optionnel : si défini dans le JSON
}

/**
 * 🎨 PALETTE DE COULEURS COMPLÈTE (89 PERSONNAGES)
 * Basée sur les couleurs officielles de l'interface Smash Ultimate (Stock Icons / UI)
 */
const characterColors: Record<string, string> = {
  // --- ORIGINAUX (N64) ---
  "01": "#e52521",  // Mario (Rouge Mario)
  "02": "#f8d030",  // Donkey Kong (Jaune Banane)
  "03": "#00aa00",  // Link (Vert Tunique)
  "04": "#e67e22",  // Samus (Orange Varia)
  "04e": "#34495e", // Dark Samus (Gris Sombre Phazon)
  "05": "#78c850",  // Yoshi (Vert Yoshi)
  "06": "#f78da7",  // Kirby (Rose Kirby)
  "07": "#2980b9",  // Fox (Bleu Arwing)
  "08": "#f1c40f",  // Pikachu (Jaune Électrique)
  "09": "#2ecc71",  // Luigi (Vert Luigi)
  "10": "#e74c3c",  // Ness (Rouge Casquette)
  "11": "#8e44ad",  // Captain Falcon (Violet F-Zero)
  "12": "#f3129dff",  // Jigglypuff (Rose/Orange)

  // --- MELEE ---
  "13": "#ff9ff3",  // Peach (Rose Princesse)
  "13e": "#f39c12", // Daisy (Orange Floral)
  "14": "#27ae60",  // Bowser (Vert Écaille)
  "15": "#74b9ff",  // Ice Climbers (Bleu Glace)
  "16": "#5f27cd",  // Sheik (Violet Sheikah)
  "17": "#a29bfe",  // Zelda (Violet Magie)
  "18": "#c0392b",  // Dr. Mario (Rouge sombre/Blanc)
  "19": "#f1c40f",  // Pichu (Jaune Pâle)
  "20": "#3498db",  // Falco (Bleu Ciel)
  "21": "#2980b9",  // Marth (Bleu Royal)
  "21e": "#2980b9", // Lucina (Bleu Royal identique)
  "22": "#00aa00",  // Young Link (Vert Forêt)
  "23": "#574b90",  // Ganondorf (Violet Ténèbres)
  "24": "#8e44ad",  // Mewtwo (Violet Psy)
  "25": "#e74c3c",  // Roy (Rouge Feu)
  "25e": "#2980b9", // Chrom (Bleu Falchion)
  "26": "#2c3e50",  // Mr. Game & Watch (Gris très foncé/Noir)

  // --- BRAWL ---
  "27": "#2c3a47",  // Meta Knight (Bleu Nuit)
  "28": "#00d2d3",  // Pit (Bleu Ciel/Blanc)
  "28e": "#57606f", // Dark Pit (Gris/Noir)
  "29": "#0984e3",  // Zero Suit Samus (Bleu Combinaison)
  "30": "#f1c40f",  // Wario (Jaune Ail)
  "31": "#7f8c8d",  // Snake (Gris Tactique)
  "32": "#c0392b",  // Ike (Rouge Cape)
  "33": "#e74c3c",  // Pokémon Trainer (Rouge Casquette)
  "36": "#d35400",  // Diddy Kong (Orange/Marron)
  "37": "#f39c12",  // Lucas (Jaune/Orange)
  "38": "#0057e7",  // Sonic (Bleu SEGA)
  "39": "#f1c40f",  // King Dedede (Jaune/Rouge Roi)
  "40": "#cddc39",  // Olimar (Vert/Beige)
  "41": "#3498db",  // Lucario (Bleu Aura)
  "42": "#95a5a6",  // R.O.B. (Gris Plastique)
  "43": "#2ecc71",  // Toon Link (Vert Cel-Shading)
  "44": "#8e44ad",  // Wolf (Violet Star Wolf)

  // --- SMASH 4 ---
  "45": "#e74c3c",  // Villager (Rouge T-shirt)
  "46": "#3498db",  // Mega Man (Bleu Bombardier)
  "47": "#00cec9",  // Wii Fit Trainer (Turquoise Santé)
  "48": "#00d2d3",  // Rosalina & Luma (Cyan Galaxie)
  "49": "#27ae60",  // Little Mac (Vert Ring)
  "50": "#3498db",  // Greninja (Bleu Eau)
  "51": "#e74c3c",  // Mii Brawler (Rouge Mii)
  "52": "#3498db",  // Mii Swordfighter (Bleu Mii)
  "53": "#f39c12",  // Mii Gunner (Orange Mii)
  "54": "#2ecc71",  // Palutena (Vert Cheveux)
  "55": "#f1c40f",  // Pac-Man (Jaune Pacman)
  "56": "#8e44ad",  // Robin (Violet Tactique)
  "57": "#e74c3c",  // Shulk (Rouge Monado)
  "58": "#2ecc71",  // Bowser Jr. (Vert Koopa Clown)
  "59": "#d35400",  // Duck Hunt (Marron Chien)
  "60": "#ecf0f1",  // Ryu (Blanc Karate)
  "61": "#1abc9c",  // Cloud (Vert Mako)
  "62": "#95a5a6",  // Corrin (Gris Dragon)
  "60e": "#c0392b", // Ken (Rouge Ken) - *Note: Ken est 60e selon l'ordre officiel*
  "63": "#2c3a47",  // Bayonetta (Noir/Violet Sorcière)

  // --- ULTIMATE ---
  "64": "#ff9f43",  // Inkling (Orange Encre)
  "65": "#8e44ad",  // Ridley (Violet Dragon)
  "66": "#d35400",  // Simon (Orange Vampire)
  "66e": "#3498db", // Richter (Bleu Belmont)
  "67": "#27ae60",  // King K. Rool (Vert Croco)
  "68": "#f1c40f",  // Isabelle (Jaune Marie)
  "69": "#c0392b",  // Incineroar (Rouge Feu)
  "70": "#e74c3c",  // Piranha Plant (Rouge Plante)
  "71": "#e74c3c",  // Joker (Rouge Metaverse)
  "72": "#8e44ad",  // Hero (Violet DQ)
  "73": "#d35400",  // Banjo & Kazooie (Marron/Jaune)
  "74": "#c0392b",  // Terry (Rouge Fatal Fury)
  "75": "#1abc9c",  // Byleth (Vert Menthe)
  "76": "#f1c40f",  // Min Min (Jaune Ramen)
  "77": "#3498db",  // Steve (Bleu Diamant)
  "78": "#151b20ff",  // Sephiroth (Noir Aile Unique)
  "79": "#e74c3c",  // Pyra / Mythra (Rouge/Vert)
  "81": "#403963ff",  // Kazuya (Violet Devil)
  "82": "#c0392b",  // Sora (Rouge KH1 / Noir)
  
  // Si jamais un ID manque :
  "default": "#e60012"
};

/**
 * Fonction utilitaire sécurisée pour récupérer la couleur
 */
 export function getFighterColor(id: string): string {
  // On nettoie l'ID au cas où (ex: "04" vs "4")
  // Mais tes JSON semblent utiliser "01", "02", etc.
  return characterColors[id] || characterColors["default"];
}

/**
 * Rendu principal du Roster
 */
export async function renderRoster(): Promise<string> {
  try {
    // 1. Chargement des données
    // On pointe vers ton fichier roster.json visible dans l'arborescence
    const response = await fetch('/assets/data/roster.json');
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - Vérifiez que assets/data/roster.json existe`);
    }

    const fighters: Fighter[] = await response.json();

    // 2. Génération du HTML
    let html = '<div class="roster-grid" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px;">';

    html += fighters.map(fighter => {
      const color = getFighterColor(fighter.id);
      
      // Logique pour trouver l'image :
      // 1. Si définie dans le JSON, on prend.
      // 2. Sinon, on construit le chemin basé sur ton dossier images (ex: mario_icon.png)
      // On retire les espaces et on met en minuscule pour correspondre aux noms de fichiers classiques
      const cleanName = fighter.name.toLowerCase().replace(/[\s.&]/g, ''); 
      // Ex: "Dr. Mario" -> "drmario", "Mr. Game & Watch" -> "mrgamewatch"
      
      // Note : Modifie '_icon.png' par '.png' si tu veux l'image complète
      const defaultImagePath = `/assets/images/${cleanName}_icon.png`;
      const finalImage = fighter.image || defaultImagePath;

      return `
        <div class="fighter-card" 
             data-id="${fighter.id}"
             style="--char-color: ${color}; cursor: pointer;">
             
            <div class="card-header" style="display:flex; justify-content:space-between; padding: 5px 10px;">
                <span style="font-weight:bold; opacity:0.8;">#${fighter.id}</span>
            </div>
            
            <div class="card-image-container" style="text-align: center; padding: 10px;">
                <img src="${finalImage}" 
                     alt="${fighter.name}" 
                     loading="lazy" 
                     style="width: 100px; height: 100px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));"
                     onerror="this.src='/vite.svg'; this.style.filter='grayscale(100%)';">
            </div>
            
            <div class="card-body" style="text-align: center; padding-bottom: 15px;">
                <h3 class="fighter-name" style="margin: 0; text-transform: uppercase; font-size: 1.1rem;">
                    ${fighter.name}
                </h3>
            </div>
        </div>
      `;
    }).join('');

    html += '</div>';
    
    return html;

  } catch (error) {
    console.error("Erreur critique roster:", error);
    return `
      <div style="text-align: center; color: white; padding: 50px;">
        <h2>Erreur de chargement</h2>
        <p>${error}</p>
        <p>Vérifie que ton fichier <code>public/assets/data/roster.json</code> est bien un tableau JSON valide.</p>
      </div>
    `;
  }
  
}