export type BrowserMessage = {
  type: 'newSite';
  searchSpec: SiteSpec;
} | {
  type: 'categorizeSite';
  bundlePath: string;
  category: SiteCategory;
} | {
  type: 'removeSite';
  bundlePath: string;
} | {
  type: 'sitesUpdated';
};

export type BrowserMessageType = 'newSite' | 'categorizeSite' | 'removeSite' | 'sitesUpdated';

export type AppSettings = {
  sites: { [key: string]: SiteSpec };
};

export const DEFAULT_SETTINGS: AppSettings = {
  sites: {},
};

export type SiteSpec = {
  title: string;
  bundlePath: string;
  baseUrl: string;
  category?: SiteCategory;
};

export type SiteCategory = undefined | 'included' | 'excluded';
