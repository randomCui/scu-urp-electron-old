const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {course_select_submit_url, http_head} = require('./config')

class DesiredCourse {
    constructor(ID, subID, semester, name, programPlanNumber, token, teacher) {
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
}

class CourseScheduler {
    /*************
     *
     * @param cookie 我寻思教务处维持登录态应该只用这一个cookie
     */
    constructor(cookie) {
        this.cookie = cookie;
        this.interval = 1000;
        this.pendingList = [];
        this.keepSeeking = true;
        this.searchContext = [];
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
            setTimeout(console.log, this.interval, '完成一轮选课')
        }
    }

    async searchCourseAlt(payload) {
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
        }).then(text => {
            this.searchContext = JSON.parse(text)['list']['records'];
            return text;
        })
    }

    addCourse(course) {
        let matchingCourse = this.findMatchingCourse(course);
        // console.log(matchingCourse);
        if (!matchingCourse) {
            return {
                'code': -2,
                'message': '未在搜索结果中找到对应课程:' + course['kcm']
            }
        }
        if (this.isDuplicatedCourse(matchingCourse) !== -1) {
            return {
                'code': -1,
                'message': course['kcm'] + '已存在重复课程，添加失败'
            }
        }
        this.pendingList.push(new DesiredCourse(
            course['kch'],
            course['kxh'],
            course['zxjxjhh'],
            course['kcm'],
            course['fajhh'],
            course['token'],
        ));
        return {
            'code': 1,
            'message': course['kcm'] + '已成功添加'
        }
    }

    deleteCourse(course) {
        let index = this.findMatchingCourseIndex(course);
        console.log(index);
        this.pendingList.splice(index, 1);
        console.log(this.pendingList)
    }

    findMatchingCourse(course) {
        // 应该是要从searchContext里面找到课程
        return this.searchContext.find((oriCourseInfo) => {
            let flag = true;
            for (let [key, value] of Object.entries(course)) {
                if (value !== oriCourseInfo[key])
                    flag = false;
            }
            return flag
        })
    }

    findMatchingCourseIndex(course) {
        return this.pendingList.findIndex((storedCourse) => {
            let flag = true;
            for (let [key, value] of Object.entries(course)) {
                if (value !== storedCourse[key])
                    flag = false;
            }
            return flag
        })
    }

    isDuplicatedCourse(course) {
        return this.findMatchingCourseIndex(course);
    }

    updateCookie(cookie) {
        this.cookie = cookie;
    }

    getPendingListJson() {
        let translateMap = new Map(
            Object.entries({
                'ID': 'kch',
                'subID': 'kxh',
                'semester': 'zxjxjhh',
                'name': 'kcm',
            })
        );
        let jsonList = []
        this.pendingList.forEach(course=>{
            let json = {};
            for(let [key,value] of Object.entries(course)){
                if (key === 'postPayload')
                    continue;
                let newKey = translateMap.get(key) || key;
                json[newKey] = value;
            }
            jsonList.push(json)
        })
        return jsonList;
    }
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
    DesiredCourse,
    is_course_selection_time,
}