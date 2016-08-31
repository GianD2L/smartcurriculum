
var coursedata_orig;
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var hoursperday = 2;
var coursestart_date = new Date(2016, 07, 29, 0, 0, 0, 0)
var currentunit_date = coursestart_date;
var weekdata = [{"NumDays":5},{"NumDays":4},{"NumDays":5},{"NumDays":4},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":4},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5},{"NumDays":5}];
var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var holidayBGColor = "#FFFFFF";
var holidayTextColor = "#000000";
var aReplace_unum;
var aReplace_lnum;
var aReplace_anum;

var holidays = [
	{
		"title":"Labour Day",
		"start":"2016-09-05",
		"end":"2016-09-05",
		"startObj": new Date(2016,08,05),
		"endObj": new Date(2016,08,05),
		"allDay":true,
		"editable":false,
		"eventStartEditable":false,
		"backgroundColor":holidayBGColor,
		"textColor":holidayTextColor
	},
	{
		"title":"PD Day",
		"start":"2016-09-23",
		"end":"2016-09-23",
		"startObj": new Date(2016,08,23),
		"endObj": new Date(2016,08,23),
		"allDay":true,
		"editable":false,
		"eventStartEditable":false,
		"backgroundColor":holidayBGColor,
		"textColor":holidayTextColor
	},
	{
		"title":"Remembrance Day",
		"start":"2016-11-11",
		"end":"2016-11-11",
		"startObj": new Date(2016,10,11),
		"endObj": new Date(2016,10,11),
		"allDay":true,
		"editable":false,
		"eventStartEditable":false,
		"backgroundColor":holidayBGColor,
		"textColor":holidayTextColor
	}
];
var unitcal = holidays.slice();


function reorderUnits() {
	var unitorder = [];
	$(".unit").each(function() {
		unitorder.push(parseInt($(this).attr("data-origpos")));
	});
	var newUnitInfo = [];

	for(var i=0; i<unitorder.length; i++) {
		for(var u=0; u<coursedata.Units.length; u++) {
			if(coursedata.Units[u].UnitNum == unitorder[i]) {
				newUnitInfo.push(coursedata.Units[u]);
			}
		}
	}

	UnitInfo = newUnitInfo;
	//calcLearningHours();
}

function calcLearningHours(event, delta) {
	if(event) {

		if(delta) {
			var uindex = -1;
			for(var u=0; u<coursedata.Units.length; u++) {
				if(event.title === coursedata.Units[u].UnitName) {
					uindex = u
				}
			}



			unitcal = holidays.slice();
			for(var u=(uindex+1); u<coursedata.Units.length; u++) {
				var numdays = 0;
				numdays = coursedata.Units[u].UnitHours / hoursperday;
				coursedata.Units[u].Start = currentunit_date;
				coursedata.Units[u].End = addBusinessDays(currentunit_date, numdays);
				currentunit_date = addBusinessDays(currentunit_date, numdays);
			}

			coursedata.Units[uindex].End = addBusinessDays(coursedata.Units[uindex].End, delta._days);

			for(var u=0; u<coursedata.Units.length; u++) {

				var holistart = -1;
				var holilength = -1;

				for(var h=0; h<holidays.length; h++) {
					if(coursedata.Units[u].Start <= holidays[h].startObj && coursedata.Units[u].End >= holidays[h].endObj ) {
						holistart = (calcBusinessDays(coursedata.Units[u].Start,holidays[h].startObj)-1);
						holilength = (calcBusinessDays(holidays[h].startObj,holidays[h].endObj));
					}
				}

				if(holistart > -1) {

					var end1= addBusinessDays(coursedata.Units[u].Start, (holistart));
					var start2 = addBusinessDays(end1, holilength);
					var end2= addBusinessDays(coursedata.Units[u].Start, (numdays + holilength));

					//console.log(end1);
					//console.log(start2);
					//console.log(end2);

					unitcal.push({
						"title":coursedata.Units[u].UnitName,
						"start":coursedata.Units[u].Start,
						"end":end1,
						"editable":false,
						backgroundColor:coursedata.Units[u].Color,
						textColor:"#000000"
					});
					unitcal.push({
						"title":coursedata.Units[u].UnitName,
						"start":start2,
						"end":end2,
						"editable":false,
						backgroundColor:coursedata.Units[u].Color,
						textColor:"#000000"
					});


					coursedata.Units[u].End = addBusinessDays(currentunit_date, (numdays+1));
					currentunit_date = addBusinessDays(currentunit_date, (numdays+1));
				}

				else {
					unitcal.push({
						"title":coursedata.Units[u].UnitName,
						"start":coursedata.Units[u].Start,
						"end":coursedata.Units[u].End,
						"allDay":true,
						"editable":false,
						"eventStartEditable":false,
						backgroundColor:coursedata.Units[u].Color,
						textColor:"#000000"
					});

					currentunit_date = 	coursedata.Units[uindex].End;

				}

			}

			updateCalendar();

		}
		else {
			var uindex = -1;
			for(var u=0; u<coursedata.Units.length; u++) {
				if(event.title === coursedata.Units[u].UnitName) {
					uindex = u
				}
			}

			coursedata.Units[uindex].Start = event.start._d;
			coursedata.Units[uindex].End = addBusinessDays(coursedata.Units[uindex].Start, (coursedata.Units[uindex].UnitHours / hoursperday));
			currentunit_date = 	coursedata.Units[uindex].End;

			for(var u=(uindex+1); u<coursedata.Units.length; u++) {
				var numdays = 0;
				numdays = coursedata.Units[u].UnitHours / hoursperday;
				coursedata.Units[u].Start = currentunit_date;
				coursedata.Units[u].End = addBusinessDays(currentunit_date, numdays);
				currentunit_date = addBusinessDays(currentunit_date, numdays);
			}

			unitcal = holidays.slice();
			for(var u=0; u<coursedata.Units.length; u++) {
				unitcal.push({
					"title":coursedata.Units[u].UnitName,
					"start":coursedata.Units[u].Start,
					"end":coursedata.Units[u].End,
					"allDay":true,
					"editable":false,
					"eventStartEditable":false,
					backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
				});
			}

			updateCalendar();

		}
	}

	else {
		createCalEvents();
	}

}


function createCalEvents() {
	unitcal = holidays.slice();

	for(var u=0; u<coursedata.Units.length; u++) {

		var holindex = [];

		for(var h=0; h<holidays.length; h++) {
			if((coursedata.Units[u].StartDate <= holidays[h].startObj) && (coursedata.Units[u].EndDate >= holidays[h].endObj)) {
				holindex.push(h);
			}
		}

		if(holindex.length == 0) {
			unitcal.push({
				"title":coursedata.Units[u].UnitName,
				"start":coursedata.Units[u].StartDate,
				"end":addBusinessDays(coursedata.Units[u].EndDate,1),
				"allDay":true,
				"editable":false,
				"eventStartEditable":false,
				backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
			});
		}
		else if (holindex.length == 1) {
			unitcal.push({
				"title":coursedata.Units[u].UnitName,
				"start":coursedata.Units[u].StartDate,
				"end":holidays[holindex[0]].startObj,
				"allDay":true,
				"editable":false,
				"eventStartEditable":false,
				backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
			});
			unitcal.push({
				"title":coursedata.Units[u].UnitName,
				"start":addBusinessDays(holidays[holindex[0]].endObj,1),
				"end":addBusinessDays(coursedata.Units[u].EndDate,1),
				"allDay":true,
				"editable":false,
				"eventStartEditable":false,
				backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
			});
		}
		else {

			var tempstart = coursedata.Units[u].StartDate;
			for(var i=0; i<holindex.length; i++) {
				if((i+1) < holindex.length) {
					unitcal.push({
						"title":coursedata.Units[u].UnitName,
						"start":tempstart,
						"end":holidays[holindex[i]].startObj,
						"allDay":true,
						"editable":false,
						"eventStartEditable":false,
						backgroundColor:coursedata.Units[u].Color,
						textColor:"#000000"
					});
					unitcal.push({
						"title":coursedata.Units[u].UnitName,
						"start":addBusinessDays(holidays[holindex[i]].endObj,1),
						"end":holidays[holindex[(i+1)]].startObj,
						"allDay":true,
						"editable":false,
						"eventStartEditable":false,
						backgroundColor:coursedata.Units[u].Color,
						textColor:"#000000"
					});
					tempstart = addBusinessDays(holidays[holindex[(i+1)]].startObj,1);
				}
				else {
					unitcal.push({
						"title":coursedata.Units[u].UnitName,
						"start":addBusinessDays(holidays[holindex[i]].endObj,1),
						"end":addBusinessDays(coursedata.Units[u].EndDate,1),
						"allDay":true,
						"editable":false,
						"eventStartEditable":false,
						backgroundColor:coursedata.Units[u].Color,
						textColor:"#000000"
					});

				}
			}

		}
	}

	updateCalendar();
}

/*
function createCalEvents() {
	coursestart_date = new Date(2016, 07, 29, 0, 0, 0, 0)
	currentunit_date = coursestart_date;
	unitcal = holidays.slice();

	for(var u=0; u<coursedata.Units.length; u++) {
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
				coursedata.Units[u].Lessons[l].LessonHours += coursedata.Units[u].Lessons[l].Activities[a].ActivityHours;
			}
			coursedata.Units[u].UnitHours += coursedata.Units[u].Lessons[l].LessonHours;
		}

		var numdays = 0;
		numdays = coursedata.Units[u].UnitHours / hoursperday;
		if(numdays == 0) {
			numdays = 1;
		}
		coursedata.Units[u].Start = currentunit_date;
		coursedata.Units[u].End = addBusinessDays(currentunit_date, numdays);

		//console.log(coursedata.Units[u].Start);
		//console.log(coursedata.Units[u].End);

		var holistart = -1;
		var holilength = -1;

		for(var h=0; h<holidays.length; h++) {
			if(coursedata.Units[u].Start <= holidays[h].startObj && coursedata.Units[u].End >= holidays[h].endObj ) {
				holistart = (calcBusinessDays(coursedata.Units[u].Start,holidays[h].startObj)-1);
				holilength = (calcBusinessDays(holidays[h].startObj,holidays[h].endObj));
			}
		}

		if(holistart > -1) {

			var end1= addBusinessDays(coursedata.Units[u].Start, (holistart));
			var start2 = addBusinessDays(end1, holilength);
			var end2= addBusinessDays(coursedata.Units[u].Start, (numdays + holilength));

			//console.log(end1);
			//console.log(start2);
			//console.log(end2);

			unitcal.push({
				"title":coursedata.Units[u].UnitName,
				"start":coursedata.Units[u].Start,
				"end":end1,
				"editable":false,
				backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
			});
			unitcal.push({
				"title":coursedata.Units[u].UnitName,
				"start":start2,
				"end":end2,
				"editable":false,
				backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
			});


			coursedata.Units[u].End = addBusinessDays(currentunit_date, (numdays+1));
			currentunit_date = addBusinessDays(currentunit_date, (numdays+1));
		}

		else {
			currentunit_date = addBusinessDays(currentunit_date, numdays);
			unitcal.push({
				"title":coursedata.Units[u].UnitName,
				"start":coursedata.Units[u].Start,
				"end":coursedata.Units[u].End,
				"editable":false,
				backgroundColor:coursedata.Units[u].Color,
textColor:"#000000"
			});
		}
	}

	console.log(unitcal);
	updateCalendar();
}
*/


function excludeUnitCal(uid) {
	$(".unit").each(function() {
		if($(this).hasClass("unit"+uid)) {
			$(this).detach();
		}
	});

	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {
			coursedata.Units.splice(u,1);
		}
	}

	unitDates();
	updateDates();
	for(var u=0; u<coursedata.Units.length; u++) {
		var lessonstart = coursedata.Units[u].StartDate;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {

			$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;
		}
	}

	$("#calModal").modal('toggle');
	viewCalendar();
	updateCalendar();
	checkStandards();

}

