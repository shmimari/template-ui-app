const express = require('express');
const cors = require('cors');
const { join } = require('path');

const initialize = () => {
    const app = express();
    const { NODE_ENV: nodeEnv = null, PORT: _port = 3000 } = process.env;

    app.use(express.json({ type: ['text/plain', 'application/json'], limit: '5mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(
        cors({
            origin: process?.env?.CORS_ORIGINS ? JSON.parse(process?.env?.CORS_ORIGINS) : '',
            allowedHeaders: ['Authorization', 'Content-Type'],
            credentials: true
        })
    );

    app.options('*', cors());
    app.set('view engine', 'pug');
    app.set('views', join(__dirname, '..', 'views'));

    if (nodeEnv === 'development') {
        const config = require(join(__dirname, '..//..//webpack.config.js'));
        const webpack = require('webpack');
        const compiler = webpack(config);
        const webpackDevMiddleware = require('webpack-dev-middleware');
        app.use(
            webpackDevMiddleware(compiler, {
                publicPath: config.output.publicPath
            })
        );
        app.use(require('webpack-hot-middleware')(compiler));
    } else {
        app.use(express.static('dist'));
    }

    app.get('*', (_req, res) => {
        const model = {
            applicationName: 'a',
            applicationDescription: 'a',
            localDev: true,
            preloadedState: { data: 's' },
            version: '1.0.0'
        };
        res.render('index', model);
    });

    const { PORT = 3000 } = process.env;
    app.listen(PORT, () => {
        console.info(`Service started on port ${PORT}`);
    });
};

void initialize();
