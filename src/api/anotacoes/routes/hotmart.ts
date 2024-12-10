export default {
  routes: [
    {
      method: 'POST',
      path: '/hotmart/webhook',
      handler: 'hotmart.handleWebhook',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};