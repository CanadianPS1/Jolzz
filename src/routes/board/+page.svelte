<script lang="ts">
    import { onMount } from "svelte";
    import { pieces, row, columns, tiles } from "$lib/services/Board";
    import { Piece } from "$lib/services/Piece";
    import {
        pawnMovement,
        rookMovement,
        bishopMovement,
        kingMovement,
        knightMovement,
        queenMovement
    } from "$lib/services/PieceMovment";
    import { highlightTiles, clearHighlights } from "$lib/services/HighlightService";

    // Selection system
    let selectedTile: string | null = null;
    let selectedPiece: string | null = null;
    let selectedSide: "white" | "black" | null = null;
    let currentMoves: string[] = [];

    // Random spawning vars
    let whitePiecesToSpawn = 16;
    let blackPiecesToSpawn = 16;
    let tileCount : number = 0;

    let whitePieceSet: Piece[] = [];
    let blackPieceSet: Piece[] = [];
    var blackOrWhite : boolean = true;
    // Shuffle your piece list ONCE
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    // Game initialization AFTER DOM loads
    onMount(() => {
        console.log("=== BOARD INIT ===");

        row.forEach((r) => {
            tileCount++;
            if(blackOrWhite){
                blackOrWhite = false;
            }else{
                blackOrWhite = true;
            }
            columns.forEach((c) => {
                const id = `${c}${r}`;
                const button = document.getElementById(id) as HTMLButtonElement | null;
                if(blackOrWhite){
                    button.style.backgroundColor = "white";
                    blackOrWhite = false;
                }else{
                    button.style.backgroundColor = "black";
                    blackOrWhite = true;
                }
                if (!button) {
                    console.warn("Tile not found:", id);
                    return;
                }

                // Register tile globally
                tiles[id] = button;

                // Start empty
                button.textContent = "";
                button.style.backgroundImage = "";

                //tileCount++;
                
                // Random spawn logic (same as before)
                //const spawnedCount = 32 - (whitePiecesToSpawn + blackPiecesToSpawn);
                //const neededChance = (64 - tileCount) - spawnedCount;
                //const roll = Math.floor(Math.random() * 100) + 1;
                const amountOfPieces : number = 32 - (whitePiecesToSpawn + blackPiecesToSpawn);
                const chanceOfPiece : number = ((64 - tileCount) - (amountOfPieces + 2));
                if(Math.floor(Math.random() * 100) + 1 > chanceOfPiece && amountOfPieces <= 32){
                //if (roll > neededChance && spawnedCount <= 32) {
                    const whiteCount = 16 - whitePiecesToSpawn;
                    const blackCount = 16 - blackPiecesToSpawn;

                    if((16 - whitePiecesToSpawn) < (16 - blackPiecesToSpawn) && whitePiecesToSpawn > 0){
                        placeRandomPiece(button, "white", whiteCount);
                        whitePiecesToSpawn--;
                    }else if((16 - whitePiecesToSpawn) > (16 - blackPiecesToSpawn) && blackPiecesToSpawn > 0){
                        placeRandomPiece(button, "black", blackCount);
                        blackPiecesToSpawn--;
                    } else {
                            if(Math.floor(Math.floor(Math.random() * 100) + 1) > 50 && whitePiecesToSpawn > 0){
                            placeRandomPiece(button, "white", whiteCount);
                            whitePiecesToSpawn--;
                        } else if (blackPiecesToSpawn > 0) {
                            placeRandomPiece(button, "black", blackCount);
                            blackPiecesToSpawn--;
                        }
                    }
                }
            });
        });

        console.log("=== BOARD INIT COMPLETE ===");
    });

    /** Spawn a single random piece on a tile */
    function placeRandomPiece(button: HTMLButtonElement, side: "white" | "black", pieceIndex: number) {
        const piece = pieces[pieceIndex];

        const img = side === "white"
            ? `/assets/WhiteSidePieces/WhiteSide${piece}.png`
            : `/assets/BlackSidePieces/blackSide${piece}.png`;

        button.style.backgroundImage = `url(${img})`;
        button.style.backgroundSize = "cover";
        button.style.backgroundPosition = "center";
        button.style.backgroundRepeat = "no-repeat";

        button.textContent = piece;
        button.dataset.side = side;

        console.log("Placed", side, piece, "at", button.id);

        if (side === "white") {
            whitePieceSet = generatePieceObject(pieceIndex, piece, whitePieceSet, side);
        } else {
            blackPieceSet = generatePieceObject(pieceIndex, piece, blackPieceSet, side);
        }
    }

    /** Handle tile clicks */
    function press(tileId: string) {
        const btn = tiles[tileId];
        if (!btn) return;

        console.log("--- press() called on", tileId, "---");

        const pieceName = btn.textContent?.trim() || "";

        // determine side safely
        let side: "white" | "black" | null = null;
        const rawSide = btn.dataset.side;

        if (rawSide === "white" || rawSide === "black") {
            side = rawSide;
        } else {
            const img = btn.style.backgroundImage;
            if (img.includes("WhiteSide")) side = "white";
            if (img.includes("BlackSide")) side = "black";
        }

        console.log("Piece:", pieceName, "Side:", side);

        // Selecting a piece
        if (!selectedTile) {
            if (!pieceName || !side) {
                console.log("Not a valid selectable piece.");
                return;
            }

            console.log("SELECTED:", side, pieceName, "at", tileId);

            selectedTile = tileId;
            selectedPiece = pieceName;
            selectedSide = side;

            // compute moves for this piece
            switch (pieceName) {
                case "Pawn":
                    currentMoves = pawnMovement(tileId, side).moves;
                    break;

                case "Rook":
                    currentMoves = rookMovement(tileId, side);
                    break;

                case "Bishop":
                    currentMoves = bishopMovement(tileId, side);
                    break;

                case "Knight":
                    currentMoves = knightMovement(tileId, side);
                    break;

                case "Queen":
                    currentMoves = queenMovement(tileId, side);
                    break;

                case "King":
                    currentMoves = kingMovement(tileId, side);
                    break;

                default:
                    currentMoves = [];
                    break;
            }

            console.log("Legal moves:", currentMoves);

            // ⭐ highlight moves for ALL pieces
            clearHighlights();
            highlightTiles(currentMoves);

            return;
        }

        // Deselect same tile
        if (tileId === selectedTile) {
            console.log("Deselected", tileId);
            clearSelection();
            return;
        }

        // Move if tile is in legal moves
        if (currentMoves.includes(tileId)) {
            console.log("Moving from", selectedTile, "to", tileId);
            movePiece(selectedTile, tileId);
            clearSelection();
            return;
        }

        // Switch selection to a different piece
        if (pieceName) {
            console.log("Switching selection to", tileId);
            clearSelection();
            press(tileId);
            return;
        }

        console.log("Clicked non-legal empty tile");
    }

    /** Move the piece from → to */
  function movePiece(fromId: string, toId: string) {
    const from = tiles[fromId];
    const to = tiles[toId];

    if (!from || !to) return;

    const piece = from.textContent;
    const side = from.dataset.side ?? "";

    // Copy appearance
    const img = from.style.backgroundImage;
    to.style.backgroundImage = img;
    to.style.backgroundSize = "cover";
    to.style.backgroundPosition = "center";
    to.style.backgroundRepeat = "no-repeat";

    // Copy piece data
    to.textContent = piece;
    to.dataset.side = side;

    // Clear old tile
    from.style.backgroundImage = "";
    from.style.backgroundSize = "";
    from.style.backgroundPosition = "";
    from.style.backgroundRepeat = "";
    from.textContent = "";
    delete from.dataset.side;

    // ⭐ PROMOTION CHECK ⭐
    if (piece === "Pawn") {
        const row = toId[1];

        if (side === "white" && row === "8") {
            promotePawn(to, "white");
        }

        if (side === "black" && row === "1") {
            promotePawn(to, "black");
        }
    }
}

