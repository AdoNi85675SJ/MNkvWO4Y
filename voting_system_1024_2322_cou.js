// 代码生成时间: 2025-10-24 23:22:40
const Hapi = require('@hapi/hapi');
const uuid = require('uuid').v4;

// 定义投票数据模型
class Vote {
  constructor(id, optionId, userId) {
    this.id = id;
    this.optionId = optionId;
    this.userId = userId;
    this.createdAt = new Date().toISOString();
  }
}

// 初始化HAPI服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 定义投票存储（内存存储，实际应用中应使用数据库）
  const votesStore = [];

  // 定义选项存储（内存存储，实际应用中应使用数据库）
  const optionsStore = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' }
  ];

  // 路由：获取选项列表
  server.route({
    method: 'GET',
    path: '/options',
    handler: async (request, h) => {
      return optionsStore;
    }
  });

  // 路由：为选项投票
  server.route({
    method: 'POST',
    path: '/vote',
    handler: async (request, h) => {
      const { optionId, userId } = request.payload;

      // 验证选项和用户ID
      if (!optionsStore.find(option => option.id === optionId) || !userId) {
        return h.response({ status: 'error', message: 'Invalid option or user ID' }).code(400);
      }

      // 创建投票对象
      const vote = new Vote(uuid(), optionId, userId);
      votesStore.push(vote);

      return {
        status: 'success',
        message: 'Vote cast successfully',
        vote: vote
      };
    }
  });

  // 路由：获取投票结果
  server.route({
    method: 'GET',
    path: '/result',
    handler: async (request, h) => {
      // 将投票结果按选项分组并计数
      const results = optionsStore.reduce((acc, option) => {
        acc[option.id] = votesStore.filter(vote => vote.optionId === option.id).length;
        return acc;
      }, {});

      return results;
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
