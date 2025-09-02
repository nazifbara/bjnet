<script lang="ts">
	import { ChevronDownIcon, LayersIcon, ChevronUpIcon } from '@lucide/svelte';
	import { page } from '$app/state';

	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible';

	const serverProtocolsRoutes = [
		{
			title: 'UAC & TCP',
			url: '/#'
		},
		{
			title: 'UAC & QUIC',
			url: '/#'
		},
		{
			title: 'EMES & TCP',
			url: '/#'
		},
		{
			title: 'EMES & QUIC',
			url: '/emes&quic'
		}
	];

	let menuGroupOpen = $state(true);
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Header>
			<img src="/bjnet_icon.jpeg" alt="logo" />
		</Sidebar.Header>

		<Collapsible.Root bind:open={menuGroupOpen} class="group/collapsible">
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props}
								><LayersIcon /> <span class="mr-auto">Server & Protocol</span>
								{#if menuGroupOpen}
									<ChevronDownIcon />
								{:else}
									<ChevronUpIcon />
								{/if}
							</Sidebar.MenuButton>
						{/snippet}
					</Collapsible.Trigger>
					<Collapsible.Content>
						<Sidebar.MenuSub>
							{#each serverProtocolsRoutes as item (item.title)}
								<Sidebar.MenuButton isActive={item.url === page.url.pathname}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							{/each}
						</Sidebar.MenuSub>
					</Collapsible.Content>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Collapsible.Root>
		<Collapsible.Root class="group/collapsible">
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props}
								><LayersIcon /> <span>Run SpeedTest</span>
							</Sidebar.MenuButton>
						{/snippet}
					</Collapsible.Trigger>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Collapsible.Root>
	</Sidebar.Content>
</Sidebar.Root>
