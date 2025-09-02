<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchBandwidthDistributionData } from '$lib/api';

	let uploadDistribution = $state<{ range: string; percent: number }[]>([]);
	let downloadDistribution = $state<{ range: string; percent: number }[]>([]);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		status = 'loading';
		uploadDistribution = [];
		downloadDistribution = [];

		try {
			const result = await fetchBandwidthDistributionData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'No data available for this period';
				return;
			}

			uploadDistribution = Object.entries(result.upload_distribution || {}).map(
				([isp, percent]) => ({
					range: isp,
					percent: parseFloat(percent)
				})
			);

			downloadDistribution = Object.entries(result.download_distribution || {}).map(
				([isp, percent]) => ({
					range: isp,
					percent: parseFloat(percent)
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
		uploadDistribution = [];
		downloadDistribution = [];
		status = 'idle';
		errorMessage = null;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Bandwidth Distribution by ISP</Card.Title>
		<Card.Description>
			Distribution of upload and download traffic across different internet service providers
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
		{:else if uploadDistribution.length > 0 || downloadDistribution.length > 0}
			<div class="space-y-6">
				<!-- Statistics Summary -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{uploadDistribution.length}</div>
						<div class="text-sm text-muted-foreground">ISPs with upload traffic</div>
					</div>
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{downloadDistribution.length}</div>
						<div class="text-sm text-muted-foreground">ISPs with download traffic</div>
					</div>
				</div>

				<!-- Chart -->
				<div class="space-y-4">
					<h4 class="text-center font-medium">Bandwidth Distribution by ISP</h4>
					{#if uploadDistribution.length > 0 || downloadDistribution.length > 0}
						<Histogram
							data1={uploadDistribution}
							data2={downloadDistribution}
							label1="Upload"
							label2="Download"
						/>
					{:else}
						<p class="text-center text-muted-foreground">No data available</p>
					{/if}
				</div>
			</div>
		{:else}
			<p>No data available for this period</p>
		{/if}
	</Card.Content>
</Card.Root>
