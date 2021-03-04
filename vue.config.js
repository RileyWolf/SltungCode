module.exports = {
    devServer: {
        proxy: {
            "/api": {
                // target: 'http://10.5.71.209:9696/',
                target: 'http://10.5.71.209:19696/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }

    }
}
