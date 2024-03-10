<script lang="ts">
  import SiteList from './SiteList.svelte';
  import settingsConnector from '../settings-connector';
  import type { SiteCategory, SiteSpec } from '../models';

  type SitesInCategories = { new: SiteSpec[], included: SiteSpec[], excluded: SiteSpec[] }

  const getSites = () => {
    sitesProm = settingsConnector.getAppSettings()
      .then(settings => Object.values(settings.sites).reduce((acc, site) => {
        acc[site.category || 'new'].push(site);
        return acc;
      }, (
        {
          new: [],
          included: [],
          excluded: [],
        } as SitesInCategories
      )))
    sitesProm.then(console.log)
  };

  let sitesProm: Promise<SitesInCategories>;
  getSites();

  const moveSite = (bundlePath: string, category: SiteCategory | 'removed'): Promise<void> => {
    if (category === 'removed') {
      return settingsConnector.removeSite(bundlePath).then(getSites);
    }
    return settingsConnector.moveSite(bundlePath, category).then(getSites);
  }
    

  const cheatAddSite = (title: string, bundlePath: string, baseUrl: string): Promise<void> =>
    settingsConnector.newSite({ title, bundlePath, baseUrl }).then(getSites);
</script>

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
  <p>You've marked these sites to be included in your IndieSearches.</p>
  {#await sitesProm}
    <p>…</p>
  {:then sites} 
    <SiteList sites={sites.included} showExclude move={moveSite}/>
  {/await}

  <h2>🚫 Excluded</h2>
  <p>These sites will never feature in your IndieSearches.</p>
  {#await sitesProm}
    <p>…</p>
  {:then sites} 
    <SiteList sites={sites.excluded} showInclude showDestroy move={moveSite}/>
  {/await}

  <h2>🔗 Cheatcodes</h2>
  <p>Here are a few sites you can add to get started:</p>
  <button on:click={() => cheatAddSite('Pagefind', 'https://pagefind.app/_pagefind', 'https://pagefind.app/')}>Pagefind</button>
  <button on:click={() => cheatAddSite('xkcd', 'https://xkcd.pagefind.app/_pagefind', 'https://xkcd.pagefind.app')}>xkcd</button>
  <button on:click={() => cheatAddSite('MDN', 'https://mdn.pagefind.app/pagefind', 'https://developer.mozilla.org')}>MDN</button>
</section>
