const request = require("request-promise");

module.exports = class Cache {
    /**
     * 
     * @param {number} lifetime in ms
     */
    constructor(lifetime) {
        this.storage = {}
        this.lifetime = lifetime;
        this.lastUpdate = 0;
    }
    /**
     * 
     * @param {string} url 
     * @return {Promise<{[key: string]: any}>}
     */
    async getWithCache(url) {
        if(this.storage) {
            if((this.lastUpdate + this.lifetime) > Date.now()) {
                console.log("Returning cached result");
                return this.storage;
            }
        }
        console.log("Cache outdated or empty, downloading fresh data");
        let body = await request(url);
        console.log("Got fresh data");

        this.storage = JSON.parse(body);
        this.lastUpdate = Date.now();
        return this.storage;
    }
}