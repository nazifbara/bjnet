<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import PieChart from '$lib/components/pie-chart.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchRetransmissionData } from '$lib/api';

	let lossTriggerData = $state<{ range: string; percent: number }[]>([]);
	let packetLossRateData = $state<{ range: string; percent: number }[]>([]);
	let sessionCount = $state(0);
	let totalPacketsLost = $state(0);
	let avgPacketsLostPerSession = $state(0);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		status = 'loading';
		lossTriggerData = [];
		packetLossRateData = [];
		sessionCount = 0;
		totalPacketsLost = 0;
		avgPacketsLostPerSession = 0;

		try {
			const result = await fetchRetransmissionData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'No data available for this period';
				return;
			}

			sessionCount = result.session_count;
			totalPacketsLost = result.total_packets_lost;
			avgPacketsLostPerSession = result.avg_packets_lost_per_session;

			lossTriggerData = Object.entries(result.loss_trigger_distribution || {}).map(
				([range, percent]) => ({
					range,
					percent: parseFloat(percent.replace('%', ''))
				})
			);

			packetLossRateData = Object.entries(result.packet_loss_rate_distribution || {}).map(
				([range, percent]) => ({
					range,
					percent: parseFloat(percent.replace('%', ''))
				})
			);
		} catch (error) {
			console.error('Error submitting form:', error);
			status = 'error';
			errorMessage =
				error instanceof Error && error.message !== 'No data found for the given criteria'
					? 'An error occurred while retrieving data.'
					: 'No data available for this period';
		} finally {
			status = 'idle';
		}
	}

	export function handleReset() {
		hasFormData = false;
		sessionCount = 0;
		totalPacketsLost = 0;
		avgPacketsLostPerSession = 0;
		status = 'idle';
		errorMessage = null;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Retransmission Analysis</Card.Title>
		<Card.Description>
			Shows how many packets were lost, main causes, and distribution of loss rates
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !hasFormData}
			<p class="text-muted-foreground">Please select a time interval</p>
		{:else if status === 'loading'}
			<Loader2Icon class="mx-auto animate-spin" />
		{:else if errorMessage}
			<p class="text-destructive">
				{errorMessage}
			</p>
		{:else if sessionCount > 0}
			<div class="space-y-6">
				<!-- Statistics Summary -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{sessionCount}</div>
						<div class="text-sm text-muted-foreground">Sessions analyzed</div>
					</div>
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{totalPacketsLost.toLocaleString()}</div>
						<div class="text-sm text-muted-foreground">Total packets lost</div>
					</div>
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{avgPacketsLostPerSession.toFixed(1)}</div>
						<div class="text-sm text-muted-foreground">Average per session</div>
					</div>
				</div>

				<!-- Charts -->
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
					<!-- Loss Trigger Distribution (Donut Chart) -->
					<div class="space-y-4">
						<h4 class="text-center font-medium">Retransmission Causes</h4>
						<PieChart data={lossTriggerData} />
					</div>

					<!-- Packet Loss Rate Distribution (Histogram) -->
					<div class="space-y-4">
						<h4 class="text-center font-medium">Loss Rate Distribution</h4>
						<Histogram data1={packetLossRateData} data2={[]} label1="Loss Rate" label2="" />
					</div>
				</div>
			</div>
		{:else}
			<p>No data available for this period</p>
		{/if}
	</Card.Content>
</Card.Root>
