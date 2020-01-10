
import Loadable from 'react-loadable'
import loading from '@/views/layout/loading'

//设置根元素字体
const setHtmlFonts = () => {
   var deviceWidth = document.documentElement.clientWidth || document.body.clientWidth;
   if (deviceWidth > 750) deviceWidth = 750;
   document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px';
}

//展开注册路由
const extendRoutes = (routesArray, parent = '', routes = []) => {
   for (var i in routesArray) {
      let parentPath = ""
      if (routesArray[i].children) {
         parentPath += routesArray[i].path
         extendRoutes(routesArray[i].children, parentPath, routes)
      }
      routes.push({
         path: parent + routesArray[i].path,
         component: routesArray[i].component
      })
   }
   return routes
}

const base64ToArrayBuffer = (base64) => {
   var binary_string = window.atob(base64);
   var len = binary_string.length;
   var bytes = new Uint8Array(len);
   for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
   }
   return bytes.buffer;
}

const parseScatter = (dataList) => {
   let data = []
   if (dataList instanceof Uint8Array) {
      for (let i = 0; i < dataList.length; i++) {
         let value = dataList[i];
         if (value !== 0) {
            let valueStr = value.toString(2)
            for (let j = 0; j < valueStr.length; j++) {
               if (valueStr.charAt(j) === '1') {
                  let index = i * 8 + j
                  data.push({ x: parseInt(index / 200) * 10, y: index % 200 * 10 })
               }
            }
         }
      }
   }
   return data;
}


/**
 * 判断是否是微信浏览器打开
 */
const isWeiXin = () => {
   var ua = window.navigator.userAgent.toLowerCase();
   if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      return true;
   } else {
      return false;
   }
}



/**
* 获取queryString*
*/
const queryUrlParam = (str, name) => {
   var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
   if (str.indexOf('?') >= 0) {
      var r = str.split("?")[1].match(reg);
      if (r != null) return (r[2]);
      return null;
   }
   return null;
}

/**
 * 获取queryString
 * @param {*} name 
 */
const getQueryString = (name, search) => {
   if (search.indexOf('?') !== 0) {
      search = '?' + search
   }
   var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
   var r = search.substr(1).match(reg);
   if (r != null) return (r[2]);
   return '';
}
/**
 * 本地储存
 * @param {*} key 
 * @param {*} value 
 */
const setLocal = (key, value) => {
   return window.localStorage.setItem(key, value)
}

/**
 * 获取本地储存
 * @param {*} key 
 */
const getLocal = (key) => {
   return window.localStorage.getItem(key)
}

const setSessLocal = (key, value) => {
   window.sessionStorage.setItem(key, value);
}

const getSessLocal = (key) => {
   window.sessionStorage.getItem(key);
}


/**
 * 移除某个本地储存
 * @param {*} key 
 */
const removeLocal = (key) => {
   return window.localStorage.removeItem(key)
}


/**
 * 判断是否app内嵌页面
 */
const isAppWebview = () => {
   return window.HybridJSInterface
}


/**
 * 跳转
 * @param {*} url 路径
 */
const gotoPage = (url, {
   replace = false,
   back,
   jumpType = 'navigateTo'
} = {}) => {
   const wx = window.wx;
   if (wx) {
      if(jumpType==='navigateBack'){
         wx.miniProgram[jumpType]()
      }else{
         wx.miniProgram[jumpType]({
            url
         })
      }
   } else {
      url = window.location.pathname + '#/' + url;
      if (isAppWebview() || replace) {
         //app内嵌页面
         window.location.replace(url)
      } else {
         window.location.href = url
      }
   }
}



/**
 * 静态资源图片路径
 */
const filterIconPath = (iconName) => {
   return window.location.origin + window.location.pathname + 'static/images/' + iconName + '.png'
}



/**
 * 获取大写字母A-Z
 */
const upperCaseChars = () => {
   var str = [];
   for (var i = 65; i < 91; i++) {
      str.push(String.fromCharCode(i));
   }
   return str;
}


/**
 * 验证手机号码
 * @param {*} phone 手机号码
 */
const checkPhone = (phone) => {
   if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return false;
   }
   return true
}

const filterNum = (val) => {
   return parseInt(window.innerWidth * val / 750)
}

/**
 * 根据URL信息切换当前环境
 */
function checkEnv() {
   var mHost = window.location.hostname
   return {
      "cdn.lifesense.com": "online",
      "doctor.lifesense.com": "online"
   }[mHost] || 'dev'
}


function countDown([start, end], cb) {
   let count = start
   let timer = null
   function countDown() {
      if (count > end) {
         count = count - 1
         cb && cb(count,timer)
      } else {
         clearInterval(timer)
      }
   }
   timer = setInterval(countDown, 1000);
}



function _loadable(loader) {
   return Loadable({
      loader,
      loading
   });
}

export {
   setHtmlFonts,
   extendRoutes,
   base64ToArrayBuffer,
   parseScatter,
   isWeiXin,
   isAppWebview,
   getQueryString,
   setLocal,
   getLocal,
   getSessLocal,
   setSessLocal,
   removeLocal,
   queryUrlParam,
   gotoPage,
   filterIconPath,
   upperCaseChars,
   checkPhone,
   filterNum,
   checkEnv,
   countDown,
   _loadable
}