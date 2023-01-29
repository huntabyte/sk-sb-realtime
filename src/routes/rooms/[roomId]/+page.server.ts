import { error, fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.session) {
		throw redirect(302, "/login")
	}

	const getMessages = async (roomId: number) => {
		const messages = await locals.sb
			.from("messages")
			.select("*")
			.eq("room_id", roomId)
			.order("created_at", { ascending: true })
		if (messages.error) {
			throw error(500, { message: messages.error.message })
		}
		return messages.data
	}

	const getRoom = async (roomId: number) => {
		const room = await locals.sb
			.from("rooms")
			.select()
			.eq("id", roomId)
			.single()
		if (room.error) {
			throw error(500, { message: room.error.message })
		}
		return room.data
	}

	return {
		messages: getMessages(Number(params.roomId)),
		room: getRoom(Number(params.roomId)),
	}
}

export const actions: Actions = {
	createMessage: async ({ locals, request, params }) => {
		const { message } = Object.fromEntries(await request.formData()) as {
			message: string
		}

		const roomMessage = await locals.sb
			.from("messages")
			.insert([{ content: message, room_id: Number(params.roomId) }])
			.select()
			.single()

		if (roomMessage.error) {
			return fail(400, { message: "Could not send message" })
		}

		return {
			status: 201,
			body: roomMessage.data,
		}
	},
}
