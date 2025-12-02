<script lang="ts">
    import { onMount } from 'svelte';
    import { pieces, row, columns} from '../../lib/services/Board.ts';
    var whitePiecesToSpawn : number = 16;
    var blackPiecesToSpawn : number = 16;
    var tileCount : number = 0;
    var isPiece : boolean = true;
    for(var i = pieces.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    onMount(() => {
    row.forEach(row => {
        tileCount++;
        columns.forEach(col => {
        const id = `${col}${row}`;
        const button = document.getElementById(id) as HTMLButtonElement | null;
        if(button){
            button.addEventListener('click', () => press(isPiece, button));
            button.disabled = true;
            const amountOfPieces : number = 32 - (whitePiecesToSpawn + blackPiecesToSpawn);
            const chanceOfPiece : number = ((64 - tileCount) - amountOfPieces);
            if(Math.floor(Math.random() * (100 - 1 + 1)) + 1 > chanceOfPiece && amountOfPieces <= 32){
                //button.disabled = false;
                if((16 - whitePiecesToSpawn) < (16 - blackPiecesToSpawn) && whitePiecesToSpawn > 0){
                    button.disabled = false;
                    const pieceNumber = 16 - whitePiecesToSpawn;
                    whitePiecesToSpawn -= 1;
                    console.log('number of white pieces : ' + pieceNumber);
                    const piece : string = pieces[pieceNumber];
                    const imageURL = '/assets/WhiteSidePieces/WhiteSide'+piece+'.png';
                    button.style.backgroundImage = "url(" + imageURL + ")";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.textContent = piece;
                    
                    console.log('spawned a white piece at : ' + col + row);
                }else if((16 - whitePiecesToSpawn) > (16 - blackPiecesToSpawn) && blackPiecesToSpawn > 0){
                    button.disabled = false;
                    const pieceNumber = 16 - blackPiecesToSpawn;
                    blackPiecesToSpawn -= 1;
                    console.log('number of black pieces : ' + pieceNumber);
                    const piece : string = pieces[pieceNumber];
                    const imageURL = '/assets/BlackSidePieces/blackSide'+piece+'.png';
                    button.style.backgroundImage = "url(" + imageURL + ")";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.textContent = piece;
                    
                    console.log('spawned a black piece at : ' + col + row);
                }else{
                    if(Math.floor(Math.floor(Math.random() * (100 - 1 + 1)) + 1) > 50 && whitePiecesToSpawn > 0){
                        button.disabled = false;
                        const pieceNumber = 16 - whitePiecesToSpawn;
                        whitePiecesToSpawn -= 1;
                        console.log('number of white pieces : ' + pieceNumber);
                        const piece : string = pieces[pieceNumber];
                        const imageURL = '/assets/WhiteSidePieces/WhiteSide'+piece+'.png';
                        button.style.backgroundImage = "url(" + imageURL + ")";
                        button.style.backgroundSize = "cover";
                        button.style.backgroundPosition = "center";
                        button.textContent = piece;
                        
                        console.log('spawned a white piece at : ' + col + row);
                    }else if(blackPiecesToSpawn > 0){
                        button.disabled = false;
                        const pieceNumber = 16 - blackPiecesToSpawn;
                        blackPiecesToSpawn -= 1;
                        console.log('number of black pieces : ' + pieceNumber);
                        const piece : string = pieces[pieceNumber];
                        const imageURL = '/assets/BlackSidePieces/blackSide'+piece+'.png';
                        button.style.backgroundImage = "url(" + imageURL + ")";
                        button.style.backgroundSize = "cover";
                        button.style.backgroundPosition = "center";
                        button.textContent = piece;
                        
                        console.log('spawned a black piece at : ' + col + row);
                    }
                }
            }
            console.log('Amount of Pieces: ' + amountOfPieces + 
                        '\nAmount of Black Pieces :' + (16 - blackPiecesToSpawn) + 
                        '\nAmount of White Pieces : ' + (16 - whitePiecesToSpawn));
        }
        });
    });
    });
    function press(piece : boolean, button : HTMLButtonElement ){
        if(piece){
            switch(button.textContent){
                case "Pawn":
                    break;
                case "Rook":
                    break;
                case "Knight":
                    break;
                case "Bishup":
                    break;
                case "Queen":
                    break;
                case "king":
                    break;
                default:
                    console.log("Unknown Piece was Pressed");
            }
        }
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
				<button class="tile" id="a{num}">a{num}</button>
				<button class="tile" id="b{num}">b{num}</button>
				<button class="tile" id="c{num}">c{num}</button>
				<button class="tile" id="d{num}">d{num}</button>
				<button class="tile" id="e{num}">e{num}</button>
				<button class="tile" id="f{num}">f{num}</button>
				<button class="tile" id="g{num}">g{num}</button>
				<button class="tile" id="h{num}">h{num}</button>
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