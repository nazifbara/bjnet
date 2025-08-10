<script lang="ts">
	import * as d3 from 'd3';

	type BandwidthData = {
		isp: string;
		download_kbps: number;
		upload_kbps: number;
	};

	type Props = {
		data: BandwidthData[];
	};

	let { data }: Props = $props();

	let container: HTMLDivElement;

	function renderChart(data: BandwidthData[]) {
		if (!container) return;
		container.innerHTML = '';

		const margin = { top: 40, right: 40, bottom: 120, left: 100 };
		const width = Math.max(600, data.length * 100) - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Create scales
		const x = d3
			.scaleBand()
			.range([0, width])
			.domain(data.map((d) => d.isp))
			.padding(0.2);

		const y = d3.scaleLinear().range([height, 0]).domain([0, 4000]);

		// Add X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');

		// Add Y axis
		svg
			.append('g')
			.call(
				d3
					.axisLeft(y)
					.ticks(5)
					.tickValues(d3.range(0, 4001, 800))
			)
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -margin.left + 20)
			.attr('x', -(height / 2))
			.attr('text-anchor', 'middle')
			.attr('fill', 'currentColor')
			.text('Débit (Kb/s)');

		// Create subgroups
		const xSubgroup = d3
			.scaleBand()
			.domain(['download_kbps', 'upload_kbps'])
			.range([0, x.bandwidth()])
			.padding(0.05);

		// Color palette
		const color = d3
			.scaleOrdinal()
			.domain(['download_kbps', 'upload_kbps'])
			.range(['#2563eb', '#22c55e']);

		// Create bars
		const bandwidthTypes = ['download_kbps', 'upload_kbps'];

		svg
			.append('g')
			.selectAll('g')
			.data(data)
			.join('g')
			.attr('transform', (d) => `translate(${x(d.isp)},0)`)
			.selectAll('rect')
			.data((d) =>
				bandwidthTypes.map((key) => ({
					key,
					value: d[key as keyof BandwidthData],
					isp: d.isp
				}))
			)
			.join('rect')
			.attr('x', (d) => xSubgroup(d.key)!)
			.attr('y', (d) => y(d.value))
			.attr('width', xSubgroup.bandwidth())
			.attr('height', (d) => height - y(d.value))
			.attr('fill', (d) => color(d.key) as string);

		// Add legend
		const legend = svg
			.append('g')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('text-anchor', 'start')
			.selectAll('g')
			.data(['Download', 'Upload'])
			.join('g')
			.attr('transform', (_, i) => `translate(${width - 200 + i * 100}, ${-margin.top / 2})`);

		legend
			.append('rect')
			.attr('x', 0)
			.attr('width', 15)
			.attr('height', 15)
			.attr('fill', (_, i) => color(bandwidthTypes[i]) as string);

		legend
			.append('text')
			.attr('x', 25)
			.attr('y', 12)
			.text((d) => d);
	}

	$effect(() => {
		if (data && data.length > 0) {
			renderChart(data);
		}
	});
</script>

<div bind:this={container} class="w-full overflow-x-auto" style="min-height:500px;"></div>
