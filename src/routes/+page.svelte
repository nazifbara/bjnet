<script lang="ts">
	import Sessions from '$lib/components/sessions.svelte';
	import Latency from '$lib/components/latency.svelte';
	import ISP from '$lib/components/isp.svelte';
	import Streams from '$lib/components/streams.svelte';
	import Acknowledgment from '$lib/components/acknowledgment.svelte';
	import FilterForm from '$lib/components/filter-form.svelte';
	import type { FormData } from '$lib/types';

	let sessionsComponent: Sessions;
	let latencyComponent: Latency;
	let ispComponent: ISP;
	let streamsComponent: Streams;
	let acknowledgmentComponent: Acknowledgment;

	function handleFormSubmit(formData: FormData) {
		sessionsComponent?.handleSubmit(formData);
		latencyComponent?.handleSubmit(formData);
		ispComponent?.handleSubmit(formData);
		streamsComponent?.handleSubmit(formData);
		acknowledgmentComponent?.handleSubmit(formData);
	}
</script>

<FilterForm onsubmit={handleFormSubmit} />

<div class="grid gap-4">
	<Sessions bind:this={sessionsComponent} />
	<Latency bind:this={latencyComponent} />
	<ISP bind:this={ispComponent} />
	<Streams bind:this={streamsComponent} />
	<Acknowledgment bind:this={acknowledgmentComponent} />
</div>
