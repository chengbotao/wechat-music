// pages/playlist/playlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playList: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist_detail',
        songListId: options.songListId
      }
    }).then(res => {
      let list = res.result.body.playlist
      this.setData({
        playList: list.tracks,
        listInfo: {
          name: list.name,
          coverImgUrl: list.coverImgUrl,
        }
      })
      this._setPlayList()
      wx.hideLoading({
        success: (res) => { },
      })
    })
  },
  /**
   * 存储歌曲列表到本地
   */
  _setPlayList(){
    wx.setStorageSync('playlist', this.data.playList)
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