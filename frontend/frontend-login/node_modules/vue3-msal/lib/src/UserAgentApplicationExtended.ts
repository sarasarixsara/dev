import {Configuration, PublicClientApplication} from "@azure/msal-browser";

import {BrowserStorage} from "@azure/msal-browser/dist/cache/BrowserStorage";

export class UserAgentApplicationExtended extends PublicClientApplication {
    public store = {};
    constructor(configuration: Configuration) {
        super(configuration);
        this.store = new BrowserStorage(this.config.cache.cacheLocation) // this.cacheStorage
    }
}
