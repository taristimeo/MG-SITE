#!/usr/bin/env bash
#
# save.sh — À lancer pour envoyer ton travail sur GitHub.
#
# 1. Récupère d'abord les modifs distantes (pour éviter les conflits).
# 2. Ajoute tous tes changements.
# 3. Crée un point de sauvegarde (commit) et l'envoie sur GitHub.
#
# Utilisation :
#   ./save.sh "Petit message décrivant ce que tu as fait"
# ou sans message :
#   ./save.sh
#
set -e
cd "$(dirname "$0")"

MSG="${*:-MAJ du site}"

echo "→ Récupération des modifs distantes d'abord…"
git pull --rebase --autostash

echo "→ Ajout de tes changements…"
git add -A

if git diff --cached --quiet; then
  echo "✓ Rien de nouveau à sauvegarder — tout est déjà sur GitHub."
  exit 0
fi

git commit -m "$MSG"

echo "→ Envoi vers GitHub…"
# Réessaie quelques fois en cas de coupure réseau
for attempt in 1 2 3 4; do
  if git push; then
    echo ""
    echo "✓ Sauvegardé sur GitHub. Arthur peut maintenant récupérer ton travail avec ./start.sh"
    exit 0
  fi
  echo "  (échec réseau, nouvelle tentative dans ${attempt}s…)"
  sleep "$attempt"
done

echo "✗ L'envoi a échoué (réseau ?). Réessaie plus tard avec : git push"
exit 1
