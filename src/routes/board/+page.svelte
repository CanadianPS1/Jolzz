<script lang="ts">
	const row: number[] = [1,2,3,4,5,6,7,8];
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

