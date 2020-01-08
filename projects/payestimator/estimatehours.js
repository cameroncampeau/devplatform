var process = require("process");


function getDaysOfTheMonth(first_day_of_the_month_date) {
    var month = first_day_of_the_month_date.getMonth() + 1,
        date_year = first_day_of_the_month_date.getFullYear();
    
    var first_day_of_next_month = createFirstDayOfTheMonthDate((month == 12 ? 1 : month + 1), date_year + (month == 12 ? 1 : 0));
    var days_in_the_month = (first_day_of_next_month - first_day_of_the_month_date) / (24 * 60 * 60 * 1000);
    var first_day = first_day_of_the_month_date.getDay();
    var days = [];
    for (var i = 0; i < days_in_the_month; i++) {
        days.push((first_day + i) % 7)
    }
    return days;
}
function createFirstDayOfTheMonthDate(month, year) {
    return new Date(month + "/01/" + year);
}
function getNumDaysInMonth(first_day_of_the_month_date) {
    var month = first_day_of_the_month_date.getMonth() + 1,
        date_year = first_day_of_the_month_date.getFullYear();
    var first_day_of_next_month = createFirstDayOfTheMonthDate((month == 12 ? 1 : month + 1), date_year + (month == 12 ? 1 : 0));
    return (first_day_of_next_month - first_day_of_the_month_date) / (24 * 60 * 60 * 1000);
}
function getNumDaysIn(month, daysIn, year) {
    var first_day_of_the_month_date = createFirstDayOfTheMonthDate(month, year);
    var days = getDaysOfTheMonth(first_day_of_the_month_date);
    var ndaysIn = 0;
    days.forEach(d => {
        if (daysIn.find(dI => dI == d)) ndaysIn += 1;
    })
    return ndaysIn;
}
function getNumDaysInFast(month, daysIn, year) {
    var first_day_of_the_month_date = createFirstDayOfTheMonthDate(month, year);
    var days_in_the_month = getNumDaysInMonth(first_day_of_the_month_date)
    var first_day = first_day_of_the_month_date.getDay();
    var num_days_in = 0;
    daysIn.forEach(d => {
        var days_before_in_first_time;
        if (first_day > d) {
            days_before_in_first_time = (7 - first_day) + d;
        } else {
            days_before_in_first_time = d - first_day;
        }
        var working_days = Math.floor((days_in_the_month - days_before_in_first_time - 1) / 7) + 1;
        num_days_in += working_days;
    })
    return num_days_in 
}
function getHours(month,daysIn,year=new Date().getFullYear(), avg_hours_in=7) {
    
    return getNumDaysInFast(month,daysIn,year) * avg_hours_in;
}

module.exports = {getHours}