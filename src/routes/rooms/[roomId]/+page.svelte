<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { messageSchema } from '$lib/schemas'
	import { supabaseClient } from '$lib/supabase'
	import type { Database } from '$lib/supabase.types'
	import type { RealtimeChannel } from '@supabase/supabase-js'
	import { onMount, onDestroy } from 'svelte'
	import { z } from 'zod'
	import type { PageData } from './$types'

	export let data: PageData

	interface OnlineUser {
		user_id: string
		email: string
		online_at: string
		presence_ref: string
	}

	const userPresenceSchema = z.object({
		email: z.string(),
		online_at: z.string(),
		presence_ref: z.string()
	})

	let onlineUsers: OnlineUser[] = []

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
	let presenceChannel: RealtimeChannel

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

		presenceChannel = supabaseClient.channel('online-users', {
			config: {
				presence: {
					key: data.session?.user.id
				}
			}
		})
		presenceChannel.on('presence', { event: 'sync' }, () => {
			console.log(presenceChannel.presenceState())
			const presenceState = presenceChannel.presenceState()
			onlineUsers = []
			for (const [key, value] of Object.entries(presenceState)) {
				let obj: OnlineUser = {
					user_id: '',
					email: '',
					online_at: '',
					presence_ref: ''
				}
				obj.user_id = key
				const userObj = userPresenceSchema.safeParse(value[0])
				if (userObj.success) {
					obj.email = userObj.data.email
					obj.online_at = userObj.data.online_at
					obj.presence_ref = userObj.data.presence_ref
				}
				onlineUsers.push(obj)
			}
			onlineUsers = onlineUsers
		})
		presenceChannel.on('presence', { event: 'join' }, ({ newPresences }) => {})

		presenceChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {})

		presenceChannel.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				const status = await presenceChannel.track({
					online_at: new Date().toISOString(),
					email: data.session?.user.email
				})
				console.log(status)
			}
		})
	})

	onDestroy(() => {
		channel.unsubscribe()
		presenceChannel.unsubscribe()
	})

	$: messages = data.messages
	$: console.log('Online Users:', onlineUsers)
</script>

<div class="flex justify-between w-full mx-auto py-6">
	<div class="flex flex-col">
		<h1 class="font-bold">{data.room.name}</h1>
		<div class="max-h-96 overflow-y-scroll">
			<h1>Messages:</h1>
			{#each messages as message}
				<pre>{JSON.stringify(message, null, 2)}</pre>
			{/each}
		</div>
	</div>
	<div class="flex flex-col">
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
		<div>
			<h2>Online Users:</h2>
			{#each onlineUsers as user}
				<p>{user.email}</p>
			{/each}
		</div>
	</div>
</div>
