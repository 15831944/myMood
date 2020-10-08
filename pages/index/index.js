var app = getApp()
const {
  allData
} = require('../data.js');
const {
  jin
} = require('../jin.js');
const jinArr = jin.split(',');
let arrays = [];
const a = require("../../utils/util.js");
for (let id = 0; id < 81; id++) {
  arrays.push(id)
}

function resetArr(arr) {
  let newArr = [];
  for (var i = arr.length + 1; i > 0;) {
    i--
    var rdm = Math.floor(Math.random() * arr.length)
    if (!newArr.includes(arr[rdm])) {
      newArr.push(arr[rdm])
    } else {
      if (newArr.length == arr.length) {
        break;
      }
      i++
    }
  }
  return newArr;
}

Page({
  data: {
    value: "",
    datas: [],
    time: '',
    name: '设置昵称',
    avatar: "",
    pickValue: 0,
    openWrap: false,
    openName: 'modal',
    nicheng: '',
    jinci: ''
  },

  onLoad: function (options) {
    const body = options.body;
    var uri = options.urls;
    const name = options.name;
    const times = options.time;
    var ok = false
    if (times) {
      var timestamp = Date.parse(new Date());
      var time = (timestamp - times) / 1000 / 60 / 60
      ok = time >= 24
      if (ok) {
        uri = ""
      }
    }
    console.log("uri is" + uri)
    console.log("body is" + body)
    console.log("name is" + name)
    console.log("time is" + time)
    if (name) {
      this.setData({
        name
      });
    }
    this.initImages(uri);
    if (body && !ok) {
      this.loadShareBody(body)
    } else {
      this.randomNumber();
      this.bindRandomText();
    }

  },
  onReady: function () {

  },
  onShow: function () {

  },
  randomDateType: function () {
    const e = new Date();
    const t = "星期" + "天一二三四五六 ".charAt(e.getDay());
    return a.formatDate2(e) + " " + t + " ";
  },
  initImages: function (uri) {
    var that = this;
    var url = "https://images.cveoy.com/images/5d54129ced504b9786970c08d66e4d6c/%E5%90%91%E4%BA%95%E8%97%8D.jpg";
    if (uri) {
      url = uri
    }
    wx.getImageInfo({
      src: url,
      success: function (res) {
        that.setData({
          avatar: res.path
        });
        app.globalData.url = res.path
        app.globalData.urls = url
      }
    })
  },
  getImages: function () {
    var that = this;
    wx.request({
      method: 'GET',
      url: "https://wx.cveoy.com/", //接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //that.setData({ avatar: res.data.url });
        that.setData({
          name: res.data.name
        });
        app.globalData.urls = res.data.url
        app.globalData.name = res.data.name
        wx.getImageInfo({
          src: res.data.url,
          success: function (res) {
            that.setData({
              avatar: res.path
            });
            app.globalData.url = res.path
          }
        })
      },
      fail: function (res) {
        console.log('cuowu' + ':' + res)
      }
    })
  },
  ViewTap: function () {
    this.getImages()
  },
  loadShareBody: function (body) {
    app.globalData.body = body
    this.setData({
      value: body
    });
  },
  randomNumber: function () {
    let data = resetArr(arrays);
    let value = data.shift();
    app.globalData.body = allData[value]
    this.setData({
      datas: data,
      value: allData[value]
    });
  },
  randomText: function () {
    var e = a.randomNum(0, s.length - 1);
    return s[e];
  },
  bindRandomText: function (e) {
    this.setData({
      time: this.randomDateType()
    });
  },
  randeNext: function () {
    const {
      datas
    } = this.data;
    wx.showLoading({
      title: "正在生成中..."
    });
    var that = this;
    wx.request({
      method: 'GET',
      url: "https://wx.cveoy.com/", //接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        setTimeout(() => {
          app.globalData.body = res.data.body
          that.setData({
            value: res.data.body
          }, () => wx.hideLoading());
        }, 400)
      },
      fail: function (res) {
        console.log('cuowu' + ':' + res)
        let newZuan = [];
        if (datas.length) {
          newZuan = datas;
        } else {
          newZuan = resetArr(arrays);
        }
        setTimeout(() => {
          let value = newZuan.shift();
          app.globalData.body = allDataall[value]
          that.setData({
            datas : newZuan,
            value: allDataall[value]
          }, () => wx.hideLoading());
        }, 400)

      }
    })
  },
  copy: function () {
    const {
      value,
      time
    } = this.data;
    wx.setClipboardData({
      data: `${time} ${value}`,
      success(res) {
        wx.showToast({
          title: "复制成功!"
        });
      }
    })
  },
  openAD: function () {
    const {
      name
    } = this.data;
    if (name === '设置昵称') {
      return wx.showToast({
        title: "请设置昵称",
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
        icon: "none"
      });
    }

    this.createCard();
  },
  createCard: function () {
    const {
      value,
      name,
      avatar,
      time
    } = this.data;
    var isOk = true;

    if (name === '设置昵称') {
      return wx.showToast({
        title: "请设置昵称",
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
        icon: "none"
      });
    }

    wx.showLoading({
      title: "内容检测中..."
    });

    if (isOk) {
      app.globalData.result = {
        value,
        name,
        avatar,
        time
      }
      wx.setStorageSync('avatar', avatar);
      this.setData({
        jinci: ''
      }, () => {
        wx.navigateTo({
          url: '/pages/result/index'
        });
      })
    } else {
      wx.showModal({
        title: "检测到有违禁词",
        content: `当前检测到违禁词 ${this.data.jinci},请更新后再提交`
      })
    }

    wx.hideLoading();
  },
  inputFn: function (e) {
    const {
      value
    } = e.detail;
    this.setData({
      value
    });
  },
  changeName: function () {
    this.setData({
      openWrap: true,
      openName: "modal open"
    });
  },
  close: function () {
    this.setData({
      openName: "modal",
      openWrap: false
    });
  },
  nichengInput: function (e) {
    const {
      value
    } = e.detail;
    this.setData({
      nicheng: value
    });
  },
  cName: function () {
    const {
      nicheng
    } = this.data;
    const that = this;

    if (!nicheng.trim()) {
      return wx.showToast({
        title: '昵称不能为空!',
        icon: "none"
      });
    }

    wx.showLoading({
      duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
      title: "昵称检测中..."
    });

    wx.request({
      method: 'GET',
      url: "https://wx.cveoy.com/check/?name=" + nicheng, //接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == "合规") {
          wx.showToast({
            title: "设置成功!"
          });
          that.setData({
            jinci: '',
            openName: "modal",
            openWrap: false,
            name: nicheng
          });
          app.globalData.name = nicheng
          wx.setStorageSync('name', nicheng);
        } else {
          wx.showModal({
            title: "检测到有违禁词",
            content: `当前检测到违禁词 ${that.data.jinci},请更新后再提交`
          })
        }
      },
      fail: function (res) {
        console.log('cuowu' + ':' + res)
      }
    })
    wx.hideLoading()
  },
  //好友
  onShareAppMessage: function (e) {
    const {
      name
    } = this.data;
    if (name === '设置昵称') {
      return wx.showToast({
        title: "请设置昵称",
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
        icon: "none"
      });
    } else {
      return {
        title: app.globalData.title,
        path: "/pages/index/index?" + "body=" + app.globalData.body + "&urls=" + app.globalData.urls + "&name=" + app.globalData.name + "&time=" + Date.parse(new Date()),
        imageUrl: app.globalData.url
      };
    }
  },
  //朋友圈
  onShareTimeline: function (e) {
    const {
      name
    } = this.data;
    if (name === '设置昵称') {
      return wx.showToast({
        title: "请设置昵称",
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
        icon: "none"
      });
    } else {
      return {
        title: app.globalData.title,
        path: "/pages/index/index?" + "body=" + app.globalData.body + "&urls=" + app.globalData.urls + "&name=" + app.globalData.name + "&time=" + Date.parse(new Date()),
        imageUrl: app.globalData.url
      };
    }
  },

})