function moveUnitCal(direction, uid) {
	var posnum = -1;
	var index = 0;
	var units = [];
	$(".unit").each(function() {
		units.push($(this));
		if($(this).hasClass("unit"+uid)) {
			posnum = index;
		}
		$(this).detach();
		index++;
	});
	if(direction == "down") {

		if((posnum+1) < units.length) {
			swapArrayElements(coursedata.Units,posnum,(posnum+1));
			swapArrayElements(units,posnum,(posnum+1));
		}

	}
	else if(direction == "up") {
		if(posnum > 0) {
			swapArrayElements(coursedata.Units,posnum,(posnum-1));
			swapArrayElements(units,posnum,(posnum-1));
		}
	}
	for(var u=0; u<units.length; u++) {
		$(".units").append(units[u]);
	}

	unitDates();
	updateDates();
	for(var u=0; u<coursedata.Units.length; u++) {
		var lessonstart = coursedata.Units[u].StartDate;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;

		}
	}
	$("#calModal").modal('toggle');
	viewCalendar();
	updateCalendar();
}


function updateCalendar() {
	$('#calendarLayout').html('<div id="calendar" class="col-xs-12"></div>');
	$('#calendar').fullCalendar({
		eventDrop: function( event, jsEvent, ui, view ) {
			calcLearningHours(event);
		},
		eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) {
			calcLearningHours(event, delta);
		},
		eventClick: function(calEvent, jsEvent, view) {

			$("#calModal .modal-title").text(calEvent.title);
			for(var u=0; u<coursedata.Units.length; u++) {
				if(coursedata.Units[u].UnitName == calEvent.title) {
					if(coursedata.Units[u].UnitNum == 0) {
						$("#calModal #calUp").attr("href","javascript:moveUnitCal('up',"+coursedata.Units[u].UnitNum+")");
						$("#calModal #calDown").attr("href","javascript:moveUnitCal('down',"+coursedata.Units[u].UnitNum+")");
						$("#calModal #modStd").attr("href","javascript:viewUnitStandards("+coursedata.Units[u].UnitNum+")");
						$("#calModal #calDel").attr("href","javascript:excludeUnitCal("+coursedata.Units[u].UnitNum+")");
						$("#calModal").modal('toggle');
					}
					else {
						$("#calModal #calUp").attr("href","javascript:moveUnitCal('up',"+coursedata.Units[u].UnitNum+")");
						$("#calModal #calDown").attr("href","javascript:moveUnitCal('down',"+coursedata.Units[u].UnitNum+")");
						$("#calModal #modStd").attr("href","javascript:viewUnitStandards("+coursedata.Units[u].UnitNum+")");
						$("#calModal #calDel").attr("href","javascript:removeUnitCal("+coursedata.Units[u].UnitNum+")");
						$("#calModal").modal('toggle');
					}
				}
			}
		},
		events: unitcal,
		weekends: false,
		defaultDate:"2016-09-01"
	});

	$('#calendar').fullCalendar( 'rerenderEvents' );
	//updateCalFeed();
}


function updateCalFeed() {

	var weeknum = 1;
	var hoursthisweek = 0;
	var uindex = 0;
	var lindex = 0;

	for(var u=0; u<coursedata.Units.length; u++) {
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {

			if(hoursthisweek == 0) {
				$("#calfeed").append("<div id='cal-week-"+weeknum+"'><h4>Week "+weeknum+"</h4></div>");
			}

			var unitnum;
			var lessonnum;
			if((u+1)<10) {
				unitnum = "0"+(u+1);
			}
			else {
				unitnum = (u+1);
			}
			if(l<10) {
				lessonnum = "0"+l;
			}
			else {
				lessonnum = l;
			}

			hoursthisweek += coursedata.Units[u].Lessons[l].LessonHours;
			$("#calfeed #cal-week-"+weeknum).append("<div class='cal-lesson'>"+unitnum+"."+lessonnum+" "+coursedata.Units[u].Lessons[l].Title+" ("+coursedata.Units[u].Lessons[l].LessonHours+" Hours)</div>");
			if(hoursthisweek >= (weekdata[weeknum-1].NumDays * hoursperday)) {
				weeknum += 1;
				hoursthisweek = 0;
			}


		}
	}
}


