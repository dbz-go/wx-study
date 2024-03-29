// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// const db = cloud.database()
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  const dbResult = await db.collection('todos').count()
  return {
    dbResult,
    ENV,
    OPENID,
    APPID,
  }

  // 先取出集合记录总数
  // const countResult = await db.collection('todos').count()
  // const total = countResult.total
  // // 计算需分几次取
  // const batchTimes = Math.ceil(total / 100)
  // // 承载所有读操作的 promise 的数组
  // const tasks = []
  // for (let i = 0; i < batchTimes; i++) {
  //   const promise = db.collection('todos').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  //   tasks.push(promise)
  // }
  // // 等待所有
  // return (await Promise.all(tasks)).reduce((acc, cur) => {
  //   return {
  //     dbResult: acc.data.concat(cur.data),
  //     errMsg: acc.errMsg,
  //     ENV,
  //     OPENID,
  //     APPID,
  //   }
  // })
}