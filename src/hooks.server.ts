import "$lib/supabase"
import { getSupabase } from "@supabase/auth-helpers-sveltekit"
import type { Handle } from "@sveltejs/kit"
import type { HandleServerError } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event)

	event.locals.sb = supabaseClient
	event.locals.session = session

	return resolve(event)
}

export const handleError = (({ error, event }) => {
	console.log(error)
	return {
		message: "Whoops!",
	}
}) satisfies HandleServerError
