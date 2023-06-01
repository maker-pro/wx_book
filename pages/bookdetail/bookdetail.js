// pages/bookdetail/bookdetail.js
const common = require('../../utils/common');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        book_info: {},
        book_chapter_list: [],
        book_detail_show: false,
        book_add_bookself: false,
        is_loading: true,
        loading_text: '查看更多>>',
        curr_openid: '',
        loading_fail: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ 
            curr_openid: wx.getStorageSync('openid')
        });
        if(options && options.hasOwnProperty('book_id')) {
            wx.request({
                url: app.baseUrl + 'book_info?book_id=' + options.book_id + '&open_id=' + this.data.curr_openid,
                data: {},
                success: (res) => {
                    this.setData({
                        book_info: res.data.data,
                        book_add_bookself: res.data.data.in_book_self,
                        loading_fail: false
                    });
                    this.getChapterList(10);
                }
            });
        }
    },

    onJumpToSearchPage: function(event) {
        wx.navigateTo({
          url: '/pages/searchbook/searchbook?category_level_2=' + event.currentTarget.dataset.categoryId,
        })
    },
    onChangeDetailLength: function(event) {
        this.setData({
            book_detail_show: !this.data.book_detail_show
        });
    },
    getChapterList: function(limit) {
        let url = app.baseUrl + 'chapter_list?book_id=' + this.data.book_info['book_id']
        if(typeof(limit) != "undefined") {
            url = url + '&limit=' + limit;
        }
        wx.request({
            url: url,
            data: {},
            success: (res) => {
                let is_loading = this.data.is_loading;
                if(typeof(limit) == "undefined") {
                    is_loading = false;
                }
                this.setData({
                    book_chapter_list: res.data.data,
                    is_loading: is_loading
                });
            }
        });
    },
    onShowAllChapter: function(event) {
        this.setData({
            loading_text: '加载中...'
        });
        this.getChapterList();
    },
    onAddBookSelf: function(event) {
        let this_ = this
        let api_url = this_.data.book_add_bookself ? 'remove_book_to_book_self' : 'add_book_to_book_self';
        let show_toast_title = this_.data.book_add_bookself ? '已移除' : '已添加';
        api_url = app.baseUrl + api_url;
        // API 添加到书架
        wx.request({
            url: api_url,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: this.data.curr_openid,
                book_id: this.data.book_info.book_id
            },
            success: (res) => {
                if(res.data.code == '200') {
                    this_.setData({
                        book_add_bookself: !this_.data.book_add_bookself
                    });
                    wx.setStorageSync(this.data.book_info.book_id, this.data.book_chapter_list[0].chapter_id + '$$$0')
                } else {
                    show_toast_title = '操作失败';
                }
                wx.showToast({
                    title: show_toast_title,
                    icon: 'success',
                    duration: 2000
                });
            }
        });
    },
    jumpToChapterContent: function(event) {
        let book_id = this.data.book_info.book_id;
        let chapter_id = event.currentTarget.dataset.chapterId;
        wx.setStorageSync(book_id, chapter_id + '$$$0')
        wx.navigateTo({
            url: '/pages/chaptercontent/chaptercontent?book_id=' + book_id + '&chapter_id=' + chapter_id + '&from_page=book_detail',
        });
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
        this.onLoad(common.getCurrentPage());
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