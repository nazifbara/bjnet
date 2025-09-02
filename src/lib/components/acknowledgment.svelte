<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchAckDelayData } from '$lib/api';

	let data = $state<{ range: string; percent: number }[]>([]);
	let count = $state(0);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		status = 'loading';
		data = [];
		count = 0;

		try {
			const result = await fetchAckDelayData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'No data available for this period';
				return;
			}
			count = result.ack_count;
			data = Object.entries(result.ack_delay_distribution_ms || {}).map(([range, percent]) => ({
				range,
				percent: parseFloat(percent)
			}));
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
		status = 'idle';
		errorMessage = null;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Acknowledgment Delay Analysis</Card.Title>
		<Card.Description>Time required to receive packet reception confirmation</Card.Description>
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
		{:else if count > 0}
			<div class="space-y-6">
				<!-- Statistics Summary -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-1">
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{count}</div>
						<div class="text-sm text-muted-foreground">Acknowledgments analyzed</div>
					</div>
				</div>

				<!-- Chart -->
				<Histogram data1={data} data2={[]} label1="Ack" label2="" />
			</div>
		{:else}
			<p>No data available for this period</p>
		{/if}
	</Card.Content>
</Card.Root>
