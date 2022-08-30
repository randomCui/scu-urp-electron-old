// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');

let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            sandbox: false,
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('./src/pages/index/index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const {ipcMain} = require('electron');
const {jwc_entry_url, jwc_jc, jwc_captcha_url, jwc_home, http_head} = require('./src/js/config');
let {JSESSIONID, isLogin} = require('./src/js/config')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

ipcMain.handle('init_urp_login', async () => {
    // electron的ipc不能直接返回blob,因此这里返回arrayBuffer后再在渲染进程中组装成blob
    return await fetch(jwc_entry_url, {
        headers: {
            'User-Agent': http_head,
        },
    }).then(response => {
        // console.log(response)
        console.log(response.headers.get('set-cookie').split(';')[0])
        return response.headers.get('set-cookie').split(';')[0];  // eslint-disable-line
    }).then(cookie => {
        JSESSIONID = cookie
        return fetch(jwc_captcha_url, {
            headers: {
                'Cookie': cookie,
                'User-Agent': http_head,
            },
        })
    }).then(response => {
        console.log('获取验证码成功')
        return response.arrayBuffer()
    })
})

ipcMain.on('urp_login', async (event, post_data) => {
    const md5 = require('md5')
    post_data['j_password'] = md5(post_data['j_password'])
    console.log(post_data)
    console.log(JSESSIONID)
    fetch(jwc_jc, {
        method: 'POST',
        headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cookie': JSESSIONID,
            'User-Agent': http_head,
        },
        body: new URLSearchParams(post_data),
    }).then((response) => {
        console.log(response.url);
        if (response.url === jwc_home) {
            console.log('登陆成功');
            isLogin = true;
        } else {
            let url = new URL(response.url);
            let errorCode = url.searchParams.get('errorCode');
            console.log('登陆失败' + errorCode)
        }
    })
})

ipcMain.handle('check_login_state', () => {
    return isLogin
})

ipcMain.handle('search_course', (event, payload) => {
    const {course_select_search_url} = require('./src/js/config');
    // 获取到课程详细信息
    return fetch(course_select_search_url, {
        method: 'POST',
        headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cookie': JSESSIONID,
            'User-Agent': http_head,
        },
        body: payload,
    }).then(response => {
        return response.text()
    }).then(text => {
        let totalResponse = JSON.parse(text)
        let courseList = JSON.parse(totalResponse['rwRxkZlList'])
        return courseList
    });
})

ipcMain.handle('search_course_alt', async (event, payload) => {
    const {zhjwjs_url, zhjwjs_search_url} = require('./test/test_config');
    return await fetch(zhjwjs_url).then(response => {
        return response.headers.get('set-cookie').split(';')[0];
    }).then(cookie => {
        return fetch(zhjwjs_search_url, {
            method: 'POST',
            headers: {
                'User-Agent': http_head,
                'cookie': cookie,
            },
            body: new URLSearchParams(payload),
        })
    }).then(response => {
        // console.log(response)
        return response.text()
    })
})

ipcMain.handle('is_course_selection_time', async () => {
    const {is_course_selection_time} = require('./src/js/course_taker')
    return await is_course_selection_time(JSESSIONID)
})

const {DesiredCourse} = require('src/js/course_taker')
ipcMain.on('addSelectedCourses',(event,courses)=>{
    let courseSet = new Set()
    for(let course of courses){
        let temp = new DesiredCourse(
            course['kch'],
            course['kxh'],
            course['zxjxjhh'],
            course['kcm'],
            course['fajhh'],
            // course['token'],   测试服务器里面没有返回这个信息
        )
    }
})