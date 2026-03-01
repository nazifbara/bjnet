<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchServiceLevelData } from '$lib/api';

	let downloadDist = $state<{ range: string; percent: number }[]>([]);
	let uploadDist = $state<{ range: string; percent: number }[]>([]);
	let sessionCount = $state(0);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		errorMessage = null;
		status = 'loading';
		downloadDist = [];
		uploadDist = [];
		sessionCount = 0;

		try {
			const result = await fetchServiceLevelData(formData);

			if (!result) {
				status = 'error';
				errorMessage = 'No data available for this period';
				return;
			}

			sessionCount = result.session_count;
			downloadDist = Object.entries(result.download_mbps_distribution || {}).map(
				([range, percent]) => ({
					range,
					percent: parseFloat(percent)
				})
			);
			uploadDist = Object.entries(result.upload_mbps_distribution || {}).map(
				([range, percent]) => ({
					range,
					percent: parseFloat(percent)
				})
			);
			console.log({ result, downloadDist, uploadDist });
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
		downloadDist = [];
		uploadDist = [];
		sessionCount = 0;
		status = 'idle';
		errorMessage = null;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Session Bandwidth Distribution</Card.Title>
		<Card.Description>Analysis of download and upload speeds across all sessions</Card.Description>
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
		{:else}
			<div class="space-y-6">
				<!-- Statistics Summary -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-1">
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{sessionCount}</div>
						<div class="text-sm text-muted-foreground">Sessions analyzed</div>
					</div>
				</div>

				<!-- Chart -->
				<Histogram data1={downloadDist} data2={uploadDist} label1="Download" label2="Upload" />
			</div>
		{/if}
	</Card.Content>
</Card.Root>
