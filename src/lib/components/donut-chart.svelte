<script lang="ts">
	import * as d3 from 'd3';

	type Props = {
		value: number;
		label: string;
	};

	let { value, label }: Props = $props();

	let container: HTMLDivElement;

	function renderDonutChart(value: number, label: string) {
		if (!container) return;
		container.innerHTML = '';

		const width = 200;
		const height = 200;
		const thickness = 25;
		const radius = Math.min(width, height) / 2;
		const color = '#2563eb'; // blue-600

		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Create the pie layout
		const pie = d3
			.pie()
			.value((d) => d) // Use actual values
			.sort(null)
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI * 1.5);

		// Create the arc generator
		const arc = d3
			.arc()
			.innerRadius(radius - thickness)
			.outerRadius(radius);

		// Create the arcs using actual values
		const arcs = pie([value, 100 - value]);

		// Add the arcs
		svg
			.selectAll('path')
			.data(arcs)
			.enter()
			.append('path')
			.attr('d', arc as any)
			.style('fill', (_, i) => (i === 0 ? '#e5e7eb' : color));

		// Add central text
		const textGroup = svg.append('g');

		textGroup
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '0em')
			.style('font-size', '2.5rem')
			.style('font-weight', 'bold')
			.text(value.toFixed(1));

		textGroup
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '2em')
			.style('font-size', '1rem')
			.text(label);
	}

	$effect(() => {
		renderDonutChart(value, label);
	});
</script>

<div bind:this={container} class="flex w-full justify-center" />
