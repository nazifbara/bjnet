<script lang="ts">
	import Sessions from '$lib/components/sessions.svelte';
	import Latency from '$lib/components/latency.svelte';
	import ISP from '$lib/components/isp.svelte';
	import Streams from '$lib/components/streams.svelte';
	import Acknowledgment from '$lib/components/acknowledgment.svelte';
	import FilterForm from '$lib/components/filter-form.svelte';
	import type { FormData } from '$lib/types';

	let formdata = $state<FormData | null>(null);
</script>

<FilterForm onsubmit={(data) => (formdata = data)} />

<div class="grid gap-4">
	<Sessions formData={formdata} />
	<Latency formData={formdata} />
	<ISP formData={formdata} />
	<Streams formData={formdata} />
	<Acknowledgment formData={formdata} />
</div>
