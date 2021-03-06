'use strict';

const brainAPI = require('./lib/brainAPI');

module.exports = function(RED) {
  function ActiveNowNode(config) {
    RED.nodes.createNode(this,config);
    const node = this;

    node.brain = RED.nodes.getNode(config.brain);

    if (!node.brain) {
      node.warn('No NEEO Brain configured!');
    }

    node.on('input', () => {
      const noBrainIp = !node.brain || !node.brain.ip;

      if (noBrainIp) {
        node.error('No NEEO Brain configured!');
        node.send({ payload: [] });
        return;
      }

      brainAPI.getActiveNow(node.brain.ip)
        .then((activeNow) => {
          const msg = { payload: activeNow };
          node.send(msg);
        })
        .catch((error) => {
          node.error(`Failed to fetch active now list: ${error.message}`);
          node.send({ payload: [] });
        });
    });
  }
  
  RED.nodes.registerType('active-now', ActiveNowNode);
};
