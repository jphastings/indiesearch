export type BrowserMessageType = 'foundSite';

export type BrowserMessage = {
  type: 'foundSite';
  searchSpec: SiteSpec;
};

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
