import browser from 'webextension-polyfill';
import {
  type BrowserMessageType,
} from './models';
import settingsConnector from './settings-connector';

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type as BrowserMessageType) {
    case 'newSite': {
      settingsConnector.newSite(message.searchSpec).then(() => sitesUpdated());
      break;
    }
    case 'categorizeSite': {
      settingsConnector.categorizeSite(message.bundlePath, message.category).then(() => sitesUpdated());
      break;
    }
    case 'removeSite': {
      settingsConnector.removeSite(message.bundlePath).then(() => sitesUpdated());
      break;
    }
  }
});

const sitesUpdated = (): Promise<void> => browser.runtime.sendMessage({ type: 'sitesUpdated' });
