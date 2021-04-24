// components/blogcard/blogcard.js
import formatDate from "../../utils/formatDate"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object
    }
  },
  observers: {
    ["content.createTime"](val) {
      if (val) {
        this.setData({
          _createTime: formatDate(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event){
      wx.previewImage({
        urls: this.data.content.img,
        current: event.target.dataset.imgsrc
      })
    }
  }
})
