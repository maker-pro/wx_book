// pages/category/category.js
const app = getApp()
const common = require('../../utils/common');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        category_list: [],
        category_list_key: [],
        category_list_active_key: '',
        loading_fail: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        common.verifySession()
        wx.request({
            url: app.baseUrl + 'category',
            data: {},
            success:(res)=>{
                this.setData({
                    category_list: res.data.data,
                    category_list_key: Object.keys(res.data.data),
                    category_list_active_key: Object.keys(res.data.data)[0],
                    loading_fail: false
                })
            }
        })
    },

    onChangeCategory(event) {
        const type = event.currentTarget.dataset.type
        this.setData({
            category_list_active_key: type
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