function calcBusinessDays(dDate1, dDate2) { // input given as Date objects
	var iWeeks, iDateDiff, iAdjust = 0;
	if (dDate2 < dDate1) return -1; // error code if dates transposed
	var iWeekday1 = dDate1.getDay(); // day of week
	var iWeekday2 = dDate2.getDay();
	iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
	iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
	if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
	iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
	iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

	// calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
	iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

	if (iWeekday1 <= iWeekday2) {
		iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
	} else {
		iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
	}

	iDateDiff -= iAdjust // take into account both days on weekend

	return (iDateDiff + 1); // add 1 because dates are inclusive
}

addBusinessDays = function (startingDate, daysToAdjust) {
    var newDate = new Date(startingDate.valueOf()),
        businessDaysLeft,
        isWeekend,
        direction;
    // Timezones are scary, let's work with whole-days only
    if (daysToAdjust !== parseInt(daysToAdjust, 10)) {
        throw new TypeError('addBusinessDays can only adjust by whole days');
    }

    // short-circuit no work; make direction assignment simpler
    if (daysToAdjust === 0) {
        return startingDate;
    }
    direction = daysToAdjust > 0 ? 1 : -1;

    // Move the date in the correct direction
    // but only count business days toward movement
    businessDaysLeft = Math.abs(daysToAdjust);
    while (businessDaysLeft) {
        newDate.setDate(newDate.getDate() + direction);
        isWeekend = newDate.getDay() in {0: 'Sunday', 6: 'Saturday'};
        if (!isWeekend) {
            businessDaysLeft--;
        }
    }
    return newDate;
};


function updateUnitNum(obj, index){
	$(obj).html("Module "+index);
}

function updateLessonNum(obj, index){
	$(obj).html("Lesson "+index);
}

function showUnits() {
	$("#view-units").css("display","block");
	$("#view-lessons").css("display","none");
	$(".view-activities").css("display","none");

	$(".view-lesson1").css("display","none");
	$(".view-lesson2").css("display","none");
	$(".view-lesson3").css("display","none");

	$(".view-activity1-1").css("display","none");
	$(".view-activity1-2").css("display","none");
	$(".view-activity1-3").css("display","none");
	$(".view-activity2-1").css("display","none");
	$(".view-activity2-2").css("display","none");
	$(".view-activity2-3").css("display","none");
	$(".view-activity3-1").css("display","none");
	$(".view-activity3-2").css("display","none");
	$(".view-activity3-3").css("display","none");

	resizefit();

}

function showLessons(unum) {
	$(".view-lesson"+unum+"-number").text($(".unit"+unum+" .unitnum").text());
	$("#view-units").css("display","none");
	$(".view-activities").css("display","none");
	$(".view-activity1-1").css("display","none");
	$(".view-activity1-2").css("display","none");
	$(".view-activity1-3").css("display","none");
	$(".view-activity2-1").css("display","none");
	$(".view-activity2-2").css("display","none");
	$(".view-activity2-3").css("display","none");
	$(".view-activity3-1").css("display","none");
	$(".view-activity3-2").css("display","none");
	$(".view-activity3-3").css("display","none");

	$("#view-lessons").css("display","block");
	$(".view-lesson"+unum).css("display","block");
	resizefit();
}

function showActivities(unum,lnum) {
	$(".view-lesson"+unum+"-number").text($(".unit"+unum+" .unitnum").text());
	$(".view-activity"+unum+"-"+lnum+"-number").text($(".lesson"+unum+"-"+lnum+" .lessonnum").text());
	$("#view-units").css("display","none");
	$("#view-lessons").css("display","none");
	$(".view-activities-"+unum).css("display","block");
	$(".view-activity"+unum+"-"+lnum).css("display","block");
}

function viewCalendar(date) {

	$("#showCurr").parent().removeClass("active");
	$("#showCal").parent().addClass("active");
	calcLearningHours();
	$("#curroptions").fadeOut(500);
	$("#curriculumOptions").fadeOut(500);
	$("#speedo").fadeOut(500);
	$("#view-units").fadeOut(500);

	setTimeout(function() {
		$("#showCurr").css("display","block");
		$("#calendarLayout").css("visibility","visible");
		if(date !== undefined) {
			for(var u=0; u<coursedata.Units.length; u++) {
				if(coursedata.Units[u].UnitNum == date) {
					var switchto = coursedata.Units[u].StartDate;
					$('#calendar').fullCalendar( 'gotoDate', switchto );
				}
			}
		}
	},500);
}

function viewCurriculum() {
	$("#showCurr").parent().addClass("active");
	$("#showCal").parent().removeClass("active");
	$("#curroptions").fadeIn(500);
	$("#calendarLayout").css("visibility","hidden");
	$("#curriculumOptions").fadeOut(500);
	$("#speedo").fadeIn(500);
	$("#view-units").fadeIn(500);
	checkStandards();
}

function replaceActivity(unum, lnum, anum) {
	aReplace_unum = unum;
	aReplace_lnum = lnum;
	aReplace_anum = anum;
	var standardslist = '';
	$("#myModal .standards-check").html("");
	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == unum) {
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lnum) {
					for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
						if(coursedata.Units[u].Lessons[l].Activities[a].ActivityNum == anum) {
							for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {

								for(var d=0; d<standards_data.Standards.length; d++) {
									if(standards_data.Standards[d].ID == coursedata.Units[u].Lessons[l].Activities[a].Standards[s]) {
										standardslist+= '<p><input id="'+d+'" type="checkbox" checked="checked" value="'+coursedata.Units[u].Lessons[l].Activities[a].Standards[s]+'"><label for="'+d+'"><strong>'+standards_data.Standards[d].ID+'</strong>: '+standards_data.Standards[d].Description+'</label></p>';
									}
								}
							}
						}
					}
				}
			}
		}
	}

	$("#myModal .standards-check").append(standardslist);
	$('#myModal').modal('toggle');
}

function saveGoogleDocs(unum, lnum, anum) {

	var standardsarray = [];
	$("#myModal input[type=checkbox]:checked").each(function(){
		standardsarray.push($(this).val());
	});


	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == unum) {
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lnum) {
					for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
						if(coursedata.Units[u].Lessons[l].Activities[a].ActivityNum == anum) {
							if($("#inputTitle").val() !== "" && $("#inputTitle").val() !== null && $("#inputTitle").val() !== undefined) {
								coursedata.Units[u].Lessons[l].Activities[a].Title = $("#inputTitle").val();
								$(".activity"+unum+"-"+lnum+"-"+anum+" h5").text($("#inputTitle").val());
							}
							if($("#inputHours").val() !== "" && $("#inputHours").val() !== null && $("#inputHours").val() !== undefined) {
								coursedata.Units[u].Lessons[l].Activities[a].ActivityHours = parseInt($("#inputHours").val());
							}

							coursedata.Units[u].Lessons[l].Activities[a].Standards = standardsarray;

						}
					}
				}
			}
		}

	}

	unitDates();
	updateDates();
	for(var u=0; u<coursedata.Units.length; u++) {
		var lessonstart = coursedata.Units[u].StartDate;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;

		}
	}
	checkStandards();
	$('#myModal').modal('toggle');


	$("#myModal input[type=radio]:checked").removeAttr("checked");
	$("#inputTitle").val("");
	$("#inputHours").val("");

	$('#myWizard').wizard('selectedItem', {
		step: 1
	});

}

function modifyActivity(unum, lnum, anum) {
	$('#myModal').modal('toggle');
}

