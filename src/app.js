const { Config, ConfigModel } = require("./logic/config.js");
const { SteamApi } = require("./logic/steam-api.js");

/**
 * @param {Config} config 
 */
const initConfig = function (config) {
    config.exportTemplate();
    if (!config.configExists()) {
        console.error(`No config found! Please setup the config.json inside [${config._cfgpath}}]`);
        process.exit(1);
    }

    if (!ConfigModel.checkModel(config.getConfig())) {
        console.error(`Your config is missing some keys. Please check your config at [${config._cfgpath}}]`);
        process.exit(1);
    }
};

/**
 * @param {Config} config 
 * @param {SteamApi} steamApi 
 */
const checkForComments = function (config, steamApi) {
    steamApi.fetchComments(0, null)
        .then(async comments => {
            comments.forEach(comment => {
                config.getConfig().patterns.forEach(async (text) => {
                    if (comment.text.includes(text)) {
                        const result = await steamApi.deleteComment(comment.id);
                        console.log(`Deleting Comment [${comment.id}]: ${result.success}`);
                    }
                });
            });
        }).catch(err => console.error);
};

const main = function () {
    const cfg = new Config();
    initConfig(cfg);

    const steamApi = new SteamApi(cfg.getConfig().steamId, cfg.getConfig().sessionId, cfg.getConfig().steamLoginSecure);

    setInterval(() => {
        console.log("Checking for comments ...");
        checkForComments(cfg, steamApi);
    }, 5000);
}

main();
