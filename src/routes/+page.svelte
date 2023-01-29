<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { supabaseClient } from '$lib/supabase'
	import type { RealtimeChannel } from '@supabase/supabase-js'
	import { onMount } from 'svelte'

	let channel: RealtimeChannel

	let messages: string[] = []
	onMount(async () => {
		channel = supabaseClient
			.channel('room1')
			.on('broadcast', { event: 'message' }, ({ payload }) => {
				console.log(payload)
				messages.push(payload.message)
				messages = messages
			})
			.subscribe((status) => {
				if (status === 'SUBSCRIBED') {
					console.log('subscribed')
				}
			})
	})

	const submitMessage: SubmitFunction = ({ data }) => {
		const { message } = Object.fromEntries(data)
		channel.send({
			type: 'broadcast',
			event: 'message',
			payload: { message }
		})
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					break
				case 'failure':
					break
				default:
					break
			}
			await update()
		}
	}

	$: console.log(messages)
</script>

<h1 class="text-2xl font-bold">SvelteKit Tailwind Starter</h1>
<div class="flex w-full justify-between max-w-xl mx-auto">
	<div>
		<h1>Messages:</h1>
		{#each messages as message}
			<p>{message}</p>
		{/each}
	</div>
	<form action="?/sendMessage" use:enhance={submitMessage} method="POST">
		<input type="text" name="message" />
		<button type="submit">Send</button>
	</form>
</div>
