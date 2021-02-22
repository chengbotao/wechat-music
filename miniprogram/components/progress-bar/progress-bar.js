// components/progress-bar/progress-bar.js

let movableAreaWidth = 0
let movableViewWidth = 0
let currentSec = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },

  /**
   * 生命周期函数
   */
  lifetimes: {
    ready() {
      this._getmovableDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取 movable 宽度
    _getmovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => { })
      backgroundAudioManager.onStop(() => { })
      backgroundAudioManager.onPause(() => { })
      backgroundAudioManager.onWaiting(() => { })
      backgroundAudioManager.onCanplay(() => {
        // backgroundAudioManager.duration 偶发获取不到处理方式
        if (typeof backgroundAudioManager.duration !== 'undefined') {
          this._setTime()
        } else {
          // TODO  性能
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }

      })
      backgroundAudioManager.onTimeUpdate(() => {
        const currentTime = backgroundAudioManager.currentTime
        const duration = backgroundAudioManager.duration
        let sec = currentTime.toString().split('.')[0]
        if (sec !== currentSec) {
          const currentTimeFmt = this._dateFormat(currentTime)
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
          })
          currentSec = sec
        }
      })
      backgroundAudioManager.onEnded(() => { })
      backgroundAudioManager.onError((res) => {
        console.error(res.errCode, res.errMsg);
        wx.showToast({
          title: `错误：${res.errCode}`,
        })
      })
    },

    _setTime() {
      const duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    // 秒格式化分
    _dateFormat(seco) {
      const min = Math.floor(seco / 60)
      const sec = Math.floor(seco % 60)

      return {
        min: this._parse(min),
        sec: this._parse(sec)
      }
    },

    _parse(num) {
      return num < 10 ? `0${num}` : num.toString()
    }
  }
})
