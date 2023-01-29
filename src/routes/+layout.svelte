<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { supabaseClient } from '$lib/supabase'
	import { onMount } from 'svelte'
	import '../app.css'

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			console.log('Auth state change detected')
			invalidateAll()
		})

		return () => {
			subscription.unsubscribe()
		}
	})
</script>

<div class="container mx-auto">
	<form action="/logout" method="POST" class="w-full bg-gray-700 mb-8">
		<button type="submit" class="text-white">Logout</button>
	</form>
	<slot />
</div>
