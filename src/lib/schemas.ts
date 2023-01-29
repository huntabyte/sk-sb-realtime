import { z } from "zod"

export const messageSchema = z.object({
	id: z.number(),
	content: z.string(),
	created_at: z.string().nullable(),
	room_id: z.number(),
})
