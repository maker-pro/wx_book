// pages/chaptercontent/chaptercontent.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        book_id: '',
        from_page: '',
        chapter_id: '',
        scroll_top: '0',
        window_height: '',
        curr_scroll_id: '',
        chapter_title: '',
        chapter_content_list: [],
        next_chapter: '',
        pre_chapter: '',

        //滑动坐标
        startX: 0,
        startY: 0,

        // 活动方向 L 左滑  R 右滑
        direction: null,

        // SettingBox 展示或者隐藏标记参数
        setting_box_is_show: false,
        setting_box_bottom: -140,
        setting_box_bottom_change_step: 20,
        setting_box_interval_time: 20,
        setting_box_interval_id: null,

        // 章节列表
        setting_top_box_header: 0,
        setting_box_chapter_list: false,
        chapter_chapter_loading: true,
        book_chapter_list: [],
        // 字体设置
        setting_box_font_set: false,
        // 背景
        background_type: 'day-background', // night-background
        font_size: 'middle', // 大 big，中 middle，小 small
        font_size_config: {
            'small': 30,
            'middle': 35,
            'big': 42
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let this_ = this;
        // 初始化背景和字体
        let font_size = wx.getStorageSync('font_size');
        let background_type = wx.getStorageSync('background_type');
        this.setData({
            font_size: font_size == '' ? this.data.font_size : font_size,
            background_type: background_type == '' ? this.data.background_type : background_type,
        });
        wx.getSystemInfo({
            success: function (res) {
              //屏幕的宽度/屏幕的高度 = 微信固定宽度(750)/微信高度
              this_.setData({
                // window_height: res.windowHeight-(res.windowWidth*20/750)+'px'
                window_height: res.windowHeight+'px'
              })
            }
        });
        if(options && options.hasOwnProperty('book_id') && options.hasOwnProperty('chapter_id')) {
            this.setData({
                book_id: options.book_id,
                chapter_id: options.chapter_id,
                from_page: options.from_page
            });
            wx.request({
                url: app.baseUrl + 'chapter_content?book_id=' + options.book_id + '&chapter_id=' + options.chapter_id,
                data: {},
                success: (res) => {
                    // console.log(res.data.data);
                    this.setData({
                        chapter_content_list: res.data.data.curr_chapter.content,
                        chapter_title: res.data.data.curr_chapter.title,
                        pre_chapter: res.data.data.hasOwnProperty('pre_chapter') ? res.data.data.pre_chapter : '',
                        next_chapter: res.data.data.hasOwnProperty('next_chapter') ? res.data.data.next_chapter : ''
                    }, () => {
                        this_.initScroll();
                    });
                }
            });
        }
    },
    scrollFun: function(e) {
        wx.setStorageSync(this.data.book_id, this.data.chapter_id + '$$$' + e.detail.scrollTop.toString())
    },
    initScroll: function() {
        let params_ = wx.getStorageSync(this.data.book_id).split('$$$');
        let scroll_top = '0';
        if(params_.length == 2 && params_[0] == this.data.chapter_id && this.data.from_page == 'book_self') {
            scroll_top = params_[1];
        }
        this.setData({ 
            scroll_top: scroll_top
        });
    },
    //开始滑动
    touchStart: function (e) {
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY
        })
    },
    //滑动中判断滑动方向
    touchMove: function (e) {
        let startX = this.data.startX // 开始x坐标
        let startY = this.data.startY // 开始y坐标
        let touchMoveX = e.changedTouches[0].clientX // 活动变化坐标
        let touchMoveY = e.changedTouches[0].clientY //滑动变化坐标
        let angle = this.angle({
            X: startX,
            Y: startY
        }, {
            X: touchMoveX,
            Y: touchMoveY
        })
        // 滑动角度超过45retrun
        let direction = '';
        if (Math.abs(angle) <= 45) {
            if (touchMoveX > startX) { //右滑
                direction = 'R';
            } else {
                direction = 'L';
            }
        }
        this.setData({
            direction: direction
        })
        return
    },
    // 滑动角度限制
    angle: function (start, end) {
        var _X = end.X - start.X, _Y = end.Y - start.Y
        //返回角度 / Math,atan()返回数据的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
    },
    // 滑动结束
    tochend: function (e) {
        let this_ = this;
        if (this.data.direction == 'R') { // 左滑相当于上一页
            // console.log("左滑")
            if(this.data.pre_chapter == '') {
                wx.showToast({
                    title: '这是第一章',
                    icon: 'success',
                    duration: 2000
                })
            } else {
                wx.redirectTo({
                    url: '/pages/chaptercontent/chaptercontent?book_id=' + this_.data.book_id + '&chapter_id=' + this_.data.pre_chapter + '&from_page=',
                });
            }
        } else if (this.data.direction == 'L') { //右滑相当于下一页
            // console.log("右滑");
            if(this.data.next_chapter == '') {
                wx.showToast({
                    title: '这是最后一章',
                    icon: 'success',
                    duration: 2000
                })
            } else {
                wx.redirectTo({
                    url: '/pages/chaptercontent/chaptercontent?book_id=' + this.data.book_id + '&chapter_id=' + this.data.next_chapter + '&from_page=',
                });
            }
        }
        this.setData({
            direction: ''
        })
    },
    showSettingBox: function() {
        let type = this.data.setting_box_is_show ? 'down' : 'up';
        if(type == 'down') {
            this.setData({
                setting_box_chapter_list: false,
                setting_box_font_set: false,
                chapter_chapter_loading: true
            });
        }
        this.setData({
            setting_box_is_show: !this.data.setting_box_is_show,
            setting_box_interval_id: setInterval(this.settingBoxBottom.bind(this, type), this.data.setting_box_interval_time)
        });
    },
    settingBoxBottom: function(type) {
        let setting_box_bottom = this.data.setting_box_bottom;
        if(type == 'up') {
            setting_box_bottom = setting_box_bottom + this.data.setting_box_bottom_change_step;
        }
        if(type == 'down') {
            setting_box_bottom = setting_box_bottom - this.data.setting_box_bottom_change_step;
        }
        this.setData({
            setting_box_bottom: setting_box_bottom
        })
        if(setting_box_bottom >= 0 || setting_box_bottom <= -140) {
            clearInterval(this.data.setting_box_interval_id);
            this.setData({
                setting_box_interval_id: null
            })
        }
        return true;
    },
    showChapterList: function() {
        let this_ = this;
        this_.setData({
            setting_top_box_header: 850,
            chapter_chapter_loading: true,
            setting_box_font_set: false,
            setting_box_chapter_list: true,
            book_chapter_list: []
        });
        wx.request({
            url: app.baseUrl + 'chapter_list?book_id=' + this.data.book_id,
            data: {},
            success: (res) => {
                this_.setData({
                    book_chapter_list: res.data.data,
                    chapter_chapter_loading: false,
                });
            }
        });
    },
    jumpToChapterContent: function(event) {
        let book_id = event.currentTarget.dataset.bookId;
        let chapter_id = event.currentTarget.dataset.chapterId;
        wx.setStorageSync(book_id, chapter_id + '$$$0')
        wx.redirectTo({
            url: '/pages/chaptercontent/chaptercontent?book_id=' + book_id + '&chapter_id=' + chapter_id + '&from_page=book_detail',
        });
    },
    showFontSet: function() {
        this.setData({
            setting_top_box_header: 200,
            setting_box_font_set: true,
            chapter_chapter_loading: true,
            setting_box_chapter_list: false
        });
    },
    changeBackgroundType: function(event) {
        let b_type = event.currentTarget.dataset.type;
        b_type = b_type + '-background';
        this.setData({
            background_type: b_type
        }, () => {
            wx.setStorageSync('background_type', b_type);
        });
    },
    changeFontSize: function(event) {
        let f_type = event.currentTarget.dataset.type;
        this.setData({
            font_size: f_type
        }, () => {
            wx.setStorageSync('font_size', f_type);
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