function removeActivity(uid, lid, aid) {
	var uindex = -1;
	var lindex = -1;
	var aindex = -1;
	var standards = [];
	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {

			uindex = u;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lid) {
					lindex = l;

					for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
						if(coursedata.Units[u].Lessons[l].Activities[a].ActivityNum == aid) {
							aindex = a;
							$("#excludeModal .modal-title").text("Archive "+coursedata.Units[u].Lessons[l].Activities[a].Title);
							for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
								if(standards.indexOf(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]) == -1) {
									standards.push(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]);
								}
							}
						}
					}
				}
			}
		}
	}

	if(standards.length > 0){
		var standardslist = "<p>The following standards are currently associated with content in "+coursedata.Units[uindex].Lessons[lindex].Activities[aindex].Title+":</p><ul class='standardslist'>";
		for(var d=0; d<standards.length; d++) {
			for(var s=0; s<standards_data.Standards.length; s++) {
				if(standards[d] == standards_data.Standards[s].ID) {
					standardslist += "<li><strong>"+standards_data.Standards[s].ID+"</strong>: "+standards_data.Standards[s].Description+"</li>";
				}
			}
		}
		standardslist += "</ul><p>Are you sure you want to exclude it from the course?</p>";
		$("#excludeModal .modal-body").html(standardslist);
		$("#excludeModal #excludeConfirm").attr("onclick","javascript:excludeActivity("+uid+","+lid+","+aid+")");
		$("#excludeModal").modal('show');
	}
	else {
		excludeLesson(uid,lid);
	}
}

function excludeActivity(unum, lnum, anum) {
	var activityfound = false;
	$("li.activity"+unum+"-"+lnum+"-"+anum).remove();
	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == unum) {
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lnum) {
					for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
						if(coursedata.Units[u].Lessons[l].Activities[a].ActivityNum == anum) {
							coursedata.Units[u].Lessons[l].Activities.splice(a,1);
							activityfound = true;
						}
					}
				}
			}
		}
	}

	if(activityfound) {
		unitDates();
		updateDates();

		for(var u=0; u<coursedata.Units.length; u++) {
			var lessonstart = coursedata.Units[u].StartDate;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
				var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
				var newlessonstart = addBusinessDays(lessonstart, lessondays);

				for(var h=0; h<holidays.length; h++) {
					if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
						newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
					}
				}
				lessonstart = newlessonstart;

			}
		}
		checkStandards();
	}
}

function showStandards() {
	$("#standardsModal").modal('show');
}

function checkStandards() {

	$('#speedo').find('.slice').removeClass('spin');


	var standardsFull = [];
	var standardsFound = [];
	for (var t=0; t<standards_data.Standards.length; t++) {
		standardsFull.push(standards_data.Standards[t].ID);
	}

	for(var u=0; u<coursedata.Units.length; u++) {
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
				for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
					for(var d=0; d<standardsFull.length; d++) {
						if(standardsFull[d] == coursedata.Units[u].Lessons[l].Activities[a].Standards[s]) {
							standardsFound.push(standardsFull[d]);
							//
						}
					}
				}
			}
		}
	}


	var diff = $(standardsFull).not(standardsFound).get();
	if(diff.length > 0) {
		$("#standardsModal .modal-body #courseStandards").html("");
		$("#standardStatus").css("display","inline-block");
		for(var d=0; d<diff.length; d++) {
			for(var s=0; s<standards_data.Standards.length; s++) {
				if(diff[d] == standards_data.Standards[s].ID) {
					$("#standardsModal .modal-body #courseStandards").append("<li class='highlighted'><strong>"+standards_data.Standards[s].ID+"</strong>: "+standards_data.Standards[s].Description+"</li>");
				}
			}
		}
	}

	var status = 0;
	var maxAlignment = diff.length == 0 ? 100 : 95;

	if (diff.length > 0) {
		$('#speedo').find('.sliceA').addClass('sliceA2');
	} else {
		$('#speedo').find('.sliceA').removeClass('sliceA2');
	}

	function updateAlignmentStatus() {
	    status += 5;
	    $('#speedo').find('.alignment').text(status + "%");
	    if(status < maxAlignment) {
				window.setTimeout(updateAlignmentStatus, 1500 / 20 );
			}
	}

	setTimeout(function() {
		$('#speedo').find('.slice').addClass('spin');
		updateAlignmentStatus();
	})
}


function resizefit() {
      //$(".link-unit").css("width",((parseInt($("#view-units").css("width"))-174)+"px"));
	  //$(".link-lesson").css("width",((parseInt($("#view-lessons").css("width"))-274)+"px"));
}

function expandUnit(id) {
	$(id).parent().find(".options-unit ul li a").first().text("Collapse Module");
	$(id).parent().find(".options-unit ul li a").first().attr("href","javascript:collapseUnit("+$(id).attr("id")+")");
	$(id).collapse('show');
}

function expandLesson(id) {
	$("#"+id).parent().find(".options-lesson ul li a").first().text("Collapse Lesson");
	$("#"+id).parent().find(".options-lesson ul li a").first().attr("href","javascript:collapseLesson('"+id+"')");
	$("#"+id).collapse('show');
}

function collapseLesson(id) {
	$("#"+id).parent().find(".options-lesson ul li a").first().text("Expand Lesson");
	$("#"+id).parent().find(".options-lesson ul li a").first().attr("href","javascript:expandLesson('"+id+"')");
	$("#"+id).collapse('hide');
}

function collapseUnit(id) {
	$(id).parent().find(".options-unit ul li a").first().text("Expand Module");
	$(id).parent().find(".options-unit ul li a").first().attr("href","javascript:expandUnit("+$(id).attr("id")+")");
	$(id).collapse('hide');
}

var swapArrayElements = function(arr, indexA, indexB) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};


function removeUnitCal(uid) {
	var uindex = -1;
	var standards = [];
	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {
			$("#excludeModal .modal-title").text("Archive "+coursedata.Units[u].UnitName);
			uindex = u;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
					for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
						if(standards.indexOf(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]) == -1) {
							standards.push(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]);
						}
					}

				}
			}
		}
	}

	if(standards.length > 0){
		var standardslist = "<p>The following standards are currently associated with content in "+coursedata.Units[uindex].UnitName+":</p><ul class='standardslist'>";
		for(var d=0; d<standards.length; d++) {
			for(var s=0; s<standards_data.Standards.length; s++) {
				if(standards[d] == standards_data.Standards[s].ID) {
					standardslist += "<li><strong>"+standards_data.Standards[s].ID+"</strong>: "+standards_data.Standards[s].Description+"</li>";
				}
			}
		}
		standardslist += "</ul><p>Are you sure you want to remove it from the course?</p>";
		$("#excludeModal .modal-body").html(standardslist);
		$("#excludeModal #excludeConfirm").attr("onclick","javascript:excludeUnitCal("+uid+")");
		$("#excludeModal").modal('show');
	}
	else {
		excludeUnit(uid);
	}
}


function removeUnit(uid) {
	var uindex = -1;
	var standards = [];
	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {
			$("#excludeModal .modal-title").text("Archive "+coursedata.Units[u].UnitName);
			uindex = u;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
					for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
						if(standards.indexOf(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]) == -1) {
							standards.push(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]);
						}
					}

				}
			}
		}
	}

	if(standards.length > 0){
		var standardslist = "<p>The following standards are currently associated with content in "+coursedata.Units[uindex].UnitName+":</p><ul class='standardslist'>";
		for(var d=0; d<standards.length; d++) {
			for(var s=0; s<standards_data.Standards.length; s++) {
				if(standards[d] == standards_data.Standards[s].ID) {
					standardslist += "<li><strong>"+standards_data.Standards[s].ID+"</strong>: "+standards_data.Standards[s].Description+"</li>";
				}
			}
		}
		standardslist += "</ul><p>Are you sure you want to remove it from the course?</p>";
		$("#excludeModal .modal-body").html(standardslist);
		$("#excludeModal #excludeConfirm").attr("onclick","javascript:excludeUnit("+uid+")");
		$("#excludeModal").modal('show');
	}
	else {
		excludeUnit(uid);
	}
}


function excludeUnit(uid) {

	$(".unit").each(function() {
		if($(this).hasClass("unit"+uid)) {
			$(this).detach();
		}
	});

	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {
			coursedata.Units.splice(u,1);
		}
	}

	unitDates();
	updateDates();
	for(var u=0; u<coursedata.Units.length; u++) {
		var lessonstart = coursedata.Units[u].StartDate;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;

		}
	}

	checkStandards();

}

