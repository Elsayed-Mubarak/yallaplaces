const defaultSecret = 'YYzviNIcWQQbhthH0DqlvCTFuJHEmJfa';
const defaultTempTokenSecret = '40VUEA8T29nAF8Q9d4FcbgsUfxVreZFz';
const envs = {
  production: 'production',
  development: 'development',
  staging: 'staging',
  test: 'test'
};

const currentEnv = process.env.NODE_ENV || envs.production;
const config = require(`./env/${currentEnv}.json`);

config.smsAPISecrets = {
  customerId: 'A592FE9C-353F-4EBB-99D0-F95F093F4662',
  apiKey: '8vWK+YXmbzg/YsOy6KxPsnjrWZBCT1P+U5NvdXD6pzwwOaIFGeG8Gs6+tRwu5pi4BvJ303ecW3MsL89OSWLXaA==',
  rest_endpoint: 'https://rest-api.telesign.com'
};

config.cloudinary = {
  cloud_name: 'yallaplacesapp',
  api_key: '154322717331216',
  api_secret: 'MR1X6Cg5zekmSKLzp9Knrz2ZToM'
};

config.email = {
   user: 'yallaplacesinfo@gmail.com',
   pass: '@Isec2020'
}

config.JWTsecret = process.env.SECRET || defaultSecret;
config.tempTokenSecret = process.env.TEMP_TOKEN_SECRET || defaultTempTokenSecret;
config.envs = envs;
config.currentEnv = currentEnv;

config.isEmailVerificationRequired = true;
config.canSendEmail = true;
config.canUseCustomErrorPages = true;
config.canHttps = true;

// prevent public routes abuse and scanning
config.preventAbuse = true;
config.canTest = false;

// ENVIRONMENT specific
if (config.currentEnv === config.envs.development) {
  config.isEmailVerificationRequired = false;
  config.canSendEmail = false;
  config.canUseCustomErrorPages = false;
  config.canHttps = false;
  config.preventAbuse = false;
  config.canTest = true;
}
if (config.currentEnv === config.envs.test) {
  config.isEmailVerificationRequired = false;
  config.canSendEmail = true;
  config.canUseCustomErrorPages = false;
  config.canHttps = false;
  config.preventAbuse = false;
  config.canTest = true;
}

console.log(`===================== CONFIG [${config.currentEnv}] =====================`);


// remote api
config.apis = {
  example: 'www.example.com'
};

module.exports = config;