//index.js
//获取应用实例
var app = getApp();
var order = ['red', 'yellow', 'blue', 'green', 'red']
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast: '',
    music_flag: true,
    news_flag: true,
    todayData: [],
    tdIsNull: false,
    toView: 'red',
    scrollTop: 100,

    cores: [
      [
        { id: 'table', name: '课表', disabled: false, teacher_disabled: false, offline_disabled: false },
        { id: 'score', name: '成绩', disabled: false, teacher_disabled: true, offline_disabled: false },
        { id: 'classroom', name: '空教室', disabled: false, teacher_disabled: false, offline_disabled: true },
        { id: 'library', name: '馆藏', disabled: false, teacher_disabled: false, offline_disabled: false },
        { id: 'bus', name: '校车', disabled: false, teacher_disabled: true, offline_disabled: false },
        { id: 'sport', name: '体育', disabled: false, teacher_disabled: true, offline_disabled: false },
       
      ]
    ],
    semester: '',

    card: {
      'kb': {
        show: false,
        time_list: [
          { begin: '8:00', end: '8:45' },
          { begin: '8:55', end: '9:40' },
          { begin: '10:05', end: '10:50' },
          { begin: '11:00', end: '11:45' },
          { begin: '14:00', end: '14:45' },
          { begin: '14:55', end: '15:40' },
          { begin: '16:05', end: '16:50' },
          { begin: '17:00', end: '17:45' },
          { begin: '19:00', end: '19:45' },
          { begin: '19:55', end: '20:40' },
          { begin: '20:50', end: '21:35' },
          { begin: '21:45', end: '22:30' }
        ],
        data: {}
      },
      'kb': {
        show: true,
        nothing: true,
        data: {
          'last_time': '',
          'balance': 0,
          'cost_status': false,
          'today_cost': {
            value: [],
            total: 0
          }
        }
      },
      'ykt': {
        show: false,
        data: {
          'last_time': '',
          'balance': 0,
          'cost_status': false,
          'today_cost': {
            value: [],
            total: 0
          }
        }
      },
      'jy': {
        show: true,
        data: {}
      },
      'sdf': {
        show: false,
        data: {
          'room': '',
          'record_time': '',
          'cost': 0,
          'spend': 0
        }
      }
    },
    user: {},
    disabledItemTap: false ,//点击了不可用的页面
    oneImg:'',
    oneWord:'',
    oneWordFrom:'',
    oneDate:'',
    oneImgAuthor:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()

  },
  onLoad: function () {
    var that = this

    wx.getStorage({
      key: 'account',
      success: function (res) {
        if (res.data) {
          console.log('用户已登录')
          var account = res.data
          wx.request({
            url: 'https://guohe3.com/api/xiaoli',
            method: 'get',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              if (res.data.code == 500) {
                wx.showToast({
                  title: '教务系统异常',
                  icon: 'loading'
                })
              }
              if (res.data.code == 200) {
                var zj = 0;
                var info = res.data.info
                if (info.currentTab == '星期二') {
                  zj = 1
                }
                else if (info.currentTab == '星期三') {
                  zj = 2
                }
                else if (info.currentTab == '星期四') {
                  zj = 3
                }
                else if (info.currentTab == '星期五') {
                  zj = 4
                }
                else if (info.currentTab == '星期六') {
                  zj = 5
                }
                else if (info.currentTab == '星期日') {
                  zj = 6
                } else {
                  zj = 0
                }
                var zc = info.index
                var semester = '2017-2018-2'//默认首页是第二学期的课表
                var today_data = wx.getStorageSync("today_data")
                if (today_data) {
                  console.log('以后再说')
                } else {
                  var localData = wx.getStorageSync(semester)
                  if (localData) {
                    wx.hideNavigationBarLoading()
                    wx.stopPullDownRefresh()
                    console.log("从本地获取")
                    var data_list = [[], [], [], [], [], [], []]
                    var date = semester + '_' + (parseInt(zc - 1) + 1)
                    var _data = localData[parseInt(zc - 1)][date]//这个星期的课表数据(未转化)                               

                    //把行数据转换为列数据
                    for (var i = 0; i < _data.length; i++) {
                      for (var key in _data[i]) {
                        if (key == 'monday') {
                          data_list[0].push(_data[i][key])

                        }
                        if (key == 'tuesday') {
                          data_list[1].push(_data[i][key])
                        }
                        if (key == 'wednesday') {
                          data_list[2].push(_data[i][key])
                        }
                        if (key == 'thursday') {
                          data_list[3].push(_data[i][key])
                        }
                        if (key == 'friday') {
                          data_list[4].push(_data[i][key])
                        }
                        if (key == 'saturday') {
                          data_list[5].push(_data[i][key])
                        }
                        if (key == 'sunday') {
                          data_list[6].push(_data[i][key])
                        }
                      }
                    }

                    var today_data = data_list[zj]
                    var today_data_list = new Array()

                    for (var i = 0; i < today_data.length; i++) {
                      var temp = {}
                      if (today_data[i]) {
                        var info_list = today_data[i].split("@")
                        temp.index = (i * 2 + 1) + '-' + (i * 2 + 2)
                        temp.cnum = info_list[0]


                        if (info_list[1].length >= 20) {
                          temp.cname = info_list[1].substr(0, 20) + "..."
                        } else {
                          temp.cname = info_list[1]
                        }
                        temp.tname = info_list[2]
                        temp.address = info_list.length >= 4 ? info_list[3] : '未指定'
                      }

                      if (JSON.stringify(temp) != "{}") {
                        today_data_list.push(temp)
                      }


                    }
                    if (today_data_list.length > 0) {
                      console.log(today_data_list)
                      that.setData({
                        todayData: today_data_list,
                        tdIsNull: false
                      })

                    } else {
                      that.setData({
                        todayData: today_data_list,
                        tdIsNull: true
                      })
                    }
                  } else {
                    wx.request({
                      url: 'https://guohe3.com/api/kb',
                      method: 'POST',
                      data: {
                        username: account.username,
                        password: account.password,
                        semester: semester
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      success: function (res) {
                        if (res.data.code == 200) {
                          wx.hideNavigationBarLoading()
                          wx.stopPullDownRefresh()
                          //设置课表缓存
                          wx.setStorage({
                            key: '2017-2018-2',
                            data: res.data.info,
                          })
                          //showDataUtil(res.data.info, semester, week, today, that)
                          var data_list = [[], [], [], [], [], [], []]
                          var date = semester + '_' + (parseInt(zc - 1) + 1)
                          var _data = res.data.info[parseInt(zc - 1)][date]//这个星期的课表数据(未转化)                               

                          //把行数据转换为列数据
                          for (var i = 0; i < _data.length; i++) {
                            for (var key in _data[i]) {
                              if (key == 'monday') {
                                data_list[0].push(_data[i][key])

                              }
                              if (key == 'tuesday') {
                                data_list[1].push(_data[i][key])
                              }
                              if (key == 'wednesday') {
                                data_list[2].push(_data[i][key])
                              }
                              if (key == 'thursday') {
                                data_list[3].push(_data[i][key])
                              }
                              if (key == 'friday') {
                                data_list[4].push(_data[i][key])
                              }
                              if (key == 'saturday') {
                                data_list[5].push(_data[i][key])
                              }
                              if (key == 'sunday') {
                                data_list[6].push(_data[i][key])
                              }
                            }
                          }

                          var today_data = data_list[zj]
                          var today_data_list = new Array()

                          for (var i = 0; i < today_data.length; i++) {
                            var temp = {}
                            if (today_data[i]) {
                              var info_list = today_data[i].split("@")
                              temp.index = (i * 2 + 1) + '-' + (i * 2 + 2)
                              temp.cnum = info_list[0]

                              if (info_list[1].length >= 20) {
                                temp.cname = info_list[1].substr(0, 20) + "..."
                              } else {
                                temp.cname = info_list[1]
                              }
                              temp.tname = info_list[2]
                              temp.address = info_list.length >= 4 ? info_list[3] : '未指定'
                            }

                            if (JSON.stringify(temp) != "{}") {
                              today_data_list.push(temp)
                            }

                          }
                          if (today_data_list.length > 0) {
                            console.log(today_data_list)
                            that.setData({
                              todayData: today_data_list,
                              tdIsNull: false
                            })

                          } else {
                            that.setData({
                              todayData: today_data_list,
                              tdIsNull: true
                            })
                          }
                        }
                      }
                    })
                  }

                }
              }
            }
          })
        }
      },
      fail: function () {
        console.log("未登录")
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
    wx.request({

      url: 'https://guohe3.com/getToast',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var message = res.data.info[0]
        console.log(message)
        that.setData({
          toast: message
        })
      }

    })

    util.getOneContent(function(data){
      console.log(data);


      that.setData({
        oneImg: data.Body.img_url,
        oneWord: data.Body.word,
        oneWordFrom: data.Body.word_from,
        oneDate: data.Body.date.split(' ')[0].replace(/\-/g, "\/"),
        oneImgAuthor: data.Body.img_kind + ' | ' +data.Body.img_author
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
    var that = this
    wx.getStorage({
      key: 'music_flag',
      success: function (res) {
        that.setData({
          music_flag: res.data
        })
      },
    })
    wx.getStorage({
      key: 'news_flag',
      success: function (res) {
        console.log(res.data)
        that.setData({
          news_flag: res.data
        })
      },
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
})