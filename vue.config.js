module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: 'http://10.5.71.209:9696/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }

    }
}
