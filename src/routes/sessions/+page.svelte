<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import type { FormData, SelectItem, Destination } from '$lib/types.ts';
	import { API_BASE_URL } from '$lib/constants';
	import Histogram from './histogram.svelte';
	import * as Card from '$lib/components/ui/card';

	const formData: FormData = $state({
		startDate: '',
		endDate: '',
		country: '',
		region: '',
		city: ''
	});

	let destinations: Destination[] = $state([]);
	let downloadDist = $state<{ range: string; percent: number }[]>([]);
	let uploadDist = $state<{ range: string; percent: number }[]>([]);
	let sessionCount = $state(0);
	let status: 'idle' | 'loading-destinations' | 'loading-results' | 'error-results' =
		$state('idle');

	let errorMessage: string | null = $state(null);
	let countries: SelectItem[] = $derived(
		Array.from(new Set(destinations.map((d) => d.country)))
			.sort()
			.map((country) => ({
				value: country,
				label: country
			}))
	);
	let regions: SelectItem[] = $derived(
		Array.from(
			new Set(destinations.filter((d) => d.country === formData.country).map((d) => d.region))
		)
			.sort()
			.map((region) => ({ value: region, label: region }))
	);
	let cities: SelectItem[] = $derived(
		Array.from(new Set(destinations.filter((d) => d.region === formData.region).map((d) => d.city)))
			.sort()
			.map((city) => ({ value: city, label: city }))
	);

	$effect(() => {
		if (formData.startDate && formData.endDate) {
			status = 'loading-destinations';
			console.log('Fetching data with:', formData);
			fetch(`${API_BASE_URL}/geoloc?startDate=${formData.startDate}&endDate=${formData.endDate}`, {
				method: 'GET',
				headers: { 'x-api-key': 'bjnet_web_dev' }
			})
				.then((response) => response.json())
				.then((data: { destinations: Destination[] } | { error: string }) => {
					if ('error' in data) {
						throw new Error(data.error);
					}
					console.log('Fetched data:', data);
					destinations = data.destinations;
				})
				.catch((error) => {
					console.error('Error fetching data:', error);
				})
				.finally(() => {
					status = 'idle';
				});
		}
	});

	async function handleSubmit() {
		if (!formData.startDate || !formData.endDate) {
			console.error('Start date and end date are required');
			return;
		}
		status = 'loading-results';
		uploadDist = [];
		downloadDist = [];
		sessionCount = 0;
		let url = `${API_BASE_URL}/serviceLevel?startDate=${formData.startDate}&endDate=${formData.endDate}`;
		if (formData.country) {
			url += `&country=${formData.country}`;
		}
		if (formData.region) {
			url += `&region=${formData.region}`;
		}
		if (formData.city) {
			url += `&city=${formData.city}`;
		}

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': 'bjnet_web_dev'
				}
			});
			if (response.status === 404) {
				console.error('No data found for the given criteria');
				status = 'error-results';
				errorMessage = 'Aucune donnée trouvée pour les critères donnés';
				return;
			} else if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result: {
				session_count: number;
				download_mbps_distribution: Record<string, string>;
				upload_mbps_distribution: Record<string, string>;
			} = await response.json();
			console.log('Form submitted successfully:', result);
			// Prepare data for histogram
			sessionCount = result.session_count;
			downloadDist = Object.entries(result.download_mbps_distribution).map(([range, percent]) => ({
				range,
				percent: parseFloat(percent)
			}));
			uploadDist = Object.entries(result.upload_mbps_distribution).map(([range, percent]) => ({
				range,
				percent: parseFloat(percent)
			}));
		} catch (error) {
			console.error('Error submitting form:', error);
			status = 'error-results';
		} finally {
			status = 'idle';
		}
	}
</script>

<Card.Root class="mb-4">
	<Card.Content>
		<h1 class="mb-6 text-2xl">Répartition des débits par session</h1>

		<form
			action=""
			class="flex gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<Input
				type="date"
				name="startDate"
				placeholder="Date de début"
				bind:value={formData.startDate}
			/>
			<Input type="date" name="endDate" placeholder="Date de fin" bind:value={formData.endDate} />
			<Select.Root
				type="single"
				name="country"
				bind:value={formData.country}
				disabled={!countries.length}
			>
				<Select.Trigger>
					{#if status === 'loading-destinations'}
						<Loader2Icon class="animate-spin" />
					{:else}
						{countries.find((f) => f.value === formData.country)?.label ?? 'Pays'}
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#each countries as country}
						<Select.Item value={country.value} label={country.label} />
					{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root
				type="single"
				name="region"
				bind:value={formData.region}
				disabled={!regions.length}
			>
				<Select.Trigger>
					{#if status === 'loading-destinations'}
						<Loader2Icon class="animate-spin" />
					{:else}
						{regions.find((f) => f.value === formData.region)?.label ?? 'Région'}
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#each regions as region}
						<Select.Item value={region.value} label={region.label} />
					{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root type="single" name="city" bind:value={formData.city} disabled={!cities.length}>
				<Select.Trigger>
					{#if status === 'loading-destinations'}
						<Loader2Icon class="animate-spin" />
					{:else}
						{regions.find((f) => f.value === formData.city)?.label ?? 'Ville'}
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#each cities as city}
						<Select.Item value={city.value} label={city.label} />
					{/each}
				</Select.Content>
			</Select.Root>
			<Button type="submit">
				{#if status === 'loading-results'}
					<Loader2Icon class="animate-spin" />
				{:else}
					Rechercher
				{/if}
			</Button>
		</form>
	</Card.Content>
</Card.Root>

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
{:else if sessionCount > 0}
	<Card.Root>
		<Card.Content>
			<Histogram {downloadDist} {uploadDist} label="Débit descendant (Mbps)" />
		</Card.Content>
	</Card.Root>
{/if}
