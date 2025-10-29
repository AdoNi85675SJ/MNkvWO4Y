// 代码生成时间: 2025-10-29 11:40:32
const Hapi = require('@hapi/hapi');
const { Joi } = require('@hapi/joi');

// 配置文件管理器
class ConfigManager {
  constructor(configFilePath) {
    this.configFilePath = configFilePath;
    this.config = {};
  }

  // 加载配置文件
  async loadConfig() {
    try {
      // 读取配置文件
      const configData = await this.readConfigFile();
      // 解析配置文件
      this.config = JSON.parse(configData);
    } catch (error) {
      // 错误处理
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  // 读取配置文件
  async readConfigFile() {
    const fs = require('fs');
    const path = require('path');
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(this.configFilePath), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // 获取配置项
  getConfig(key) {
    return this.config[key];
  }
}

// 创建HAPI服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  // 配置文件路径
  const configFilePath = './config.json';
  const configManager = new ConfigManager(configFilePath);
  await configManager.loadConfig();

  // 定义路由
  server.route({
    method: 'GET',
    path: '/config/{key}',
    handler: async (request, h) => {
      const { key } = request.params;
      const value = configManager.getConfig(key);
      if (value === undefined) {
        return h.response({
          statusCode: 404,
          message: 'Configuration key not found',
        }).code(404);
      }
      return {
        value: value,
      };
    },
    config: {
      validate: {
        params: {
          key: Joi.string().required().description('The configuration key'),
        },
      },
    },
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 启动服务器
init();