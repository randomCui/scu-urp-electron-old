const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {curriculum_query_url, http_head} = require("./config");

class Curriculum {
    constructor(cookie) {
        this.courseList = [];
        this.cookie = cookie;
        this.totalCourseCount = 0;
    }

    async getExistingCourseCurriculum() {
        console.log(this.cookie+'; selectionBar=82022');
        await fetch(curriculum_query_url, {
            method: 'get',
            headers: {
                'Cookie': this.cookie+'; selectionBar=82022',
                'User-Agent': http_head,
            },
            body: null,
        }).then(response => {
            return response.json();
        }).then(json => {
            this.totalCourseCount = json['allUnits'];
            // console.log(json['xkxx'])
            for (let course of Object.values(json['xkxx'][0])) {
                this.courseList.push(new CurriculumClass(course))
            }
        })
        console.log(this.courseList)
    }

    updateCookie(cookie){
        this.cookie = cookie;
    }
}

class CurriculumClass {
    constructor(
        {
            'attendClassTeacher': teacher,
            'courseCategoryName': name,
            'id': {
                'coureNumber': ID,
                'coureSequenceNumber': subID
            },
            'timeAndPlaceList': {
                'executiveEducationPlanNumber': semester,
                'campusName': campus,
                classDay,
                classSessions,
                'classWeek': classWeekMask,
                continuingSession,
                classroomName,
                teachingBuildingName,
                weekDescription
            }
        }
    ) {
        this.ID = ID;
        this.subID = subID;
        this.name = name;
        this.semester = semester;
        this.teacher = teacher;
        this.campus = campus;
        this.classDay = classDay;
        this.classSessions = classSessions;
        this.classWeekMask = classWeekMask;
        this.continuingSession = continuingSession;
        this.classroomName = classroomName;
        this.teachingBuildingName = teachingBuildingName;
        this.weekDescription = weekDescription;
    }
}

module.exports = {
    Curriculum,
    CurriculumClass,
}