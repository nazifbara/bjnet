<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import { fetchCongestionData, type CongestionData } from '$lib/api';
	import GaugeGraph from './gauge-graph.svelte';

	let data: CongestionData | null = $state(null);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		errorMessage = null;
		status = 'loading';
		data = null;

		try {
			const result = await fetchCongestionData(formData);

			if (!result) {
				status = 'error';
				errorMessage = 'No data available for this period';
				return;
			}

			data = result;
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
		data = null;
		status = 'idle';
		errorMessage = null;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Network Congestion Pressure Index</Card.Title>
		<Card.Description>
			Provides a synthetic indicator of congestion pressure derived from the ratio between bytes in
			flight and the congestion window.
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
		{:else if data}
			<div class="mb-6 grid">
				<div class="rounded-lg bg-muted/50 p-4 text-center">
					<div class="text-2xl font-bold">{data.session_count}</div>
					<div class="text-sm text-muted-foreground">Sessions analyzed</div>
				</div>
			</div>
			<GaugeGraph {data} />
		{/if}
	</Card.Content>
</Card.Root>