function promotePawn(tile: HTMLButtonElement, side: "white" | "black") {
    // For now: always promote to Queen
    tile.textContent = "Queen";

    const img = side === "white"
        ? `/assets/WhiteSidePieces/WhiteSideQueen.png`
        : `/assets/BlackSidePieces/blackSideQueen.png`;

    tile.style.backgroundImage = `url(${img})`;
    tile.style.backgroundSize = "cover";
    tile.style.backgroundPosition = "center";
    tile.style.backgroundRepeat = "no-repeat";

    console.log(`Pawn promoted to Queen (${side})`);
}



    /** Clear highlights + selection */
    function clearSelection() {
        selectedTile = null;
        selectedPiece = null;
        selectedSide = null;
        currentMoves = [];

        clearHighlights();
    }

    /** Build a piece object */
    function generatePieceObject(pieceNumber: number, piece: string, array: Piece[], side: string) {
        let canMoveUp = false;
        let canMoveDown = false;
        let canMoveLeft = false;
        let canMoveRight = false;
        let canMoveDinagnle = false;
        let canMoveInL = false;
        let amountOfSpacesCanMove = 0;

        if (piece === "King") {
            canMoveUp = canMoveDown = canMoveLeft = canMoveRight = canMoveDinagnle = true;
            amountOfSpacesCanMove = 1;
        } else if (piece === "Queen") {
            canMoveUp = canMoveDown = canMoveLeft = canMoveRight = canMoveDinagnle = true;
            amountOfSpacesCanMove = 7;
        } else if (piece === "Bishop" || piece === "Bishup") {
            canMoveDinagnle = true;
            amountOfSpacesCanMove = 7;
        } else if (piece === "Knight") {
            canMoveInL = true;
            amountOfSpacesCanMove = 4;
        } else if (piece === "Rook") {
            canMoveUp = canMoveDown = canMoveLeft = canMoveRight = true;
            amountOfSpacesCanMove = 7;
        } else if (piece === "Pawn") {
            canMoveUp = true;
            amountOfSpacesCanMove = 2;
        }

        array.push(new Piece(
            pieceNumber,
            side,
            piece,
            canMoveUp,
            canMoveDown,
            canMoveRight,
            canMoveLeft,
            canMoveDinagnle,
            canMoveInL,
            amountOfSpacesCanMove
        ));

        return array;
    }
