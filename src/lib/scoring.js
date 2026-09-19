// Calcule le niveau (1 à 5) de détente à partir d'une mesure en cm, selon le genre
export function niveauDetente(cm, genre) {
  const seuils = genre === 'Femme'
    ? [25, 35, 45, 55]
    : [35, 45, 55, 65]; // Homme et Autre par défaut (Autre = moyenne calculée à part)
  return niveauDepuisSeuils(cm, seuils);
}

export function niveauSautBloc(cm, genre) {
  const seuils = genre === 'Femme'
    ? [20, 30, 40, 50]
    : [30, 40, 50, 60];
  return niveauDepuisSeuils(cm, seuils);
}

// Sprint : plus le temps est petit, meilleur le niveau (seuils inversés)
export function niveauRapidite(secondes, genre) {
  const seuils = genre === 'Femme'
    ? [6.0, 5.5, 5.0, 4.6]
    : [5.5, 5.0, 4.6, 4.2];
  // niveau 1 si > seuils[0], niveau 5 si < seuils[3]
  if (secondes > seuils[0]) return 1;
  if (secondes > seuils[1]) return 2;
  if (secondes > seuils[2]) return 3;
  if (secondes >= seuils[3]) return 4;
  return 5;
}

export function niveauEndurance(palier) {
  if (palier <= 4) return 1;
  if (palier <= 6) return 2;
  if (palier <= 8) return 3;
  if (palier <= 10) return 4;
  return 5;
}

// Technique : moyenne de points (0-3) par tentative -> niveau 1-5
export function niveauTechniqueDepuisMoyenne(moyenne) {
  if (moyenne <= 0.5) return 1;
  if (moyenne <= 1.2) return 2;
  if (moyenne <= 1.9) return 3;
  if (moyenne <= 2.5) return 4;
  return 5;
}

function niveauDepuisSeuils(valeur, seuils) {
  if (valeur < seuils[0]) return 1;
  if (valeur < seuils[1]) return 2;
  if (valeur < seuils[2]) return 3;
  if (valeur < seuils[3]) return 4;
  return 5;
}

export function moyenneArrondie(...valeurs) {
  const valides = valeurs.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (valides.length === 0) return null;
  return Math.round(valides.reduce((a, b) => a + b, 0) / valides.length);
}
