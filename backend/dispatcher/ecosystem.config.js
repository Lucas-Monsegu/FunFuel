// Target server hostname or IP address
const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST ? process.env.TARGET_SERVER_HOST.trim() : ""
// Target server username
const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER ? process.env.TARGET_SERVER_USER.trim() : ""
// Target server application path
const TARGET_SERVER_APP_PATH = `/home/${TARGET_SERVER_USER}/dispatcher`
// Your repository
const REPO = "git@gitlab.com:funfuel/dispatcher.git"

module.exports = {
    /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
    apps: [
        {
            name: "dispatcher",
            script: "yarn",
            args: "prod",
            interpreter: "bash",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production",
            }
        }
    ],

    /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
    deploy: {
        production: {
            user: TARGET_SERVER_USER,
            host: TARGET_SERVER_HOST,
            port: "8104",
            ref: "origin/master",
            repo: REPO,
            ssh_options: "StrictHostKeyChecking=no",
            path: TARGET_SERVER_APP_PATH,
            "post-deploy": "yarn --prod"
                + " && pm2 startOrReload ecosystem.config.js --env=production"
                + " && pm2 save"
        }
    }
}