<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="flex flex-col space-y-2">
	Rooms:
	{#each data.rooms as room}
		<div>
			<a href="/rooms/{room.id}">
				{room.name}
			</a>
		</div>
	{/each}
</div>
