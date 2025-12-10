<script lang="ts">
    let gameOver = false;

    import { onDestroy, onMount } from "svelte";
    import { pieces, row, columns, tiles, piecesEqualChance, piecemap } from "$lib/services/Board";
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
    import { board_store, currentTurn_store, opponent_store, playerColor_store, username_store } from "$lib/store/ConncectionStore";
    import { ClientConncection } from "$lib/services/ClientConnection";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let connection: ClientConncection;

    // selection system
    let selectedTile: string | null = null;
    let selectedPiece: string | null = null;
    let selectedSide: "white" | "black" | null = null;
    let currentMoves: string[] = [];

    // random spawning vars
    let whitePiecesToSpawn = 16;
    let blackPiecesToSpawn = 16;
    let tileCount : number = 0;

    let whitePieceSet: Piece[] = [];
    let blackPieceSet: Piece[] = [];
    // shuffle piece list once

    // stored values
    let username: string | null = null;
    let opponent: string | null = null;
    let playerColor: "white" | "black" | null = null;
    let currentTurn: "white" | "black" = "white";

    // shuffle piece list once
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    // game initialization after dom loads
    onMount(() => {
        if (page.params.username == undefined) {
            goto("/");
            return;
        }

        username_store.subscribe((value) => username = value);
        opponent_store.subscribe((value) => opponent = value);
        playerColor_store.subscribe((value) => playerColor = value);
        currentTurn_store.subscribe((value) => currentTurn = value);
        board_store.subscribe((value) => generateBoard(value));

        connection = new ClientConncection("ws", "127.0.0.1", 3333);
        setTimeout(() => {
            if (page.params.username == undefined) {
                goto("/");
                return;
            }
            
            connection.username = page.params.username;
        }, 250);
    });

    onDestroy(() => {
        if (connection != undefined) connection.close();
    });

    function generateBoard(board: string) {
        board.split("").forEach((p, i) => {
            const c = i % 8;
            const r = Math.floor(i / 8);

            const id = `${columns[c]}${r + 1}`;
            const button = document.getElementById(id) as HTMLButtonElement | null;
            if (!button) {
                console.warn("Tile not found:", id);
                return;
            }

            // register tile globally
            tiles[id] = {
                button: button,
                character: p,
                pieceIndex: p !== "_" ? piecemap[p].pieceIndex : -1
            };

            // start empty
            button.textContent = "";
            button.style.backgroundImage = "";

            // get and place the piece on the board
            if (p !== "_") {
                const piece = piecemap[p];
                placeRandomPiece(button, piece.side, piece.pieceIndex);
            }
        });
    }

    function generateBoardString(): string {
        let board = "";
        row.forEach((r) => {
            columns.forEach((c) => {
                const id = `${c}${r}`;
                board += tiles[id].character;
            });
        });

        return board;
    }

    // spawn a single random piece on a tile 
    function placeRandomPiece(button: HTMLButtonElement, side: "white" | "black", pieceIndex: number) {
        const piece = piecesEqualChance[pieceIndex];

        const img = side === "white"
            ? `/assets/WhiteSidePieces/WhiteSide${piece}.png`
            : `/assets/BlackSidePieces/BlackSide${piece}.png`;

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

    // handle tile clicks 
    function press(tileId: string) {
        if (gameOver || connection.currentTurn !== connection.playerColor) return;

        const tile = tiles[tileId];
        if (!tile) return;

        console.log("--- press() called on", tileId, "---");

        // selecting a piece
        if (!selectedTile) {
            const pieceName = piecesEqualChance[tile.pieceIndex];
            const side: "white" | "black" = tile.character === tile.character.toUpperCase() ? "white" : "black";
            if (tile.character === "_" || side != connection.playerColor) return;
    
            console.log("Piece:", pieceName, "Side:", side);
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

            // highlight moves for all pieces
            clearHighlights();
            highlightTiles(currentMoves);
            return;
        }

        // deselect same tile
        if (tileId === selectedTile) {
            console.log("Deselected", tileId);
            clearSelection();
            return;
        }

        // move if tile is in legal moves
        if (currentMoves.includes(tileId)) {
            console.log("Moving from", selectedTile, "to", tileId);
            movePiece(selectedTile, tileId);
            clearSelection();
            return;
        }

        // switch selection to a different piece
        console.log("Switching selection to", tileId);
        clearSelection();
        press(tileId);
    }

    // move the piece from -> to 
    function movePiece(fromId: string, toId: string) {
        const from = tiles[fromId];
        const to = tiles[toId];

        if (!from || !to) return;

        const side = from.character.toUpperCase() === from.character ? "white" : "black";

        // king capture check
        if (to.character === "K") {
            endGame("white");
            return;
        } else if (to.character === "k") {
            endGame("black");
            return;
        }

        const toButton = to.button;
        const fromButton = from.button;

        // copy appearence
        toButton.style.backgroundImage = fromButton.style.backgroundImage;
        toButton.style.backgroundSize = "cover";
        toButton.style.backgroundPosition = "center";
        toButton.style.backgroundRepeat = "no-repeat";
        to.character = from.character;

        // copy peice data
        toButton.textContent = fromButton.textContent;
        toButton.dataset.side = side;

        // clear old title
        fromButton.style.backgroundImage = "";
        fromButton.style.backgroundSize = "";
        fromButton.style.backgroundPosition = "";
        fromButton.style.backgroundRepeat = "";
        fromButton.textContent = "";
        from.character = "_";
        delete fromButton.dataset.side;

        //  promotion check
        if (from.character.toUpperCase() === "P") {
            const row = toId[1];

            if (side == "white" && row === "8") {
                promotePawn(to.button, "white");
                to.character = "Q";
            }

            if (side == "black" && row === "1") {
                promotePawn(to.button, "black");
                to.character = "q";
            }
        }

        connection.board = generateBoardString();
    }

    function promotePawn(tile: HTMLButtonElement, side: "white" | "black") {
        // for now always promote to Queen
        tile.textContent = "Queen";

        const img = side === "white"
            ? `/assets/WhiteSidePieces/WhiteSideQueen.png`
            : `/assets/BlackSidePieces/BlackSideQueen.png`;

        tile.style.backgroundImage = `url(${img})`;
        tile.style.backgroundSize = "cover";
        tile.style.backgroundPosition = "center";
        tile.style.backgroundRepeat = "no-repeat";

        console.log(`Pawn promoted to Queen (${side})`);
    }

    // clear highlights and selection 
    function clearSelection() {
        selectedTile = null;
        selectedPiece = null;
        selectedSide = null;
        currentMoves = [];

        clearHighlights();
    }

    function endGame(winner: "white" | "black") {
        gameOver = true; 
        alert(`${winner.toUpperCase()} WINS! The king has been captured.`);
        console.log(`GAME OVER — ${winner.toUpperCase()} wins.`);
        for (const id in tiles) {
            tiles[id].button.style.opacity = "0.8";
        }
    }    

    // build a piece object 
    function generatePieceObject(pieceNumber: number, piece: string, array: Piece[], side: string) {
        let canMoveUp = false;
        let canMoveDown = false;
        let canMoveLeft = false;
        let canMoveRight = false;
        let canMoveDiagonal = false;
        let canMoveInL = false;
        let amountOfSpacesCanMove = 0;

        if (piece === "King") {
            canMoveUp = canMoveDown = canMoveLeft = canMoveRight = canMoveDiagonal = true;
            amountOfSpacesCanMove = 1;
        } else if (piece === "Queen") {
            canMoveUp = canMoveDown = canMoveLeft = canMoveRight = canMoveDiagonal = true;
            amountOfSpacesCanMove = 7;
        } else if (piece === "Bishop" || piece === "Bishup") {
            canMoveDiagonal = true;
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
            canMoveDiagonal,
            canMoveInL,
            amountOfSpacesCanMove
        ));

        return array;
    }

</script>

<main>
    <h2>
        <div class="username">
            {#key username}
                <div class="user1">{username != null ? username : ""} ({playerColor})</div>
            {/key}
            <!-- <div class="u1WinsLosses">W/L</div> -->
        </div>
        {#key currentTurn}
            <div class="actingPlayer">{currentTurn.toUpperCase()}'S TURN</div>
        {/key}
    </h2>

    <h1 class="board">
        <!--generates each button with its location-->
        {#each row as num}
            <div class={"row" + num}>
                {#each columns as col}
                    <button
                        title={`${col}${num}`}
                        class="tile {((col.charCodeAt(0) + num) % 2 === 0) ? 'light' : 'dark'}"
                        id={`${col}${num}`}
                        on:click={() => press(`${col}${num}`)}
                     ></button>
                {/each}
            </div>
        {/each}
    </h1>

    <h2>
        <div class="username">
            <!-- <div class="u2WinsLosses">W/L</div> -->
            {#key opponent}
                <div class="user2">{opponent != null ? opponent : ""} ({playerColor == "white" ? "black" : "white"})</div>
            {/key}
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

    .tile.light {
    background-color: #f0d9b5; 
     }

    .tile.dark {
    background-color: #b58863; 
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
