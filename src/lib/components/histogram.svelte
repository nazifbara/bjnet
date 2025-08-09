<script lang="ts">
	import * as d3 from 'd3';

	type Props = {
		data1: { range: string; percent: number }[];
		data2: { range: string; percent: number }[];
		label1: string;
		label2: string;
	};

	let { data1, data2, label1, label2 }: Props = $props();

	let container: HTMLDivElement;

	function renderHistogram(
		data1: { range: string; percent: number }[],
		data2: { range: string; percent: number }[]
	) {
		if (!container) return;
		container.innerHTML = '';
		const margin = { top: 20, right: 20, bottom: 80, left: 40 };
		const width = 700 - margin.left - margin.right;
		const height = 450 - margin.top - margin.bottom;
		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Get all unique ranges
		const allRanges = Array.from(
			new Set([...data1.map((d) => d.range), ...data2.map((d) => d.range)])
		);

		const x0 = d3.scaleBand().domain(allRanges).range([0, width]).padding(0.2);

		const x1 = d3
			.scaleBand()
			.domain(data2.length ? [label1, label2] : [label1])
			.range([0, x0.bandwidth()])
			.padding(0.05);

		const y = d3
			.scaleLinear()
			.domain([
				0,
				Math.max(
					d3.max(data1, (d) => d.percent) || 0,
					data2.length ? d3.max(data2, (d) => d.percent) || 0 : 0,
					100
				)
			])
			.range([height, 0]);

		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x0))
			.selectAll('text')
			.attr('transform', 'rotate(-30)')
			.style('text-anchor', 'end');

		svg.append('g').call(
			d3
				.axisLeft(y)
				.ticks(5)
				.tickFormat((d) => d + '%')
		);

		// Prepare data for grouped bars
		const dataMap = new Map();
		data1.forEach((d) => {
			dataMap.set(d.range, { download: d.percent, upload: 0 });
		});
		data2.forEach((d) => {
			if (!dataMap.has(d.range)) {
				dataMap.set(d.range, { download: 0, upload: d.percent });
			} else {
				dataMap.get(d.range).upload = d.percent;
			}
		});

		const colors = { [label1]: '#2563eb', [label2]: '#22c55e' };

		svg
			.selectAll('g.bar-group')
			.data(allRanges)
			.enter()
			.append('g')
			.attr('class', 'bar-group')
			.attr('transform', (d) => `translate(${x0(d)},0)`)
			.selectAll('rect')
			.data((range) => [
				{ key: label1, value: dataMap.get(range)?.download || 0 },
				{ key: label2, value: dataMap.get(range)?.upload || 0 }
			])
			.enter()
			.append('rect')
			.attr('x', (d) => x1(d.key)!)
			.attr('y', (d) => y(d.value))
			.attr('width', x1.bandwidth())
			.attr('height', (d) => height - y(d.value))
			.attr('fill', (d) => colors[d.key]);

		// Add legend
		const legend = svg.append('g').attr('transform', `translate(${width - 120}, 0)`);
		const legendLabels = data2.length ? [label1, label2] : [label1];
		legendLabels.forEach((key, i) => {
			legend
				.append('rect')
				.attr('x', 0)
				.attr('y', i * 20)
				.attr('width', 16)
				.attr('height', 16)
				.attr('fill', colors[key]);
			legend
				.append('text')
				.attr('x', 22)
				.attr('y', i * 20 + 12)
				.text(key)
				.style('font-size', '12px');
		});
	}

	$effect(() => {
		if (data1 && data1.length) {
			renderHistogram(data1, data2 || []);
		}
	});
</script>

<div bind:this={container} class="w-full overflow-x-auto" style="min-height:270px;"></div>
