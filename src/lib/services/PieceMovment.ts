import pieceLocater from "../../routes/board/+page.svelte";
const pieceLocaterInstence = new pieceLocater({ target: document.body });
function pawnMovment(kingLocation : string, pawnLocation : string, pawnSide : string){

}
function rookMovment(rookLocation : string, rookSide : string){

}
function bishupMovment(bishupLocation : string, bishupSide : string){

}
function knightMovment(knightLocation : string, knightSide : string){

}
function queenMovment(queenLocation : string, queenSide : string){

}
export function kingMovment(kingSide : string){
    const kingLocation = pieceLocaterInstence.getPieceLocation("king");
    console.log("the king is at " + kingLocation);
}