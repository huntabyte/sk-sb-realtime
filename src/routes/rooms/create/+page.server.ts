import { error, fail } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
	create: async ({ locals, request }) => {
		if (!locals.session) {
			return fail(401, { message: "Unauthorized" })
		}
		const { name } = Object.fromEntries(await request.formData()) as {
			name: string
		}

		console.log(await locals.sb.auth.getUser())

		const room = await locals.sb
			.from("rooms")
			.insert([{ name, user_id: locals.session.user.id }])
			.select()
			.single()

		if (room.error) {
			throw error(500, { message: room.error.message })
		}

		const roomMember = await locals.sb
			.from("room_members")
			.insert([{ room_id: room.data.id, user_id: locals.session.user.id }])

		if (roomMember.error) {
			throw error(500, { message: roomMember.error.message })
		}

		return {
			status: 201,
		}
	},
}
