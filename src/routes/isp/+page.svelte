<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import FilterForm from '$lib/components/filter-form.svelte';
	import GroupedBarChart from '$lib/components/grouped-bar-chart.svelte';
	import { fetchBandwithData } from '$lib/api';

	type BandwidthData = {
		isp: string;
		sessions: number;
		upload_kbps: number;
		download_kbps: number;
	};

	let data = $state<BandwidthData[]>([]);
	let status: 'idle' | 'loading-destinations' | 'loading-results' | 'error-results' =
		$state('idle');
	let errorMessage: string | null = $state(null);

	async function handleSubmit(event: CustomEvent<{ formData: FormData; status: string }>) {
		const { formData } = event.detail;
		status = 'loading-results';
		data = [];

		try {
			const result = await fetchBandwithData(formData);
			data = result.results;
			console.log({ data });
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

<FilterForm title="Débits moyens par FAI" on:submit={handleSubmit} ips />

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
{:else if data.length > 0}
	<Card.Root>
		<Card.Content>
			<GroupedBarChart {data} />
		</Card.Content>
	</Card.Root>
{/if}
