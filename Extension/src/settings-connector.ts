import browser from 'webextension-polyfill';
import { type AppSettings, DEFAULT_SETTINGS, type SiteSpec, type SiteCategory } from './models';

class SettingsConnector {
  private static readonly settingsKey = 'settings';
  
  async getAppSettings() {
    let settings = (
      await browser.storage.sync.get(SettingsConnector.settingsKey)
    )[SettingsConnector.settingsKey] as Partial<AppSettings> | undefined;

    if (!settings) {
      console.log('no settings found, using default settings');
      await browser.storage.sync.set({
        [SettingsConnector.settingsKey]: DEFAULT_SETTINGS
      });
      settings = DEFAULT_SETTINGS;
    }

    return settings as AppSettings;
  }

  async newSite(siteSpec: SiteSpec): Promise<void> {
    const settings = await this.getAppSettings();
    if (settings.sites[siteSpec.bundlePath]) {
      return;
    }
    settings.sites[siteSpec.bundlePath] = siteSpec;

    await browser.storage.sync.set({
      [SettingsConnector.settingsKey]: settings
    });
  }

  async categorizeSite(bundlePath: string, category: SiteCategory): Promise<void> {
    const settings = await this.getAppSettings();
    if (!settings.sites[bundlePath]) {
      return;
    }
    settings.sites[bundlePath].category = category;

    await browser.storage.sync.set({
      [SettingsConnector.settingsKey]: settings
    });
  }

  async removeSite(bundlePath: string): Promise<void> {
    const settings = await this.getAppSettings();
    delete settings.sites[bundlePath];
    await browser.storage.sync.set({
      [SettingsConnector.settingsKey]: settings
    });
  }
}

const singleton = new SettingsConnector();
export default singleton;
