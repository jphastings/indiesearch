import browser, { find } from 'webextension-polyfill';
import { type BrowserMessage } from './models';

const pageFindType = 'application/pagefind';

function findSearchLink(): void {
  const searchLinkEl = document.querySelector(`link[rel="search"][type="${pageFindType}"]`);
  if (!searchLinkEl) {
    return;
  }
  const searchHref = searchLinkEl.getAttribute('href');
  if (!searchHref) {
    return;
  }

  const baseUrl = getBaseUrl();

  browser.runtime.sendMessage({
    type: "foundSite",
    searchSpec: {
      title: searchLinkEl.getAttribute('title'),
      bundlePath: new URL(searchHref, baseUrl).toString(),
      baseUrl,
    }
  } as BrowserMessage);
}

function getBaseUrl(): string {
  const baseHref = document.querySelector('base[href]')?.getAttribute('href');
  if (baseHref) {
    return new URL(baseHref, document.location.href).toString();
  }

  return document.location.origin;
}

findSearchLink();