</script>

<main>
    <h2>
        <div class="username">
            <div class="user1">DEFAULT USER 1</div>
            <div class="u1WinsLosses">W/L</div>
        </div>
        <div class="actingPlayer">USER #'s TURN</div>
    </h2>

    <h1 class="board">
        {#each row as num}
            <div class={"row" + num}>
                {#each columns as col}
                    <button 
                        class="tile" 
                        id={`${col}${num}`}
                        on:click={() => press(`${col}${num}`)}
                    ></button>
                {/each}
            </div>
        {/each}
    </h1>

    <h2>
        <div class="username">
            <div class="u2WinsLosses">W/L</div>
            <div class="user2">DEFAULT USER 2</div>
        </div>
    </h2>
</main>

<style>
    * { margin: 0; padding: 0; }
    .row1 { margin-top: 1%; margin-left: 30%; }
    .row1, .row2, .row3, .row4, .row5, .row6, .row7, .row8 {
        display: flex;
        margin-left: 30%;
    }
    .tile {
        width: 5.5rem;
        height: 5.5rem;
        border-radius: 0;
        background-repeat: no-repeat;
    }

    .tile.disabled {
        pointer-events: none;
        opacity: 0.6;
    }

    .user1 { margin-top: 1%; margin-left: 10%; }
    .user2 { margin-left: 80%; margin-bottom: 1%; }
    .u2WinsLosses { margin-left: 84%; }
    .u1WinsLosses { margin-left: 14%; }
    .actingPlayer { margin-top: 2%; text-align: center; }
</style>
