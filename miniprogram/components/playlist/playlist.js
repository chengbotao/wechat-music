// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Array
    }
  },
  observers: {
    playlist(val) {
      this.setData({
        detailList: val
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailList: [],
    playingId: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择歌曲跳转播放页
    onSelect(event) {
      let ds = event.currentTarget.dataset
      let listId = ds.listid
      let idx = ds.idx
      this.setData({
        playingId: listId
      })

      wx.navigateTo({
        url: `../../pages/player/player?musicId=${listId}&index=${idx}`,
      })
    }
  }
})
