<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import type { FormData, SelectItem, Destination } from '$lib/types.ts';
	import { API_BASE_URL } from '$lib/constants';
	import * as Card from '$lib/components/ui/card';

	type Props = {
		ips?: boolean;
		onsubmit: (formData: FormData) => void;
		onreset?: () => void;
	};

	let { ips = false, onsubmit, onreset }: Props = $props();

	const formData: FormData = $state({
		startDate: '',
		endDate: '',
		country: '',
		region: '',
		city: ''
	});

	let destinations: Destination[] = $state([]);
	let status: 'idle' | 'loading-destinations' | 'loading-results' | 'error-results' =
		$state('idle');

	// Derived states for button enabling
	let isFormValid = $derived(formData.startDate && formData.endDate);
	let isSearchDisabled = $derived(!isFormValid || status !== 'idle');
	let isResetDisabled = $derived(status !== 'idle');

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

	function handleSubmit() {
		if (!formData.startDate || !formData.endDate) {
			console.error('Start date and end date are required');
			return;
		}
		status = 'loading-results';
		onsubmit(formData);
		// Reset status after a short delay to allow components to start loading
		setTimeout(() => {
			status = 'idle';
		}, 500);
	}

	function handleReset() {
		formData.startDate = '';
		formData.endDate = '';
		formData.country = '';
		formData.region = '';
		formData.city = '';
		destinations = [];
		onreset?.();
	}
</script>

<Card.Root class="mb-4">
	<Card.Header>
		<Card.Title class="text-2xl">BJNet Monitor</Card.Title>
		<Card.Description class="text-base">
			BJNet Monitor is a platform for visualizing internet performances in Benin. It's a local
			version of Measurement LAB for global internet performance. server.</Card.Description
		>
		<p class="mb-2">Here is QUIC data from External</p>
	</Card.Header>
	<Card.Content>
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
				disabled={status !== 'idle'}
			/>
			<Input
				type="date"
				name="endDate"
				placeholder="Date de fin"
				bind:value={formData.endDate}
				disabled={status !== 'idle'}
			/>
			{#if !ips}
				<Select.Root
					type="single"
					name="country"
					bind:value={formData.country}
					disabled={!countries.length || status !== 'idle'}
				>
					<Select.Trigger>
						{#if status === 'loading-destinations'}
							<Loader2Icon class="animate-spin" />
						{:else}
							{countries.find((f) => f.value === formData.country)?.label ?? 'Country'}
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
					disabled={!regions.length || status !== 'idle'}
				>
					<Select.Trigger>
						{#if status === 'loading-destinations'}
							<Loader2Icon class="animate-spin" />
						{:else}
							{regions.find((f) => f.value === formData.region)?.label ?? 'Region'}
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each regions as region}
							<Select.Item value={region.value} label={region.label} />
						{/each}
					</Select.Content>
				</Select.Root>
				<Select.Root
					type="single"
					name="city"
					bind:value={formData.city}
					disabled={!cities.length || status !== 'idle'}
				>
					<Select.Trigger>
						{#if status === 'loading-destinations'}
							<Loader2Icon class="animate-spin" />
						{:else}
							{regions.find((f) => f.value === formData.city)?.label ?? 'City'}
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each cities as city}
							<Select.Item value={city.value} label={city.label} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}
			<Button type="submit" disabled={isSearchDisabled}>
				{#if status === 'loading-results'}
					<Loader2Icon class="h-4 w-4 animate-spin" />
				{/if}
				Search
			</Button>
			<Button type="button" variant="outline" onclick={handleReset} disabled={isResetDisabled}>
				Reset
			</Button>
		</form>
	</Card.Content>
</Card.Root>
