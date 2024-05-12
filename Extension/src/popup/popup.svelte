<script lang="ts">
  import browser from 'webextension-polyfill';
  import SiteList from './SiteList.svelte';
  import settingsConnector from '../settings-connector';
  import type { AppSettings, BrowserMessage, SiteCategory, SiteSpec } from '../models';

  type SitesInCategories = { new: SiteSpec[], included: SiteSpec[], excluded: SiteSpec[] }

  const processSites = (settings: AppSettings): SitesInCategories => (
    Object.values(settings.sites).reduce((acc, site) => {
      acc[site.category || 'new'].push(site);
      return acc;
    }, (
      {
        new: [],
        included: [],
        excluded: [],
      } as SitesInCategories
    ))
  );

  let sitesProm: Promise<SitesInCategories> = settingsConnector.getAppSettings().then(processSites);

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'sitesUpdated') {
      sitesProm = settingsConnector.getAppSettings().then(processSites);
    }
  });

  const moveSite = (bundlePath: string, category: SiteCategory | 'removed'): Promise<void> => {
    if (category === 'removed') {
      return browser.runtime.sendMessage({
        type: "removeSite",
        bundlePath,
      } as BrowserMessage)
    }
    return browser.runtime.sendMessage({
      type: "categorizeSite",
      bundlePath,
      category,
    } as BrowserMessage)
  }    

  const cheatAddSite = (title: string, bundlePath: string, baseUrl: string): Promise<void> => (
    browser.runtime.sendMessage({
      type: "newSite",
      searchSpec: { title, bundlePath, baseUrl },
    } as BrowserMessage)
  )
</script>

<style>
  section {
    min-width: 450px;
  }
</style>

<section>
  <h1>IndieSearch: Sites</h1>
  <p>Choose which sites are included in your <a href="search.html" target="_blank">IndieSearches</a>.</p>

  <h2>✨ New</h2>
  <p>These are pagefind sites you've stumbled across since the last time you were here. They're included by default.</p>
  {#await sitesProm}
    <p>…</p>
  {:then sites}  
    <SiteList sites={sites.new} showInclude showExclude move={moveSite}/>  
  {/await}

  <h2>✅ Included</h2>
  <p>These sites will <em>always</em> feature in your IndieSearches.</p>
  {#await sitesProm}
    <p>…</p>
  {:then sites} 
    <SiteList sites={sites.included} showExclude move={moveSite}/>
  {/await}

  <h2>🚫 Excluded</h2>
  <p>These sites will <em>never</em> feature in your IndieSearches.</p>
  {#await sitesProm}
    <p>…</p>
  {:then sites} 
    <SiteList sites={sites.excluded} showInclude showRemove move={moveSite}/>
  {/await}

  <h2>🔗 Cheatcodes</h2>
  <p>Here are a few sites you can add to get started:</p>
  <button on:click={() => cheatAddSite('Pagefind', 'https://pagefind.app/_pagefind', 'https://pagefind.app/')}>Pagefind</button>
  <button on:click={() => cheatAddSite('xkcd', 'https://xkcd.pagefind.app/_pagefind', 'https://xkcd.pagefind.app')}>xkcd</button>
  <button on:click={() => cheatAddSite('MDN', 'https://mdn.pagefind.app/pagefind', 'https://developer.mozilla.org')}>MDN</button>
</section>
