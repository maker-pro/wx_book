const app = getApp();
module.exports = {
    verifySession: function () {
        wx.login({
            success(res) {
              if (res.code) {
                  //发起网络请求
                  wx.request({
                      url: app.baseUrl + 'wx_code_to_session',
                      method: 'POST',
                      data: {
                          code: res.code
                      },
                      header: {
                          'content-type': 'application/x-www-form-urlencoded'
                      },
                      success (res) {
                          wx.setStorageSync('openid', res.data.data.openid);
                          wx.setStorageSync('session_key', res.data.data.session_key);
                          wx.setStorageSync('nick_name', res.data.data.nick_name);
                          wx.setStorageSync('avatar', res.data.data.avatar);
                      }
                  });
              } else {
                  console.log('登录失败！' + res.errMsg)
              }
            }
        })
    },
    locLogin: function() {
        wx.checkSession({
            success () {
                console.log('session_key 未过期，并且在本生命周期一直有效')
                //session_key 未过期，并且在本生命周期一直有效
            },
            fail () {
                // session_key 已经失效，需要重新执行登录流程
                wx.login({
                    success(res) {
                      if (res.code) {
                          //发起网络请求
                          wx.request({
                              url: app.baseUrl + 'wx_code_to_session',
                              method: 'POST',
                              data: {
                                  code: res.code
                              },
                              header: {
                                  'content-type': 'application/x-www-form-urlencoded'
                              },
                              success (res) {
                                wx.setStorageSync('openid', res.data.data.openid);
                                wx.setStorageSync('session_key', res.data.data.session_key);
                                wx.setStorageSync('nick_name', res.data.data.nick_name);
                                wx.setStorageSync('avatar', res.data.data.avatar);
                              }
                          });
                      } else {
                          console.log('登录失败！' + res.errMsg)
                      }
                    }
                })
            }
        })
    },
    getCurrentPage: function() {
        let pages = getCurrentPages();
        return pages[pages.length - 1].options;
    }
  };