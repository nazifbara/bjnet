<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchAckDelayData } from '$lib/api';

	type Props = {
		formData: FormData | null;
	};

	let { formData }: Props = $props();

	let data = $state<{ range: string; percent: number }[]>([]);
	let count = $state(0);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);

	async function handleSubmit(formData: FormData) {
		status = 'loading';
		data = [];
		count = 0;

		try {
			const result = await fetchAckDelayData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'Aucune donnée disponible pour cette période';
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
		<Card.Title>Analyse des délais d'acquittement</Card.Title>
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
			<Histogram data1={data} data2={[]} label1="Ack" label2="" />
		{:else}
			<p>Aucune donnée disponible pour cette période</p>
		{/if}
	</Card.Content>
</Card.Root>
