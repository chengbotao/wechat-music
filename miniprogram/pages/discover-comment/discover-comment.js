// pages/discover-comment/discover-comment.js
import formatDate from "../../utils/formatDate"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail(options.blogId)
  },
  _getBlogDetail() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name: "discover",
      data: {
        blogId: this.data.blogId,
        $url: "detail",
      }
    }).then(res => {
      let commentList = res.result.commentList.data
      for (let i = 0; i < commentList.length; i++) {
        commentList[i].createTime = formatDate(new Date(commentList[i].createTime))
      }
      console.log(res);
      this.setData({
        commentList,
        blog: res.result.detail[0],
      })
      wx.hideLoading({
        success: (res) => { },
      })
    })
  },
  refreshCommentList() {
    this._getBlogDetail()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})