module.exports = {
  development: 'http://172.16.35.194:8080',
  production: 'http://pictrip.qyer.com',
  map: {
    '@index@': {
      development: '',
      production: '/bbs'
    },
    '@post@': {
      development: '/post.html',
      production: '/bbs/index/post'
    }
  }
}
