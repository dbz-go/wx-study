// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database({
  env: 'test-zduag'
})
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('todos').where({
      done: false
    })
    .update({
      data: {
        progress: _.inc(10)
      }
    })
  } catch(e){
    console.log(e)
  }
}