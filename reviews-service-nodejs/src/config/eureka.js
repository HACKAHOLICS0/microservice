const Eureka = require('eureka-js-client').Eureka;
require('dotenv').config();

// Déterminer si nous sommes en environnement Docker ou local
const isDocker = process.env.NODE_ENV === 'production';

// Configuration du client Eureka
const eurekaClient = new Eureka({
  instance: {
    app: process.env.APP_NAME,
    hostName: isDocker ? process.env.APP_NAME : 'localhost',
    ipAddr: isDocker ? process.env.APP_NAME : '127.0.0.1',
    statusPageUrl: `http://${isDocker ? process.env.APP_NAME : 'localhost'}:${process.env.PORT}/health`,
    healthCheckUrl: `http://${isDocker ? process.env.APP_NAME : 'localhost'}:${process.env.PORT}/health`,
    port: {
      '$': parseInt(process.env.PORT),
      '@enabled': true,
    },
    vipAddress: process.env.APP_NAME,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: isDocker ? (process.env.EUREKA_HOST || 'eureka-server') : 'localhost',
    port: parseInt(process.env.EUREKA_PORT || '8761'),
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
    preferIpAddress: true,
  },
});

// Ajouter des logs pour le débogage
console.log(`Eureka client configuration: ${isDocker ? 'Docker' : 'Local'} environment`);
console.log(`Eureka host: ${eurekaClient.config.eureka.host}:${eurekaClient.config.eureka.port}`);
console.log(`Service name: ${eurekaClient.config.instance.app}`);
console.log(`Service URL: ${eurekaClient.config.instance.statusPageUrl}`);

module.exports = eurekaClient;
