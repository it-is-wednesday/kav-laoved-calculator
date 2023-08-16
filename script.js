﻿NUM_WORKER_TYPES = 5;
LANG = 1;
selectedForm = 0;
showImage = true;

CLEANING_WORKER_FORM = 0;
CARETAKER_FORM = 1;
DAILY_WORKER_FORM = 2;
AGRICULTURAL_WORKER_FORM = 3;
MONTHLHY_WORKER_FORM = 4;

//If wanting to add a language, add it here and add it to languages.js in this order
var langs = ['en','he','th'];
var langsLabel = ['English','עברית','Thai'];

var forms = [];

function getQueryParams(qs) {
	//utility
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var $_GET = getQueryParams(document.location.search);
if($_GET.lang)
{
	//if directed here using a language parameter... this hasn't been implemented
	LANG = langs.indexOf($_GET.lang);
}

//translates LANG to text direction
function isPageLtr () {
	if(langs[LANG]=='he')
		return false;
	return true;
}

$(function() {
	initPage();
 });

function addInputToAllForms(label, type, id, defaultValue, onClickAction, other) {
	forms.map(function(form) { form.addInput(label, type, id, defaultValue, onClickAction, other);});
}

function addInputToForms(affected, label, type, id, defaultValue, onClickAction, other) {
	forms.map(function(form) { if(affected.indexOf(form.id)!=-1) form.addInput(label, type, id, defaultValue, onClickAction, other);});
}

function updateCleaningEmployeeExpansionDateLabel() {
	var updatedDate = getExpansionDate(""+$('#formElement25-'+selectedForm+':checked').val())
	$('#cleaningEmployeeExpansionDateLabel')[0].innerHTML = dateToString(updatedDate,1);
}

function initPage() {

	//setting the text direction globally
	if(isPageLtr())
		document.body.dir="ltr";
	else
		document.body.dir="rtl";

	$('#div_output_donation').hide();

	for(let i in langs){
		$("#div_main").append('<input id="lang'+i+'" type="button" value="'+langsLabel[i]+'" onClick="setLang('+i+');"/><br/> ');
	}

	$("#div_main").append('<input type="button" value="'+STR.print[LANG]+'" onClick="printOutput();"/> ');
	$("#div_main").append('<input type="button" value="'+STR.reset[LANG]+'" onClick="resetOutput();"/><br/>');

	for(var i = 0; i < NUM_WORKER_TYPES; i++){
		$("#div_main").append('<input id="option'+i+'" type="button" value="'+ STR.type_buttons[i][LANG] +'" onClick="showForm('+i+');"/> ');
		$("#div_form").append('<table id="form'+i+'"></table>');
		forms[i] = new Form(i);
	}
	//Cleaning Employee Type
	formElement25 = "<tr id='formElementRow25-%d'><td>"+STR.cleaning_type[LANG] + ":</td><td>" 
		+ "<input type='radio' id='formElement25-%d' name='cleaning_type' onClick='updateCleaningEmployeeExpansionDateLabel()' value='1' checked='checked'/>" + STR.cleaning_private[LANG] 
		+ "<input type='radio' id='formElement25-%d' name='cleaning_type' onClick='updateCleaningEmployeeExpansionDateLabel()' value='2'/>" + STR.cleaning_public[LANG] 
		+ "<input type='radio' id='formElement25-%d' name='cleaning_type' onClick='updateCleaningEmployeeExpansionDateLabel()' value='3'/>" + STR.cleaning_hotel[LANG] 
		+ "</td><td>%s<label id='cleaningEmployeeExpansionDateLabel'>%s</label>";
		+ "</td></tr>";
    $("#form"+CLEANING_WORKER_FORM).append(sprintf(formElement25,CLEANING_WORKER_FORM,CLEANING_WORKER_FORM,CLEANING_WORKER_FORM,CLEANING_WORKER_FORM,
    		STR.expansion_date_label[LANG], dateToString(getExpansionDate(C_PRIVATE),1)));

	//Employee Name
	addInputToAllForms(STR.employee_name[LANG], "text", 1, "");
	//Employer Name
	addInputToAllForms(STR.employer_name[LANG], "text", 22, "");
	//Editor Name
	addInputToAllForms(STR.editor_name[LANG], "text", 21, "");
	//Comments
	addInputToAllForms(STR.comments[LANG], "textarea", 23, "", "", "rows='2' cols='30'");
	//Start Date
	lastYear = new Date();
	lastYear.setYear(lastYear.getFullYear()-1);
	lastYear.setDate(lastYear.getDate() + 1);
	addInputToAllForms(STR.start_date[LANG], "date", 2, dateToString(lastYear,2));
	//End Date
	addInputToAllForms(STR.end_date[LANG], "date", 3, dateToString(new Date(),2));
	//Month Wage
	addInputToForms([CARETAKER_FORM,AGRICULTURAL_WORKER_FORM,4], STR.month_wage[LANG], "number", 4, "");
	//Work Percentage
	addInputToForms([CLEANING_WORKER_FORM, MONTHLHY_WORKER_FORM], STR.work_percentage[LANG], "number", 20, "100");
	//Daily Wage
	addInputToForms([DAILY_WORKER_FORM], STR.daily_wage[LANG], "number", 5, "");
	//Hourly Wage
	addInputToForms([CLEANING_WORKER_FORM], STR.hourly_wage[LANG], "number", 28, "0")
	//Week's Allowance
	addInputToForms([CARETAKER_FORM,AGRICULTURAL_WORKER_FORM], STR.week_allowance[LANG], "number", 6, "");
	//Num Holidays
	addInputToForms([CLEANING_WORKER_FORM,CARETAKER_FORM,AGRICULTURAL_WORKER_FORM,MONTHLHY_WORKER_FORM], STR.holidays_for_calc[LANG], "number", 7, "0");
	//Words Days in a Week
	addInputToForms([DAILY_WORKER_FORM], STR.num_days_in_week[LANG], "number", 8, "0");
	//Hours in a Week
	addInputToForms([DAILY_WORKER_FORM], STR.num_hours_in_week[LANG], "number", 9, "0");
	//Five Day Week?
	addInputToForms([CLEANING_WORKER_FORM,MONTHLHY_WORKER_FORM], STR.five_day_week[LANG], "checkbox", 19, "");
	//Eligible for Compensation?
	addInputToForms([CLEANING_WORKER_FORM, DAILY_WORKER_FORM, CARETAKER_FORM,AGRICULTURAL_WORKER_FORM,MONTHLHY_WORKER_FORM],STR.elig_compen[LANG], "checkbox", 13, "", "checkedEligCompen()");
	//Show Eligibility Details?
	formElement24 = "<tr id='formElementRow24-%d'><td>"+STR.show_elig_details[LANG] + ":</td><td><input type='checkbox' id='formElement24-%d'/></td></tr>";
    $("#form0").append(sprintf(formElement24,0,0));
    $("#form1").append(sprintf(formElement24,1,1));
	$("#form2").append(sprintf(formElement24,2,2));
	$("#form3").append(sprintf(formElement24,3,3));
	$("#form4").append(sprintf(formElement24,4,4));

	//transportationCosts
	addInputToForms([CLEANING_WORKER_FORM], STR.transportationCosts[LANG], "number", 29, "0");

	//Overtime
	addInputToForms([CLEANING_WORKER_FORM], STR.overtime[LANG] + " 125%", "number", 26, "0");

	addInputToForms([CLEANING_WORKER_FORM], STR.overtime[LANG] + " 150%", "number", 27, "0");

	//drop down for output language
	forms.map(function(form) {
		form.addDropdown(STR.output_lang[LANG], 30, langsLabel, "setOutputLang();" );
	});

	//calc_recuper_vacation_and_holidays button
	forms.map(function(form){
		form.addButton(STR.calc_recuper_vacation_and_holidays[LANG], 15, "resetOutput();main([calcRecuper,calcVacation,calcHolidays]);");
	});
	//calc compen pension and early button
	forms.map(function(form){
		form.addButton(STR.calc_compen[LANG], 17, "resetOutput();main([calcPension,calcCompen,calcEarly]);");
	});
	

    showForm(-1);
}

var worker;

function main(funcs) {
	var month_value = 1*$('#formElement4-'+selectedForm).val();
	var allowance = 1*$('#formElement6-'+selectedForm).val();
	var day_value = $('#formElement5-'+selectedForm).val();
	var hour_value = $('#formElement28-'+selectedForm).val();
	var num_days_in_week = $('#formElement8-'+selectedForm).val();
	var num_hours_in_week = $('#formElement9-'+selectedForm).val();
	var work_percentage = $('#formElement20-'+selectedForm).val();
	var five_day_week = $('#formElement19-'+selectedForm).is(':checked');
	var cleaning_type = $("input[name=cleaning_type]:radio:checked").val();
	var overtime125 = 1*$('#formElement26-'+selectedForm).val();
	var overtime150 = 1*$('#formElement27-'+selectedForm).val();
	var transportationCosts = 1*$('#formElement29-'+selectedForm).val();
	var isSep = isSeparationEligible();

	//sets the text direction of the output
	if(isPageLtr()){
		$("#div_output_header")[0].style.direction="ltr";
		$("#div_output_body")[0].style.direction="ltr";
	}
	else {
		$("#div_output_header")[0].style.direction="rtl";
		$("#div_output_body")[0].style.direction="rtl";
	}

	showDonationMessage();

	switch(selectedForm){
		case CLEANING_WORKER_FORM:
			worker = new CleaningWorker(getStartDate(), getEndDate(), isSep, work_percentage, hour_value, cleaning_type, 
				transportationCosts, overtime125, overtime150, five_day_week);
			break;
		case CARETAKER_FORM:
			worker = new Caretaker(getStartDate(), getEndDate(), isSep, month_value, allowance);
			break;
		case DAILY_WORKER_FORM:
			worker = new HourlyWorker(getStartDate(), getEndDate(), isSep, day_value, num_days_in_week, num_hours_in_week);
			break;
		case AGRICULTURAL_WORKER_FORM:
			worker = new AgriculturalWorker(getStartDate(), getEndDate(), isSep, month_value, allowance);
			break;
		case MONTHLHY_WORKER_FORM:
			worker = new MonthlyWorker(getStartDate(), getEndDate(), isSep, month_value, work_percentage, five_day_week);
			break;
	}
	for (var i = 0; i < funcs.length; i++) {
		if(i==0)
			funcs[i](true);
		else
			funcs[i]();
	};
}

//sets the language according to the selected output
function setOutputLang(){
	LANG = parseInt(document.getElementById("formElement30-"+selectedForm).value);
}

function showDonationMessage(){
	$('#div_output_donation').show()
	$('#div_output_donation').append(donation_message);
}

function checkedEligCompen(){
	if(isSeparationEligible())
		$('#formElementRow24-'+selectedForm).show();
	else
		$('#formElementRow24-'+selectedForm).hide();
}

function isSeparationEligible() {
	//simple
	return $('#formElement13-'+selectedForm).is(':checked');
}

function showForm(formId){
	for(i=0;i<NUM_WORKER_TYPES;i++)
	{
		if(i==formId)
			$("#form"+i).show();
		else
			$("#form"+i).hide();
	}
	selectedForm = formId;
	checkedEligCompen();
	
	//set the output language select default value to the current language
	if(document.getElementById('formElement30-'+selectedForm))
		document.getElementById('formElement30-'+selectedForm).value = LANG;
}

function getItemByDate(array, date) {
	return array[getIndexByDate(array, date)];
}
function getIndexByDate(array, date) {
	if(array.length == 1)
		return 0;
	var index = 0;
	while(index + 1 < array.length && date >= array[index+1][0]) {
		index++;
	}
	return index;
}

function getItem(array, index) {
	//returns the item from an array, if index is biggr than array returns the last one
	index = index >= array.length ? array.length - 1 : index;
    return array[index];
}

function getYearNum(startWorkDate, date) {
	return Math.floor(getMonthsDiff(startWorkDate, date)/12.0);
}

function isUndefined(variable) {
	//utility
	return variable == undefined || variable == "";
}

function isInputValid(startDate, endDate){
	//validate input
	if(selectedForm<0 || selectedForm >= NUM_WORKER_TYPES) {
		alert('Type of worker hasn\'t been selected');
		return false;
	}
	
	if(startDate == "Invalid Date" || endDate == "Invalid Date" || endDate<startDate) {
		alert(STR.alert_no_dates[LANG]);
		return false;
	}
	
	dateDiff = getDateDiff(startDate, endDate)
	if(dateDiff[0]<1 && isSeparationEligible()){
		alert(STR.output_compen_less_than_year_alert[LANG]);
		return false;
	}
	
	if($('#formElement20-'+selectedForm).val() > 100) {
		alert(STR.alert_part_time_over_hundred[LANG]);
		return false;
	}

	if(selectedForm==DAILY_WORKER_FORM){
		num_days_in_week = $('#formElement8-2').val();
		if((!num_days_in_week>0) || num_days_in_week>6)
		{
			alert(STR.alert_bad_days_in_week[LANG]);
			return false;
		}
	}
	return true;
}

function getEndDate() {
	var end_date = stringToDate($("#formElement3-"+selectedForm).val());
	return end_date;
	//return new Date(end_date.setDate(end_date.getDate()+1));
}

function getStartDate() {

	var start_date = stringToDate($("#formElement2-"+selectedForm).val());
	return start_date;
	//return new Date(end_date.setDate(end_date.getDate()+1));
}

function stringToDate(strDate) {
	return new Date(moment(strDate,"YYYY-MM-DD").valueOf());
}

function getOldness(period, yearsBack){
	//util function
	if($('#formElement14-'+selectedForm).is(':checked'))
		return period[0]>=yearsBack ? [period[0]-yearsBack, period[1]] : [0,0];
	return [0,0];
}

function getPensionData(date) {
	/*var index = getPensionDataIndex(date);
	var data = pension_data[index];
	return data;*/
	return getItemByDate(pension_data, date);
}

function getPensionDataIndex(date) {
	return getIndexByDate(pension_data, date);
	/*
	//util function
	var running_index = 0;
	while(running_index < pension_data.length && date >= pension_data[running_index][0]){
		running_index++;
	}
	if(running_index>0)
		running_index--;
	return running_index*/
}

function calcRecuper(isFirst){
	var start_date = getStartDate();
	var end_date = getEndDate()
	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	//convert dates to months and years of work
	dateDiff = getDateDiff(start_date, end_date);

	//define output table headers
	headers = [STR.years[LANG], STR.days_potential[LANG], STR.days_net[LANG], STR.amount_per_year[LANG]];

	var result = worker.getRecuperationTable();
	var recuperation_value = result[0];
	var recuperation_total = result[1];
	var recuperation_total_without_oldness = result[2];
	var rows = result[3];

	//get visual
	createOutputTable(isFirst, 
		STR.output_recuper[LANG] + " (" + STR.recuper_day[LANG] + ": " + recuperation_value + " " + STR.shekels[LANG] + ")", 
		start_date,
		end_date, 
		headers, 
		rows,
		['%d','%.2f','%.2f','%.2f']);
	
	output = $("#div_output");

	if($('#formElement14-'+selectedForm).is(':checked'))
		output_body.append(sprintf("<b>%s: %.2f</b><br/><b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			recuperation_total_without_oldness,STR.total_amount_oldness[LANG],recuperation_total));
	else
		output_body.append(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			recuperation_total_without_oldness));
}

function calcVacation(isFirst){

	var start_date = getStartDate();
	var end_date = getEndDate()
	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	//convert dates to months and years of work
	var dateDiff = getDateDiff(start_date, end_date);

	//define output table headers
	var headers = [STR.years[LANG], STR.vacation_days_net[LANG], STR.amount_per_year[LANG]];

    var result = worker.getVacationTable();
	var total_value = result[0];//running total
	var total_value_without_oldness = result[1];//running total
	var rows = result[2];

	var vacationDayValue = worker.getVacationDayValue(end_date);

	//get visual
	createOutputTable(isFirst, 
		sprintf("%s (%s: %.2f " + STR.shekels[LANG] + ")",STR.output_vacation[LANG], STR.vacation_day[LANG], vacationDayValue), 
		start_date,
		end_date, 
		headers, 
		rows,
		['%d','%d','%.2f']);
	output = $("#div_output");

	if($('#formElement14-'+selectedForm).is(':checked'))
		output_body.append(sprintf("<b>%s: %.2f</b><br/><b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			total_value_without_oldness,STR.total_amount_oldness[LANG],total_value));
	else
		output_body.append(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			total_value_without_oldness));
}

sepPayTotal = 0;

function calcPension(isFirst){
	var start_date = getStartDate();
	var end_date = getEndDate()
	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	var sep_elig = worker.isEligibleToSeperation;
	var sep_elig_show_details = sep_elig && $('#formElement24-'+selectedForm).is(':checked');
	//define output table headers
	
	//different columns depending on separation stuff:
	if(sep_elig && (!sep_elig_show_details) ){
		headers = [STR.period[LANG], STR.num_months[LANG], STR.base_salary_for_calc[LANG], STR.percentages[LANG], STR.subtotal_pension[LANG], STR.subtotal_period[LANG]];
		printFormat = ['%s','%.2f','%.2f','%s','%.2f','%.2f']
	}
	else {
		headers = [STR.period[LANG], STR.num_months[LANG], STR.base_salary_for_calc[LANG], STR.percentages[LANG], STR.subtotal_pension[LANG], STR.subtotal_separation[LANG], STR.subtotal_period[LANG]];
		printFormat = ['%s','%.2f','%.2f','%s','%.2f','%.2f','%.2f']
	}

	var result = worker.getPensionTable(sep_elig_show_details);
	var total_value = result['total_value'];
	var pension_total = result['pension_total'];
	var compensation_total = result['compensation_total'];
	var rows = result['rows'];
	var bottom_lines = result['bottom_lines'];

	//get visual
	var pensionExpl = (worker.getPensionWaiting(worker.startWorkDate)==6) ? STR.output_pension_expl[LANG] : "";
	createOutputTable(isFirst, 
		"</u>" + STR.pension_statement[LANG] + "<br/><u>" + STR.output_pension[LANG] + "</u> " + pensionExpl, 
		start_date,
		end_date, 
		headers, 
		rows, 
		printFormat);
	output = $("#div_output");
	for(line in bottom_lines){
		output_body.append(bottom_lines[line]);
	}
	
	//In case both checkmarks are checked, we need the separation pay total saved so that we can deduct it from the compensation total
	sepPayTotal = 0
	if(sep_elig && sep_elig_show_details){
		sepPayTotal = compensation_total;
	}
	
	if(null != worker.getHishtalmutEligibleDay()) {
		calcHishtalmut(false);
	}
}

function calcHishtalmut(isFirst){
	var start_date = getStartDate();
	var end_date = getEndDate()
	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	//define output table headers
	headers = [STR.period[LANG], STR.num_months[LANG], STR.base_salary_for_calc[LANG], STR.percentages[LANG], STR.subtotal_period[LANG]];
	printFormat = ['%s','%.2f','%.2f','%s','%.2f','%.2f']

	var result = worker.getHishtalmutTable();
	var total_value = result[0];
	var rows = result[1];
	var bottom_lines = result[2];

	//get visual	
	createOutputTable(isFirst, 
		"<u>" + STR.output_hishtalmut[LANG] + "</u>", 
		start_date,
		end_date, 
		headers, 
		rows, 
		printFormat);
	output = $("#div_output");
	for(line in bottom_lines){
		output_body.append(bottom_lines[line]);
	}
}

function calcHolidays(isFirst){
	if(selectedForm == DAILY_WORKER_FORM)
		return;
	var start_date = getStartDate();
	var end_date = getEndDate();
	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	//convert dates to months and years of work
	dateDiff = getDateDiff(start_date, end_date);

	numHolidays = $('#formElement7-'+selectedForm).val();
	if(numHolidays!="0" && numHolidays!="")
	{
		var holidayValue = Math.round(worker.getHolidayValue(worker.endWorkDate));
		if (holidayValue == 361)
			holidayValue = 360;
		output_body.append(sprintf("<b>%s</b>: %s<br/>",
			STR.num_holidays[LANG], numHolidays));
		output_body.append(sprintf("<b>%s</b>: %.0f<br/>",
			STR.holiday_day[LANG], holidayValue))
		output_body.append(sprintf("<b>%s</b>: %.0f",
			STR.total_amount_holidays[LANG], numHolidays * holidayValue))
	}
}

function calcCompen (isFirst) {
	//if a worker is eligible for separation pay here we calculate that compensation
	var start_date = worker.startWorkDate;
	var end_date = worker.endWorkDate;
	var sep_elig = isSeparationEligible();
	var sep_elig_show_details = $('#formElement24-'+selectedForm).is(':checked');
	var month_value = worker.getMonthWage(end_date);
	var dateDiff = worker.dateDiff;

	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	//convert dates to months and years of work
	

	//case when compensation is not to be show:
	//if worker isn't eligible
	if(!isSeparationEligible())
		return;

	createOutputTable(isFirst, 
		STR.output_compen[LANG], 
		start_date, 
		end_date,
		[], 
		[], 
		[]);
	output = $("#div_output");
	
	//alert that worker isn't eligible due to working less than a year
	if(!worker.isEligibleToSeparationCompensation()) {
		output_body.append("<p>" + STR.output_compen_less_than_year[LANG] + "<p/>");
	}
	//in this case indeed some money is deserved and we show the calculation
	else {
		
		if(sep_elig && selectedForm == CLEANING_WORKER_FORM){
			//this is ugly, but we need to know how much compensation was given in pension and subtract it
			var rows = worker.getPensionTable(sep_elig_show_details)['rows'];
			var pension_compensation = 0;
			for(var i = 0; i < rows.length; i++)
			{
				pension_compensation += rows[i].period_compensation_total;
			}
			compensation = round(dateDiff[0] + dateDiff[1]/12, 2) * round(month_value,2) + round(worker.getOvertimePensionData()[1] - pension_compensation,2);
			output_body.append(sprintf("%s:<p " + (isPageLtr()? "" : "style='text-align:right;' ") +
			 "dir='ltr'>%.2f X %.2f + %.2f - %.2f = <b>%.2f</b></p>",
					STR.compen_label5[LANG], dateDiff[0] + dateDiff[1]/12, month_value, worker.getOvertimePensionData()[1], pension_compensation, compensation));
		}
		else if(sep_elig && (!sep_elig_show_details) ){
			compensation = round(dateDiff[0] + dateDiff[1]/12, 2) * round(month_value,2)
			output_body.append(sprintf("%s:<p " + (isPageLtr()? "" : "style='text-align:right;' ") +
			 "dir='ltr'>%.2f X %.2f = <b>%.2f</b></p>",
					STR.compen_label1[LANG], dateDiff[0] + dateDiff[1]/12, month_value, compensation));
		}
		else if(sep_elig && sep_elig_show_details){
			compensation = round(dateDiff[0] + dateDiff[1]/12,2) * round(month_value,2);
			output_body.append(sprintf("%s:<p " + (isPageLtr()? "" : "style='text-align:right;' ") +
			 "dir='ltr'>%.2f X %.2f - %.2f = <b>%.2f</b></p>",
					STR.output_compen_complement[LANG], dateDiff[0] + dateDiff[1]/12, month_value, sepPayTotal, compensation - sepPayTotal));
		}
	}
}

function round(dec, places) {
	var helper = Math.pow(10,places);
	return Math.round(dec*helper)/helper;
}

function calcEarly (isFirst) {
	var start_date = getStartDate();
	var end_date = getEndDate()
	var dateDiff = worker.dateDiff;
	if(isFirst)
		if(!isInputValid(start_date, end_date))
			return;
	min_month_value = pension_data[getPensionDataIndex(getEndDate())][1];

	//case when early notice is not to be shown:
	//if worker isn't eligible and has worked at least a year 
	if(!worker.isEligibleEarlyNoticeCompensation())
		return;

	numDays = worker.getNumDaysEarlyNotice();
	//round to match display
	numDays = parseFloat(numDays.toFixed(1));
	isMonthEarlyNotice = numDays==-2;

	if(!isMonthEarlyNotice){
		runningDate = new Date(end_date);

		runningDate.setDate(runningDate.getDate()+1);
		workDays = 0;
		num_days_in_week = worker.getWorkDaysPerWeek();
		while(numDays>0) {
			if(numDays<1)
				workDays+=numDays;
			else if(runningDate.getDay()<num_days_in_week)
				workDays++;
			runningDate.setDate(runningDate.getDate()+1);
			numDays--;
		}

		earlyPay = worker.getDayWage(end_date) * workDays;
	}
	else{
		earlyPay = worker.getMonthWage(end_date);
	}
	output_table_id = createOutputTable(isFirst, 
		sprintf("%s: %.2f " + STR.shekels[LANG],STR.early_days[LANG], worker.getDayWage(end_date)), 
		start_date, 
		end_date,
		[], [], []);
	table = $("#output_table"+output_table_id);
	if(isMonthEarlyNotice)
		table.append(sprintf("<tr><td>%s:</td><td><b>%s</b></td></tr>",
			STR.compen_label2[LANG], STR.month[LANG]));
	else
		table.append(sprintf("<tr><td>%s:</td><td><b>%.1f</b></td></tr>",
			STR.compen_label2[LANG], worker.getNumDaysEarlyNotice(dateDiff, end_date)));
	if(selectedForm != DAILY_WORKER_FORM){
		if(!isMonthEarlyNotice){
			table.append(sprintf("<tr><td>%s:</td><td><b>%.1f</b></td></tr>",
					STR.compen_label3[LANG], workDays));
		}
		table.append(sprintf("<tr><td>%s:</td><td><b>%.2f</b></td></tr>",
				STR.compen_label4[LANG], earlyPay));
	}
}

function getNumWorkDaysInMonth () {
	if(selectedForm == CARETAKER_FORM || selectedForm == AGRICULTURAL_WORKER_FORM)
		return SIX_WORK_DAYS_IN_MONTH;
	if(selectedForm == 2)
		return $('#formElement8-2').val() * WEEKS_IN_MONTH;
	if(selectedForm == 4){
		if($('#formElement19-4').is(':checked'))
			return FIVE_WORK_DAYS_IN_MONTH;
		else
			return SIX_WORK_DAYS_IN_MONTH;
	}
}

function getMonthsDiff (startDate, endDate) {
	//utility
	periodDateDiff = getDateDiff(startDate, endDate);
	return periodDateDiff[0]*12+periodDateDiff[1];
}

function dateToString (date, format) {
	if(format==0)
		//month and year only
		return date.getMonth()+1 + "/" + date.getFullYear();
	else if(format==1){
		//DD-MM-YYYY
		/*month = (date.getMonth()+1);
		if(month<10)
			month = "0"+month;
		day = date.getDate();
		if(day<10)
			day = "0"+day;
		return  day + "-" + month + "-" + date.getFullYear();*/
		return moment(date).format('DD-MM-YYYY');
	}
	else if(format==2){
		//YYYY-MM-DD
		day = ("0" + date.getDate()).slice(-2);
    	month = ("0" + (date.getMonth() + 1)).slice(-2);

    	return date.getFullYear()+"-"+(month)+"-"+(day) ;
	}
}

function addMonth (date, month) {
	//utility
	newDate = new Date(date);
	newDate.setMonth(date.getMonth()+month);
	return newDate;
}

function addDay (date, days) {
	//utility
	newDate = new Date(date);
	newDate.setDate(date.getDate()+days);
	return newDate;
}

var tableId = 0;

function createOutputTable(isFirst, title, startDate, endDate, headers, rows, formats){
	employee_name = $('#formElement1-'+selectedForm).val();
	employer_name = $('#formElement22-'+selectedForm).val();
	comments = $('#formElement23-'+selectedForm).val();
	editor_name = $('#formElement21-'+selectedForm).val();
	output = $("#div_output");
	output_header = $("#div_output_header");
	output_body = $("#div_output_body");
	output_footer = $("#div_output_footer");
	table2 = $("<table border='1' id='output_table"+(tableId++)+"'></table>");
	dateDiff = getDateDiff(startDate, endDate);
	if(isFirst){
		table1 = $("<table width='100%'></table>");
		table1.append(sprintf("<tr><td width='10%%'>%s</td><td style='text-align:left;' width='90%%'>%s</td></tr>",dateToString(new Date(),1),showImage?"<img src='cropped-logo.gif'/>":"",1));
		output_header.append(table1);
		output_header.append(sprintf("<br/>%s: %s<br/>",STR.employee_name[LANG], employee_name));
		output_header.append(sprintf("%s: %s<br/>",STR.employer_name[LANG], employer_name));
		output_header.append(sprintf("%s: %s<br/>",STR.editor_name[LANG], editor_name));
		output_header.append(sprintf("%s: %d, &nbsp&nbsp&nbsp&nbsp %s: %.2f<br/>",
			STR.years[LANG], dateDiff[0], STR.months[LANG], dateDiff[1]));
		output_header.append(sprintf("%s: (%s) - (%s)<br/>",
			STR.work_period[LANG], dateToString(startDate,1), dateToString(endDate,1)));
		output_header.append(sprintf("%s: %.1f%%<br/>", STR.work_percentage[LANG], 
			worker.getPartTimeFraction()*100))
		output_header.append(sprintf("%s: %s<br/><br/>",STR.comments[LANG], comments));
		
		//show contact details
		if(showImage){
			output_footer.append("<img width='100%' src='contact-info.jpg'/>");
		}
	}

	output_body.append("<u>"+title+"</u>");
	
	headerHtml = "<tr>";
	for(header in headers){
		headerHtml += sprintf("<td><b>%s</b></td>",headers[header]);
	}
	headerHtml += "</tr>";
	table2.append(headerHtml);

	for(row in rows){
		rowHtml = "<tr>";
		i=0;
		for(cell in rows[row]){
			rowHtml += sprintf("<td" + (cell==0 ? "" : " style='text-align:center;'") + ">" + formats[i++] + "</td>",rows[row][cell]);
		}
		rowHtml += "<tr>";
		table2.append(rowHtml);
	}
	output_body.append(table2);
	return tableId-1;
}

function resetOutput () {
	output_header = $("#div_output_header");
	output_header.empty();
	output_body = $("#div_output_body");
	output_body.empty();
	output_footer = $("#div_output_footer");
	output_footer.empty();
	output_donation = $('#div_output_donation');
	output_donation.empty()
	output_donation.hide()
}

function getNumDaysInMonth(year,month){
	//utility
	return (new Date(year,month,0)).getDate();
}

function getDateDiff(startDate, endDate) {
	//utility
	//calculates B - A
	//Simulates the passing of time
	var dateA = new Date(startDate);
	var dateB = new Date(endDate);
	if(dateA == "Invalid Date" || dateB == "Invalid Date")
	{
		alert(STR.alert_no_dates[LANG]);
		return;
	}
	dateB = new Date(dateB.setDate(dateB.getDate()+1));
	var runningDate = new Date(dateA);
	var years = 0;
	var months = 0;
	//run years
	runningDate = addMonth(runningDate, 12);
	while(runningDate <= dateB) {
		years++;
		runningDate = addMonth(runningDate, 12);
	}
	runningDate = addMonth(runningDate, -11);
	//run months
	while(runningDate <= dateB) {
		months++;
		runningDate = addMonth(runningDate, 1);
	}
	runningDate = addMonth(runningDate, -1);
	
	//run "days"
	var diff = dateB - runningDate;
	var milisThisMonth = (MILI_IN_DAY*daysInMonth(runningDate.getMonth()+1, runningDate.getUTCFullYear()))
	months += Math.min(1, diff / milisThisMonth);
	return [years, months];
}

function getDateDiff3(startDate, endDate) {
	//utility
	//calculates B - A
	//Uses conversions between days, months, and years --> inaccurate
	var dateA = new Date(startDate);
	var dateB = new Date(endDate);
	if(dateA == "Invalid Date" || dateB == "Invalid Date")
	{
		alert(STR.alert_no_dates[LANG]);
		return;
	}
	dateB = new Date(dateB.setDate(dateB.getDate()+1));
	var diff = dateB - dateA;
	var years = Math.floor(diff / (365*MILI_IN_DAY));
	diff -= years * (365*MILI_IN_DAY);
	var leapDays = Math.floor(years / 4);
	diff -= leapDays*MILI_IN_DAY;
	diff = diff<0 ? 0 : diff;
	var months = 0;
	var runningDate = new Date(dateA);
	while(diff > 0){
		var milisThisMonth = (MILI_IN_DAY*daysInMonth(runningDate.getMonth()+1, runningDate.getUTCFullYear()))
		months += Math.min(1, diff / milisThisMonth);
		diff -= milisThisMonth;
		runningDate = addMonth(runningDate, 1);
	}
	//months = diff / (MILI_IN_DAY*(TOTAL_DAYS_IN_MONTH+0.5));
	return [years, months];
}
function getYearsDiff(startDate, endDate) {
	//utility
	//calculates B - A and rounds for years
	var dateA = new Date(startDate);
	var dateB = new Date(endDate);
	if(dateA == "Invalid Date" || dateB == "Invalid Date")
	{
		alert(STR.alert_no_dates[LANG]);
		return;
	}
	var years = 0;
	dateA = addMonth(dateA, 12);
	dateA = addDay(dateA, -1);
	while(dateA < dateB){
		years++;
		dateA = addMonth(dateA, 12);
	}
	return years;
}
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}
function getDateDiff2(startDate, endDate) {
	//utility
	//calculates B - A
	var dateA = new Date(startDate);
	var dateB = new Date(endDate);
	if(dateA == "Invalid Date" || dateB == "Invalid Date")
	{
		alert(STR.alert_no_dates[LANG]);
		return;
	}
	dateB = new Date(dateB.setDate(dateB.getDate()+1));
	yearA = dateA.getYear();
	yearB = dateB.getYear();
	monthA = dateA.getMonth();
	monthB = dateB.getMonth();
	dayA = dateA.getDate();
	dayB = dateB.getDate();
	years = yearB - yearA;
	if(monthB<monthA || (monthB==monthA && dayB<dayA))
	{
		monthB+=12;
		years--;
	}
	months = monthB-monthA;	
	if(dayB<dayA){
		months-=1;
		dayB += getNumDaysInMonth(dateB.getFullYear(), monthB-1);//TOTAL_DAYS_IN_MONTH;
	}
	months += (dayB-dayA)/getNumDaysInMonth(dateB.getFullYear(), monthB-1);

	return [years, months];
}

function resetPage(){
	$('#div_main').empty();
	for(i=0;i<NUM_WORKER_TYPES;i++)
		$('#form'+i).empty();
	resetOutput();
	initPage();
}

function setLang(lang){
	LANG = lang;
	resetPage();
}

function printOutput() {
    //Get the HTML of div
    $('#div_main').hide();
    $('#div_form').hide();
    $('#hr_divide').hide();
    //Print Page
    window.print();
 	$('#div_main').show();
    $('#div_form').show();
    $('#hr_divide').show();
}

function roundVacationDays(vacation_days){
	//the lawyers decided that if a worker earned 90% of their day they deserve it
	if(vacation_days - Math.floor(vacation_days) >= 0.9)
	  return Math.floor(vacation_days)+1;
	else
	  return Math.floor(vacation_days);
}

function emulateTime(startDate, endDate, initRunningDate, isPeriodOver, calcPeriodRow, incrementRunningDate) {
	var rows = [];
	var staticVars = []
	var runningDate = initRunningDate(startDate, staticVars);
	if(runningDate == null)
		return;
	var periodStart = new Date(runningDate);
	var periodEnd;
	
	while(runningDate<endDate){
		if(isPeriodOver(periodStart, runningDate)) {
			periodEnd = new Date(runningDate);
			periodEnd.setDate(runningDate.getDate()-1);
			rows.push(calcPeriodRow(periodStart, periodEnd, staticVars))
			periodStart = new Date(runningDate);
		}
		
		runningDate = incrementRunningDate(runningDate);
	}
	periodEnd = new Date(runningDate);
	rows.push(calcPeriodRow(periodStart, periodEnd, staticVars))
	return [rows, staticVars];
}
