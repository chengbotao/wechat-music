// components/blogctrl/blogctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: {
      type: String
    }
  },
  options: {
    styleIsolation: "apply-shared",
  },

  /**
   * 组件的初始数据
   */
  data: {
    authorizeShow: false,
    modalShow: false,
    content: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(event) {
      wx.getSetting({
        withSubscriptions: true,
        success: (res) => {
          console.log(res);
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              authorizeShow: true
            })
          }
        }
      })
    },
    authorizeFail() {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "授权用户才能进行评论"
      })
    },
    authorizeSucc(userInfo) {
      this.setData({
        authorizeShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
      userInfo = userInfo
    },
    // onInput(event) {
    //   this.setData({
    //     content: event.detail.value
    //   })
    // },
    onSend(event) {
      // 插入数据库
      let content = event.detail.value.content
      let formId = event.detail.formId
      let blogId = this.properties.blogId
      if (!content.trim()) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: "评论内容不能为空"
        })
        return
      }
      wx.showLoading({
        title: '评价中...',
        mask: true
      })

      db.collection("blogComment").add({
        data: {
          content,
          blogId,
          createTime: db.serverDate(),
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        wx.hideLoading({
          success: (res) => { },
        })
        wx.showToast({
          title: '评价成功',
        })
        this.setData({
          modalShow: false,
          content: ""
        })
        this.triggerEvent("refreshCommentList")
      })

      // 推送消息
      wx.cloud.callFunction({
        name: "sendMessage",
        data: {
          content,
          formId,
          blogId,
          createTime: db.serverDate(),
        }
      }).then(res => {
        console.log("sssss",res);
      })
    }
  }
})
