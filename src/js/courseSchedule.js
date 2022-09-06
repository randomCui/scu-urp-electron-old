const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {curriculum_query_url, http_head} = require("./config");

class Curriculum {
    constructor(cookie) {
        this.courseList = [];
        this.cookie = cookie;
        this.totalCourseCount = 0;
    }

    async getExistingCourseCurriculum() {
        await this.updateCurriculumFromJWC();
        console.log(this.courseList)
        return this.courseList
    }

    async updateCurriculumFromJWC() {
        this.courseList = [];
        await fetch(curriculum_query_url, {
            method: 'get',
            headers: {
                'Cookie': this.cookie + '; selectionBar=82022',
                'User-Agent': http_head,
            },
            body: null,
        }).then(response => {
            return response.json();
        }).then(json => {
            this.totalCourseCount = json['allUnits'];
            // console.log(json['xkxx'])
            for (let course of Object.values(json['dateList'][0]["selectCourseList"])) {
                this.courseList.push(new CurriculumClass(course))
            }
        })
    }

    updateCookie(cookie) {
        this.cookie = cookie;
    }
}

class CurriculumClass {
    constructor(
        {
            'attendClassTeacher': teacher,
            'courseCategoryName': categoryName,
            'courseName': name,
            'id': {
                'coureNumber': ID,
                'coureSequenceNumber': subID
            },
            'timeAndPlaceList': {
                '0': {
                    'executiveEducationPlanNumber': semester,
                    'campusName': campus,
                    classDay,
                    classSessions,
                    'classWeek': classWeekMask,
                    continuingSession,
                    classroomName,
                    teachingBuildingName,
                    weekDescription
                },

            }
        }
    ) {
        this.ID = ID;
        this.subID = subID;
        this.name = name;
        this.categoryName = categoryName;
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