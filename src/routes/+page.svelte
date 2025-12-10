<script lang="ts">
	import { validatePassword, validateUsername } from "$lib/services/ClientValidation";
	import { onDestroy, onMount } from "svelte";
	function validateUsernameView(e: Event) {
		const inputElement = e.target as HTMLInputElement;
		const username = inputElement.value;
		if (!username) {
			inputElement.style.borderColor = "red";
			return;
		}

		try {
			validateUsername(username);
		} catch (e) {
			inputElement.style.borderColor = "red";
			return;
		}

		inputElement.style.borderColor = "green";
	}
	
	function validatePasswordView(e: Event) {
		const inputElement = e.target as HTMLInputElement;
		const password = inputElement.value;
		if (!password) {
			inputElement.style.borderColor = "red";
			return;
		}
		
		try {
			validatePassword(password);
		} catch (e) {
			inputElement.style.borderColor = "red";
			return;
		}

		inputElement.style.borderColor = "green";
	}
	onMount(() => {
		const funnyGuy = document.getElementById('funnyGuy');
		const funnyGuyImage = document.getElementById('funnyGuyImage');
		const funnyGuySound = new Audio('/assets/funnySound.wav');
		funnyGuyImage!.style.display = "none";
		funnyGuy!.addEventListener('click', function() {
			console.log("funny button was pressed");
			funnyGuy!.style.backgroundImage="url(/assets/funnyGuy.png)";
			funnyGuyImage!.style.display = "block";
			if (funnyGuySound.paused) {
				funnyGuySound.play();
			}
		});
	});
	
</script>

<main>
	<h1>Jolzz</h1>

	<div class="form-container">
		<form method="POST" action="?/register">
			<h2>First Time</h2>
			<input name="username" type="text" autocomplete="off" autocorrect="off" placeholder="Username" on:input={validateUsernameView}>
			<input name="password" type="password" placeholder="Password" on:input={validatePasswordView}>
			<button type="submit" class="submit-button">CREATE PLAYER</button>
		</form>
		
		<form method="POST" action="?/login">
			<h2>Returning Player</h2>
			<input name="username" type="text" autocomplete="off" autocorrect="off" placeholder="Username" on:input={validateUsernameView}>
			<input name="password" type="password" placeholder="Password" on:input={validatePasswordView}>
			<button type="submit" class="submit-button">CONTINUE PLAYING</button>
		</form>
	</div>
	<img src="/assets/funnyGuy.png" width="100.5rem" height="100.5rem" alt="is a funny guy" id="funnyGuyImage">
	<button id="funnyGuy">Funny Guy</button>
</main>

<style>
	*,
	*::after,
	*::before {
		box-sizing: border-box;
	}
	
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
	}

	h1 {
		margin-bottom: 100px;
		user-select: none;
		-webkit-user-select: none;
	}
	
	h2 {
		text-align: center;
		user-select: none;
		-webkit-user-select: none;
	}

	.form-container {
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 15px;
	}

	input {
		border: solid 1px lightgray;
		border-radius: 5px;
		padding: 10px 15px;
		appearance: none;
		caret-color: coral;
	}

	input:focus {
		border-color: coral;
	}

	.submit-button {
		border: none;
		border-radius: 5px;
		padding: 10px 15px;
		width: fit-content;
		background-color: coral;
		color: white;
		font-weight: bold;
		font-size: 0.9rem;
		appearance: none;
	}
</style>
