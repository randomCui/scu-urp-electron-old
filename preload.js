// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

const {contextBridge, ipcRenderer} = require('electron')

let indexBridge = {
    init_urp_login: async () => {
        return await ipcRenderer.invoke('init_urp_login')
    },
    urp_login: async (studentID, password, captcha) => {
        let post_data = {
            "j_username": studentID,
            "j_password": password,
            "j_captcha": captcha,
        }
        return await ipcRenderer.invoke('urp_login', post_data).then(result => {
            return result;
        })
    },
    check_login_state: async () => {
        return await ipcRenderer.invoke('check_login_state',);
    },
    rememberPassword: (studentID, password) => {
        ipcRenderer.send('rememberPassword', studentID, password);
    },
    readLoginInfo: async () => {
        return await ipcRenderer.invoke('readLoginInfo');
    }
}

let autoTakerBridge = {
    /******
     * 通过给定的字符串搜索符合条件的课程
     *
     * @param conditionMap 保存条件和值的Map对象
     * @param searchMode comprehensive->综合搜索  split->分条目搜索
     */
    searchCourse: async (conditionMap, searchMode) => {
        if (searchMode === 'comprehensive') {
            let search_string = '';
            conditionMap.forEach((value) => {
                search_string += value + ' '
            });
            let searchPayload = {
                "searchtj": search_string,
                "xq": 0,
                "jc": 0,
                "kclbdm": ""
            }
            return await ipcRenderer.invoke('search_course', searchPayload);
        } else if (searchMode === 'split') {
            let searchPayload = {
                'zxjxjhh': '2022-2023-1-1',
                'kch': '',
                'kcm': conditionMap.get('comprehensive-search'),
                'js': '',
                'kkxs': '',
                'skxq': '',
                'sjhc': '',
                'xq': '',
                'jxl': '',
                'jas': '',
                'pageNum': 1,
                'pageSize': 1000000,
                'kclb': '',
            }
            // console.log(response)
            return await ipcRenderer.invoke('search_course_alt', searchPayload)
        }
    },
    is_course_selection_time: async () => {
        return await ipcRenderer.invoke('is_course_selection_time')
    },
    addSelectedCourses: async (course) => {
        // console.log(course);
        // 传递包含课程对象的列表
        ipcRenderer.send('addSelectedCourses', course);
    },
    /********
     * 添加指定的课程到课表中
     * @param jsonString 保存了课程号(ID)，课序号(subID)，学期(semester)，授课教师(teacher)的Json字符串
     * @returns {Promise<void>} 指示每个课程操作状态的Json对象字符串
     */
    addCourse: async (jsonString) => {
        return ipcRenderer.invoke('addCourse', jsonString).then((operationStatus) => {
            // console.log(operationStatus)
            return operationStatus;
        })
    },
    /**********
     * 从待选课列表中删除指定课程
     * @param jsonString 保存了课程号(ID)，课序号(subID)，学期(semester)，授课教师(teacher)的Json字符串
     * @returns {Promise<void>} 指示每个课程操作状态的Json对象字符串
     */
    deleteCourse: async (jsonString) => {
        ipcRenderer.invoke('deleteCourse', jsonString).then((operationStatus) => {
            return operationStatus;
        })
    },
    /*********
     * 在node环境中初始化一个CourseScheduler实例
     */
    initCourseSelection: () => {
        ipcRenderer.send('initCourseSelection');
    },
    getExistingCurriculum: async () => {
        return ipcRenderer.invoke('getExistingCurriculum').then(jsonString => {
            return jsonString;
        })
    }
}

let courseControlBridge = {
    getPendingList: () => {
        return ipcRenderer.invoke('getPendingList').then(pendingListJsonString => {
            return pendingListJsonString;
        })
    },
    startAll: () => {
        ipcRenderer.send('startAll');
    },
    stopAll: () => {
        ipcRenderer.send('stopAll');
    },
    changeInterval: (courseInfo, interval) => {
        ipcRenderer.send('changeInterval', JSON.stringify(courseInfo), JSON.stringify(interval));
    }
}


contextBridge.exposeInMainWorld("indexBridge", indexBridge);
contextBridge.exposeInMainWorld('autoTakerBridge', autoTakerBridge);
contextBridge.exposeInMainWorld('courseControlBridge', courseControlBridge);