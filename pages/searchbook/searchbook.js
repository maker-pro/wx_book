// pages/searchbook/searchbook.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        no_more: false,
        book_list: [],
        search_text: '',
        page_max_id: 0,
        category_list: [],
        category_level_1: 'all',
        category_level_2: '',
        category_level_2_list: [],
        book_category_2_to_1: {},
        loading_fail: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {        
        wx.request({
            url: app.baseUrl + 'search_book_category',
            data: {},
            success:(res)=>{
                let category_level_1 = '';
                let category_level_2 = '';
                let category_level_2_list = [];
                if(options && options.hasOwnProperty('category_level_2')) {
                    category_level_2 = options.category_level_2;
                    category_level_1 = res.data.data.book_category_2_to_1[options.category_level_2];
                    category_level_2_list = res.data.data.book_category_list[category_level_1]['child'];
                } else {
                    category_level_1 = Object.keys(res.data.data.book_category_list)[0];
                }
                this.setData({
                    category_list: res.data.data.book_category_list,
                    category_level_1: category_level_1,
                    category_level_2: category_level_2,
                    category_level_2_list: category_level_2_list,
                    book_category_2_to_1: res.data.data.book_category_2_to_1,
                    loading_fail: false
                });
                this.searchBookByCategory();
            }
        });
    },

    onChangeCategoryLevel1: function(event) {
        var child_category_list = this.data.category_list[event.currentTarget.dataset.category]['child']
        var category_level_2 = child_category_list.length > 0 ? child_category_list[0].id : '';
        this.setData({
            category_level_1: event.currentTarget.dataset.category,
            category_level_2: category_level_2,
            category_level_2_list: child_category_list
        });
        this.searchBookByCategory();
    },
    onChangeCategoryLevel2: function(event) {
        this.setData({
            category_level_2: event.currentTarget.dataset.category,
        });
        this.searchBookByCategory();
    },
    chengeInputText: function(event) {
        // console.log(event.detail.value)
        this.setData({
            search_text: event.detail.value
        })
    },
    searchBookByCategory: function() {
        var category_level_1 = this.data.category_level_1;
        var category_level_2 = this.data.category_level_2;
        var search_text = this.data.search_text;
        // console.log(category_level_1 + '<--->' + category_level_2);
        wx.request({
            url: app.baseUrl + 'search_book_v2',
            data: {
                category_level_1_id: category_level_1,
                category_level_2_id: category_level_2,
                search_text: search_text
            },
            success:(res)=>{
                this.setData({
                    book_list: res.data.data.books,
                    page_max_id: res.data.data.page_max_id,
                    no_more: res.data.data.books == false
                })
            }
        });
    },
    onGoToBookDetail1: function(event) {
        wx.navigateTo({
          url: '/pages/bookdetail/bookdetail?book_id=' + event.currentTarget.dataset.bookId,
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
        this.searchBookByCategory();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showNavigationBarLoading();
        wx.request({
            url: app.baseUrl + 'search_book_v2',
            data: {
                category_level_1_id: this.data.category_level_1,
                category_level_2_id: this.data.category_level_2,
                search_text: this.data.search_text,
                page_max_id: this.data.page_max_id
            },
            success:(res)=>{
                this.setData({
                    book_list: this.data.book_list.concat(res.data.data.books),
                    page_max_id: res.data.data.page_max_id,
                    no_more: res.data.data.books == false
                })
                wx.hideNavigationBarLoading();
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})