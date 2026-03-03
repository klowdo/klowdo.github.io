<script lang="ts">
	import type { TreeNode } from './filesystem';

	let { tree, root }: { tree: TreeNode[]; root: string } = $props();

	function renderTree(nodes: TreeNode[], prefix: string = ''): string {
		let lines: string[] = [];
		nodes.forEach((node, i) => {
			const isLast = i === nodes.length - 1;
			const connector = isLast ? '└── ' : '├── ';
			const dirMarker = node.isDir ? '/' : '';
			lines.push(`${prefix}${connector}${node.name}${dirMarker}`);
			if (node.children) {
				const childPrefix = prefix + (isLast ? '    ' : '│   ');
				lines.push(...renderTree(node.children, childPrefix).split('\n'));
			}
		});
		return lines.filter(Boolean).join('\n');
	}
</script>

<pre class="tree"><span class="dir">{root}</span>
{@html renderTree(tree)
	.replace(/([├└│─]+\s*)(\S+\/)/g, '$1<span class="dir">$2</span>')}</pre>

<style>
	.tree {
		margin: 0;
		font-family: inherit;
		white-space: pre;
		line-height: 1.4;
	}
	.tree :global(.dir) {
		color: var(--blue, #89b4fa);
		font-weight: bold;
	}
</style>
