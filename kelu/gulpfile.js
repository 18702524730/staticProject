var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var proxy = require('http-proxy-middleware');

var config = {
  baseDir: './',
  watchFiles: [ '**/*.html', '**/*.css', '**/*.js' ]
}

// 设置代理
var middleware = [
    proxy('/kelu', {
        target: 'http://47.110.124.54:8081',
        changeOrigin: true,
        ws: true, // proxy websockets
        cookieDomainRewrite: "",
        pathRewrite: {
            '^/kelu' : '/kelu'
        },
        router: {}
    }),
    proxy('/iprp_portal', {
        target: 'http://testuser.ipsebe.com',
        changeOrigin: true,
        ws: true, // proxy websockets
        cookieDomainRewrite: "",
        pathRewrite: {
            '^/iprp_portal' : ''
        },
        router: {}
    })
];

gulp.task('server', function() {
  browserSync.init({
    files: config.watchFiles,
    server: {
        baseDir: "./"
    },
    middleware: middleware
  });
})
gulp.task('default',['server']); //定义默认任务