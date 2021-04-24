// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// tcb-router
const TcbRouter = require('tcb-router')
const db = cloud.database()
const musicBlogCollection = db.collection('musicBlog')
const blogCommentCollection = db.collection('blogComment')

const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router("list", async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim()) {
      w = {
        content: new db.RegExp({
          regexp: keyword,
          options: "i"
        })
      }
    }
    let blogList = await musicBlogCollection.where(w).skip(event.start).limit(event.count).orderBy("createTime", "desc").get().then(res => {
      return res.data
    })
    ctx.body = blogList
  })

  app.router("detail", async (ctx, next) => {
    let blogId = event.blogId
    // 博客查询
    let detail = await musicBlogCollection.where({
      _id: blogId
    }).get().then(res => {
      return res.data
    })
    // 评论查询
    const countResult = await blogCommentCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = blogCommentCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({ blogId }).orderBy("createTime", "desc").get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          console.log(acc,cur);
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail
    }
  })
  return app.serve()
}