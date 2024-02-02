process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const Support = require('./support');

module.exports = function (RED) {
  function AuthenticateSapNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // reset status
    node.status({});

    const globalContext = node.context().global;

    globalContext.set(`SAP_B1_Service_Layer${node.id}`, {
      host: config.host,
      port: config.port,
      postfix: config.postfix,
      version: config.version,
      credentials: {
        CompanyDB: node.credentials.company,
        UserName: node.credentials.user,
        Password: node.credentials.password,
      },
    });

    if (!node.credentials.user || !node.credentials.password || !node.credentials.company) {
      node.status({ fill: 'gray', shape: 'ring', text: 'Missing credentials' });
    }

    node.on('input', async (msg, send, done) => {
      // If Company setted from msg
      if (node.credentials.companyType == 'msg') {
        const company = msg[node.credentials.company];
        globalContext.set(`SAP_B1_Service_Layer${node.id}.credentials.CompanyDB`, company);
      }

      // If User setted from msg
      if (node.credentials.userType == 'msg') {
        const user = msg[node.credentials.user];
        globalContext.set(`SAP_B1_Service_Layer${node.id}.credentials.UserName`, user);
      }

      // reset status
      node.status({});

      if (!node.credentials.user || !node.credentials.password || !node.credentials.company) {
        node.status({ fill: 'red', shape: 'dot', text: 'Missing credentials' });
        done(new Error('Missing credentials'));
        return;
      }

      const headers = globalContext.get(`SAP_B1_Service_Layer${node.id}.headers`);

      msg.SAP_B1_Service_Layer = {
        idAuth: node.id,
      };

      if (!headers) {
        try {
          const result = await Support.login(node, node.id);
          globalContext.set(`SAP_B1_Service_Layer${node.id}.headers`, result.headers['set-cookie']);
        } catch (error) {
          msg.payload = error;
          if (error.response && error.response.data) {
            msg.statusCode = error.response.status;
            msg.payload = error.response.data;
          }
          node.send(msg);
          node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
          done(error);
          return;
        }
      }
      node.send(msg);
      node.status({ fill: 'green', shape: 'dot', text: 'connected' });
    });
  }
  RED.nodes.registerType('authenticateSap', AuthenticateSapNode, {
    credentials: {
      company: { type: 'text' },
      companyType: { type: 'text' },
      user: { type: 'text' },
      userType: { type: 'text' },
      password: { type: 'password' },
    },
  });
};
