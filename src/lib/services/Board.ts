export const row: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
export const columns: string[] = ["a","b","c","d","e","f","g","h"];
export const tiles: { [key: string]: HTMLButtonElement } = {};
export const pieces: string[] = ["Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Bishup", "Bishup", "Knight", "Knight", "Rook", "Rook", "Queen", "King"];
// document.addEventListener('DOMContentLoaded', () => {
//   row.forEach(row => {
//     columns.forEach(col => {
//       const id = `${col}${row}`;
//       const button = document.getElementById(id) as HTMLButtonElement | null;
//       if(button){
//         button.addEventListener('click', () => console.log('Clicked ' + id));
//         tiles[id] = button;
//       } else {
//         console.warn(`Button ${id} not found`);
//       }
//     });
//   });

// });
