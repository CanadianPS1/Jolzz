import { tiles } from "$lib/services/Board";

export function highlightTiles(tileIds: string[]) {
    clearHighlights(); // remove old highlights
    tileIds.forEach(id => {
        const button = tiles[id].button;
        if (button) {
            button.style.backgroundColor = "yellow";
            button.style.border = "2px solid gold";
        }
    });
}

export function clearHighlights() {
    Object.values(tiles).forEach(tile => {
        const button = tile.button;
        button.style.backgroundColor = "";
        button.style.border = "";
    });
}
