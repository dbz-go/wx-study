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
    // 时间戳和openid生成一个唯一标识 用于分享和存入数据库
    // this.initShareId()
  },
  // 调用云函数得到openid
  onGetOpenid: function () {
    wx.cloud.callFunction({
      name: 'newlogin',
      data: {},
    }).then(res => {
      console.log('[云函数] [login] user openid调用成功: ', res.result.OPENID)
      
      // 时间戳和openid生成一个唯一标识 用于分享和存入数据库
      this.initShareId(res.result.OPENID)

    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
    })
  },
  initShareId: function(data){
    let timestamp = Date.parse(new Date());
    let shareId = timestamp/1000 + '' + data
    this.setData({
      shareId: shareId
    })
    console.log(this.data.shareId)
  },
  //  新增分享记录----云数据库shareInfos
  addShareInfo: function () {
    const db = wx.cloud.database()
    db.collection('shareInfos').add({
      data: {
        shareId: this.data.shareId,
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
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    }).catch(err => {
      console.error('[数据库] [新增记录] 失败：', err)
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // 7月5日起新提交发布的版本，用户从小程序中分享消息给好友时，开发者将无法获知用户是否分享完成，也无法在分享后立即获得群ID
    this.addShareInfo()
   
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮", res.target)
    } else {
      // 来自菜单栏转发按钮
      console.log(res.target)
    }
   
    return {
      title: '我的评测报告',
      path: '/pages/share2/share?shareId=' + this.data.shareId,
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          console.log("用户取消转发")
        } else {
          console.log("转发失败:", res.detail.message)
        }
      }
    }
  }
})
