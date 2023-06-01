// pages/bookshelf/bookshelf.js
const app = getApp();
const common = require('../../utils/common');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        curr_openid: '',
        book_list: [],

        edit_status: false,
        need_delete_book_map: {},
        loading_fail: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        common.verifySession()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            curr_openid: wx.getStorageSync('openid')
        });
        this.loadBookShelf();
    },

    loadBookShelf: function() {
        let this_ = this
        wx.request({
            url: app.baseUrl + 'get_book_shelf',
            method: 'POST',
            data: {
                openid: this.data.curr_openid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success (res) {
                this_.setData({
                    book_list: res.data.data,
                    loading_fail: false
                })
            }
        });
    },
    
    jumpToChapterContent: function(event) {
        let book_id = event.currentTarget.dataset.bookId;
        if (this.data.edit_status) {
            let need_delete_book_map = this.data.need_delete_book_map;
            if(need_delete_book_map.hasOwnProperty(book_id)) {
                // 删除
                delete need_delete_book_map[book_id];
            } else {
                // 添加
                need_delete_book_map[book_id] = 1;
            }
            this.setData({
                need_delete_book_map: need_delete_book_map
            });
            return ;
        }
        wx.request({
            url: app.baseUrl + 'update_book_last_red_time',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                openid: this.data.curr_openid,
                book_id: book_id
            },
            success: (res) => {
                if(res.data.code == '200') {
                    let params_ = wx.getStorageSync(book_id).split('$$$');
                    let chapter_id = '';
                    if(params_.length == 2) {
                        chapter_id = params_[0];
                    } else {
                        chapter_id = res.data.data[0].chapter_id;
                    }
                    wx.navigateTo({
                        url: '/pages/chaptercontent/chaptercontent?book_id=' + book_id + '&chapter_id=' + chapter_id + '&from_page=book_self',
                    });
                } else {
                    show_toast_title = '网络连接错误';
                    wx.showToast({
                        title: show_toast_title,
                        icon: 'success',
                        duration: 2000
                    });
                }
            }
        });
    },

    onEdit: function() {
        this.setData({
            edit_status: true,
            need_delete_book_map: {}
        })
    },
    deleteCancel: function() {
        this.setData({
            edit_status: false,
            need_delete_book_map: {}
        });
    },
    deleteSubmit: function() {
        let need_delete_books = Object.keys(this.data.need_delete_book_map);
        if(need_delete_books.length > 0) {
            // console.log(need_delete_books);
            wx.request({
                url: app.baseUrl + 'remove_book_to_book_self',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    openid: this.data.curr_openid,
                    book_id: need_delete_books
                },
                success: (res) => {
                    let show_toast_title = '操作失败';
                    if(res.data.code == 200) {
                        show_toast_title = '操作成功';
                        this.loadBookShelf();
                    }
                    wx.showToast({
                        title: show_toast_title,
                        icon: 'success',
                        duration: 2000
                    });
                }
            });
        }
        this.deleteCancel();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loadBookShelf();
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
        this.onReady();
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