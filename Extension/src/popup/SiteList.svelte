<script lang="ts">
  import type { SiteCategory, SiteSpec } from "../models";

  export let sites: SiteSpec[] = [];
  export let showInclude: boolean = false;
  export let showExclude: boolean = false;
  export let showDestroy: boolean = false;
  export let move: (bundlePath: string, category: SiteCategory | 'removed') => Promise<void>;
</script>

{#if sites.length === 0}
  <em>No sites here yet</em>
{:else}
<ol>
  {#each sites as site}
    <li>
      <a href="{site.baseUrl}" target="_blank">{site.title}</a>
      {#if showInclude}
        <button on:click={() => move(site.bundlePath, 'included')}>✅</button>
      {/if}
      {#if showExclude}
        <button on:click={() => move(site.bundlePath, 'excluded')}>🚫</button>
      {/if}
      {#if showDestroy}
        <button on:click={() => move(site.bundlePath, 'removed')}>💥</button>
      {/if}
    </li>
  {/each}
</ol>
{/if}