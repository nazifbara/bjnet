<script lang="ts">
	import * as d3 from 'd3';

	type Props = {
		data: { range: string; percent: number }[];
	};

	let { data }: Props = $props();

	let container: HTMLDivElement;

	function renderPieChart(data: { range: string; percent: number }[]) {
		if (!container || !data.length) return;
		container.innerHTML = '';

		const width = 200;
		const height = 200;
		const radius = Math.min(width, height) / 2 - 10;

		// High contrast color palette
		const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#be185d'];

		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Create the pie layout
		const pie = d3
			.pie<{ range: string; percent: number }>()
			.value((d) => d.percent)
			.sort(null);

		// Create the arc generator
		const arc = d3
			.arc()
			.innerRadius(radius * 0.6) // Make it a donut
			.outerRadius(radius);

		// Create the arcs
		const arcs = pie(data);

		// Add the arcs
		svg
			.selectAll('path')
			.data(arcs)
			.enter()
			.append('path')
			.attr('d', arc as any)
			.style('fill', (_, i) => colors[i % colors.length])
			.style('stroke', 'white')
			.style('stroke-width', 2);

		// Add labels
		svg
			.selectAll('text')
			.data(arcs)
			.enter()
			.append('text')
			.attr('transform', (d) => `translate(${arc.centroid(d as any)})`)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', 'bold')
			.style('fill', 'white')
			.text((d) => `${d.data.percent}%`);
	}

	$effect(() => {
		renderPieChart(data);
	});
</script>

<div bind:this={container} class="flex w-full justify-center"></div>

<!-- Legend -->
{#if data.length > 0}
	<div class="mt-4 flex flex-col space-y-2">
		{#each data as item, index}
			<div class="flex items-center space-x-2">
				<div
					class="h-3 w-3 rounded-full"
					style="background-color: {[
						'#2563eb',
						'#dc2626',
						'#16a34a',
						'#ea580c',
						'#7c3aed',
						'#0891b2',
						'#be185d'
					][index % 7]}"
				></div>
				<span class="text-sm">{item.range}</span>
			</div>
		{/each}
	</div>
{/if}
