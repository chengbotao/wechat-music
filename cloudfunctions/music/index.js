// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// tcb-router
const TcbRouter = require('tcb-router')

// NeteaseCloudMusicApi playlsit_detail
const { playlist_detail, song_url } = require('NeteaseCloudMusicApi')

// 歌单列表数据
const songsList = cloud.database().collection('songsList')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event, context })

  app.use(async (ctx, next) => {
    // todo 全局路由处理
    await next()
  })

  // 获取歌单列表
  app.router('songsList', async (ctx, next) => {
    ctx.body = await songsList.skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res
    })
  })

  // 获取某个歌单的歌曲列表
  app.router('playlist_detail', async (ctx, next) => {
    ctx.body = await playlist_detail({
      id: parseInt(event.songListId)
    }).then(res => {
      return res
    })
  })

  // 获取歌曲的播放的 URL
  app.router('song', async (ctx, next) => {
    ctx.body = await song_url({
      id: event.songId
    }).then(res => {
      return res
    })
  })

  return app.serve()
}