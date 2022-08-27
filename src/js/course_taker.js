const fetch = require('node-fetch')

let http_head = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1";

const course_select_submit_url = "http://zhjw.scu.edu.cn/student/courseSelect/selectCourse/checkInputCodeAndSubmit"

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
        this.cookie = cookie
        this.interval = 1000
        this.pendingList = [new desireCourse(1, 1, 1, 1, 1, 1)]
        this.keepSeeking = true
    }

    async start() {
        while(this.keepSeeking) {
            for (let course of this.pendingList) {
                fetch(course_select_submit_url, {
                    method: 'POST',
                    headers: {
                        'Cookie': 'JSESSIONID=' + this.cookie.get('JSESSIONID'),
                        'User-Agent': http_head,
                    },
                    body: course.postPayload,
                }).then(/*do something*/)
            }
            await setTimeout(console.log,this.interval,'完成一轮选课')
        }
    }
    addCourse(course){
        this.pendingList.push(course)
    }
    delCourse(ID){
        let index = this.pendingList.findIndex((value, index) => {return value.ID === ID})
        this.pendingList.splice(index,1)
    }
}


class CourseSelector{
    searchCourse(option){

    }
}

class CourseShowContainer{

}

export {
    CourseScheduler,
    CourseSelector,
    DesiredCourse,
}