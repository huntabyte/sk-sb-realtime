import { error, fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { z, ZodError } from "zod"

const roomMessagesSchema = z.array(
	z.object({
		created_at: z.string(),
		id: z.number(),
		message_id: z.number(),
		room_id: z.number(),
		messages: z.object({
			content: z.string(),
		}),
	}),
)

export const load: PageServerLoad = async ({ locals, params }) => {
	const getMessages = async (roomId: number) => {
		const messages = await locals.sb
			.from("room_messages")
			.select("*, messages(content)")
			.eq("room_id", roomId)
			.order("created_at", { ascending: true })
		console.log(messages.data)
		if (messages.error) {
			throw error(500, { message: messages.error.message })
		}
		try {
			return roomMessagesSchema.parse(messages.data)
		} catch (e) {
			if (e instanceof ZodError) {
				console.log(e)
			}
			return []
		}
	}

	return {
		messages: getMessages(Number(params.roomId)),
	}
}

export const actions: Actions = {
	createMessage: async ({ locals, request, params }) => {
		const { message } = Object.fromEntries(await request.formData()) as {
			message: string
		}

		const roomMessage = await locals.sb
			.from("messages")
			.insert([{ content: message }])
			.select()
			.single()

		if (roomMessage.error) {
			return fail(400, { message: "Could not send message" })
		}

		const roomMessageRelation = await locals.sb
			.from("room_messages")
			.insert([
				{ room_id: Number(params.roomId), message_id: roomMessage.data.id },
			])

		if (roomMessageRelation.error) {
			await locals.sb.from("messages").delete().eq("id", roomMessage.data.id)
			return fail(400, { message: "Could not send message" })
		}

		return {
			status: 201,
		}
	},
}