function removeLesson(uid,lid) {
	var uindex = -1;
	var lindex = -1;
	var standards = [];
	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {

			uindex = u;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lid) {
					lindex = l;
					$("#excludeModal .modal-title").text("Archive "+coursedata.Units[u].Lessons[l].Title);
					for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
						for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
							if(standards.indexOf(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]) == -1) {
								standards.push(coursedata.Units[u].Lessons[l].Activities[a].Standards[s]);
							}
						}
					}
				}
			}
		}
	}

	if(standards.length > 0){
		var standardslist = "<p>The following standards are currently associated with content in "+coursedata.Units[uindex].Lessons[lindex].Title+":</p><ul class='standardslist'>";
		for(var d=0; d<standards.length; d++) {
			for(var s=0; s<standards_data.Standards.length; s++) {
				if(standards[d] == standards_data.Standards[s].ID) {
					standardslist += "<li><strong>"+standards_data.Standards[s].ID+"</strong>: "+standards_data.Standards[s].Description+"</li>";
				}
			}
		}
		standardslist += "</ul><p>Are you sure you want to exclude it from the course?</p>";
		$("#excludeModal .modal-body").html(standardslist);
		$("#excludeModal #excludeConfirm").attr("onclick","javascript:excludeLesson("+uid+","+lid+")");
		$("#excludeModal").modal('show');
	}
	else {
		excludeLesson(uid,lid);
	}
}

function excludeLesson(uid,lid) {
	$(".unit"+uid+" .lesson").each(function() {
		if($(this).hasClass("lesson"+uid+"-"+lid)) {
			$(this).detach();
		}
	});

	var uindex = -1;

	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {
			uindex = u;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lid) {
					coursedata.Units[u].Lessons.splice(l,1);
				}
			}

		}
	}

	unitDates();
	updateDates();

	for(var u=0; u<coursedata.Units.length; u++) {
		var lessonstart = coursedata.Units[u].StartDate;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;

		}
	}

	checkStandards();
}


function moveUnit(direction, uid) {
	var posnum = -1;
	var index = 0;
	var units = [];
	$(".unit").each(function() {
		units.push($(this));
		if($(this).hasClass("unit"+uid)) {
			posnum = index;
		}
		$(this).detach();
		index++;
	});
	if(direction == "down") {

		if((posnum+1) < units.length) {
			swapArrayElements(coursedata.Units,posnum,(posnum+1));
			swapArrayElements(units,posnum,(posnum+1));
		}

	}
	else if(direction == "up") {
		if(posnum > 0) {
			swapArrayElements(coursedata.Units,posnum,(posnum-1));
			swapArrayElements(units,posnum,(posnum-1));
		}
	}
	for(var u=0; u<units.length; u++) {
		$(".units").append(units[u]);
	}

	unitDates();
	updateDates();

	for(var u=0; u<coursedata.Units.length; u++) {
		var lessonstart = coursedata.Units[u].StartDate;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;

		}
	}
}

function checkStandard(sid) {
	var sfound = false;
	for(var u=0; u<coursedata.Units.length; u++) {
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
				for(var s=0; s<coursedata.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
					if(coursedata.Units[u].Lessons[l].Activities[a].Standards[s] == sid) {
						sfound = true;
						return true;
					}
				}
			}
		}
	}

	if(!sfound) {
		return false;
	}
}


function viewLessonStandards(uid,lid) {
	$("#lessonstandardsModal #modtitle").text("");
	$("#lessonstandardsModal #courseStandards").html("");
	for(var u=0; u<coursedata_orig.Units.length; u++) {
		if(coursedata_orig.Units[u].UnitNum == uid) {

			for(var l=0; l<coursedata_orig.Units[u].Lessons.length; l++) {
				if(coursedata_orig.Units[u].Lessons[l].LessonNum == lid) {
					$("#lessonstandardsModal #modtitle").text(coursedata_orig.Units[u].Lessons[l].Title);
					for(var a=0; a<coursedata_orig.Units[u].Lessons[l].Activities.length; a++) {
						for(var s=0; s<coursedata_orig.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
							if(checkStandard(coursedata_orig.Units[u].Lessons[l].Activities[a].Standards[s])) {
								for(var d=0; d<standards_data.Standards.length; d++) {
									if(coursedata_orig.Units[u].Lessons[l].Activities[a].Standards[s] == standards_data.Standards[d].ID) {
										$("#lessonstandardsModal #courseStandards").append("<li><strong>"+standards_data.Standards[d].ID+"</strong>: "+standards_data.Standards[d].Description+"</li>");
									}
								}
							}
							else {
								for(var d=0; d<standards_data.Standards.length; d++) {
									if(coursedata_orig.Units[u].Lessons[l].Activities[a].Standards[s] == standards_data.Standards[d].ID) {
										$("#lessonstandardsModal #courseStandards").append("<li class='highlighted'><strong>"+standards_data.Standards[d].ID+"</strong>: "+standards_data.Standards[d].Description+"</li>");
									}
								}
							}
						}
					}
				}
			}
		}
	}

	$("#lessonstandardsModal").modal('show');
}


function viewUnitStandards(uid) {
	$("#unitstandardsModal #modtitle").text("");
	$("#unitstandardsModal #courseStandards").html("");
	for(var u=0; u<coursedata_orig.Units.length; u++) {
		if(coursedata_orig.Units[u].UnitNum == uid) {
			$("#unitstandardsModal #modtitle").text(coursedata_orig.Units[u].UnitName);
			for(var l=0; l<coursedata_orig.Units[u].Lessons.length; l++) {
				for(var a=0; a<coursedata_orig.Units[u].Lessons[l].Activities.length; a++) {
					for(var s=0; s<coursedata_orig.Units[u].Lessons[l].Activities[a].Standards.length; s++) {
						if(checkStandard(coursedata_orig.Units[u].Lessons[l].Activities[a].Standards[s])) {
							for(var d=0; d<standards_data.Standards.length; d++) {
								if(coursedata_orig.Units[u].Lessons[l].Activities[a].Standards[s] == standards_data.Standards[d].ID) {
									$("#unitstandardsModal #courseStandards").append("<li><strong>"+standards_data.Standards[d].ID+"</strong>: "+standards_data.Standards[d].Description+"</li>");
								}
							}
						}
						else {
							for(var d=0; d<standards_data.Standards.length; d++) {
								if(coursedata_orig.Units[u].Lessons[l].Activities[a].Standards[s] == standards_data.Standards[d].ID) {
									$("#unitstandardsModal #courseStandards").append("<li class='highlighted'><strong>"+standards_data.Standards[d].ID+"</strong>: "+standards_data.Standards[d].Description+"</li>");
								}
							}
						}
					}
				}
			}
		}
	}

	$("#unitstandardsModal").modal('show');
}


function moveLesson(direction, uid, lid) {
	var posnum = -1;
	var index = 0;
	var uindex = -1;
	var lindex = -1;
	var lessons = [];

	for(var u=0; u<coursedata.Units.length; u++) {
		if(coursedata.Units[u].UnitNum == uid) {
			uindex = u;
			for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
				if(coursedata.Units[u].Lessons[l].LessonNum == lid) {
					lindex = l;
				}
			}
		}
	}

	$(".unit"+uid+" .lesson").each(function() {
		lessons.push($(this));
		if($(this).hasClass("lesson"+uid+"-"+lid)) {
			posnum = index;
		}
		$(this).detach();
		index++;
	});

	if(direction == "down") {
		if((posnum+1) < lessons.length) {
			swapArrayElements(coursedata.Units[uindex].Lessons,posnum,(posnum+1));
			swapArrayElements(lessons,posnum,(posnum+1));
		}
	}
	else if(direction == "up") {
		if(posnum > 0) {
			swapArrayElements(coursedata.Units[uindex].Lessons,posnum,(posnum-1));
			swapArrayElements(lessons,posnum,(posnum-1));
		}
	}

	for(var l=0; l<lessons.length; l++) {
		$(".unit"+uid+" .lessons").append(lessons[l]);
	}

	unitDates();
	updateDates();

	var lessonstart = coursedata.Units[uindex].StartDate;
	for(var l=0; l<coursedata.Units[uindex].Lessons.length; l++) {

		$(".lesson"+coursedata.Units[uindex].UnitNum+"-"+coursedata.Units[uindex].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
		var lessondays = coursedata.Units[uindex].Lessons[l].LessonHours / hoursperday;
		var newlessonstart = addBusinessDays(lessonstart, lessondays);

		for(var h=0; h<holidays.length; h++) {
			if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
				newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
			}
		}
		lessonstart = newlessonstart;

	}

