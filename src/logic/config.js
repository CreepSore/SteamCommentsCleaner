"use strict";
const path = require("path");
const fs = require("fs");

class ConfigModel {
    constructor() {
        /** @type {String} */
        this.sessionId = "-- ADD YOUR SESSIONID HERE --";
        /** @type {String} */
        this.steamId = "-- YOUR STEAMID HERE --";
        /** @type {String} */
        this.steamLoginSecure = "FIND IN BROWSER COOKIES";
        /** @type {Array<string>} */
        this.patterns = [
            "giveaway",
            "trade",
            "trading",
            "skin",
            "winner"
        ];
    }

    static checkModel(model) {
        const defaultKeys = Object.keys(new ConfigModel());
        const keys = Object.keys(model);

        for(let i = 0; i < defaultKeys.length; i++) {
            if(!keys.includes(defaultKeys[i])) {
                return false;
            }
        }

        return true;
    }
}

class Config { 
    constructor() {
        this._cfgpath = path.join(__dirname, "..", "..", "config.json");
        this._templatepath = path.join(__dirname, "..", "..", "config.template.json");
        this._config = null;
    }

    /**
     * @returns {ConfigModel}
     */
    getConfig() {
        if(this._config === null) {
            if(!this.configExists()) {
                return null;
            }
            try {
                this._config = JSON.parse(fs.readFileSync(this._cfgpath).toString());
            } catch (ex) {
                return null;
            }
        }

        return this._config;
    }

    configExists() {
        return fs.existsSync(this._cfgpath);
    }

    templateExists() {
        return fs.existsSync(this._templatepath);
    }

    exportTemplate() {
        if(this.templateExists()) {
            fs.unlinkSync(this._templatepath);
        }

        fs.writeFileSync(this._templatepath, JSON.stringify(new ConfigModel(), null, 4));
    }
}

module.exports = {
    Config,
    ConfigModel
}
