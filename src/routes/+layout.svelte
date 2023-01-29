<script lang="ts">
	import '../app.css'
</script>

<div class="container mx-auto">
	<div class="flex items-center gap-2 justify-between">
		<div class="flex gap-2 items-center">
			<a href="/">Home</a>
			<a href="/rooms">Rooms</a>
		</div>
		<form action="/logout" method="POST" class="">
			<button type="submit">Logout</button>
		</form>
	</div>
	<slot />
</div>
