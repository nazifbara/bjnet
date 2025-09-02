<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import GroupedBarChart from '$lib/components/grouped-bar-chart.svelte';
	import { fetchBandwithData } from '$lib/api';

	type BandwidthData = {
		isp: string;
		sessions: number;
		upload_kbps: number;
		download_kbps: number;
	};

	let data = $state<BandwidthData[]>([]);
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
				errorMessage = 'Aucune donnée disponible pour cette période';
				return;
			}
			data = result.results || [];
		} catch (error) {
			console.error('Error submitting form:', error);
			status = 'error';
			errorMessage =
				error instanceof Error && error.message !== 'No data found for the given criteria'
					? 'Une erreur is survenue lors de la récupération des données.'
					: 'Aucune donnée disponible pour cette période';
		} finally {
			status = 'idle';
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Débits moyens par FAI</Card.Title>
		<Card.Description>
			Comparaison des performances de téléchargement et d'upload par fournisseur d'accès
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !hasFormData}
			<p class="text-muted-foreground">Veuillez sélectionner un intervalle de temps</p>
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
						<div class="text-sm text-muted-foreground">Sessions totales</div>
					</div>
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{data.length}</div>
						<div class="text-sm text-muted-foreground">FAI analysés</div>
					</div>
				</div>

				<!-- Chart -->
				<GroupedBarChart {data} />
			</div>
		{:else}
			<p>Aucune donnée disponible pour cette période</p>
		{/if}
	</Card.Content>
</Card.Root>
