const {curriculum_query_url} = require("./config");

class Curriculum {
    constructor(cookie) {
        this.courseList = []
    }

    getExistingCourseCurriculum() {
        fetch(curriculum_query_url,{
            headers
        })
    }
}