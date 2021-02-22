// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object
    }
  },

  /**
   * 监听组件属性变化 
   */
  observers: {
    ['data.playCount'](count) {
      this.setData({
        _count: this._tranNumber(count)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: '0'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPlayList() {
      wx.navigateTo({
        url: `../../pages/playlist/playlist?songListId=${this.properties.data.id}`,
      })
    },
    _tranNumber(num, point = 2) {
      let numStr = num.toString().split('.')[0];
      let numLen = numStr.length;
      if (numLen < 6) {
        return numStr;
      } else if (numLen >= 6 && numLen <= 8) {
        let decimal = numStr.substring(numLen - 4, numLen - 4 + point);
        return `${parseInt(num / 10000)}.${decimal}万`
      } else {
        let decimal = numStr.substring(numLen - 8, numLen - 8 + point);
        return `${parseInt(num / 100000000)}.${decimal}亿`
      }
    }
  }
})
