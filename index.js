var fluid = require("infusion"),
    kettle = fluid.require("kettle", require),
    loader = fluid.getLoader(__dirname);

kettle.config.makeConfigLoader({
    nodeEnv: kettle.config.getNodeEnv(),
    configPath: kettle.config.getConfigPath() || "configs/"
});
