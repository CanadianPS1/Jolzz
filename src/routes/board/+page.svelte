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