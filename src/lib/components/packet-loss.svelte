<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import type { FormData } from '$lib/types';
	import Histogram from '$lib/components/histogram.svelte';
	import * as Card from '$lib/components/ui/card';
	import { fetchPacketLossData } from '$lib/api';

	let data = $state<{ range: string; percent: number }[]>([]);
	let count = $state(0);
	let status: 'idle' | 'loading' | 'error' = $state('idle');
	let errorMessage: string | null = $state(null);
	let hasFormData = $state(false);

	export async function handleSubmit(formData: FormData) {
		hasFormData = true;
		status = 'loading';
		data = [];
		count = 0;

		try {
			const result = await fetchPacketLossData(formData);
			if (!result) {
				status = 'error';
				errorMessage = 'Aucune donnée disponible pour cette période';
				return;
			}
			count = result.session_count;
			data = Object.entries(result.packet_loss_distribution || {}).map(([range, percent]) => ({
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

	export function handleReset() {
		hasFormData = false;
		status = 'idle';
		errorMessage = null;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Analyse de la perte de paquets</Card.Title>
		<Card.Description>Distribution des paquets perdus pendant la transmission</Card.Description>
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
		{:else if count > 0}
			<div class="space-y-6">
				<!-- Statistics Summary -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-1">
					<div class="rounded-lg bg-muted/50 p-4 text-center">
						<div class="text-2xl font-bold">{count}</div>
						<div class="text-sm text-muted-foreground">Sessions analysées</div>
					</div>
				</div>

				<!-- Chart -->
				<Histogram data1={data} data2={[]} label1="Packet Loss" label2="" />
			</div>
		{:else}
			<p>Aucune donnée disponible pour cette période</p>
		{/if}
	</Card.Content>
</Card.Root>
