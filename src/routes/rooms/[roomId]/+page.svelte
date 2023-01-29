<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { messageSchema } from '$lib/schemas'
	import { supabaseClient } from '$lib/supabase'
	import type { Database } from '$lib/supabase.types'
	import type { RealtimeChannel } from '@supabase/supabase-js'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const submitNewMessage: SubmitFunction = ({ form }) => {
		return async ({ update, result }) => {
			switch (result.type) {
				case 'success':
					form.reset()
					break
				case 'failure':
					await update()
					break
			}
		}
	}
	let channel: RealtimeChannel

	let messages: Database['public']['Tables']['messages']['Row'][]

	onMount(async () => {
		channel = supabaseClient
			.channel(String(data.room.id))
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
					filter: `room_id=eq.${data.room.id}`
				},
				(payload) => {
					console.log('change detected', payload)
					const parsedMessage = messageSchema.safeParse(payload.new)
					if (!parsedMessage.success) {
						return
					}
					messages.push(parsedMessage.data)
					messages = messages
				}
			)
			.subscribe((status) => {
				if (status === 'SUBSCRIBED') {
					console.log('subscribed')
				}
			})
	})

	$: ({ messages } = data)
	$: messages = data.messages
</script>

<div class="flex justify-between w-full mx-auto py-6">
	<div class="flex flex-col">
		<h1 class="font-bold">{data.room.name}</h1>
		<h1>Messages:</h1>
		{#each messages as message}
			<pre>{JSON.stringify(message, null, 2)}</pre>
		{/each}
	</div>
	<form action="?/createMessage" method="POST" class="" use:enhance={submitNewMessage}>
		<div class="flex items-center w-full gap-2">
			<input
				type="text"
				name="message"
				id="message"
				placeholder="message"
				class="border border-gray-600 p-2"
			/>
			<button type="submit" class="bg-cyan-600 px-2.5 py-2">Send</button>
		</div>
	</form>
</div>
