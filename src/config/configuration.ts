export default () => {
  return {
    port: process.env['PORT'] || '3000',
    logPath: process.env['LOG_PATH'] || './logs',
    isDev: process.env['NODE_ENV'] === 'development',
    mongoUri: process.env['MONGO_URI'] || 'mongodb://localhost:27071/wxkf-manager',
    accessTokenUrl: process.env['ACCESS_TOKEN_URL'] || 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
  }
}