// 代码生成时间: 2025-10-15 03:00:31
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

// 创建一个Hapi服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 定义树形结构数据的接口
const TREE_SCHEMA = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  children: Joi.array().items(Joi.link('$'))
}).external('children', (value, originalValue, helpers) => {
  // 递归引用检查
  return value && typeof value === 'object';
});

// 树形结构组件
class TreeComponent {
  constructor() {
    this.root = null;
  }

  // 添加节点
  addNode(id, name, children = []) {
    const newNode = { id, name, children };
    if (!this.root) {
      this.root = newNode;
    } else {
      // 递归添加节点
      this._addNode(this.root, newNode);
    }
  }

  // 递归添加节点
  _addNode(currentNode, newNode) {
    if (currentNode.children.length > 0) {
      for (let i = 0; i < currentNode.children.length; i++) {
        this._addNode(currentNode.children[i], newNode);
      }
    } else {
      currentNode.children.push(newNode);
    }
  }

  // 获取树
  getTree() {
    if (!this.root) {
      throw new Error('Tree is empty');
    }
    return this.root;
  }
}

// 初始化树形结构组件
const treeComponent = new TreeComponent();

// 定义路由处理函数
const addTreeNodeRoute = async (request, h) => {
  try {
    const { id, name, children } = request.payload;
    await TREE_SCHEMA.validate({ id, name, children });
    treeComponent.addNode(id, name, children);
    return h.response({ message: 'Node added successfully' }).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(400);
  }
};

// 定义路由
server.route({
  method: 'POST',
  path: '/add-node',
  handler: addTreeNodeRoute,
  options: {
    validate: {
      payload: TREE_SCHEMA
    },
    response: {
      schema: Joi.object({
        message: Joi.string().required()
      })
    }
  }
});

// 定义路由获取树
const getTreeRoute = async (request, h) => {
  try {
    const tree = treeComponent.getTree();
    return h.response({ tree }).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};

// 定义路由
server.route({
  method: 'GET',
  path: '/tree',
  handler: getTreeRoute,
  options: {
    response: {
      schema: Joi.object({
        tree: TREE_SCHEMA
      })
    }
  }
});

// 启动服务器
async function start() {
  await server.start();
  console.log('Server running on %s', server.info.uri);
}

start();