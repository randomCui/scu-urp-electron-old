const jwc_entry_url = 'http://zhjw.scu.edu.cn/login'
const jwc_captcha_url = 'http://zhjw.scu.edu.cn/img/captcha.jpg'
const jwc_jc = 'http://zhjw.scu.edu.cn/j_spring_security_check'
const jwc_home = 'http://zhjw.scu.edu.cn/'
const course_select_submit_url = 'http://zhjw.scu.edu.cn/student/courseSelect/selectCourse/checkInputCodeAndSubmit'
// 自由选课
const course_select_search_url = 'http://zhjw.scu.edu.cn/student/courseSelect/courseSelect/index'

const http_head = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1";

let JSESSIONID = ''
let is_login = false

module.exports = {
    jwc_entry_url,
    jwc_captcha_url,
    jwc_jc,
    jwc_home,
    course_select_submit_url,
    course_select_search_url,
    http_head,

    JSESSIONID,
    is_login
}