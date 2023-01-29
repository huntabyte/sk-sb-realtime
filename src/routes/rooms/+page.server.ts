import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals }) => {
	const getRooms = async () => {
		const rooms = await locals.sb.from("rooms").select("*")
		if (rooms.error) {
			throw error(500, { message: rooms.error.message })
		}
		return rooms.data
	}

	return {
		rooms: getRooms(),
	}
}
