// Fichier: fill_data.js
// Lance-le avec : node fill_data.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Nécessaire pour gérer les chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'public/assets/data/fighters');
const ROSTER_FILE = path.join(__dirname, 'public/assets/data/roster.json');

// LISTE INTERNE COMPLÈTE (Plus besoin de lien externe !)
const characters = [
  { id: "01", name: "Mario" }, { id: "02", name: "Donkey Kong" }, { id: "03", name: "Link" }, 
  { id: "04", name: "Samus" }, { id: "04e", name: "Dark Samus", echo: true }, { id: "05", name: "Yoshi" }, 
  { id: "06", name: "Kirby" }, { id: "07", name: "Fox" }, { id: "08", name: "Pikachu" }, 
  { id: "09", name: "Luigi" }, { id: "10", name: "Ness" }, { id: "11", name: "Captain Falcon" }, 
  { id: "12", name: "Jigglypuff" }, { id: "13", name: "Peach" }, { id: "13e", name: "Daisy", echo: true }, 
  { id: "14", name: "Bowser" }, { id: "15", name: "Ice Climbers" }, { id: "16", name: "Sheik" }, 
  { id: "17", name: "Zelda" }, { id: "18", name: "Dr. Mario" }, { id: "19", name: "Pichu" }, 
  { id: "20", name: "Falco" }, { id: "21", name: "Marth" }, { id: "21e", name: "Lucina", echo: true }, 
  { id: "22", name: "Young Link" }, { id: "23", name: "Ganondorf" }, { id: "24", name: "Mewtwo" }, 
  { id: "25", name: "Roy" }, { id: "25e", name: "Chrom", echo: true }, { id: "26", name: "Mr. Game & Watch" }, 
  { id: "27", name: "Meta Knight" }, { id: "28", name: "Pit" }, { id: "28e", name: "Dark Pit", echo: true }, 
  { id: "29", name: "Zero Suit Samus" }, { id: "30", name: "Wario" }, { id: "31", name: "Snake" }, 
  { id: "32", name: "Ike" }, { id: "33", name: "Squirtle" }, { id: "34", name: "Ivysaur" }, 
  { id: "35", name: "Charizard" }, { id: "36", name: "Diddy Kong" }, { id: "37", name: "Lucas" }, 
  { id: "38", name: "Sonic" }, { id: "39", name: "King Dedede" }, { id: "40", name: "Olimar" }, 
  { id: "41", name: "Lucario" }, { id: "42", name: "R.O.B." }, { id: "43", name: "Toon Link" }, 
  { id: "44", name: "Wolf" }, { id: "45", name: "Villager" }, { id: "46", name: "Mega Man" }, 
  { id: "47", name: "Wii Fit Trainer" }, { id: "48", name: "Rosalina & Luma" }, { id: "49", name: "Little Mac" }, 
  { id: "50", name: "Greninja" }, { id: "51", name: "Mii Brawler" }, { id: "52", name: "Mii Swordfighter" }, 
  { id: "53", name: "Mii Gunner" }, { id: "54", name: "Palutena" }, { id: "55", name: "Pac-Man" }, 
  { id: "56", name: "Robin" }, { id: "57", name: "Shulk" }, { id: "58", name: "Bowser Jr." }, 
  { id: "59", name: "Duck Hunt" }, { id: "60", name: "Ryu" }, { id: "60e", name: "Ken", echo: true }, 
  { id: "61", name: "Cloud" }, { id: "62", name: "Corrin" }, { id: "63", name: "Bayonetta" }, 
  { id: "64", name: "Inkling" }, { id: "65", name: "Ridley" }, { id: "66", name: "Simon" }, 
  { id: "66e", name: "Richter", echo: true }, { id: "67", name: "King K. Rool" }, { id: "68", name: "Isabelle" }, 
  { id: "69", name: "Incineroar" }, { id: "70", name: "Piranha Plant" }, { id: "71", name: "Joker" }, 
  { id: "72", name: "Hero" }, { id: "73", name: "Banjo & Kazooie" }, { id: "74", name: "Terry" }, 
  { id: "75", name: "Byleth" }, { id: "76", name: "Min Min" }, { id: "77", name: "Steve" }, 
  { id: "78", name: "Sephiroth" }, { id: "79", name: "Pyra" }, { id: "80", name: "Mythra" }, 
  { id: "81", name: "Kazuya" }, { id: "82", name: "Sora" }
];

console.log("⏳ Génération des données locales...");

async function generateData() {
    try {
        const rosterList = [];

        // Création du dossier s'il n'existe pas
        if (!fs.existsSync(OUTPUT_DIR)){
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        characters.forEach((char) => {
            // Génération nom de fichier image théorique
            // Ex: "Dark Samus" devient "darksamus"
            const safeName = char.name.toLowerCase().replace(/[\s\.\&]/g, '').replace(/é/g, 'e');
            const iconName = `${safeName}_icon.png`;
            const imgName = `${safeName}.png`;

            // 1. Ajout au Roster global
            rosterList.push({
                id: char.id,
                name: char.name,
                thumbnail: iconName,
                isEcho: char.isEcho || false
            });

            // 2. Création de la fiche détaillée individuelle
            const charDetail = {
                id: char.id,
                name: char.name,
                series: "Super Smash Bros",
                isEcho: char.isEcho || false,
                description: `Fiche technique de ${char.name}. Description à venir.`,
                thumbnail: iconName,
                image: imgName,
                moves: {
                    neutral: [
                        { name: "Jab", input: "A", damage: "TBD", description: "Attaque standard" }
                    ],
                    smash: [
                        { name: "F-Smash", input: "Stick →", damage: "TBD", description: "Smash latéral" }
                    ],
                    specials: [
                        { name: "Neutral B", input: "B", damage: "TBD", description: "Spécial neutre" },
                        { name: "Side B", input: "→ + B", damage: "TBD", description: "Spécial côté" },
                        { name: "Up B", input: "↑ + B", damage: "TBD", description: "Recouvrement" },
                        { name: "Down B", input: "↓ + B", damage: "TBD", description: "Spécial bas" }
                    ],
                    aerials: [],
                    throws: []
                }
            };

            // Écriture du fichier JSON (ex: 01.json)
            const fileName = path.join(OUTPUT_DIR, `${char.id}.json`);
            
            // IMPORTANT : On n'écrase PAS le fichier s'il existe déjà 
            // (Comme ça tu ne perds pas tes données sur Mario !)
            if (!fs.existsSync(fileName)) {
                fs.writeFileSync(fileName, JSON.stringify(charDetail, null, 2));
                console.log(`✅ Créé : ${char.id}.json (${char.name})`);
            } else {
                console.log(`⏩ Ignoré (existe déjà) : ${char.id}.json`);
            }
        });

        // 3. Mise à jour du Roster
        fs.writeFileSync(ROSTER_FILE, JSON.stringify(rosterList, null, 2));
        console.log("🔥 Roster complet et fichiers générés avec succès !");

    } catch (error) {
        console.error("Erreur critique :", error);
    }
}

generateData();