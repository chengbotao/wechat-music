// pages/discover/discover.js
let keyword = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    blogList: []
  },

  // 发布
  onPublish() {
    // 用户是否授权
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        console.log(res);
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              this.authorizeSucc({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },
  authorizeSucc(event) {
    console.log(event);
    const detail = event.detail;
    wx.navigateTo({
      url: `../discover-edit/discover-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  authorizeFail() {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "授权用户才能发布"
    })
  },
  goComment(event) {
    wx.navigateTo({
      url: `../discover-comment/discover-comment?blogId=${event.target.dataset.blogid}`,
    })
  },
  onSearch(event) {
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    this._loadBlogList()

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: "discover",
      data: {
        start,
        keyword,
        count: 10,
        $url: "list",
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading({
        success: (res) => { },
      })
      wx.stopPullDownRefresh({
        success: (res) => { },
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: []
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event);
    let blog = event.target.dataset.blog
    return {
      title:blog.content,
      path: `/pages/discover-comment/discover-comment?blogId=${blog._id}`,
      // imageUrl: ``
    }
  }
})