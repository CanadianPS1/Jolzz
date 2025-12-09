import { tiles, columns, row } from "$lib/services/Board";
import { highlightTiles } from "$lib/services/HighlightService";

// convert tile string ex:a4 -> indexs
function parseTile(tileId: string) {
    const col = tileId[0];
    const r = parseInt(tileId[1]);
    return {
        colIndex: columns.indexOf(col),
        rowIndex: row.indexOf(r)
    };
}

// convert indexes -> tile string
function makeTile(colIndex: number, rowIndex: number): string | null {
    if (colIndex < 0 || colIndex > 7) return null;
    if (rowIndex < 0 || rowIndex > 7) return null;
    return columns[colIndex] + row[rowIndex];
}

// a tile is occupied ONLY if it has a dataset.side
function tileOccupied(tileId: string): boolean {
    const btn = tiles[tileId];
    if (!btn) return false;
    return !!btn.dataset.side;
}

// a tile is enemy-occupied ONLY if dataset.side exists AND is not pawnSide
function tileOccupiedByEnemy(tileId: string, pawnSide: string): boolean {
    const btn = tiles[tileId];
    if (!btn) return false;
    const side = btn.dataset.side;
    return !!side && side !== pawnSide;
}

export function pawnMovement(tile: string, side: string) {
    const moves: string[] = [];

    const { colIndex, rowIndex } = parseTile(tile);

    //BOARD ORIENTATION:
    // row 1 is TOP -> rowIndex 0
    // white moves down (+1)
    // black moves up (-1)
    const direction = side === "white" ? 1 : -1;
       console.log("=== PAWN MOVEMENT DEBUG ===");
    console.log("Tile:", tile);
    console.log("Side:", side);
    console.log("ColIndex:", colIndex, "RowIndex:", rowIndex);

    const forwardTile = makeTile(colIndex, rowIndex + direction);
    console.log("Forward tile:", forwardTile);

    if (forwardTile) {
        const btn = tiles[forwardTile];
        console.log("Forward dataset.side:", btn?.dataset.side);
    }

    const leftDiag = makeTile(colIndex - 1, rowIndex + direction);
    console.log("Left diag:", leftDiag, "occupiedByEnemy:", tileOccupiedByEnemy(leftDiag!, side));

    const rightDiag = makeTile(colIndex + 1, rowIndex + direction);
    console.log("Right diag:", rightDiag, "occupiedByEnemy:", tileOccupiedByEnemy(rightDiag!, side));

    // promotion rows for flipped board
    const promotionRow = side === "white" ? 7 : 0;

    // 1 square forward
    const oneStep = makeTile(colIndex, rowIndex + direction);
    if (oneStep && !tileOccupied(oneStep)) {
        moves.push(oneStep);
    }

    // 2 squares forward 
    if (oneStep && !tileOccupied(oneStep)) {
        const twoStep = makeTile(colIndex, rowIndex + direction * 2);
        if (twoStep && !tileOccupied(twoStep)) {
            moves.push(twoStep);
        }
    }

    // diagonal captures
    const diagLeft = makeTile(colIndex - 1, rowIndex + direction);
    if (diagLeft && tileOccupiedByEnemy(diagLeft, side)) {
        moves.push(diagLeft);
    }

    const diagRight = makeTile(colIndex + 1, rowIndex + direction);
    if (diagRight && tileOccupiedByEnemy(diagRight, side)) {
        moves.push(diagRight);
    }

    // promotion detection
    const promotionMoves = moves.filter(t => {
        const { rowIndex: r } = parseTile(t);
        return r === promotionRow;
    });

    highlightTiles(moves);

    return { moves, promotionMoves };
}

// rook movement
export function rookMovement(start: string, side: string) {
    const { colIndex, rowIndex } = parseTile(start);
    const moves: string[] = [];

    const directions = [
        { dc: 1, dr: 0 },  // right
        { dc: -1, dr: 0 }, // left
        { dc: 0, dr: 1 },  // up
        { dc: 0, dr: -1 }  // down
    ];

    directions.forEach(dir => {
        for (let i = 1; i < 8; i++) {
            const tile = makeTile(colIndex + dir.dc * i, rowIndex + dir.dr * i);
            if (!tile) break;

            if (!tileOccupied(tile)) {
                moves.push(tile);       // empty square → legal
            } else {
                if (tileOccupiedByEnemy(tile, side)) {
                    moves.push(tile);   // capture
                }
                break; // blocked
            }
        }
    });

    return moves;
}


//bishop movement
export function bishopMovement(start: string, side: string) {
    const { colIndex, rowIndex } = parseTile(start);
    const moves: string[] = [];

    const directions = [
        { dc: 1, dr: 1 },   // up-right
        { dc: -1, dr: 1 },  // up-left
        { dc: 1, dr: -1 },  // down-right
        { dc: -1, dr: -1 }  // down-left
    ];

    directions.forEach(dir => {
        for (let i = 1; i < 8; i++) {
            const tile = makeTile(colIndex + dir.dc * i, rowIndex + dir.dr * i);
            if (!tile) break;

            if (!tileOccupied(tile)) moves.push(tile);
            else {
                if (tileOccupiedByEnemy(tile, side)) moves.push(tile);
                break;
            }
        }
    });

    return moves;
}


// queen movement
export function queenMovement(start: string, side: string) {
    return [
        ...rookMovement(start, side),
        ...bishopMovement(start, side)
    ];
}


// knight movement
export function knightMovement(start: string, side: string) {
    const { colIndex, rowIndex } = parseTile(start);
    const moves: string[] = [];

    const jumps = [
        { dc: 1, dr: 2 }, { dc: 2, dr: 1 },
        { dc: -1, dr: 2 }, { dc: -2, dr: 1 },
        { dc: 1, dr: -2 }, { dc: 2, dr: -1 },
        { dc: -1, dr: -2 }, { dc: -2, dr: -1 }
    ];

    jumps.forEach(j => {
        const tile = makeTile(colIndex + j.dc, rowIndex + j.dr);
        if (!tile) return;

        if (!tileOccupied(tile) || tileOccupiedByEnemy(tile, side)) {
            moves.push(tile);
        }
    });

    return moves;
}


// king movement
export function kingMovement(start: string, side: string) {
    const { colIndex, rowIndex } = parseTile(start);
    const moves: string[] = [];

    const dirs = [
        { dc: 1, dr: 0 }, { dc: -1, dr: 0 },
        { dc: 0, dr: 1 }, { dc: 0, dr: -1 },
        { dc: 1, dr: 1 }, { dc: -1, dr: 1 },
        { dc: 1, dr: -1 }, { dc: -1, dr: -1 }
    ];

    dirs.forEach(d => {
        const tile = makeTile(colIndex + d.dc, rowIndex + d.dr);
        if (!tile) return;

        if (!tileOccupied(tile) || tileOccupiedByEnemy(tile, side)) {
            moves.push(tile);
        }
    });

    return moves;
}

