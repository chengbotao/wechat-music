// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const result = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `/pages/discover-comment/discover-comment?blogId=${event.blogId}`,
    data: {
      phrase2: {
        value: "评价成功"
      },
      time1: {
        value: event.createTime
      },
      thing3: {
        value: event.content
      }
    },
    templateId: "dPriEUpgmgGRh0kV97WaxMyqCcKei3tUhy2c6FdZ8Nk",
    formId: event.formId
  })
  return result
}