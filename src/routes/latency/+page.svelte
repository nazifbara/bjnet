<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import FilterForm from '$lib/components/filter-form.svelte';
	import { fetchRTTData } from '$lib/api';

	let data = $state<{ range: string; percent: number }[]>([]);
	let count = $state(0);
	let status: 'idle' | 'loading-destinations' | 'loading-results' | 'error-results' =
		$state('idle');
	let errorMessage: string | null = $state(null);

	async function handleSubmit(formData: FormData) {
		status = 'loading-results';
		data = [];
		count = 0;

		try {
			const result = await fetchRTTData(formData);
			if (!result) {
				status = 'error-results';
				errorMessage = 'Aucune donnée disponible pour cette période';
				return;
			}
			count = result.session_count;
			data = Object.entries(result.rtt_distribution_ms || {}).map(([range, percent]) => ({
				range,
				percent: parseFloat(percent)
			}));
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

<FilterForm title="Analyse des délais d'aller-retour (RTT)" onsubmit={handleSubmit} />

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
{:else if count > 0}
	<Card.Root>
		<Card.Content>
			<Histogram data1={data} data2={[]} label1="Delay" label2="" />
		</Card.Content>
	</Card.Root>
{/if}
