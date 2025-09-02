<script lang="ts">
	import Sessions from '$lib/components/sessions.svelte';
	import Latency from '$lib/components/latency.svelte';
	import PacketLoss from '$lib/components/packet-loss.svelte';
	import Retransmissions from '$lib/components/retransmissions.svelte';
	import BandwidthDistribution from '$lib/components/bandwidth-distribution.svelte';
	import ISP from '$lib/components/isp.svelte';
	import Streams from '$lib/components/streams.svelte';
	import Acknowledgment from '$lib/components/acknowledgment.svelte';
	import FilterForm from '$lib/components/filter-form.svelte';
	import type { FormData } from '$lib/types';

	let sessionsComponent: Sessions;
	let latencyComponent: Latency;
	let packetLossComponent: PacketLoss;
	let retransmissionsComponent: Retransmissions;
	let bandwidthDistributionComponent: BandwidthDistribution;
	let ispComponent: ISP;
	let streamsComponent: Streams;
	let acknowledgmentComponent: Acknowledgment;

	function handleFormSubmit(formData: FormData) {
		sessionsComponent?.handleSubmit(formData);
		latencyComponent?.handleSubmit(formData);
		packetLossComponent?.handleSubmit(formData);
		retransmissionsComponent?.handleSubmit(formData);
		bandwidthDistributionComponent?.handleSubmit(formData);
		ispComponent?.handleSubmit(formData);
		streamsComponent?.handleSubmit(formData);
		acknowledgmentComponent?.handleSubmit(formData);
	}
</script>

<FilterForm onsubmit={handleFormSubmit} />

<div class="grid min-w-0 gap-4">
	<Sessions bind:this={sessionsComponent} />
	<Latency bind:this={latencyComponent} />
	<PacketLoss bind:this={packetLossComponent} />
	<Retransmissions bind:this={retransmissionsComponent} />
	<BandwidthDistribution bind:this={bandwidthDistributionComponent} />
	<ISP bind:this={ispComponent} />
	<Streams bind:this={streamsComponent} />
	<Acknowledgment bind:this={acknowledgmentComponent} />
</div>
