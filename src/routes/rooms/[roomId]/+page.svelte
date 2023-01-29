<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import type { PageData } from './$types'

	export let data: PageData

	const submitNewMessage: SubmitFunction = () => {
		return async ({ update }) => {
			await update()
		}
	}

	$: ({ messages } = data)
	$: console.log(data.messages)
</script>

<div class="flex justify-between w-full mx-auto">
	<div class="flex flex-col">
		<h1>Messages:</h1>
		{#each messages as message}
			<p>{message.messages.content}</p>
		{/each}
	</div>
	<form
		action="?/createMessage"
		method="POST"
		class="flex gap-2 max-w-2xl"
		use:enhance={submitNewMessage}
	>
		<div class="flex flex-col ">
			<label for="message">Message</label>
			<input
				type="text"
				name="message"
				id="message"
				placeholder="message"
				class="border border-gray-600 p-2"
			/>
		</div>
		<div>
			<button type="submit" class="bg-cyan-600 px-2.5 py-2">Send</button>
		</div>
	</form>
</div>
