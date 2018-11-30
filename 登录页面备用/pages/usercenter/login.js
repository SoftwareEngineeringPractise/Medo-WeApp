Page({
  data: {
    email: '',
    password: ''
  },
  bindEmailInput: function (e) {
    this.setData({ email: e.detail.value })
  },
  bindPasswordInput: function (e) {
    this.setData({ password: e.detail.value })
  },
  login: function (e) {
    wx.showToast({ title: '登录请求中', icon: 'loading', duration: 1000 });
    //网络请求开始
    wx.request({
      url: 'http://api.gugujiankong.com/account/Login?email=' + this.data.email + '&password=' + this.data.password,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.LoginStatus == 1) {
          //进行一些用户状态的存储
          //进行 tab 的切换
          wx.switchTab({
            url: '../../pages/index/index',
            success: function () {
              console.log("called switchtab.");
            }
          });
        } else {
          wx.showModal({
            title: '登录失败', content: '请检查您填写的用户信息！', showCancel: false, success: function (res) {
              //回调函数
            }
          });
        }
      }
    });
  }
})
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})