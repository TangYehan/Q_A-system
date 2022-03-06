export default (ctx, options) => {
  ctx.modifyWebpackChain(args => {
    const chain = args.chain
    chain.module.rules.delete('script') // 删除Taro中配置的babel-loader
    chain.merge({
      // 重新配置babel-loader
      module: {
        rule: {
          script: {
            test: /\.[tj]sx?$/i,
            use: {
              threadLoader: {
                loader: 'thread-loader' // 多核构建
              },
              babelLoader: {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true // 开启babel-loader缓存
                }
              }
            }
          }
        }
      }
    })
  })
}
