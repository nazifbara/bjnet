<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import GroupedBarChartMbps from '$lib/components/grouped-bar-chart-mbps.svelte';
	import { fetchBandwithData, type BandwidthResult } from '$lib/api';

	let data = $state<BandwidthResult[]>([]);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		status = 'loading';
		data = [];

		try {
			const result = await fetchBandwithData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'No data available for this period';
				return;
			}
			data = result.results || [];
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
		<Card.Title>Average Speeds by ISP</Card.Title>
		<Card.Description>
			Comparison of download and upload performance by internet service provider
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
		{:else if data.length > 0}
			<div class="space-y-6">
				<!-- Statistics Summary -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">
							{data.reduce((sum, item) => sum + item.sessions, 0)}
						</div>
						<div class="text-sm text-muted-foreground">Total sessions</div>
					</div>
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{data.length}</div>
						<div class="text-sm text-muted-foreground">ISPs analyzed</div>
					</div>
				</div>

				<!-- Chart -->
				<GroupedBarChartMbps {data} />
			</div>
		{:else}
			<p>No data available for this period</p>
		{/if}
	</Card.Content>
</Card.Root>
