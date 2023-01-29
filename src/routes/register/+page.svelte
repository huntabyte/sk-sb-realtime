<script lang="ts">
</script>

<form action="?/register" method="POST" class="flex flex-col space-y-2 max-w-xl">
	<label for="email">Email</label>
	<input
		type="email"
		name="email"
		id="email"
		placeholder="Email"
		class="border border-gray-600 p-2"
	/>
	<label for="password">Password</label>
	<input
		type="password"
		name="password"
		id="password"
		placeholder="Password"
		class="border border-gray-600 p-2"
	/>
	<button type="submit" class="bg-cyan-600 px-2.5 py-2">Login</button>
</form>
