<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import FilterForm from '$lib/components/filter-form.svelte';
	import { fetchServiceLevelData } from '$lib/api';

	let downloadDist = $state<{ range: string; percent: number }[]>([]);
	let uploadDist = $state<{ range: string; percent: number }[]>([]);
	let sessionCount = $state(0);
	let status: 'idle' | 'loading-destinations' | 'loading-results' | 'error-results' =
		$state('idle');
	let errorMessage: string | null = $state(null);

	async function handleSubmit(formData: FormData) {
		status = 'loading-results';
		downloadDist = [];
		uploadDist = [];
		sessionCount = 0;

		try {
			const result = await fetchServiceLevelData(formData);
			if (!result) {
				status = 'error-results';
				errorMessage = 'Aucune donnée disponible pour cette période';
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
		} catch (error) {
			console.error('Error submitting form:', error);
			status = 'error-results';
			errorMessage =
				error instanceof Error && error.message !== 'No data found for the given criteria'
					? 'Une erreur est survenue lors de la récupération des données.'
					: 'Aucune donnée disponible pour cette période';
		} finally {
			status = 'idle';
		}
	}
</script>

<FilterForm title="Répartition des débits par session" onsubmit={handleSubmit} />

{#if status === 'loading-results'}
	<Loader2Icon class="mx-auto animate-spin" />
{:else if errorMessage}
	<Card.Root>
		<Card.Content>
			<p class="text-destructive">
				{errorMessage}
			</p>
		</Card.Content>
	</Card.Root>
{:else if sessionCount > 0}
	<Card.Root>
		<Card.Content>
			<Histogram data1={downloadDist} data2={uploadDist} label1="Download" label2="Upload" />
		</Card.Content>
	</Card.Root>
{/if}
