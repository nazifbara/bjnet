<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import DonutChart from '$lib/components/donut-chart.svelte';
	import * as Card from '$lib/components/ui/card';
	import FilterForm from '$lib/components/filter-form.svelte';
	import { fetchStreamData } from '$lib/api';

	let data = $state<{ range: string; percent: number }[]>([]);
	let count = $state(0);
	let avgConcurrency = $state(0);
	let status: 'idle' | 'loading-destinations' | 'loading-results' | 'error-results' =
		$state('idle');
	let errorMessage: string | null = $state(null);

	async function handleSubmit(event: CustomEvent<{ formData: FormData; status: string }>) {
		const { formData } = event.detail;
		status = 'loading-results';
		data = [];
		count = 0;
		avgConcurrency = 0;

		try {
			const result = await fetchStreamData(formData);
			count = result.session_count;
			avgConcurrency = result.avg_concurrency_overall;
			data = Object.entries(result.stream_concurrency_distribution).map(([range, percent]) => ({
				range,
				percent: parseFloat(percent)
			}));
		} catch (error) {
			console.error('Error submitting form:', error);
			status = 'error-results';
			errorMessage =
				error instanceof Error
					? error.message
					: 'Une erreur est survenue lors de la récupération des données';
		} finally {
			status = 'idle';
		}
	}
</script>

<FilterForm title="Analyse des flux par connexion" on:submit={handleSubmit} />

{#if status === 'loading-results'}
	<Loader2Icon class="mx-auto animate-spin" />
{:else if status === 'error-results'}
	<Card.Root>
		<Card.Content>
			<p class="text-destructive">
				{errorMessage || 'Une erreur est survenue lors de la récupération des données.'}
			</p>
		</Card.Content>
	</Card.Root>
{:else if count > 0}
	<div class="space-y-4">
		<Card.Root>
			<Card.Content>
				<Histogram data1={data} data2={[]} label1="Streams" label2="" />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content>
				<div class="flex justify-center">
					<DonutChart value={avgConcurrency} label="Flux" />
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
