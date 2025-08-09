<script lang="ts">
	import {
		BookDownIcon,
		CircleUserIcon,
		SettingsIcon,
		LogOutIcon,
		BoxesIcon,
		BoxIcon,
		UsersIcon
	} from '@lucide/svelte';
	import { page } from '$app/state';

	import * as Sidebar from '$lib/components/ui/sidebar';

	const routes = [
		{
			title: 'Débits par session',
			url: '/sessions',
			icon: BoxIcon
		},
		{
			title: "Délais d'aller-retour",
			url: '/latency',
			icon: CircleUserIcon
		},
		{
			title: "Délais d'acquittement",
			url: '/acknowledgment',
			icon: SettingsIcon
		},
		{
			title: 'Flux simultanés',
			url: '/streams',
			icon: SettingsIcon
		},
		{
			title: 'Bande passante',
			url: '/isp',
			icon: BookDownIcon
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Header>
			<img src="/bjnet_icon.jpeg" alt="logo" />
		</Sidebar.Header>
		<Sidebar.Group>
			<Sidebar.GroupLabel>API</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each routes as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={page.url.pathname === item.url}>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