/*
	$(".unit").each(function() {
		units.push($(this));
		if($(this).hasClass("unit"+uid)) {
			posnum = index;
		}
		$(this).detach();
		index++;
	});
	if(direction == "down") {

		if((posnum+1) < units.length) {
			swapArrayElements(coursedata.Units,posnum,(posnum+1));
			swapArrayElements(units,posnum,(posnum+1));
		}

	}
	else if(direction == "up") {
		if(posnum > 0) {
			swapArrayElements(coursedata.Units,posnum,(posnum-1));
			swapArrayElements(units,posnum,(posnum-1));
		}
	}
	for(var u=0; u<units.length; u++) {
		$(".units").append(units[u]);
	}

	unitDates();
	updateDates();

*/}


function updateDates() {
	for(var u=0; u<coursedata.Units.length; u++) {
		var month = monthNames[coursedata.Units[u].StartDate.getMonth()];
		var date = coursedata.Units[u].StartDate.getDate();
		$(".unit"+coursedata.Units[u].UnitNum+" .col-xs-2").html('<a href="javascript:viewCalendar('+coursedata.Units[u].UnitNum+')" title="View Calendar"><div class="calobj"><div id="calmonth">'+month+'</div><div id="caldate">'+date+'</div></div></a>');
	}
}

function unitDates() {

	var unitstartdate = coursestart_date;
	var unitenddate = null;

	for(var u=0; u<coursedata.Units.length; u++) {
		var unithours = 0;
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			var lessonhours = 0;
			for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
				lessonhours += coursedata.Units[u].Lessons[l].Activities[a].ActivityHours;
			}
			coursedata.Units[u].Lessons[l].LessonHours = lessonhours;
			unithours += lessonhours
		}
		coursedata.Units[u].UnitHours = unithours;
		numdays = coursedata.Units[u].UnitHours / hoursperday;
		coursedata.Units[u].StartDate = unitstartdate;
		for(var h=0; h<holidays.length; h++) {

			if(unitstartdate.getTime() == holidays[h].startObj.getTime()) {
				var holidaythis = (holidays[h].endObj - holidays[h].startObj) + 1;
				holidaytot += holidaythis;
				unitstartdate = addBusinessDays(unitstartdate, (holidaythis));
			}
		}

		unitenddate = addBusinessDays(unitstartdate, (numdays));

		var holidaytot = 0;

		for(var h=0; h<holidays.length; h++) {
			if((coursedata.Units[u].StartDate <= holidays[h].startObj) && (unitenddate >= holidays[h].endObj)) {
				var holidaythis = (holidays[h].endObj - holidays[h].startObj) + 1;
				holidaytot += holidaythis;
				unitenddate = addBusinessDays(unitenddate, (holidaythis));
			}
		}

		coursedata.Units[u].StartDate = unitstartdate;
		coursedata.Units[u].EndDate = unitenddate;
		unitstartdate = addBusinessDays(unitenddate, 1);
	}

}

