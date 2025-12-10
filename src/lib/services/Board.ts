export const row: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
export const columns: string[] = ["a","b","c","d","e","f","g","h"];
export const tiles: { [key: string]: { button: HTMLButtonElement, character: string, pieceIndex: number } } = {};
export const pieces: string[] = ["Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Bishop", "Bishop", "Knight", "Knight", "Rook", "Rook", "Queen", "King"];
export const piecesEqualChance: string[] = ["Pawn", "Bishop", "Knight", "Rook", "Queen", "King"];

export const piecemap: { [key: string]: { side: "white" | "black", pieceIndex: number } } = {
  P: { side: "white", pieceIndex: 0 },
  B: { side: "white", pieceIndex: 1 },
  N: { side: "white", pieceIndex: 2 },
  R: { side: "white", pieceIndex: 3 },
  Q: { side: "white", pieceIndex: 4 },
  K: { side: "white", pieceIndex: 5 },
  p: { side: "black", pieceIndex: 0 },
  b: { side: "black", pieceIndex: 1 },
  n: { side: "black", pieceIndex: 2 },
  r: { side: "black", pieceIndex: 3 },
  q: { side: "black", pieceIndex: 4 },
  k: { side: "black", pieceIndex: 5 }
};
