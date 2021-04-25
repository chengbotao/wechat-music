// pages/blog-bloghistory/blog-bloghistory.js
const MAX_LIMI = 100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getListByCloudFn()
  },

  _getListByCloudFn() {
    wx.showLoading({
      title: "加载中"
    })
    wx.cloud.callFunction({
      name: "discover",
      data: {
        $url: "getListByOpenid",
        start: this.data.blogList.length,
        count: MAX_LIMI
      }
    }).then(res => {
      console.log(res);
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading({
        success: (res) => { },
      })
    })
  },
  goComment(event) {
    wx.navigateTo({
      url: `../discover-comment/discover-comment?blogId=${event.target.dataset.blogid}`,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getListByCloudFn()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    let blog = event.target.dataset.blog
    return {
      title:blog.content,
      path: `/pages/discover-comment/discover-comment?blogId=${blog._id}`,
      // imageUrl: ``
    }
  }
})