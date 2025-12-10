import { tiles } from "$lib/services/Board";

export function highlightTiles(tileIds: string[]) {
    clearHighlights();
    tileIds.forEach(id => tiles[id].button.classList.add("isHighlighted"));
}

export function clearHighlights() {
    Object.values(tiles).forEach(t => t.button.classList.remove("isHighlighted"));
}

