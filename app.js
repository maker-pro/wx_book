// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  },

  // 这里填写自己的接口地址前缀
  baseUrl:"https://127.0.0.1/api/v1/",
  
  // 微信小程序开发编译时出现，因为启用组件按需注入
  lazyCodeLoading: "requiredComponents"
})
