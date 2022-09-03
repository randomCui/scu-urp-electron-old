// 教务系统登录入口
const jwc_entry_url = 'http://zhjw.scu.edu.cn/login'
// 教务系统验证码获取
const jwc_captcha_url = 'http://zhjw.scu.edu.cn/img/captcha.jpg'
// 教务系统登录验证
const jwc_jc = 'http://zhjw.scu.edu.cn/j_spring_security_check'
// 教务系统首页
const jwc_home = 'http://zhjw.scu.edu.cn/'
// 教务系统自由选课提交接口
const course_select_submit_url = 'http://zhjw.scu.edu.cn/student/courseSelect/selectCourse/checkInputCodeAndSubmit'
// 教务系统自由选课搜索api
const course_select_search_url = "http://zhjw.scu.edu.cn/student/courseSelect/freeCourse/courseList"
// 教务系统自由选课页面
const course_select_entry_url = 'http://zhjw.scu.edu.cn/student/courseSelect/courseSelect/index'

const curriculum_query_url = 'http://zhjw.scu.edu.cn/student/courseSelect/thisSemesterCurriculum/7992K9sk3g/ajaxStudentSchedule/curr/callback'

const http_head = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1";

let JSESSIONID = '';
let isLogin = false;

module.exports = {
    jwc_entry_url,
    jwc_captcha_url,
    jwc_jc,
    jwc_home,
    course_select_submit_url,
    course_select_entry_url,
    course_select_search_url,
    http_head,
    JSESSIONID,
    isLogin,
    curriculum_query_url
}