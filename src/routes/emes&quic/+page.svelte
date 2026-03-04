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
	import Congestion from '$lib/components/congestion.svelte';

	let sessionsComponent: Sessions;
	let latencyComponent: Latency;
	let packetLossComponent: PacketLoss;
	let retransmissionsComponent: Retransmissions;
	let bandwidthDistributionComponent: BandwidthDistribution;
	let ispComponent: ISP;
	let streamsComponent: Streams;
	let acknowledgmentComponent: Acknowledgment;
	let congestionComponent: Congestion;

	function handleFormSubmit(formData: FormData) {
		sessionsComponent?.handleSubmit(formData);
		latencyComponent?.handleSubmit(formData);
		packetLossComponent?.handleSubmit(formData);
		retransmissionsComponent?.handleSubmit(formData);
		bandwidthDistributionComponent?.handleSubmit(formData);
		ispComponent?.handleSubmit(formData);
		streamsComponent?.handleSubmit(formData);
		acknowledgmentComponent?.handleSubmit(formData);
		congestionComponent?.handleSubmit(formData);
	}

	function handleFormReset() {
		sessionsComponent?.handleReset();
		latencyComponent?.handleReset();
		packetLossComponent?.handleReset();
		retransmissionsComponent?.handleReset();
		bandwidthDistributionComponent?.handleReset();
		ispComponent?.handleReset();
		streamsComponent?.handleReset();
		acknowledgmentComponent?.handleReset();
		congestionComponent?.handleReset();
	}
</script>

<FilterForm onsubmit={handleFormSubmit} onreset={handleFormReset} />

<div class="grid min-w-0 gap-4">
	<Sessions bind:this={sessionsComponent} />
	<Latency bind:this={latencyComponent} />
	<PacketLoss bind:this={packetLossComponent} />
	<Acknowledgment bind:this={acknowledgmentComponent} />
	<Streams bind:this={streamsComponent} />
	<Congestion bind:this={congestionComponent} />
	<Retransmissions bind:this={retransmissionsComponent} />
	<ISP bind:this={ispComponent} />
	<BandwidthDistribution bind:this={bandwidthDistributionComponent} />
</div>
