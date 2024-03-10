<script lang="ts">
  import type { SiteSpec } from '../models';
  import settingsConnector from '../settings-connector';

  const siteProm = settingsConnector.getAppSettings()
    .then(settings => Object.values(settings.sites).filter(s => s.category !== 'excluded'))

  const loadSearch = (element: HTMLElement, sites: SiteSpec[]) => {
    const mergeIndex = sites.map(({ baseUrl, bundlePath }) => ({ baseUrl, bundlePath }));
    // @ts-ignore
    new PagefindUI({
      element,
      mergeIndex,
      pageSize: 20,
      showSubResults: true,
      autofocus: true,
    });
  }
</script>

<h1>IndieSearch</h1>
{#await siteProm}
  <p>…</p>
{:then sites}
  <section use:loadSearch={sites}></section>
  
  <aside>
    {#if sites.length === 0}
      <em>You've not visited any pagefind sites to search!</em>
    {:else}
      <h2>🌐 Sites</h2>
      {#each sites as site, idx}
        {#if idx < sites.length && idx > 0}, {/if}
        <a href="{site.baseUrl}" target="_blank">{site.title}</a>
      {/each}
    {/if}
  </aside>
{/await}

<style>
  h1 {
    padding: 1em 0;
  }
</style>
