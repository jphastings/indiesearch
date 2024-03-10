<script lang="ts">
  import { type AppSettings } from '../models';
  import settingsConnector from '../settings-connector';

  type InputChangeEvent = Event & {
    currentTarget: EventTarget & HTMLInputElement;
  };

  let appSettings: AppSettings | undefined;
  settingsConnector
    .getAppSettings()
    .then(settingsFromStorage => (appSettings = settingsFromStorage));
</script>

{#if appSettings}
  <h1>Settings</h1>
  <section>
    <a href="search.html">Go to search</a>
  </section>
{/if}

<style>
  h1 {
    padding: 1em 0;
  }
</style>
