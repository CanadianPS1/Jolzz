<script lang="ts">
    import { onMount } from 'svelte';
    import { pieces, row, columns, piecesEqualChance} from '$lib/services/Board.ts';
    import {Piece} from '$lib/services/Piece.ts';
    //import {kingMovment} from '$lib/services/PieceMovment.ts';
    var whitePiecesToSpawn : number = 16;
    var blackPiecesToSpawn : number = 16;
    var tileCount : number = 0;
    var isPiece : boolean = true;
    var blackPieceSet : Piece[] = [];
    var whitePieceSet : Piece[] = [];
    for(var i = pieces.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    onMount(() => {
        //loops through all the buttons on the chess board
        row.forEach(row => {
            tileCount++;
            columns.forEach(col => {
                //creates their ID's'
                const id = `${col}${row}`;
                const button = document.getElementById(id) as HTMLButtonElement | null;
                if(button){
                    button.addEventListener('click', () => press(isPiece, button));
                    button.disabled = true;
                    const amountOfPieces : number = 32 - (whitePiecesToSpawn + blackPiecesToSpawn);
                    const chanceOfPiece : number = ((64 - tileCount) - amountOfPieces);
                    //chekcs if a piece is going to spawn on that tile
                    if(Math.floor(Math.random() * 100) + 1 > chanceOfPiece && amountOfPieces <= 32){
                        //checks if the piece is gunna be white
                        if((16 - whitePiecesToSpawn) < (16 - blackPiecesToSpawn) && whitePiecesToSpawn > 0){
                            button.disabled = false;
                            const pieceNumber = 16 - whitePiecesToSpawn;
                            whitePiecesToSpawn -= 1;
                            const piece : string = pieces[pieceNumber];
                            const imageURL = '/assets/WhiteSidePieces/WhiteSide'+piece+'.png';
                            button.style.backgroundImage = "url(" + imageURL + ")";
                            button.style.backgroundSize = "cover";
                            button.style.backgroundPosition = "center";
                            button.textContent = id + piece;
                            //creates an object for the piece
                            whitePieceSet = generatePieceObject(pieceNumber,piece,whitePieceSet,"white",id);
                        //checks if the piece is gunna be black
                        }else if((16 - whitePiecesToSpawn) > (16 - blackPiecesToSpawn) && blackPiecesToSpawn > 0){
                            button.disabled = false;
                            const pieceNumber = 16 - blackPiecesToSpawn;
                            blackPiecesToSpawn -= 1;
                            const piece : string = pieces[pieceNumber];
                            const imageURL = '/assets/BlackSidePieces/blackSide'+piece+'.png';
                            button.style.backgroundImage = "url(" + imageURL + ")";
                            button.style.backgroundSize = "cover";
                            button.style.backgroundPosition = "center";
                            button.textContent = id + piece;
                            //creates an object for the piece
                            blackPieceSet = generatePieceObject(pieceNumber,piece,blackPieceSet,"black",id);
                        //runs if theirs the same amount of pieces in each team
                        }else{
                            //checks if the piece is gunna be white
                            if(Math.floor(Math.floor(Math.random() * 100) + 1) > 50 && whitePiecesToSpawn > 0){
                                button.disabled = false;
                                const pieceNumber = 16 - whitePiecesToSpawn;
                                whitePiecesToSpawn -= 1;
                                const piece : string = pieces[pieceNumber];
                                const imageURL = '/assets/WhiteSidePieces/WhiteSide'+piece+'.png';
                                button.style.backgroundImage = "url(" + imageURL + ")";
                                button.style.backgroundSize = "cover";
                                button.style.backgroundPosition = "center";
                                button.textContent = id + piece;
                                //creates an object for the piece
                                whitePieceSet = generatePieceObject(pieceNumber,piece,whitePieceSet,"white",id);
                            //checks if the piece is gunna be black
                            }else if(blackPiecesToSpawn > 0){
                                button.disabled = false;
                                const pieceNumber = 16 - blackPiecesToSpawn;
                                blackPiecesToSpawn -= 1;
                                const piece : string = pieces[pieceNumber];
                                const imageURL = '/assets/BlackSidePieces/blackSide'+piece+'.png';
                                button.style.backgroundImage = "url(" + imageURL + ")";
                                button.style.backgroundSize = "cover";
                                button.style.backgroundPosition = "center";
                                button.textContent = id + piece;
                                //creates an object for the piece
                                blackPieceSet = generatePieceObject(pieceNumber,piece,blackPieceSet,"black",id);
                            }
                        }
                    }
                    // console.log('Amount of Pieces: ' + amountOfPieces + 
                    //             '\nAmount of Black Pieces :' + (16 - blackPiecesToSpawn) + 
                    //             '\nAmount of White Pieces : ' + (16 - whitePiecesToSpawn));
                }
            });
        });
    });
    function generatePieceObject(pieceNumber : number, piece : string, array : Piece[], side : string, location : string){
        var canMoveUp : boolean = false;
        var canMoveDown : boolean = false;
        var canMoveLeft : boolean = false;
        var canMoveRight : boolean = false;
        var canMoveDinagnle : boolean = false;
        var canMoveInL : boolean = false;
        var amountOfSpacesCanMove : number = 0;
        //created all the pieces
        if(piece == "King"){
            canMoveDinagnle = true;
            canMoveUp = true;
            canMoveDown = true;
            canMoveLeft = true;
            canMoveRight = true;
            canMoveInL = false;
            amountOfSpacesCanMove = 2;
        }else if(piece == "Queen"){
            canMoveDinagnle = true;
            canMoveUp = true;
            canMoveDown = true;
            canMoveLeft = true;
            canMoveRight = true;
            canMoveInL = false;
            amountOfSpacesCanMove = 8;
        }else if(piece == "Bishop"){
            canMoveDinagnle = true;
            canMoveUp = false;
            canMoveDown = false;
            canMoveLeft = false;
            canMoveRight = false;
            canMoveInL = false;
            amountOfSpacesCanMove = 8;
        }else if(piece == "Knight"){
            canMoveDinagnle = false;
            canMoveUp = false;
            canMoveDown = false;
            canMoveLeft = false;
            canMoveRight = false;
            canMoveInL = true;
            amountOfSpacesCanMove = 5;
        }else if(piece == "Rook"){
            canMoveDinagnle = false;
            canMoveUp = true;
            canMoveDown = true;
            canMoveLeft = true;
            canMoveRight = true;
            canMoveInL = false;
            amountOfSpacesCanMove = 8;
        }else if(piece == "Pawn"){
            canMoveDinagnle = false;
            canMoveUp = true;
            canMoveDown = false;
            canMoveLeft = false;
            canMoveRight = false;
            canMoveInL = false;
            amountOfSpacesCanMove = 3;
        }
        try{
            array.push(new Piece(pieceNumber,side,piece,canMoveUp,canMoveDown,canMoveRight,canMoveLeft,canMoveDinagnle,canMoveInL, amountOfSpacesCanMove,location));
        }catch(e){
            alert(e);
        }
        return array;
    }
    //deteced button presses for each type of piece
    function press(piece : boolean, button : HTMLButtonElement ){
        if(piece){
            switch(button.textContent.slice(2)){
                case "Pawn":
                    console.log("pawn pressed");
                    break;
                case "Rook":
                    move(button);
                    break;
                case "Knight":
                    move(button);
                    break;
                case "Bishop":
                    move(button);
                    break;
                case "Queen":
                    move(button);
                    break;
                case "King":
                    move(button);
                    break;
                default:
                    console.log("Unknown Piece was Pressed");
            }
        }
    }
    function move(button : HTMLButtonElement){
        //finds the rooks object
        const location = button.textContent!.substring(0, 2);
        let piece!: Piece;
        for(let i = 0; i < whitePieceSet.length; i++){
            const p = whitePieceSet[i];
            if(p.getLocation() === location) piece = p;
        }
        for(let i = 0; i < blackPieceSet.length; i++){
            const p = blackPieceSet[i];
            if(p.getLocation() === location) piece = p;
        }
        console.log(piece.getSide() + " side " + piece.getPieceName() + " number " + piece.getId() + " at " + location + " was pressed");
        var amountLeft: number = 0;
        var amountRight : number = 0;
        var amountUp : number = 0;
        var amountDown : number = 0;
        var amountDinagnleLeft : number = 0;
        var amountDinagnleRight : number = 0;
        var count : number = 0;
        row.forEach((row, rowIndex) => {
            tileCount++;
            columns.forEach((col, colIndex) => {
                const id = `${col}${row}`;
                const buttonForign = document.getElementById(id) as HTMLButtonElement | null;
                if(button){
                    //the code for rendering tiles left of the piece
                    if(piece.getCanMoveLeft()){
                        //checks if the tile is left of the piece and if its on the same row
                        if(colIndex < columns.findIndex((pieceCol) => pieceCol == piece.getLocation().charAt(0)) && row == parseInt(piece.getLocation().charAt(1))){
                            //trust the prosses, finds if the piece is in the limit of where it can move
                            if((columns.findIndex((pieceCol) => pieceCol == piece.getLocation().charAt(0))) - piece.getAmountOfSpacesCanMove() < colIndex){
                                if(buttonForign?.textContent.length! == 2){
                                    buttonForign!.disabled = false;
                                    buttonForign!.style.backgroundColor = "gold";
                                    amountLeft++;
                                }
                                
                            }
                        }
                        
                    }if(piece.getCanMoveRight()){
                        //checks if the tile is right of the piece and if its on the same row
                        if(colIndex > columns.findIndex((pieceCol) => pieceCol == piece.getLocation().charAt(0)) && row == parseInt(piece.getLocation().charAt(1))){
                            //trust the prosses, finds if the piece is in the limit of where it can move
                            if((columns.findIndex((pieceCol) => pieceCol == piece.getLocation().charAt(0))) + (piece.getAmountOfSpacesCanMove() - amountRight) > colIndex){
                                if(buttonForign?.textContent.length! == 2){
                                    buttonForign!.disabled = false;
                                    buttonForign!.style.backgroundColor = "gold";
                                    amountRight++;
                                }
                            }
                        }
                    }
                    if(piece.getCanMoveUp()){
                        //checks if the tile is right of the piece and if its on the same row
                        if(rowIndex < parseInt(piece.getLocation().charAt(1)) && col == piece.getLocation().charAt(0)){
                            //trust the prosses, finds if the piece is in the limit of where it can move
                            if(parseInt(piece.getLocation().charAt(1)) - piece.getAmountOfSpacesCanMove() < rowIndex){
                                count++
                                console.log(count);
                                alert(buttonForign?.textContent.length!);
                                if(buttonForign?.textContent.length! == 2){
                                    
                                    buttonForign!.disabled = false;
                                    buttonForign!.style.backgroundColor = "gold";
                                    amountUp++;
                                }
                            }
                        }
                    }
                    
                }
            });
        });
    }
    function generateRandomRows() {
        const whiteRow = row.splice(0, 2);
        const blackRow = row.splice(row.length - 2);

        const createdPieces = new Array<string>(16);

        const kingPlacement = Math.floor(Math.random() * 8);
        const button = document.getElementById(`${columns[kingPlacement]}${1}`) as HTMLButtonElement | null;
        if (button) {
            button.disabled = false;
            button.style.backgroundImage = "url(/assets/WhiteSidePieces/WhiteSideKing.png)";
            button.style.backgroundSize = "cover";
            button.style.backgroundPosition = "center";
            button.textContent = "King";
            createdPieces[kingPlacement] = "King";
        }

        whiteRow.forEach((row, rowIndex) => {
            tileCount++;
            columns.forEach((col, colIndex) => {
                if (kingPlacement == colIndex + rowIndex * 8) return;

                const id = `${col}${row}`;
                const button = document.getElementById(id) as HTMLButtonElement | null;
                if (button) {
                    button.disabled = false;
                    const randomPiece = Math.floor(Math.random() * (piecesEqualChance.length - 1));
                    const piece: string = piecesEqualChance[randomPiece];
                    const imageURL = "/assets/WhiteSidePieces/WhiteSide" + piece + ".png";
                    button.style.backgroundImage = "url(" + imageURL + ")";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.textContent = piece;
                    createdPieces[colIndex + rowIndex * 8] = piece;
                }
            });
        });

        blackRow.forEach((row, rowIndex) => {
            columns.forEach((col, colIndex) => {
                const id = `${col}${row}`;
                const button = document.getElementById(id) as HTMLButtonElement | null;
                if (button) {
                    button.disabled = false;
                    const piece = createdPieces[colIndex + ((blackRow.length - rowIndex - 1) * 8)];
                    const imageURL = "/assets/BlackSidePieces/BlackSide" + piece + ".png";
                    button.style.backgroundImage = "url(" + imageURL + ")";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.textContent = piece;
                }
            });
        });
    }
</script>
<main>
	<h2>
		<div class="username">
			<div class="user1">DEFULT USER 1</div>
			<div class="u1WinsLosses">W/L</div>
		</div>
		<div class="actingPlayer">USER #'s TURN</div>
	</h2>
	<h1 class="board">
		{#each row as num}
			<div class="row{num}">
				<button disabled class="tile" id="a{num}">a{num}</button>
				<button disabled class="tile" id="b{num}">b{num}</button>
				<button disabled class="tile" id="c{num}">c{num}</button>
				<button disabled class="tile" id="d{num}">d{num}</button>
				<button disabled class="tile" id="e{num}">e{num}</button>
				<button disabled class="tile" id="f{num}">f{num}</button>
				<button disabled class="tile" id="g{num}">g{num}</button>
				<button disabled class="tile" id="h{num}">h{num}</button>
			</div>
		{/each}
	</h1>
    
	<h2>
		<div class="username">
			<div class="u2WinsLosses">W/L</div>
			<div class="user2">DEFULT USER 2</div>
		</div>
	</h2>
</main>
<style>
    *{
    margin: 0;
    padding: 0;
}
.row1{
    margin-top: 1%;
    margin-left: 30%;
}
.row1, .row2, .row3, .row4, .row5, .row6, .row7, .row8 {
    display: flex;        
    margin-left: 30%;
}
.tile{
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 0;
}
.user1{
    margin-top: 1%;
    margin-left: 10%;
}
.user2{
    margin-left: 80%;
    margin-bottom: 1%;
}
.u2WinsLosses{
    margin-left: 84%;
}
.u1WinsLosses{
    margin-left: 14%;
}
.actingPlayer{
    margin-top: 2%;
    text-align: center;
}
</style>