// pages/discover-edit/discover-edit.js
const MAX_WORDS_NUM = 140
const MAX_IMG_NUM = 9
const db = wx.cloud.database()
let content = ""
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    userInfo = options
  },

  onInput(event) {
    console.log(event);
    let wordsNum = event.detail.value.length;
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur(event) {
    this.setData({
      footerBottom: 0
    })
  },
  onChooseImage() {
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        console.log(res);
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max < -0 ? false : true
        })
      }
    })
  },
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images === MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: max < -0 ? false : true
      })
    }
  },
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },
  send() {
    // 数据 -> 云数据库
    // 图片-> 云存储 fileID 云文件
    if (!content.trim()) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "请输入内容"
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    let promisrArr = []
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let P = new Promise((resolve, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: `music/${Date.now()}-${Math.random() * 1000000}${suffix}`,
          filePath: item,
          success: (res) => {
            console.log(res);
            fileIds = fileIds.concat(res.fileID)
            resolve(res)
          },
          fail: (err) => {
            console.error(err);
            reject(err)
          }
        })
      })
      promisrArr.push(P)
    }
    Promise.all(promisrArr).then(res => {
      db.collection("musicBlog").add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(), // 服务端时间
        }
      }).then(res => {
        wx.hideLoading({
          success: (res) => { },
        })
        wx.showToast({
          title: '发布成功',
        })

        // 返回前一页 并调用前一页的刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      }).catch(err => {
        wx.hideLoading({
          success: (res) => { },
        })
        wx.showToast({
          title: '发布失败',
        })
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