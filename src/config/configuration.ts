export default () => {
  return {
    port: process.env["PORT"] || '3000',
    logPath: process.env['LOG_PATH'] || './logs',
    isDev: process.env['NODE_ENV'] === 'development',
  }
}