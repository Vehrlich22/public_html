$(document).ready(() => {
	$("#requirements-accordion").accordion();
	generatePlan();
});

function validateSubmission() {
    let sixteen = validateSixteen();
    let elephant = validateElephant();
    let nine11 = validate911();
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
    let number = document.getElementById('sixteen');
    if (number.value == '16') {
        document.getElementById('sixteen_error').innerHTML = ' ';
        return true;
    } else {
        document.getElementById('sixteen_error').innerHTML = 'Enter the correct number';
        number.focus();
        number.select();
        return false;
    }    
}

function validateElephant() {
    let spelling = document.getElementById('elephant');
    if (spelling.value == 'elephant') {
        document.getElementById('elephant_error').innerHTML = ' ';
        return true;
    } else {
        document.getElementById('elephant_error').innerHTML = 'Enter the correct spelling';
        spelling.focus();
        spelling.select();
        return false;
    } 
}

function validate911() {
    let number = document.getElementById('911');
    if (number.value == '911') {
        document.getElementById('911_error').innerHTML = ' ';
        return true;
    } else {
        document.getElementById('911_error').innerHTML = 'Enter the correct number';
        number.focus();
        number.select();
        return false;
    } 
}

function generatePlan() {
    let plan = new Plan('project2', 2018, 'Computer Science', 'Vance Ehrlich', 'Spring');
    
    plan.addCourse('CS-1210', 'C++ Programing', 'Fall', 2015, 0);
    plan.addCourse('CS-1220', 'Obj-Orient Design/C++', 'Spring', 2016, 1);
    plan.addCourse('CS-2210', 'Data Struct Using Java', 'Fall', 2016, 2);
    plan.addCourse('EGCP-3210', 'Computer Architecture', 'Spring', 2017, 3);
    plan.addCourse('CS-3410', 'Algorithms', 'Fall', 2017, 4);
    plan.addCourse('CS-3310', 'Operating Systems', 'Fall', 2017, 5);
    plan.addCourse('EGCP-4310', 'Computer Networks', 'Fall', 2017, 6);
    plan.addCourse('CS-3220', 'Web Applications', 'Spring', 2018, 8);
    plan.addCourse('CS-3350', 'Foundtions Computer S', 'Spring', 2018, 9);
    plan.addCourse('CS-3610', 'Database Org & Design', 'Spring', 2018, 10);
    plan.addCourse('CS-4810', 'Software Engineering I', 'Fall', 2018, 11);
    plan.addCourse('CS-4820', 'Software Engineering II', 'Spring', 2019, 12);
    plan.addCourse('CS-3510', 'Compiler Theory & Prac', 'Spring', 2019, 13);
	
	plan.convertYears();
    
    let planDiv = document.getElementById('plan');
    let html = '<div class=\'header\' align=\'center\'>Academic Plan</div>';
    
    for (var key in plan.years) {
        let year = plan.years[key];
        var nextYear = 1 + parseInt(key);
		console.log(key);
		console.log(nextYear);
        html += '<div class=\'section\'>';
            html += `<div class=\'year_header\' align=\'center\'>${key} - ${nextYear}</div>`;
            
            html += '<div class=\'divider\'></div>';
            
            html += '<div class=\'terms\'>';
            
                html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Fall</div>';
                for (let key in year.fall) {
                    html += '<p>' + year.fall[key].name + '</p>';
                }
                html += '</div>';
                
                html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Summer</div>';
                for (let key in year.summer) {
                    html += '<p>' + year.summer[key].name + '</p>';                
                }
                html += '</div>';
                
                html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Spring</div>';
                for (let key in year.spring) {
                    html += '<p>' + year.spring[key].name + '</p>';                
                }
                html += '</div>';
            
            html += '</div>'; 
        html += '</div>';
    }
    
    planDiv.innerHTML = html;
    console.log('Plan Generated!');
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
    constructor(id, name, term, year) {
        this.id           = id;
        this.name         = name;
        this.term         = term;
        this.year 		  = year;
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
    
    addCourse(id, name, term, calendarYear, pos) {
        let course = new Course(id, name, term, calendarYear);
        this.courses[pos] = course;
    }
	
	convertYears() {		
		for (var key in this.courses) {
			var course = this.courses[key];
			if (course.term === 'Fall' && this.years[course.year] === undefined) {
				console.log('Year: ' + parseInt(course.year) + ' added!');
				this.years[course.year] = new Year(course.year);
			} else if (this.years[course.year - 1] === undefined) {
				this.years[course.year - 1] = new Year(course.year - 1);
			}
			
			if (course.term === 'Fall') {
				this.years[course.year].fall[this.numberOfCourses] = course;
			} else if (course.term === 'Spring') {
				this.years[course.year - 1].spring[this.numberOfCourses] = course;
			} else if (course.term === 'Summer') {
				this.years[course.year - 1].summer[this.numberOfCourses] = course;
			}
			
			this.numberOfCourses++;
		}
	}
}
