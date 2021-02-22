// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云数据库
const MAX_LIMIT = 100
const db = cloud.database()
const songsListCollection = db.collection('songsList')

// 歌单
const { personalized } = require('NeteaseCloudMusicApi')

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取云数据库歌单列表的总条数
  const { total } = await songsListCollection.count()

  // 分批请求然后整合突破小程序每次请求只能获取100条数据的限制
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    // 云数据库分页查询
    let promise = songsListCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 云数据库中歌单列表的数据
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 获取歌单列表数据
  let songsList = await personalized({
    limit: 30
  }).then(res => {
    return res.body.result
  })

  // 歌单列表去重
  let data = songsList.reduce((acc, cur) => {
    if (!list.data.some(item => item.id === cur.id)) {
      acc.push(cur)
    }
    return acc
  }, [])

  // 更新云数据库
  for (let i = 0; i < data.length; i++) {
    await songsListCollection.add({
      data: {
        ...data[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('数据插入成功');
    }).catch(err => {
      console.log('数据插入失败');
    })
  }
}