import type { Actions } from "./$types"

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		const { message } = Object.fromEntries(await request.formData())

		const channel = locals.sb.channel("room1")
		channel.subscribe((status) => {
			if (status === "SUBSCRIBED") {
				console.log("subscribed")
			}
		})

		channel.send({
			type: "broadcast",
			event: "message",
			payload: { message },
		})

		return {
			status: 200,
		}
	},
}
