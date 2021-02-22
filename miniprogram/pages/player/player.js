// pages/player/player.js

// 全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

// 歌曲列表 & 当前播放的index
let playList = []
let nowPlayingIdx = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    playList = wx.getStorageSync('playlist')
    nowPlayingIdx = options.index
    this._loadMusicDetail()
  },

  /**
   * 加载歌曲信息
   */
  _loadMusicDetail(musicid) {
    let song = playList[nowPlayingIdx]
    wx.setNavigationBarTitle({
      title: song.name,
    })
    this.setData({
      picUrl: song.al.picUrl,
      isPlaying: false
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'song',
        songId: song.id
      }
    }).then(res => {
      console.log(res);
      let songDetail = res.result.body.data
      backgroundAudioManager.src = songDetail[0].url
      backgroundAudioManager.title = song.name
      this.setData({
        isPlaying: true
      })
    })
  },

  /**
   * 播放状态切换
   */
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  /**
   * 上一首
   */
  onPrev() {
    nowPlayingIdx--
    if (nowPlayingIdx < 0) {
      nowPlayingIdx = playList.length - 1
    }
    this._loadMusicDetail()
  },

  /**
   * 下一首
   */
  onNext() {
    nowPlayingIdx++
    if (nowPlayingIdx === playList.length) {
      nowPlayingIdx = 0
    }
    this._loadMusicDetail()
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