<script lang="ts">
	import { profile } from '$lib/data/profile';
	import DevfetchInfo from './DevfetchInfo.svelte';
</script>

<div class="devfetch">
	<div class="image-container">
		<img src={profile.image} alt={profile.name} />
	</div>
	<DevfetchInfo />
</div>

<style>
	.devfetch {
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

	.image-container {
		flex-shrink: 0;
	}

	img {
		width: 200px;
		height: 200px;
		border-radius: 12px;
		border: 2px solid var(--ctp-surface1);
		object-fit: cover;
	}

	@media (max-width: 640px) {
		.devfetch {
			flex-direction: column;
			align-items: center;
		}

		img {
			width: 150px;
			height: 150px;
		}
	}
</style>
