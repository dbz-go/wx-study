// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({
  env: 'test-zduag'
})
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('todos').add({
      data: {
        description:"learn cloud add database",
        due: new Date("2019-09-30"),
        tags: [
          'cloud',
          'database',
          'add'
        ],
        location: new db.Geo.Point(113,23),
        done: false
      }
    })

  } catch(e) {
    console.error(e)
  }
}