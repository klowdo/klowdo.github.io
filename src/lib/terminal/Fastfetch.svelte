<script lang="ts">
	const NIXOS_LOGO = [
		'          ▗▄▄▄       ▗▄▄▄▄    ▄▄▄▖',
		'          ▜███▙       ▜███▙  ▟███▛',
		'           ▜███▙       ▜███▙▟███▛',
		'            ▜███▙       ▜██████▛',
		'     ▟█████████████████▙ ▜████▛     ▟▙',
		'    ▟███████████████████▙ ▜███▙    ▟██▙',
		'           ▄▄▄▄▖           ▜███▙  ▟███▛',
		'          ▟███▛             ▜██▛ ▟███▛',
		'         ▟███▛               ▜▛ ▟███▛',
		'▟███████████▛                  ▟██████████▙',
		'▜██████████▛                  ▟███████████▛',
		'      ▟███▛ ▟▙               ▟███▛',
		'     ▟███▛ ▟██▙             ▟███▛',
		'    ▟███▛  ▜███▙           ▝▀▀▀▀',
		'    ▜██▛    ▜███▙ ▜██████████████████▛',
		'     ▜▛     ▟████▙ ▜████████████████▛',
		'           ▟██████▙       ▜███▙',
		'          ▟███▛▜███▙       ▜███▙',
		'         ▟███▛  ▜███▙       ▜███▙',
		'         ▝▀▀▀    ▀▀▀▀▘       ▀▀▀▘'
	];

	const INFO_ROWS: { key: string; value: string }[] = [
		{ key: 'OS', value: 'NixOS 25.11 (Xantusia) x86_64' },
		{ key: 'Host', value: 'Dell XPS 15 9530' },
		{ key: 'Kernel', value: 'Linux 6.12.74' },
		{ key: 'Shell', value: 'zsh 5.9' },
		{ key: 'WM', value: 'Hyprland 0.54.0 (Wayland)' },
		{ key: 'Terminal', value: 'kitty' },
		{ key: 'CPU', value: '13th Gen Intel i9-13900H (20) @ 5.40 GHz' },
		{ key: 'GPU', value: 'Intel Iris Xe Graphics @ 1.50 GHz' },
		{ key: 'Memory', value: '18.12 GiB / 62.48 GiB (29%)' },
		{ key: 'Disk', value: '211 GiB / 953 GiB (22%) - btrfs' }
	];

	const colors = [
		'var(--ctp-red)',
		'var(--ctp-peach)',
		'var(--ctp-yellow)',
		'var(--ctp-green)',
		'var(--ctp-teal)',
		'var(--ctp-blue)',
		'var(--ctp-mauve)',
		'var(--ctp-pink)'
	];
</script>

<div class="fastfetch">
	<pre class="logo">{NIXOS_LOGO.join('\n')}</pre>
	<div class="info">
		<div class="header">klowdo@dellicious</div>
		<div class="separator">──────────────────</div>
		{#each INFO_ROWS as row}
			<div class="row">
				<span class="key">{row.key}</span>
				<span class="val">{row.value}</span>
			</div>
		{/each}
		<div class="colors">
			{#each colors as color}
				<span class="block" style="background-color: {color}"></span>
			{/each}
		</div>
	</div>
</div>

<style>
	.fastfetch {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
		margin-top: 0.75rem;
		animation: fadeIn 0.4s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.logo {
		color: var(--ctp-blue);
		flex-shrink: 0;
		font-size: 0.55rem;
		line-height: 1.2;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.header {
		color: var(--ctp-green);
		font-weight: 700;
	}

	.separator {
		color: var(--ctp-overlay0);
		margin-bottom: 0.25rem;
	}

	.row {
		display: flex;
		gap: 0.5ch;
	}

	.key {
		color: var(--ctp-blue);
		font-weight: 700;
		min-width: 10ch;
		flex-shrink: 0;
	}

	.key::after {
		content: ':';
	}

	.val {
		color: var(--ctp-text);
	}

	.colors {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.block {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 3px;
	}

	@media (max-width: 640px) {
		.fastfetch {
			flex-direction: column;
			align-items: center;
		}

		.logo {
			font-size: 0.4rem;
		}

		.row {
			flex-wrap: wrap;
		}

		.key {
			min-width: 8ch;
		}

		.separator {
			overflow: hidden;
		}
	}
</style>
