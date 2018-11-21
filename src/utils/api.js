// 封装后端接口请求相关代码
import wepy from 'wepy'

// 服务器接口地址
const host = 'http://127.0.0.1:1234/api'

// 普通请求
const request = async (options, showLoading = true) => {
  // if传入字符串转换为对象
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }

  // 显示加载中
  if (showLoading) {
    wepy.showLoading({title: '加载中'})
  }
  // 拼接请求地址
  options.url = host + '/' + options.url

  // 调用小程序的request方法
  let response = await wepy.request(options)

  if (showLoading) {
    // 隐藏加载中
    wepy.hideLoading()
  }

  // 服务器异常后给提示
  if (response.statusCode === 500) {
    wepy.showModal({
      title: '提示',
      content: '服务器错误'
    })
  }
  return response
}

// 登录
const login = async(params = {}) => {
  // 调用code
  let loginData = await wepy.login()

  // 参数中增加code
  params.code = loginData.code

  // 接口请求
  let authResponse = await request({
    url: 'weapp/authorizations',
    data: params,
    method: 'POST'
  })

  // 登录成功，就记录token信息
  if (authResponse.statusCode === 201) {
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
  }

  return authResponse
}

export default {
  request,
  login
}
