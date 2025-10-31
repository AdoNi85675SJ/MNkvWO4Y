// 代码生成时间: 2025-10-31 16:38:22
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi');

// 排行榜数据模型
class LeaderboardEntry {
  constructor(id, score) {
    this.id = id;
    this.score = score;
  }
}

// 排行榜服务
class LeaderboardService {
  constructor() {
    this.leaderboard = [];
  }

  // 添加新分数到排行榜
  addScore(userId, score) {
    const newEntry = new LeaderboardEntry(userId, score);
    this.leaderboard.push(newEntry);
    this.leaderboard.sort((a, b) => b.score - a.score); // 按分数降序排序
    return newEntry;
  }

  // 获取排行榜列表
  getLeaderboard() {
    return this.leaderboard;
  }
}

// 创建Hapi服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 注册路由
  server.route({
    method: 'POST',
    path: '/leaderboard',
    options: {
      validate: {
        payload: Joi.object({
          userId: Joi.string().required(),
          score: Joi.number().required()
        }).unknown()
      },
      handler: async (request, h) => {
        try {
          const leaderboardService = new LeaderboardService();
 const          newEntry = leaderboardService.addScore(request.payload.userId, request.payload.score);
          return {
            success: true,
            message: 'Score added successfully',
            newEntry: newEntry
          };
        } catch (error) {
          return Boom.badImplementation(error);
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/leaderboard',
    handler: async (request, h) => {
      try {
        const leaderboardService = new LeaderboardService();
        return {
          success: true,
          leaderboard: leaderboardService.getLeaderboard()
        };
      } catch (error) {
        return Boom.badImplementation(error);
      }
    }
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 运行服务器
init();