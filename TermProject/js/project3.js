$(document).ready(() => {
	$.getJSON('/~gallaghd/cs3220/termProject/getCombined.php', (data) => {
		generatePlanFromExisting(data.plan);
	});
	$("#requirements-accordion").accordion();
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

function generatePlanFromExisting(p) {
	let plan = new Plan(p.name, p.student, p.major, p.catYear, p.currYear, p.currTerm, p.courses);
	
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
                    html += '<p>' + year.fall[key].id + '</p>';
                }
                html += '</div>';
				
				html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Spring</div>';
                for (let key in year.spring) {
                    html += '<p>' + year.spring[key].id + '</p>';                
                }
                html += '</div>';
                
                html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Summer</div>';
                for (let key in year.summer) {
                    html += '<p>' + year.summer[key].id + '</p>';                
                }
                html += '</div>';
            
            html += '</div>'; 
        html += '</div>';
    }
    
    planDiv.innerHTML = html;
    console.log('Plan Generated!');
}

function generatePlan() {
    let plan = new Plan('project3', 'Vance Ehrlich', 'Computer Science', 2015, 2018, 'Spring', {});
    
    plan.addCourse('CS-1210', 'Fall', 2015, 0);
    plan.addCourse('CS-1220', 'Spring', 2016, 1);
    plan.addCourse('CS-2210', 'Fall', 2016, 2);
    plan.addCourse('EGCP-3210', 'Spring', 2017, 3);
    plan.addCourse('CS-3410', 2017, 4);
    plan.addCourse('CS-3310', 'Fall', 2017, 5);
    plan.addCourse('EGCP-4310', 'Fall', 2017, 6);
    plan.addCourse('CS-3220', 'Spring', 2018, 8);
    plan.addCourse('CS-3350', 'Spring', 2018, 9);
    plan.addCourse('CS-3610', 'Spring', 2018, 10);
    plan.addCourse('CS-4810', 'Fall', 2018, 11);
    plan.addCourse('CS-4820', 'Spring', 2019, 12);
    plan.addCourse('CS-3510', 'Spring', 2019, 13);
	
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
                
                html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Spring</div>';
                for (let key in year.spring) {
                    html += '<p>' + year.spring[key].name + '</p>';                
                }
                html += '</div>';
				
				html += '<div class=\'term\'><div class=\'term_header\' align=\'center\'>Summer</div>';
                for (let key in year.summer) {
                    html += '<p>' + year.summer[key].name + '</p>';                
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
    constructor(id, term, year) {
        this.id           = id;
        this.term         = term;
        this.year 		  = year;
    }
}

class Plan {	
    constructor(name, student, major, currentYear, catalogYear, currentTerm, courses) {
        this.name            = name;
		this.student         = student;
        this.major           = major;
		this.catalogYear     = catalogYear;
        this.currentYear     = currentYear;
		this.currentTerm     = currentTerm;
        this.numberOfCourses = 0;
        this.years           = {};
        this.courses         = courses;
    }
    
    addCourse(id, name, term, calendarYear, pos) {
        let course = new Course(id, name, term, calendarYear);
        this.courses[pos] = course;
    }
	
	convertYears() {		
		for (let key in this.courses) {
			let course = this.courses[key];
			if (course.term === 'Fall' && this.years[course.year] === undefined) {
				console.log('Year: ' + parseInt(course.year) + ' added!');
				this.years[course.year] = new Year(course.year);
			} else if (course.term !== 'Fall' && this.years[course.year - 1] === undefined) {
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
