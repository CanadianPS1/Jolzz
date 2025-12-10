import { writable } from "svelte/store";

export let username_store = writable<string | null>(null);
export let opponent_store = writable<string | null>(null);
export let playerColor_store = writable<"white" | "black" | null>(null);
export let currentTurn_store = writable<"white" | "black">("white");
export let board_store = writable<string>("");
