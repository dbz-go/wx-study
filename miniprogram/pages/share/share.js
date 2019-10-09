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
    this._initAboutShare();
  },
  /**
   * 用户点击右上角分享
   */
  doShare: function(){
   console.log("分享操作")
  },
  _initAboutShare:async function(){
    //得到openid
    await this.onGetOpenid()
    // 查询数据
    await this.getShareInfoNum()
    console.log("开始初始化info")
    await this.setShareInfo()
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

  //  查询分享记录----云数据库shareInfos
  getShareInfoNum: function () {
    const db = wx.cloud.database()
    db.collection('shareInfos')
      .where({
        _openid: this.data.openid
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
      .then(res => {
        console.log('[数据库] [查询记录] 成功 shareTotal: ', res.data.length, ' ,shareId: ', res.data[0]._id, res.data)
        this.setData({
          shareTotal: res.data.length,
          shareId: res.data[0]._id
        })
      })
      .catch(err => {
        console.error('[数据库] [查询记录] 失败：', err)
      })
  },
  
  /*getShareInfoNum: function () {
    const db = wx.cloud.database()
    db.collection('shareInfos').where({
      _openid: this.data.openid
    }).orderBy('createTime','desc').limit(1).get({
      success: res => {
        //成功
        console.log('[数据库] [查询记录] 成功 shareTotal: ', res.data.length, ' ,shareId: ', res.data[0]._id , res.data)
        this.setData({
          shareTotal: res.data.length,
          shareId: res.data[0]._id
        })
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },*/
  //设置分享记录----云数据库shareInfos
  setShareInfo: function () {
    
    if (this.data.hasupdate){
      console.log("近期评估报告有更新，需更新云数据库")
      //没有记录 则新添加一个数据
      if (this.data.shareTotal === 0 && this.data.shareTotal === '') {
        this.addShareInfo()
      } else{
        //如果有记录 则更新对应数据
        this.updateShareInfo()
      } 
    }else{
      console.log("近期评估报告没有更新，无需更新云数据库")
    }
  },
  //  新增分享记录----云数据库shareInfos
  addShareInfo: function () {
    const db = wx.cloud.database()
    db.collection('shareInfos').add({
      data: {
        isnew:true,
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
    }).catch(err =>{
      console.error('[数据库] [新增记录] 失败：', err)
    })
  },

  //  更新分享记录----云数据库shareInfos
  updateShareInfo: function () {
    const db = wx.cloud.database()
    db.collection('shareInfos').doc(this.data.shareId).update({
      data: {
        isnew:false,
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
      console.log('[数据库] [更新记录] 成功：', res.status.updated)
    }).catch(err => {
      console.error('[数据库] [更新记录] 失败：', err)
    })
  },
  // onShareAppMessage: function (res) {
  //   //存储数据到云数据库 shareInfos
  //   this.setShareInfo()
  //   var shareId = this.data.shareId
  //   console.log(shareId)
  //   if (shareId && res.from === 'button'){
  //     return {
  //       title: '我的评测报告',
  //       path: '/page/share?shareId=' + shareId
  //     }
  //   }else{
  //     console.log("没有shareid")
  //     return {
  //       title: '我的评测报告',
  //       path: '/page/share?shareId=' + shareId
  //     }
  //   }
  // },
})