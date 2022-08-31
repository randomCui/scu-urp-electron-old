const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {course_select_submit_url, http_head} = require('./config')

class DesiredCourse {
    constructor(ID, subID, semester, name, programPlanNumber, token) {
        this.ID = ID;
        this.subID = subID;
        this.semester = semester;
        this.name = name;
        this.programPlanNumber = programPlanNumber;
        this.token = token;
        this.postPayload = this.makePost()
    }

    /***************
     * 将该课程提交需要使用的json对象返回
     ***********************
     * dealType: 选课类型 <br>
     * kcIDs: 课程编号 <br>
     * kcms: 课程名 <br>
     * fajhh: 方案计划号(?) <br>
     * sj: (开课)时间 <br>
     * searchtj: 搜索条件 <br>
     * inputcode: 意义不明 <br>
     * tokenValue: 用于选课的token <br>
     *
     * @returns {{kcIds: string, inputcode: string, fajhh, sj: string, searchtj, kclbdm: string, dealType: number, kcms: string, tokenValue}}
     */
    makePost() {
        let make_kcms = () => {
            return [this.ID, this.subID, this.semester].join('@')
        }
        return {
            'dealType': 5,
            'kcIds': this.ID + "@" + this.subID + "@" + this.semester,
            'kcms': make_kcms(),
            'fajhh': this.programPlanNumber,
            'sj': '0_0',
            'searchtj': this.name,  // 搜索条件
            'kclbdm': '',
            'inputcode': '',
            'tokenValue': this.token,
        }
    }
    addCourse(course) {

    }
}

class CourseScheduler {
    /*************
     *
     * @param cookie 我寻思教务处维持登录态应该只用这一个cookie
     */
    constructor(cookie) {
        this.cookie = cookie
        this.interval = 1000
        this.pendingList = [new DesiredCourse(1, 1, 1, 1, 1, 1)]
        this.keepSeeking = true
    }

    async start() {
        while (this.keepSeeking) {
            for (let course of this.pendingList) {
                fetch(course_select_submit_url, {
                    method: 'POST',
                    headers: {
                        'Cookie': this.cookie,
                        'User-Agent': http_head,
                    },
                    body: course.postPayload,
                }).then(/*do something*/)
            }
            await setTimeout(console.log, this.interval, '完成一轮选课')
        }
    }

    async searchCourseAlt (payload){
        const {zhjwjs_url, zhjwjs_search_url} = require('../test/test_config');
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
           return response.text();
        }).then(text =>{
            this.searchContext = JSON.parse(text)['list']['records'];
            return text;
        })
    }

    addCourse(course) {
        this.pendingList.push(course)
    }

    deleteCourse(ID) {
        let index = this.pendingList.findIndex((value, index) => {
            if(value.ID === ID)
                return index
        })
        this.pendingList.splice(index, 1)
    }

    findMatchCourse(course) {

    }
}


class CourseSelector {
    searchCourse(option) {

    }
}

class CourseShowContainer {

}

/**********
 * 检查目前是否在选课阶段
 *
 * @param cookie
 * @returns {Promise<void>}
 */

async function is_course_selection_time(cookie) {
    const {course_select_search_url} = require('../js/config')
    return fetch(course_select_search_url, {
        headers: {
            'Cookie': this.cookie,
            'User-Agent': http_head,
        },
    }).then((response) => {
        return response.text();
    }).then((text) => {
        return text.includes('自由选课');
    })
}

module.exports = {
    CourseScheduler,
    CourseSelector,
    DesiredCourse,
    is_course_selection_time,
}