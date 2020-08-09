const {Config, ConfigModel} = require("./logic/config.js");
const {SteamApi} = require("./logic/steam-api.js");

/**
 * @param {Config} config 
 */
const initConfig = function(config) {
    config.exportTemplate();
    if(!config.configExists()) {
        console.error(`No config found! Please setup the config.json inside [${config._cfgpath}}]`);
        process.exit(1);
    }

    if(!ConfigModel.checkModel(config.getConfig())) {
        console.error(`Your config is missing some keys. Please check your config at [${config._cfgpath}}]`);
        process.exit(1);
    }
};

const main = function() {
    let cfg = new Config();
    initConfig(cfg);

    let steamApi = new SteamApi(cfg.getConfig().sessionId);
};

main();
