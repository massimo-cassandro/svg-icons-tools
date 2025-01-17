export const configManager = {

  cfgObj: {},

  updCfg: function(cfg) {
    this.cfgObj = { ...this.cfgObj, ...cfg };
  },

  getCfg: function() {
    return this.cfgObj;
  }

};
