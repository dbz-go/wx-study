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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:", options)
    
    if (options.shareId ){
      this.setData({
        shareId: options.shareId
      })
      this.getShareInfoByShareId(options.shareId)
    }else{
      console.log("参数缺失")
    }
  },
  //  查询分享记录----云数据库shareInfos
  getShareInfoByShareId: function (shareId) {
    const db = wx.cloud.database()
    db.collection('shareInfos')
      .where({
        shareId: shareId
      })
      .get()
      .then(res => {
        console.log('[数据库] [查询记录] 成功 :', res.data)
        const programsData={
          'date': ['9月15日', '9月16日', '9月17日', '9月18日', '9月19日', '9月20日', '今天'],
          'medicines': res.data[0].medicines,
          'breath': res.data[0].breath,
          'sleep': res.data[0].sleep,
          'cough': res.data[0].cough,
          'foot': res.data[0].foot,
          'status': res.data[0].status,
          'chest': res.data[0].chest,
        }
        this.setData({
          programsData: programsData,
          creaT:res.data[0].createTime,
          shareId: res.data[0].shareId,
          _id: res.data[0]._id,
        })
      })
      .catch(err => {
        console.error('[数据库] [查询记录] 失败：', err)
      })
  },
 
})