import { writable } from "svelte/store"
import { supabaseClient } from "./supabase"

interface Payload {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any
	event: string
	type: "broadcast"
}

export function createRealtimeStore(channel: string) {
	const { subscribe, set, update } = writable<{ messages: string[] }>({
		messages: [],
	})

	supabaseClient
		.channel(channel)
		.on("broadcast", { event: "message" }, (payload: Payload) => {
			update((n) => {
				n.messages.push(payload.message)
				return n
			})
		})
		.subscribe((status) => {
			if (status === "SUBSCRIBED") {
				console.log("subscribed")
			}
		})

	return { subscribe }
}
