<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { supabaseClient } from '$lib/supabase'
	import type { RealtimeChannel } from '@supabase/supabase-js'
	import { onMount } from 'svelte'

	let channel: RealtimeChannel

	interface Payload {
		[key: string]: any
		event: string
		type: 'broadcast'
	}

	let messages: string[] = []

	onMount(async () => {
		channel = supabaseClient
			.channel('room1')
			.on('broadcast', { event: 'message' }, ({ payload }: Payload) => {
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
</script>

<div class="flex flex-col mx-auto">
	<h1 class="text-2xl font-bold">Chatly</h1>
	<div class="flex w-full justify-between max-w-xl">
		<div class="flex flex-col space-y-2">
			<h1>Messages:</h1>
			{#each messages as message}
				<p>{message}</p>
			{/each}
		</div>
		<form action="?/sendMessage" use:enhance={submitMessage} method="POST">
			<input type="text" name="message" class="border-2 border-gray-500 p-2 " />
			<button type="submit" class="bg-cyan-600  p-2">Send</button>
		</form>
	</div>
</div>