function buildOverview() {

	for(var u=0; u<coursedata.Units.length; u++) {

		var month = monthNames[coursedata.Units[u].StartDate.getMonth()];
		var date = coursedata.Units[u].StartDate.getDate();

		if(coursedata.Units[u].UnitNum > 0) {
			$(".units").append('<li class="unit unit'+coursedata.Units[u].UnitNum+' row" data-origpos="'+coursedata.Units[u].UnitNum+'"><div class="col-xs-2"><a href="javascript:viewCalendar('+coursedata.Units[u].UnitNum+')" title="View Calendar"><div class="calobj"><div id="calmonth">'+month+'</div><div id="caldate">'+date+'</div></div></a></div><div class="unit-header col-xs-10"><div class="image-unit handle"><img src="img/'+coursedata.Units[u].UnitImage+'" style="border-right:20px solid '+coursedata.Units[u].Color+'"></div><a class="link-unit" role="button" data-toggle="collapse" href="#collapseUnit'+coursedata.Units[u].UnitNum+'" aria-expanded="false" aria-controls="collapseUnit'+coursedata.Units[u].UnitNum+'"><h5><div class="title-unit">'+coursedata.Units[u].UnitName+'</div></h5></a><div class="options-unit dropdown"><a href="javascript:void(0)" class="dropdown-toggle" id="dropdownMenu'+coursedata.Units[u].UnitNum+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Options</a><ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu'+coursedata.Units[u].UnitNum+'"><li><a href="javascript:expandUnit(collapseUnit'+coursedata.Units[u].UnitNum+')">Expand Module</a></li><li role="separator" class="divider"></li><li><a href="javascript:moveUnit(\x27up\x27,'+coursedata.Units[u].UnitNum+')">Move Module Up</a></li><li><a href="javascript:moveUnit(\x27down\x27,'+coursedata.Units[u].UnitNum+')">Move Module Down</a></li><li role="separator" class="divider"></li><li><a href="javascript:viewUnitStandards('+coursedata.Units[u].UnitNum+')">View Module Standards</a></li><li role="separator" class="divider"></li><li><a href="javascript:removeUnit('+coursedata.Units[u].UnitNum+')">Exclude Module From Course</a></li><li role="separator" class="divider"></li><li class="disabled"><a href="#">Replace Module (Coming Soon)</a></li></ul></div><div class="collapseicon"></div></div></li>');
		}
		else {
			$(".units").append('<li class="unit unit'+coursedata.Units[u].UnitNum+' row" data-origpos="'+coursedata.Units[u].UnitNum+'"><div class="col-xs-2"><a href="javascript:viewCalendar('+coursedata.Units[u].UnitNum+')" title="View Calendar"><div class="calobj"><div id="calmonth">'+month+'</div><div id="caldate">'+date+'</div></div></a></div><div class="unit-header col-xs-10"><a style="border-left:20px solid '+coursedata.Units[u].Color+'" class="link-specialunit" role="button" data-toggle="collapse" href="#collapseUnit'+coursedata.Units[u].UnitNum+'" aria-expanded="false" aria-controls="collapseUnit'+coursedata.Units[u].UnitNum+'"><h5><div class="title-unit handle">'+coursedata.Units[u].UnitName+'</div></h5></a><div class="options-unit dropdown"><a href="javascript:void(0)" class="dropdown-toggle" id="dropdownMenu'+coursedata.Units[u].UnitNum+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Options</a><ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu'+coursedata.Units[u].UnitNum+'"><li><a href="javascript:expandUnit(collapseUnit'+coursedata.Units[u].UnitNum+')">Expand Module</a></li><li role="separator" class="divider"></li><li><a href="javascript:moveUnit(\x27up\x27,'+coursedata.Units[u].UnitNum+')">Move Module Up</a></li><li><a href="javascript:moveUnit(\x27down\x27,'+coursedata.Units[u].UnitNum+')">Move Module Down</a></li><li role="separator" class="divider"></li><li><a href="javascript:viewUnitStandards('+coursedata.Units[u].UnitNum+')">View Module Standards</a></li><li role="separator" class="divider"></li><li><a href="javascript:removeUnit('+coursedata.Units[u].UnitNum+')">Exclude Module From Course</a></li><li role="separator" class="divider"></li><li class="disabled"><a href="#">Replace Module (Coming Soon)</a></li></ul></div><div class="collapseicon"></div></div></li>');
		}

		var lessonstart = coursedata.Units[u].StartDate;
		var lessonlist = '<div class="collapse view-lesson view-lesson'+coursedata.Units[u].UnitNum+' col-xs-offset-2 col-xs-10" id="collapseUnit'+coursedata.Units[u].UnitNum+'"><ul class="lessons lessons'+coursedata.Units[u].UnitNum+'">';
		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			//lessonlist = lessonlist + '<li class="lesson lesson'+coursedata.Units[u].UnitNum+'-'+(l+1)+'"><div class="image-lesson handle"><img src="img/clouds.png"></div><a class="link-lesson" href="javascript:showActivities('+coursedata.Units[u].UnitNum+','+(l+1)+')"><h5><div class="lessonnum"></div><div class="title-lesson">Clouds</div></h5></a><div class="lesson-changes"><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span class="caret"></span></button><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li><a href="javascript:modifyLesson('+coursedata.Units[u].UnitNum+','+(l+1)+')">Modify</a></li><li><a href="javascript:replaceLesson('+coursedata.Units[u].UnitNum+','+(l+1)+')">Replace</a></li><li><a href="javascript:deleteLesson('+coursedata.Units[u].UnitNum+','+(l+1)+')">Delete</a></li></ul></div></div></li>';
			lessonlist = lessonlist + '<li class="lesson lesson'+coursedata.Units[u].UnitNum+'-'+(l+1)+'" data-modnum="'+coursedata.Units[u].UnitNum+'" data-origpos="'+coursedata.Units[u].Lessons[l].LessonNum+'"><div class="lesson-header"><a class="link-lesson" role="button" data-toggle="collapse" href="#collapseLesson'+coursedata.Units[u].UnitNum+'-'+coursedata.Units[u].Lessons[l].LessonNum+'"><h5><div class="title-lesson handle">'+coursedata.Units[u].Lessons[l].Title+' <div class="lesson-date">Start Date: '+lessonstart.toLocaleDateString('en-US', options)+'</div></div></h5></a><div class="options-lesson dropdown"><a href="javascript:void(0)" class="dropdown-toggle" id="dropdownMenu'+coursedata.Units[u].UnitNum+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Options</a><ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu'+coursedata.Units[u].UnitNum+'"><li><a href="javascript:expandLesson(\x27collapseLesson'+coursedata.Units[u].UnitNum+'-'+coursedata.Units[u].Lessons[l].LessonNum+'\x27)">Expand Lesson</a></li><li role="separator" class="divider"></li><li><a href="javascript:moveLesson(\x27up\x27,'+coursedata.Units[u].UnitNum+','+coursedata.Units[u].Lessons[l].LessonNum+')">Move Lesson Up</a></li><li><a href="javascript:moveLesson(\x27down\x27,'+coursedata.Units[u].UnitNum+','+coursedata.Units[u].Lessons[l].LessonNum+')">Move Lesson Down</a></li><li role="separator" class="divider"></li><li><a href="javascript:viewLessonStandards('+coursedata.Units[u].UnitNum+','+coursedata.Units[u].Lessons[l].LessonNum+')">View Lesson Standards</a></li><li role="separator" class="divider"></li><li><a href="javascript:removeLesson('+coursedata.Units[u].UnitNum+','+coursedata.Units[u].Lessons[l].LessonNum+')">Exclude Lesson From Course</a></li><li role="separator" class="divider"></li><li class="disabled"><a href="#">Replace Lesson (Coming Soon)</a></li></ul></div><div class="collapseicon-l"></div></div>';

			var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
			var newlessonstart = addBusinessDays(lessonstart, lessondays);

			for(var h=0; h<holidays.length; h++) {
				if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
					newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
				}
			}
			lessonstart = newlessonstart;

			lessonlist = lessonlist + '<div class="collapse" id="collapseLesson'+coursedata.Units[u].UnitNum+'-'+coursedata.Units[u].Lessons[l].LessonNum+'"><ul class="activities activities'+coursedata.Units[u].UnitNum+'-'+coursedata.Units[u].Lessons[l].LessonNum+' ui-sortable">';

			for(var a=0; a<coursedata.Units[u].Lessons[l].Activities.length; a++) {
				lessonlist = lessonlist + '<li class="activity activity'+coursedata.Units[u].UnitNum+'-'+coursedata.Units[u].Lessons[l].LessonNum+'-'+coursedata.Units[u].Lessons[l].Activities[a].ActivityNum+'"><div class="activity-header"><a class="link-activity" href="javascript:void(0)"><h5 class="handle">'+coursedata.Units[u].Lessons[l].Activities[a].Title+'</h5></a><div class="options-activity dropdown"><a href="javascript:void(0)" class="dropdown-toggle" id="dropdownMenu'+coursedata.Units[u].UnitNum+'-'+coursedata.Units[u].Lessons[l].LessonNum+'-'+a+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Options</a><ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu'+coursedata.Units[u].UnitNum+'"><li class="disabled"><a href="#">Edit Standards (Coming Soon)</a></li><li role="separator" class="divider"></li><li><a href="javascript:replaceActivity('+coursedata.Units[u].UnitNum+','+coursedata.Units[u].Lessons[l].LessonNum+','+coursedata.Units[u].Lessons[l].Activities[a].ActivityNum+')">Replace Content</a></li><li role="separator" class="divider"></li><li><a href="javascript:removeActivity('+coursedata.Units[u].UnitNum+','+coursedata.Units[u].Lessons[l].LessonNum+','+coursedata.Units[u].Lessons[l].Activities[a].ActivityNum+')">Exclude Content From Course</a></li></ul></div><div></div></div></li>';

			}

			lessonlist = lessonlist + '</ul></div></li>';

		}

		lessonlist = lessonlist + '</div></li></ul>';
		$(".unit"+coursedata.Units[u].UnitNum).append(lessonlist);
	}

	$(".units").sortable({
		 placeholder: 'unit-placeholder',
		 handle: '.handle',
		 update: function(event, ui) {
/*
			 var unitnum = 1;
			 $(".unit .unitnum").each(function() {
				 updateUnitNum(this, unitnum);
				 unitnum++;
			 });

			 reorderUnits();
*/

		 },
		axis: "y",
		revert: 150,
		start: function(e, ui){

			placeholderHeight = ui.item.outerHeight();
			ui.placeholder.height(placeholderHeight + 15);
			$('<div class="unit-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);

		},
		change: function(event, ui) {

			ui.placeholder.stop().height(0).animate({
				height: ui.item.outerHeight() + 15
			}, 300);

			placeholderAnimatorHeight = parseInt($(".unit-placeholder-animator").attr("data-height"));

			$(".unit-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
				height: 0
			}, 300, function() {
				$(this).remove();
				placeholderHeight = ui.item.outerHeight();
				$('<div class="unit-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
			});

		},
		stop: function(e, ui) {

			$(".unit-placeholder-animator").remove();

		},
	});

	$(".lessons").sortable({
		 placeholder: 'unit-placeholder',
		 handle: '.handle',
		 update: function(event, ui) {
/*
			 var lessonnum = 1;
			 $(".lessons1 .lesson .lessonnum").each(function() {
				 updateLessonNum(this, lessonnum);
				 lessonnum++;
			 });
			 var lessonnum = 1;
			 $(".lessons2 .lesson .lessonnum").each(function() {
				 updateLessonNum(this, lessonnum);
				 lessonnum++;
			 });
			 var lessonnum = 1;
			 $(".lessons3 .lesson .lessonnum").each(function() {
				 updateLessonNum(this, lessonnum);
				 lessonnum++;
			 });
*/
		 },
		axis: "y",
		revert: 150,
		start: function(e, ui){

			placeholderHeight = ui.item.outerHeight();
			ui.placeholder.height(placeholderHeight + 15);
			$('<div class="unit-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);

		},
		change: function(event, ui) {

			ui.placeholder.stop().height(0).animate({
				height: ui.item.outerHeight() + 15
			}, 300);

			placeholderAnimatorHeight = parseInt($(".unit-placeholder-animator").attr("data-height"));

			$(".unit-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
				height: 0
			}, 300, function() {
				$(this).remove();
				placeholderHeight = ui.item.outerHeight();
				$('<div class="unit-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
			});

		},
		stop: function(e, ui) {

			$(".unit-placeholder-animator").remove();

		},
	});

	$(".activities").sortable({
		 placeholder: 'unit-placeholder',
		 handle: '.handle',
		axis: "y",
		revert: 150,
		start: function(e, ui){

			placeholderHeight = ui.item.outerHeight();
			ui.placeholder.height(placeholderHeight + 15);
			$('<div class="unit-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);

		},
		change: function(event, ui) {

			ui.placeholder.stop().height(0).animate({
				height: ui.item.outerHeight() + 15
			}, 300);

			placeholderAnimatorHeight = parseInt($(".unit-placeholder-animator").attr("data-height"));

			$(".unit-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
				height: 0
			}, 300, function() {
				$(this).remove();
				placeholderHeight = ui.item.outerHeight();
				$('<div class="unit-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
			});

		},
		stop: function(e, ui) {

			$(".unit-placeholder-animator").remove();

		},
	});
}


$(document).ready(function(){
	coursedata_orig = JSON.parse(JSON.stringify(coursedata));
	unitDates();
	buildOverview();
	resizefit();

	 var lessonnum = 1;
	 $(".lessons1 .lesson .lessonnum").each(function() {
		 updateLessonNum(this, lessonnum);
		 lessonnum++;
	 });
	 var lessonnum = 1;
	 $(".lessons2 .lesson .lessonnum").each(function() {
		 updateLessonNum(this, lessonnum);
		 lessonnum++;
	 });
	 var lessonnum = 1;
	 $(".lessons3 .lesson .lessonnum").each(function() {
		 updateLessonNum(this, lessonnum);
		 lessonnum++;
	 });

	 var unitnum = 1;
	 $(".unit .unitnum").each(function() {
		 updateUnitNum(this, unitnum);
		 unitnum++;
	 });

	 calcLearningHours();
	 $('#myWizard').wizard();
	 checkStandards();

	$(".view-lesson").on('shown.bs.collapse', function () {
		var uid = parseInt($(this).attr("id").slice(12));
		$(this).parent().find(".collapseicon").css("background-image","url(icons/chevron-o.png)");
		$(this).parent().find(".options-unit ul li a").first().text("Collapse Module");
		$(this).parent().find(".options-unit ul li a").first().attr("href","javascript:collapseUnit(collapseUnit"+uid+")");
	})

	 $(".view-lesson").on('hidden.bs.collapse', function () {
		var uid = parseInt($(this).attr("id").slice(12));
		$(this).parent().find(".collapseicon").css("background-image","url(icons/chevron-c.png)");
		$(this).parent().find(".options-unit ul li a").first().text("Expand Module");
		$(this).parent().find(".options-unit ul li a").first().attr("href","javascript:expandUnit(collapseUnit"+uid+")");
	 });


	 for(var u=0; u<coursedata.Units.length; u++) {

		for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
			$("#collapseLesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum).on('hidden.bs.collapse', function (e) {

				$(this).parent().find(".collapseicon-l").css("background-image","url(icons/chevron-c-20.png)");
				$(this).parent().find(".options-lesson ul li a").first().text("Expand Lesson");
				$(this).parent().find(".options-lesson ul li a").first().attr("href","javascript:expandLesson('"+$(this).attr('id')+"')");

				e.stopPropagation();
			})

			$("#collapseLesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum).on('shown.bs.collapse', function (e) {

				$(this).parent().find(".collapseicon-l").css("background-image","url(icons/chevron-o-20.png)");
				$(this).parent().find(".options-lesson ul li a").first().text("Collapse Lesson");
				$(this).parent().find(".options-lesson ul li a").first().attr("href","javascript:collapseLesson('"+$(this).attr('id')+"')");
				e.stopPropagation();
			})
		}

	 }


	 $('.link-specialunit').bind("mouseenter focus",
        function(event) {
			$(".options-unit").css("display","none");
			$(".options-lesson").css("display","none");
			$(".options-activity").css("display","none");
			$(this).parent().find(".options-unit").css("display","block");
		});

	 $('.link-unit').bind("mouseenter focus",
        function(event) {
			$(".options-unit").css("display","none");
			$(".options-lesson").css("display","none");
			$(".options-activity").css("display","none");
			$(this).parent().find(".options-unit").css("display","block");
		});

	 $('.link-activity').bind("mouseenter focus",
        function(event) {
			$(".options-unit").css("display","none");
			$(".options-activity").css("display","none");
			$(".options-lesson").css("display","none");
			$(this).parent().find(".options-activity").css("display","block");
		});

	 $('.link-lesson').bind("mouseenter focus",
        function(event) {
			$(".options-unit").css("display","none");
			$(".options-activity").css("display","none");
			$(".options-lesson").css("display","none");
			$(this).parent().find(".options-lesson").css("display","block");
		});


	$(".ui-sortable").on( "sortstart", function( event, ui ) {

			$(".lesson-date").text("");

			if(ui.item.hasClass("unit")) {
				$(".unit .calobj").html("");
			}
		} );

	$(".ui-sortable").on( "sortstop", function( event, ui ) {
			var unitorder = [];
			var lessonorder = [];
			if(ui.item.hasClass("unit")) {
				$(".unit").each(function() {
					unitorder.push($(this).attr("data-origpos"));
				});

				var courseunits_temp = [];
				for(var o=0; o<unitorder.length; o++) {
					for(var u=0; u<coursedata.Units.length; u++) {
						if(coursedata.Units[u].UnitNum == unitorder[o]) {
							courseunits_temp.push(coursedata.Units[u]);
						}
					}
				}

				coursedata.Units = courseunits_temp;
				unitDates();
				updateDates();
				for(var u=0; u<coursedata.Units.length; u++) {
					var lessonstart = coursedata.Units[u].StartDate;
					for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
						$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
						var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
						var newlessonstart = addBusinessDays(lessonstart, lessondays);

						for(var h=0; h<holidays.length; h++) {
							if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
								newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
							}
						}
						lessonstart = newlessonstart;

					}
				}

			}
			else if(ui.item.hasClass("lesson")) {
				var uindex = -1;
				var modnum = ui.item.attr("data-modnum");
				$(".unit"+modnum+" .lesson").each(function() {
					lessonorder.push($(this).attr("data-origpos"));
				});

				var courselessons_temp = [];
				for(var o=0; o<lessonorder.length; o++) {
					for(var u=0; u<coursedata.Units.length; u++) {
						if(coursedata.Units[u].UnitNum == modnum) {
							uindex = u;
							for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {
								if(coursedata.Units[u].Lessons[l].LessonNum == lessonorder[o]) {
									courselessons_temp.push(coursedata.Units[u].Lessons[l]);
								}
							}
						}
					}
				}

				coursedata.Units[uindex].Lessons = courselessons_temp;
				var lessonstart = coursestart_date;

				for(var u=0; u<coursedata.Units.length; u++) {
					var lessonstart = coursedata.Units[u].StartDate;
					for(var l=0; l<coursedata.Units[u].Lessons.length; l++) {

						$(".lesson"+coursedata.Units[u].UnitNum+"-"+coursedata.Units[u].Lessons[l].LessonNum+" .lesson-date").text("Start Date: "+lessonstart.toLocaleDateString('en-US', options)+"");
						var lessondays = coursedata.Units[u].Lessons[l].LessonHours / hoursperday;
						var newlessonstart = addBusinessDays(lessonstart, lessondays);

						for(var h=0; h<holidays.length; h++) {
							if((lessonstart <= holidays[h].startObj) && (newlessonstart >= holidays[h].endObj)) {
								newlessonstart = addBusinessDays(newlessonstart, (holidays[h].endObj - holidays[h].startObj + 1));
							}
						}
						lessonstart = newlessonstart;
					}

				}

			}
		 event.stopPropagation();

		});

		$('#myWizard').on('finished.fu.wizard', function (evt, data) {
			saveGoogleDocs(aReplace_unum, aReplace_lnum, aReplace_anum);
		});
	 //viewCalendar();
	 $("#welcomeModal").modal('toggle');

	 expandUnit(collapseUnit0);
	 expandUnit(collapseUnit1);

});

$(window).resize(function(){
	resizefit();
});
