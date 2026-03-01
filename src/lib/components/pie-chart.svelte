<script lang="ts">
	import * as d3 from 'd3';

	type Props = {
		data: { range: string; percent: number }[];
		showLegend?: boolean;
	};

	let { data, showLegend = true }: Props = $props();

	let container: HTMLDivElement;

	const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#be185d'];

	function renderPieChart(data: { range: string; percent: number }[]) {
		if (!container || !data.length) return;
		container.innerHTML = '';

		// UPDATED: Increased to 400px for better visibility
		const width = 400;
		const height = 400;

		// UPDATED: Increased padding to 30 to give the labels "breathing room"
		const radius = Math.min(width, height) / 2 - 30;

		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', '100%') // Make it fill the container width
			.attr('height', '100%')
			.attr('viewBox', `0 0 ${width} ${height}`) // Maintains aspect ratio
			.attr('style', 'max-width: 400px; height: auto;') // Keeps it from getting gargantuan on ultrawide monitors
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		const pie = d3
			.pie<{ range: string; percent: number }>()
			.value((d) => d.percent)
			.sort(null);

		const arc = d3
			.arc()
			.innerRadius(radius * 0.55) // Slightly thinner donut for a more modern look
			.outerRadius(radius);

		const arcs = pie(data);

		svg
			.selectAll('path')
			.data(arcs)
			.enter()
			.append('path')
			.attr('d', arc as any)
			.style('fill', (_, i) => colors[i % colors.length])
			.style('stroke', 'white')
			.style('stroke-width', '3px'); // Thicker border for better contrast at larger sizes

		// Add labels
		svg
			.selectAll('text')
			.data(arcs)
			.enter()
			.append('text')
			.attr('transform', (d) => `translate(${arc.centroid(d as any)})`)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px') // Increased font size for readability
			.style('font-weight', '700')
			.style('fill', 'white')
			.style('pointer-events', 'none')
			.text((d) => `${d.data.percent}%`);
	}

	$effect(() => {
		renderPieChart(data);
	});
</script>

<div class="flex w-full flex-col items-center py-4">
	<div bind:this={container} class="flex w-full justify-center"></div>

	{#if showLegend && data.length > 0}
		<div class="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each data as item, index}
				<div class="flex items-center space-x-3">
					<div
						class="h-4 w-4 rounded-sm"
						style="background-color: {colors[index % colors.length]}"
					></div>
					<span class="text-sm font-semibold text-gray-700">{item.range}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
