<script lang="ts">
  import browser from 'webextension-polyfill';
  import type { AppSettings, BrowserMessageType, SiteSpec } from '../models';
  import settingsConnector from '../settings-connector';

  const processSites = (settings: AppSettings): SiteSpec[] => (
    Object.values(settings.sites).filter(s => s.category !== 'excluded')
  )

  let sitesProm: Promise<SiteSpec[]> = settingsConnector.getAppSettings().then(processSites)

  let search: any;
  const loadSearch = (element: HTMLElement, sites: SiteSpec[]) => {
    const mergeIndex = sites.map(({ baseUrl, bundlePath }) => ({ baseUrl, bundlePath }));
    if (search) search.destroy();
    // @ts-ignore
    search = new PagefindUI({
      element,
      mergeIndex,
      pageSize: 20,
      showSubResults: true,
      autofocus: true,
    });
  }

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'sitesUpdated') {
      sitesProm = settingsConnector.getAppSettings().then(processSites);
    }
  });

</script>

<h1>IndieSearch</h1>
{#await sitesProm}
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
