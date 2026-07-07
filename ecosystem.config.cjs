module.exports = {
  apps: [
    {
      name: 'scswiki-assistant',
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'assistant-api/src/server.ts',
      cwd: __dirname,
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        SCS_ASSISTANT_HOST: '127.0.0.1',
        SCS_ASSISTANT_PORT: '8787',
      },
    },
  ],
};
