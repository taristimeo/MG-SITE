#!/usr/bin/env bash
#
# start.sh — À lancer quand tu commences à travailler sur le site.
#
# 1. Récupère les dernières modifications depuis GitHub (le travail d'Arthur).
# 2. Installe les dépendances si elles ont changé.
# 3. Lance le site en local sur http://localhost:3000
#
# Utilisation (depuis le dossier du projet) :
#   ./start.sh
#
set -e
cd "$(dirname "$0")"

echo "→ Récupération des dernières modifs depuis GitHub…"
git pull --rebase --autostash

echo "→ Installation des dépendances (si besoin)…"
npm install

echo ""
echo "✓ Tout est à jour. Lancement du site sur http://localhost:3000"
echo "  (Ctrl+C pour arrêter)"
echo ""
npm run dev
