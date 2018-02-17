/*
buildYears() {
	this.years = this.initializeEmptyYearsStructure();
	
	let skipToNextCourse;
	for (let course of this.courses) {
		skipToNextCourse = false;
		for (let year of this.years) {
			if (course.year === year.year && course.term === this.TERM_NAMES.FALL) {
				this.addCourseToYearDuringTerm(course, year, this.TERM_NAMES.FALL);
				skipToNextCourse = true;
			} else if (course.year - 1 === year.year) {
				if (course.term === this.TERM_NAMES.SPRING) {
					this.addCourseToYearDuringTerm(course, year, this.TERM_NAMES.SPRING);
					skipToNextCourse = true;
				} else if (course.term === this.TERM_NAMES.SUMMER) {
					this.addCourseToYearDuringTerm(course, year, this.TERM_NAMES.SUMMER);
					skipToNextCourse = true;
				}
			}
			
			if (skipToNextCourse) {
				break;
			}
		}
	}
}
*/

function validateSubmission() {
    var sixteen = validateSixteen();
    var elephant = validateElephant();
    var nine11 = validate911();
    if (!sixteen) {
        document.getElementById('sixteen').focus();
        document.getElementById('sixteen').select();
    } else if (!elephant) {
        document.getElementById('elephant').focus();
        document.getElementById('elephant').select();
    } else if (!nine11) {
        document.getElementById('911').focus();
        document.getElementById('911').select();
    }
}

function validateSixteen() {
    var number = document.getElementById('sixteen');
    if (number.value == '16') {
        document.getElementById('sixteen_error').innerHTML = " ";
        return true;
    } else {
        document.getElementById('sixteen_error').innerHTML = "Enter the correct number";
        number.focus();
        number.select();
        return false;
    }    
}

function validateElephant() {
    var spelling = document.getElementById('elephant');
    if (spelling.value == 'elephant') {
        document.getElementById('elephant_error').innerHTML = " ";
        return true;
    } else {
        document.getElementById('elephant_error').innerHTML = "Enter the correct spelling";
        spelling.focus();
        spelling.select();
        return false;
    } 
}

function validate911() {
    var number = document.getElementById('911');
    if (number.value == '911') {
        document.getElementById('911_error').innerHTML = " ";
        return true;
    } else {
        document.getElementById('911_error').innerHTML = "Enter the correct number";
        number.focus();
        number.select();
        return false;
    } 
}

function generatePlan() {
    var plan = new Plan("project2", 2018, "Computer Science", "Vance Ehrlich", "sp");
    
    plan.addCourse("CS-1210", "C++ Programing", "fa", 2015);
    plan.addCourse("CS-1220", "Obj-Orient Design/C++", "sp", 2015);
    plan.addCourse("CS-2210", "Data Struct Using Java", "fa", 2016);
    plan.addCourse("EGCP-3210", "Computer Architecture", "sp", 2016);
    plan.addCourse("CS-3410", "Algorithms", "fa", 2017);
    plan.addCourse("CS-3310", "Operating Systems", "fa", 2017);
    plan.addCourse("EGCP-4310", "Computer Networks", "fa", 2017);
    plan.addCourse("CS-3220", "Web Applications", "sp", 2017);
    plan.addCourse("CS-3350", "Foundtions Computer S", "sp", 2017);
    plan.addCourse("CS-3610", "Database Org & Design", "sp", 2017);
    plan.addCourse("CS-4810", "Software Engineering I", "fa", 2018);
    plan.addCourse("CS-4820", "Software Engineering II", "sp", 2018);
    plan.addCourse("CS-3510", "Compiler Theory & Prac", "sp", 2018);
    
    var planDiv = document.getElementById('plan');
    var html = "<div class=\"header\" align=\"center\">Academic Plan</div>";
    
    for (var key in plan.years) {
        var year = plan.years[key];
        var nextYear= 1 + parseInt(key);
        html += "<div class=\"section\">";
            html += `<div class=\"year_header\" align=\"center\">${key} - ${nextYear}</div>`;
            
            html += "<div class=\"divider\"></div>";
            
            html += "<div class=\"semesters\">";
            
                html += "<div class=\"semester\"><div class=\"semester_header\" align=\"center\">Fall</div>";
                for (var key in year.fall) {
                    html += "<p>" + year.fall[key].name + "</p>";
                }
                html += "</div>";
                
                html += "<div class=\"semester\"><div class=\"semester_header\" align=\"center\">Summer</div>";
                for (var key in year.summer) {
                    html += "<p>" + year.summer[key].name + "</p>";                
                }
                html += "</div>";
                
                html += "<div class=\"semester\"><div class=\"semester_header\" align=\"center\">Spring</div>";
                for (var key in year.spring) {
                    html += "<p>" + year.spring[key].name + "</p>";                
                }
                html += "</div>";
            
            html += "</div>"; 
        html += "</div>";
    }
    
    planDiv.innerHTML = html;
    console.log("Plan Generated!");
}

class Year {
    constructor(calendarYear) {
        this.calendarYear  = calendarYear;
        this.spring        = {};
        this.summer        = {};
        this.fall          = {};
    }
}

class Course {
    constructor(id, name, semester, calendarYear) {
        this.id           = id;
        this.name         = name;
        this.semester     = semester;
        this.calendarYear = calendarYear;
    }
}

class Plan {
    constructor(planName, catalogYear, major, studentName, currentSemester) {
        this.name            = planName;
        this.catalogYear     = catalogYear;
        this.major           = major;
        this.studentName     = studentName;
        this.currentSemester = currentSemester;
        this.numberOfCourses = 0;
        this.years           = {};
        this.courses         = {};
    }
    
    addCourse(id, name, semester, calendarYear) {
        var course = new Course(id, name, semester, calendarYear);
        this.courses[this.numberOfCourses] = course;
        
        if (this.years[calendarYear] == undefined) {
            this.years[calendarYear] = new Year(calendarYear);
        }
        
        if (semester == "sp") {
            this.years[calendarYear].spring[this.numberOfCourses] = course;
        } else if (semester == "su") {
            this.years[calendarYear].summer[this.numberOfCourses] = course;
        } else if (semester == "fa") {
            this.years[calendarYear].fall[this.numberOfCourses] = course;
        }
        this.numberOfCourses += 1;
    }
}
