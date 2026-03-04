<script lang="ts">
	import * as d3 from 'd3';

	type CongestionData = {
		congestion_index: { avg: number; p50: number; p90: number };
		congestion_level_distribution: {
			low: string;
			moderate: string;
			high: string;
			very_high: string;
		};
	};

	let { data }: { data: CongestionData } = $props();

	let gaugeContainer: HTMLDivElement;
	let barContainer: HTMLDivElement;

	const getColor = (val: number) => {
		if (val < 0.375) return '#22c55e';
		if (val <= 0.75) return '#f59e0b';
		if (val <= 1.125) return '#ef4444';
		return '#b91c1c';
	};

	function renderGauge() {
		if (!gaugeContainer) return;
		gaugeContainer.innerHTML = '';

		const width = 340;
		const height = 260;
		const svg = d3
			.select(gaugeContainer)
			.append('svg')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height - 60})`);

		const radius = 130;
		const numValue = data.congestion_index.avg;

		const arc = d3
			.arc()
			.innerRadius(radius * 0.65)
			.outerRadius(radius)
			.cornerRadius(2);

		const pie = d3
			.pie()
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI / 2)
			.sort(null)
			.value(1);

		const segments = [
			{ label: 'LOW', color: '#22c55e', limit: '0.38' },
			{ label: 'MOD', color: '#f59e0b', limit: '0.75' },
			{ label: 'HIGH', color: '#ef4444', limit: '1.13' },
			{ label: 'V.HIGH', color: '#b91c1c', limit: '1.50' }
		];

		const arcs = svg
			.selectAll('g.arc')
			.data(pie(segments as any))
			.enter()
			.append('g')
			.attr('class', 'arc');

		arcs
			.append('path')
			.attr('d', arc as any)
			.attr('fill', (d) => (d.data as any).color)
			.attr('opacity', 0.9)
			.attr('stroke', 'white')
			.attr('stroke-width', '2px');

		// Category Labels (Inside segments)
		arcs
			.append('text')
			.attr('transform', (d) => `translate(${arc.centroid(d as any)})`)
			.attr('dy', '0.35em')
			.attr('text-anchor', 'middle')
			.attr('fill', 'white')
			.style('font-size', '10px')
			.style('font-weight', 'bold')
			.text((d) => (d.data as any).label);

		// Numerical Labels (At segment ends)
		const tickScale = d3
			.scaleLinear()
			.domain([0, 1.5])
			.range([-Math.PI / 2, Math.PI / 2]);
		const ticks = [0, 0.38, 0.75, 1.13, 1.5];

		svg
			.selectAll('.tick')
			.data(ticks)
			.enter()
			.append('text')
			.attr('x', (d) => Math.cos(tickScale(d) - Math.PI / 2) * (radius + 15))
			.attr('y', (d) => Math.sin(tickScale(d) - Math.PI / 2) * (radius + 15))
			.attr('text-anchor', 'middle')
			.attr('fill', '#94a3b8')
			.style('font-size', '11px')
			.text((d) => d);

		const needleScale = d3
			.scaleLinear()
			.domain([0, 1.5])
			.range([-Math.PI / 2, Math.PI / 2]);

		const angle = needleScale(Math.min(numValue, 1.5));

		svg
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', Math.sin(angle) * radius * 0.85)
			.attr('y2', -Math.cos(angle) * radius * 0.85)
			.attr('stroke', '#1e293b')
			.attr('stroke-width', 4)
			.attr('stroke-linecap', 'round');

		svg.append('circle').attr('r', 8).attr('fill', '#1e293b');

		svg
			.append('text')
			.attr('y', -35)
			.attr('text-anchor', 'middle')
			.attr('fill', getColor(numValue))
			.style('font-size', '34px')
			.style('font-weight', 'bold')
			.text(numValue.toFixed(2));

		svg
			.append('text')
			.attr('y', 35)
			.attr('text-anchor', 'middle')
			.attr('fill', '#64748b')
			.style('font-size', '15px')
			.style('font-weight', '500')
			.text('Congestion Index');
	}

	function renderHistogram() {
		if (!barContainer) return;
		barContainer.innerHTML = '';

		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const width = 400 - margin.left - margin.right;
		const height = 250 - margin.top - margin.bottom;

		const svg = d3
			.select(barContainer)
			.append('svg')
			.attr(
				'viewBox',
				`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
			)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const dist = data.congestion_level_distribution;
		const formattedData = [
			{ label: 'Low', value: parseFloat(dist.low), color: '#22c55e' },
			{ label: 'Moderate', value: parseFloat(dist.moderate), color: '#f59e0b' },
			{ label: 'High', value: parseFloat(dist.high), color: '#ef4444' },
			{ label: 'Very High', value: parseFloat(dist.very_high), color: '#b91c1c' }
		];

		const x = d3
			.scaleBand()
			.range([0, width])
			.domain(formattedData.map((d) => d.label))
			.padding(0.3);
		const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.attr('color', '#64748b');

		svg
			.selectAll('rect')
			.data(formattedData)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.label)!)
			.attr('y', (d) => y(d.value))
			.attr('width', x.bandwidth())
			.attr('height', (d) => height - y(d.value))
			.attr('fill', (d) => d.color)
			.attr('rx', 4);

		svg
			.selectAll('.label')
			.data(formattedData)
			.enter()
			.append('text')
			.attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
			.attr('y', (d) => y(d.value) - 5)
			.attr('text-anchor', 'middle')
			.attr('fill', '#1e293b')
			.style('font-size', '12px')
			.text((d) => d.value + '%');
	}

	$effect(() => {
		if (data) {
			renderGauge();
			renderHistogram();
		}
	});
</script>

<div class="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
	<div class="flex flex-col items-center">
		<div bind:this={gaugeContainer} class="w-full max-w-[340px]"></div>

		<div class="mt-2 flex w-full max-w-[280px] justify-between border-t pt-4">
			<div class="text-center">
				<p class="text-xs tracking-wider uppercase">P50 (Median)</p>
				<p class="text-xl font-bold">{data.congestion_index.p50}</p>
			</div>
			<div class="text-center">
				<p class="text-xs tracking-wider uppercase">P90 (Critical)</p>
				<p class="text-xl font-bold">{data.congestion_index.p90}</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col justify-center">
		<h3 class="mb-4 text-center font-semibold">Session Distribution (%)</h3>
		<div bind:this={barContainer} class="w-full"></div>
	</div>
</div>
