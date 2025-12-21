export interface Move {
  name: string;
  input: string;
  damage: string;
  description: string;
}

export interface CharacterMoves {
  neutral: Move[];
  smash: Move[];
  specials: Move[];
  aerials: Move[];
  throws: Move[];
  // Le ? signifie que cette propriété est optionnelle
  // (Kazuya l'a, mais pas Mario par exemple)
  command_inputs?: Move[]; 
}

export interface CharacterMatchups {
  winning_hard: string[];
  winning_soft: string[];
  even: string[];
  losing_soft: string[];
  losing_hard: string[];
}

export interface Character {
  id: string;
  name: string;
  series: string;
  isEcho: boolean;
  description: string;
  thumbnail: string;
  image: string;
  moves: CharacterMoves;
  // Optionnel aussi, car on ne l'a pas encore rempli pour tout le monde
  matchups?: CharacterMatchups; 
}