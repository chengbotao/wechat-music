// components/authorize/authorize.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(event) {
      console.log(event);
      const userInfo = event.detail.userInfo;
      if (userInfo) {
        // 允许授权
        this.setData({
          modalShow: false
        })
        this.triggerEvent("authorizeSucc", userInfo)
      } else {
        this.triggerEvent("authorizeFail")
      }
    }
  }
})
