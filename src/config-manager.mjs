import default_config from './default-config.mjs';


export const configManager = {

  cfgObj: default_config,

  updCfg: function(cfg) {
    this.cfgObj = { ...this.cfgObj, ...cfg };
  },

  getCfg: function() {
    return this.cfgObj;
  }

};
