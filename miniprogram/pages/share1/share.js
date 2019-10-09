// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //问题列表，与每日记录页一致
    programs: [
      { type: 'breath', id: 3, text: '昨晚呼吸困难加重了吗？', example: '', inputway: 'choose' },
      { type: 'sleep', id: 4, text: '昨晚睡觉是否要比平时垫高一些？', example: '', inputway: 'choose' },
      { type: 'cough', id: 5, text: '今天咳嗽比平时加重了吗？', example: '', inputway: 'choose' },
      { type: 'foot', id: 6, text: '今天脚踝是否比昨天更肿了？', example: '', inputway: 'choose' },
      { type: 'status', id: 7, text: '今天是否感觉更疲惫一些？', example: '', inputway: 'choose' },
      { type: 'chest', id: 8, text: '今天是否有胸闷胸痛？', example: '', inputway: 'choose' }
    ],
    //假设接口返回的一周数据。临时说明：0:未记录，1:yes，2:no
    programsData: {
      'date': ['9月15日', '9月16日', '9月17日', '9月18日', '9月19日', '9月20日', '今天'],
      'medicines': [1, 0, 1, 2, 2, 0, 1],
      'breath': [1, 0, 1, 2, 2, 0, 1],
      'sleep': [0, 0, 1, 1, 2, 2, 0],
      'cough': [2, 0, 1, 0, 2, 0, 1],
      'foot': [2, 0, 1, 2, 2, 0, 1],
      'status': [1, 1, 0, 0, 2, 0, 1],
      'chest': [1, 0, 0, 2, 1, 0, 2]
    },
    hasupdate: true, //当前评估报告有无更新
    // shareId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到openid
    this.onGetOpenid();
    // this.addShareInfo()
  },
  /**
   * 用户点击右上角分享
   */
  doShare: function () {
    console.log("开始新增分享记录操作")
    var that = this
    that.onShareAppMessage()
    // this.addShareInfo().then(function (data) {
    //   console.log("新增的记录id", data)
    //   that.onShareAppMessage()
    // })
  },

  // 调用云函数得到openid
  onGetOpenid: function () {
    wx.cloud.callFunction({
      name: 'newlogin',
      data: {},
    }).then(res => {
      console.log('[云函数] [login] user openid调用成功: ', res.result.OPENID)
      this.setData({
        openid: res.result.OPENID
      })
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
    })
  },

  //  新增分享记录----云数据库shareInfos
  /*addShareInfo: function () {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database()
      db.collection('shareInfos').add({
        data: {
          isnew: true,
          medicines: this.data.programsData.medicines,
          breath: this.data.programsData.breath,
          sleep: this.data.programsData.sleep,
          cough: this.data.programsData.cough,
          foot: this.data.programsData.foot,
          status: this.data.programsData.status,
          chest: this.data.programsData.chest,
          createTime: db.serverDate()
        }
      }).then(res => {
        resolve(res._id)
        this.setData({
          shareId:res._id
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      }).catch(err => {
        console.error('[数据库] [新增记录] 失败：', err)
      })
    })
  },*/
  addShareInfo: function () {
    const db = wx.cloud.database()
    db.collection('shareInfos').add({
      data: {
        isnew: true,
        medicines: this.data.programsData.medicines,
        breath: this.data.programsData.breath,
        sleep: this.data.programsData.sleep,
        cough: this.data.programsData.cough,
        foot: this.data.programsData.foot,
        status: this.data.programsData.status,
        chest: this.data.programsData.chest,
        createTime: db.serverDate()
      }
    }).then(res => {
      this.setData({
        shareId: res._id,
        shareTotal: 1
      })
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      var id = res._id
      console.log(id)
      return id;
    }).catch(err => {
      console.error('[数据库] [新增记录] 失败：', err)
    })
  },
  onShareAppMessage: function (res) {
    var id=this.addShareInfo()
    console.log(id)

    var path = '/pages/share2/share?shareId=' + id
    // console.log("34")
    console.log(id)
    console.log(path)

    return {
      title: '我的评测报告',
      path: path,
      // path: '/pages/index/index',
      success: res => {
        console.log("分享成功")
      },
      fail: res => {
        console.log("分享失败:", res.errMsg)
      }
    }
    
    // var shareId = this.data.shareId
    // console.log("shareId:", shareId)

    // if (shareId) {
    //   return {
    //     title: '我的评测报告',
    //     path: '/pages/share2/share?shareId=' + shareId,
    //     success: res => {
    //       console.log(res)
    //     },
    //     fail: res => {
    //       if (res.errMsg == 'shareAppMessage:fail cancel') {
    //         console.log("用户取消转发")
    //       } else {
    //         console.log("转发失败:", res.detail.message)
    //       }
    //     }
    //   }
    // } else {
    //   console.log("没有shareid")
    // }
  },
  /*onShareAppMessage: function (res) {
    var shareId = this.data.shareId
    console.log(shareId)

    if (shareId && res.from === 'button'){
      return {
        title: '我的评测报告',
        path: '/pages/share2/share?shareId=' + shareId,
        success:res => {
          console.log(res)
        },
        fail: res => {
          if (res.errMsg == 'shareAppMessage:fail cancel'){
            console.log("用户取消转发")
          }else{
            console.log("转发失败:", res.detail.message)
          }
        }
      }
    }else{
      console.log("没有shareid")
      // return {
      //   title: '我的评测报告',
      //   path: '/pages/share2/share?openId=' + this.data.openid
      // }
    }
  },*/
})