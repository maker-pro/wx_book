// components/category-list/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        category_item: Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onJumpToSearchPage(event) {
            wx.navigateTo({
              url: '/pages/searchbook/searchbook?category_level_2=' + this.properties.category_item.id,
            })
        }
    }
})
