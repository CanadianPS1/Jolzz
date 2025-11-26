const rows: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
const columns: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const tiles: { [key: string]: HTMLButtonElement } = {};
rows.forEach(row => {
  columns.forEach(col => {
    const id = `${col}${row}`;
    const button = document.getElementById(id) as HTMLButtonElement | null;
    if (button) {
      tiles[id] = button;
    } else {
      console.warn(`Button with ID ${id} not found`);
    }
  });
});

// Example usage:
// boardButtons['a1'].addEventListener('click', () => console.log('Clicked a1'));
