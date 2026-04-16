<script lang="ts">
	import type { Snippet } from 'svelte';

	const MIN_WIDTH = 400;
	const MIN_HEIGHT = 300;
	const VISIBLE_TITLEBAR_PX = 100;

	let {
		children,
		path = '~',
		hidden = false,
		onclose,
		onrestore
	}: {
		children: Snippet;
		path?: string;
		hidden?: boolean;
		onclose?: () => void;
		onrestore?: () => void;
	} = $props();

	let windowEl: HTMLDivElement | undefined = $state();
	let maximized = $state(false);
	let displayNone = $state(false);
	let hiding = $state(false);
	let showing = $state(false);

	let isMobile = $state(false);

	let hasDragged = $state(false);
	let dragging = $state(false);
	let dragX = $state(0);
	let dragY = $state(0);
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	let resizing = $state(false);
	let resizeDir = '';
	let windowWidth = $state(900);
	let windowHeight = $state(0);
	let resizeStartX = 0;
	let resizeStartY = 0;
	let resizeStartW = 0;
	let resizeStartH = 0;
	let resizeStartLeft = 0;
	let resizeStartTop = 0;

	let showResizeHandles = $derived(!isMobile && !maximized && !hidden);

	$effect(() => {
		const mq = window.matchMedia('(max-width: 640px)');
		isMobile = mq.matches;
		function onChange(e: MediaQueryListEvent) {
			isMobile = e.matches;
		}
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	let prevHidden = false;
	$effect(() => {
		if (hidden && !prevHidden) {
			hiding = true;
			showing = false;
		} else if (!hidden && prevHidden) {
			hasDragged = false;
			windowWidth = 900;
			windowHeight = 0;
			dragX = 0;
			dragY = 0;
			dragOffsetX = 0;
			dragOffsetY = 0;
			displayNone = false;
			hiding = false;
			showing = true;
		}
		prevHidden = hidden;
	});

	function snapshotPosition() {
		if (hasDragged || !windowEl) return;
		const rect = windowEl.getBoundingClientRect();
		dragX = rect.left;
		dragY = rect.top;
		windowWidth = rect.width;
		windowHeight = rect.height;
		hasDragged = true;
	}

	function toggleMaximize() {
		maximized = !maximized;
	}

	function handleClose() {
		onclose?.();
	}

	function handleAnimationEnd(e: AnimationEvent) {
		if (e.animationName === 'window-hide') {
			displayNone = true;
			hiding = false;
		}
		if (e.animationName === 'window-show') {
			showing = false;
			onrestore?.();
		}
	}

	function handleTitlebarPointerDown(e: PointerEvent) {
		if (isMobile || maximized) return;
		if ((e.target as HTMLElement).closest('.dot')) return;

		snapshotPosition();
		dragOffsetX = e.clientX - dragX;
		dragOffsetY = e.clientY - dragY;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handleTitlebarPointerMove(e: PointerEvent) {
		if (!dragging) return;
		let newX = e.clientX - dragOffsetX;
		let newY = e.clientY - dragOffsetY;

		newY = Math.max(0, newY);
		const currentWidth = windowEl?.offsetWidth ?? windowWidth;
		newX = Math.max(-(currentWidth - VISIBLE_TITLEBAR_PX), newX);
		newX = Math.min(window.innerWidth - VISIBLE_TITLEBAR_PX, newX);

		dragX = newX;
		dragY = newY;
	}

	function handleTitlebarPointerUp() {
		dragging = false;
	}

	function handleResizePointerDown(dir: string, e: PointerEvent) {
		e.preventDefault();
		snapshotPosition();
		resizeDir = dir;
		resizeStartX = e.clientX;
		resizeStartY = e.clientY;
		resizeStartW = windowEl?.offsetWidth ?? windowWidth;
		resizeStartH = windowEl?.offsetHeight ?? windowHeight;
		resizeStartLeft = dragX;
		resizeStartTop = dragY;
		resizing = true;

		window.addEventListener('pointermove', handleResizePointerMove);
		window.addEventListener('pointerup', handleResizePointerUp);
	}

	function handleResizePointerMove(e: PointerEvent) {
		if (!resizing) return;
		const dx = e.clientX - resizeStartX;
		const dy = e.clientY - resizeStartY;

		let newW = resizeStartW;
		let newH = resizeStartH;
		let newX = resizeStartLeft;
		let newY = resizeStartTop;

		if (resizeDir.includes('e')) newW = Math.max(MIN_WIDTH, resizeStartW + dx);
		if (resizeDir.includes('w')) {
			newW = Math.max(MIN_WIDTH, resizeStartW - dx);
			newX = resizeStartLeft + (resizeStartW - newW);
		}
		if (resizeDir.includes('s')) newH = Math.max(MIN_HEIGHT, resizeStartH + dy);
		if (resizeDir.includes('n')) {
			newH = Math.max(MIN_HEIGHT, resizeStartH - dy);
			newY = resizeStartTop + (resizeStartH - newH);
		}

		windowWidth = newW;
		windowHeight = newH;
		dragX = newX;
		dragY = newY;
	}

	function handleResizePointerUp() {
		resizing = false;
		window.removeEventListener('pointermove', handleResizePointerMove);
		window.removeEventListener('pointerup', handleResizePointerUp);
	}
</script>

<div
	bind:this={windowEl}
	class="window"
	class:positioned={hasDragged}
	class:maximized
	class:hiding
	class:showing
	style:display={displayNone ? 'none' : ''}
	style:width={hasDragged && !maximized ? `${windowWidth}px` : ''}
	style:height={hasDragged && !maximized && windowHeight > 0 ? `${windowHeight}px` : ''}
	style:transform={hasDragged && !maximized ? `translate(${dragX}px, ${dragY}px)` : ''}
	onanimationend={handleAnimationEnd}
>
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="titlebar"
		onpointerdown={handleTitlebarPointerDown}
		onpointermove={handleTitlebarPointerMove}
		onpointerup={handleTitlebarPointerUp}
		ondblclick={toggleMaximize}
		role="toolbar"
	>
		<div class="dots">
			<button class="dot red" onclick={handleClose} aria-label="Close"></button>
			<span class="dot yellow"></span>
			<button class="dot green" onclick={toggleMaximize} aria-label="Maximize"></button>
		</div>
		<span class="title">visitor@flixen.se:{path}</span>
		<div class="spacer"></div>
	</div>
	<div class="body">
		{@render children()}
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	{#if showResizeHandles}
		<div class="resize-handle resize-n" onpointerdown={(e) => handleResizePointerDown('n', e)}></div>
		<div class="resize-handle resize-s" onpointerdown={(e) => handleResizePointerDown('s', e)}></div>
		<div class="resize-handle resize-e" onpointerdown={(e) => handleResizePointerDown('e', e)}></div>
		<div class="resize-handle resize-w" onpointerdown={(e) => handleResizePointerDown('w', e)}></div>
		<div class="resize-handle resize-ne" onpointerdown={(e) => handleResizePointerDown('ne', e)}></div>
		<div class="resize-handle resize-nw" onpointerdown={(e) => handleResizePointerDown('nw', e)}></div>
		<div class="resize-handle resize-se" onpointerdown={(e) => handleResizePointerDown('se', e)}></div>
		<div class="resize-handle resize-sw" onpointerdown={(e) => handleResizePointerDown('sw', e)}></div>
	{/if}
</div>

<style>
	.window {
		background-color: var(--ctp-base);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		max-width: 900px;
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.window.positioned {
		position: absolute;
		top: 0;
		left: 0;
		max-width: none;
	}

	.window.maximized {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw !important;
		height: 100vh !important;
		max-width: none;
		border-radius: 0;
		box-shadow: none;
		transform: none !important;
		z-index: 9999;
	}

	.window.hiding {
		animation: window-hide 0.25s ease forwards;
	}

	.window.showing {
		animation: window-show 0.25s ease forwards;
	}

	@keyframes window-hide {
		from {
			opacity: 1;
			scale: 1;
		}
		to {
			opacity: 0;
			scale: 0.95;
		}
	}

	@keyframes window-show {
		from {
			opacity: 0;
			scale: 0.95;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}

	.titlebar {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: var(--ctp-mantle);
		gap: 0.75rem;
		cursor: grab;
		user-select: none;
	}

	.titlebar:active {
		cursor: grabbing;
	}

	.dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.dot.red {
		background-color: var(--ctp-red);
	}

	.dot.yellow {
		background-color: var(--ctp-yellow);
		cursor: default;
	}

	.dot.green {
		background-color: var(--ctp-green);
	}

	.title {
		color: var(--ctp-subtext0);
		font-size: 0.85rem;
		flex: 1;
		text-align: center;
		pointer-events: none;
	}

	.spacer {
		width: 52px;
	}

	.body {
		padding: 1.25rem;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.resize-handle {
		position: absolute;
		z-index: 10;
	}

	.resize-n {
		top: 0;
		left: 12px;
		right: 12px;
		height: 6px;
		cursor: ns-resize;
	}

	.resize-s {
		bottom: 0;
		left: 12px;
		right: 12px;
		height: 6px;
		cursor: ns-resize;
	}

	.resize-e {
		top: 12px;
		right: 0;
		bottom: 12px;
		width: 6px;
		cursor: ew-resize;
	}

	.resize-w {
		top: 12px;
		left: 0;
		bottom: 12px;
		width: 6px;
		cursor: ew-resize;
	}

	.resize-ne {
		top: 0;
		right: 0;
		width: 12px;
		height: 12px;
		cursor: nesw-resize;
	}

	.resize-nw {
		top: 0;
		left: 0;
		width: 12px;
		height: 12px;
		cursor: nwse-resize;
	}

	.resize-se {
		bottom: 0;
		right: 0;
		width: 12px;
		height: 12px;
		cursor: nwse-resize;
	}

	.resize-sw {
		bottom: 0;
		left: 0;
		width: 12px;
		height: 12px;
		cursor: nesw-resize;
	}

	@media (max-width: 640px) {
		.window {
			border-radius: 0;
			box-shadow: none;
			max-width: none;
			min-height: 100dvh;
			display: flex;
			flex-direction: column;
		}

		.titlebar {
			cursor: default;
		}

		.titlebar:active {
			cursor: default;
		}

		.body {
			flex: 1;
			padding: 1rem;
			font-size: 0.8rem;
		}
	}
</style>
