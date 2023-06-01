// pages/find/find.js
const app = getApp()
const common = require('../../utils/common');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiper_key_list: [],
        hot_book_list: [],
        loading_fail: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        common.verifySession()
        wx.request({
          url: app.baseUrl + 'swiper_key',
          data: {},
          success: (res) => {
              this.setData({
                swiper_key_list: res.data.data
              })
          }
        });
        wx.request({
          url: app.baseUrl + 'hot_book',
          data: {},
          success: (res) => {
            this.setData({
                hot_book_list: res.data.data,
                loading_fail: false
            })
          }
        })
    },
    onGoToBookDetail1: function(event) {
        wx.navigateTo({
          url: '/pages/bookdetail/bookdetail?book_id=' + event.currentTarget.dataset.bookId,
        });
    },
    onGoToSearchBook: function(event) {
      wx.navigateTo({
        url: '/pages/searchbook/searchbook',
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
      this.onLoad();
      wx.stopPullDownRefresh();
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