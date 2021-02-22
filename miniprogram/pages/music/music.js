// pages/music/music.js

const MAX_LIMIT = 15

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgs: [],
    songsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSongsList()
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
    // 下拉更新歌单列表
    this.setData({
      songsList: []
    })
    this._getSongsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 上拉加载歌单列表数据
    this._getSongsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /** 
   * 获取歌单列表
  */
  _getSongsList() {
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'songsList',
        start: this.data.songsList.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      this.setData({
        songsList: this.data.songsList.concat(res.result.data)
      })

      // 下拉结束
      wx.stopPullDownRefresh({
        success: (res) => { },
      })

      wx.hideLoading({
        success: (res) => { },
      })
    })
  }
})