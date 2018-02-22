var catalog;
var plan = 'myplan';
var searchResults;
var allCourses;

$(document).ready(() => {
	doSetupStuff();
});

function doSetupStuff() {
	$('#search-table').DataTable();
	
	$.getJSON('/~gallaghd/cs3220/termProject/getCombined.php', data => {
		this.catalog = data.catalog;
		this.plan = data.plan;
		
		generatePlanFromExisting(this.plan);
		setupRequirementsAccordion();
		setupSearchAutocomplete();
	});
	
	var request = new XMLHttpRequest();
	request.open('GET', '/~gallaghd/ymm/ymmdb.php?fmt=json', true);
	request.onreadystatechange = () => {
	    if (request.readyState === 4) {
	        let years = JSON.parse(request.responseText);
	        let html = '';
	        for (let year of years) {
	            html += '<option>' + year + '</option>';
	        }
	        $('#kbb-year').html(html);
	    }
	};
	request.send(null);
	
	$('#kbb-year').change(event => {
	    let requestUrl = '/~gallaghd/ymm/ymmdb.php?fmt=json&year=' + event.target.value;
	    request.open('GET', requestUrl, true);
	    request.onreadystatechange = () => {
	        if (request.readyState === 4) {
	            let makes = JSON.parse(request.responseText);
	            let html = '';
	            for (let make of makes) {
	                html += '<option value="' + make.id + '">' + make.name + '</option>';
	            }
	            $('#kbb-make').html(html);
	        }
	    }
	    request.send(null);
	});
	
	$('#kbb-make').change(event => {
	    let requestUrl = '/~gallaghd/ymm/ymmdb.php?fmt=json&year=' + $('#kbb-year').val() + '&make=' + event.target.value;
	    console.log(requestUrl);
	    request.open('GET', requestUrl, true);
	    request.onreadystatechange = () => {
	        if (request.readyState === 4) {
	            let models = JSON.parse(request.responseText);
	            let html = '';
	            for (let model of models) {
	                html += '<option>' + model.name + '</option>';
	            }
	            $('#kbb-model').html(html);
	        }
	    }
	    request.send(null);
	});
}

function setupSearchAutocomplete() {
	allCourses = [];
	for (let courseKey in this.catalog.courses) {
		let course = this.catalog.courses[courseKey];
		allCourses.push(course);
	}
	
	$('#course-search').on('change paste keyup', event => {
		// Credit to https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
		// for awesome escaping bit.
		let escapedText = event.target.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		let searchCriteria = new RegExp(escapedText, 'i', 'u');
		searchResults = $.grep(allCourses, course => {
			return (course.id.search(searchCriteria) != -1) || (course.name.search(searchCriteria) != -1);
		});
		
		updateSearchResults();
	});
}

function updateSearchResults() {
	let html = '';
	for (let course of searchResults) {
		html += '<div>';
		html += makeDivWithContent(course.id);
		html += makeDivWithContent(course.name);
		html += makeDivWithContent(course.credits);
		html += '</div>';
	}
	console.log(html);
	$('#search-results').html(html);
}

function makeDivWithContent(content) {
	return '<div>' + content + '</div>';
}

function setupRequirementsAccordion() {
	$.getJSON('/~gallaghd/cs3220/termProject/getRequirements.php', data => {
		let categories = data.categories;
		let html = '';
		
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
