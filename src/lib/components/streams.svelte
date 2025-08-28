<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import DonutChart from '$lib/components/donut-chart.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchStreamData } from '$lib/api';

	type Props = {
		formData: FormData | null;
	};

	let { formData }: Props = $props();

	let data = $state<{ range: string; percent: number }[]>([]);
	let count = $state(0);
	let avgConcurrency = $state(0);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);

	async function handleSubmit(formData: FormData) {
		status = 'loading';
		data = [];
		count = 0;
		avgConcurrency = 0;

		try {
			const result = await fetchStreamData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'Aucune donnée disponible pour cette période';
				return;
			}
			count = result.session_count;
			avgConcurrency = result.avg_concurrency_overall;
			data = Object.entries(result.stream_concurrency_distribution || {}).map(
				([range, percent]) => ({
					range,
					percent: parseFloat(percent)
				})
			);
		} catch (error) {
			console.error('Error submitting form:', error);
			status = 'error';
			errorMessage =
				error instanceof Error && error.message !== 'No data found for the given criteria'
					? 'Une erreur est survenue lors de la récupération des données.'
					: 'Aucune donnée disponible pour cette période';
		} finally {
			status = 'idle';
		}
	}

	$effect(() => {
		if (formData) {
			handleSubmit(formData);
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Analyse des flux par connexion</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if !formData}
			<p class="text-muted-foreground">Veuillez sélectionner un intervalle de temps</p>
		{:else if status === 'loading'}
			<Loader2Icon class="mx-auto animate-spin" />
		{:else if errorMessage}
			<p class="text-destructive">
				{errorMessage}
			</p>
		{:else if count > 0}
			<div class="space-y-4">
				<Histogram data1={data} data2={[]} label1="Streams" label2="" />
				<div class="flex justify-center">
					<DonutChart value={avgConcurrency} label="Flux" />
				</div>
			</div>
		{:else}
			<p>Aucune donnée disponible pour cette période</p>
		{/if}
	</Card.Content>
</Card.Root>
