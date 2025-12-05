import { tiles } from "$lib/services/Board";

export function highlightTiles(tileIds: string[]) {
    clearHighlights(); // remove old highlights
    tileIds.forEach(id => {
        if (tiles[id]) {
            tiles[id].style.backgroundColor = "yellow";
            tiles[id].style.border = "2px solid gold";
        }
    });
}

export function clearHighlights() {
    Object.values(tiles).forEach(tile => {
        tile.style.backgroundColor = "";
        tile.style.border = "";
    });
}
