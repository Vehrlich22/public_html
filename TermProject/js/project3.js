var catalog;
var plan = 'myplan';

$(document).ready(() => {
	doSetupStuff();
});

function doSetupStuff() {
	// TODO: Change this path to pull from Dr. G's endpoint
	$.getJSON('getCombined.txt', data => {
		this.catalog = data.catalog;
		this.plan = data.plan;
		
		generatePlanFromExisting(this.plan);
		setupRequirementsAccordion();
	});
}

function setupRequirementsAccordion() {
	$.getJSON('requirements.txt', data => {
		let categories = data.categories;
		let html = '';
		
		// TODO: Build this as an unordered list
		//       and get course info from catalog.
		for (let key in categories) {
			let category = categories[key];
			html += `<h3>${key}</h3>`;
			html += '<div><ul>';
			for (let course of category.courses) {
				let courseInfo = getInformationForCourse(course);
				if (courseInfo !== undefined) {
					html += `<li>${courseInfo.id} ${courseInfo.name}</li>`;
				}
			}
			html += '</ul></div>';
		}
		
		html += '</ul>';
		
		let requirementAccordion = $('#requirements-accordion');
		requirementAccordion.append(html);
		requirementAccordion.accordion();
		
	});
}

function generatePlanFromExisting(p) {
	let plan = new Plan(p.name, p.student, p.major, p.catYear, p.currYear, p.currTerm, p.courses);
	
	plan.convertYears();
    
    let planDiv = document.getElementById('plan');
    let html = '<div class=\'header\' align=\'center\'>Academic Plan</div>';
    
    for (var key in plan.years) {
        let year = plan.years[key];
        var nextYear = 1 + parseInt(key);
        html += '<div class=\'section\'>';
            html += `<div class=\'year_header\' align=\'center\'>${key} - ${nextYear}</div>`;
            
            html += '<div class=\'divider\'></div>';
            
            html += '<div class=\'terms\'>';
			
			let terms = [year.fall, year.spring, year.summer];
			let termNames = ['Fall', 'Spring', 'Summer'];
			
			for (let i = 0; i < terms.length; i++) {
				html += `<div class=\'term\'><div class=\'term_header\' align=\'center\'>${termNames[i]}</div>`;
				let currentTerm = terms[i];
				for (let course in currentTerm) {
					let courseInfo = getInformationForCourse(currentTerm[course].id);
					html += '<p>' + courseInfo.id + ' ' + courseInfo.name + '</p>';
				}
				html += '</div>';
			}
            
            html += '</div>'; 
        html += '</div>';
    }
    
    planDiv.innerHTML = html;
}

function getInformationForCourse(courseId) {
	let course = this.catalog.courses[courseId];
	return course;
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
