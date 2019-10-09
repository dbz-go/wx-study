// pages/cloudDatabase/cloudDatabase.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  // 查询数据库
  onQueryTodos: function () {
    // const db = wx.cloud.database()
    // db.collection('todos').count().then(res => {
    //   console.log(res.total)
    // })
    wx.cloud.callFunction({
      name: 'querytodos',
      data: {},
      success: res => {
        console.log('[云函数] [querytodos]: ', res.result.dbResult)
        console.log('[云函数] [querytodos]: ', res.result.ENV)
      },
      fail: err => {
        console.error('[云函数] [querytodos] 调用失败', err)
      }
    })
    // db.collection('todos').doc('1af3506e5d95f69009fdf63e649d36b0').update({
    //   data:{
    //     tags: _.push('min-o')
    //   },
    //   success: res => {
    //     console.log(res)
    //   },
    //   fail: err => {
    //     console.error(err)
    //   }
    // })


  },

  // 添加数据库
  onAddTodos: function () {
    wx.cloud.callFunction({
      name: 'addtodos',
      data: {},
      success: res => {
        console.log('[云函数] [querytodos]: ', res.result)
      },
      fail: err => {
        console.error('[云函数] [querytodos] 调用失败', err)
      }
    })
  },

  // 更新数据库
  updateTodos: function () {
    wx.cloud.callFunction({
      name: 'updateTodos',
      data: {},
      success: res => {
        console.log('[云函数] [updateTodos]调用成功: ', res.result)
      },
      fail: err => {
        console.error('[云函数] [updateTodos] 调用失败' + err)
      }
    })
  },

  // 删除数据库
  removeTodos: function () {
    wx.cloud.callFunction({
      name: 'removeTodos',
      data: {},
      success: res => {
        console.log('[云函数] [removeTodos]调用成功: ', res.result)
      },
      fail: err => {
        console.error('[云函数] [removeTodos] 调用失败' + err)
      }
    })
  },
})
