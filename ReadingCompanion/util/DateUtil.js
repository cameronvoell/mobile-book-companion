export function MillisToDisplayDate(millis) {
    date = new Date(millis)

    displayMonth = date.getMonth() + 1 //Javascript Date month is 0-11
    displayMonthString = '' + displayMonth
    if (displayMonth < 10) {
        displayMonthString = '0' + displayMonthString
    }

    displayDayString = '' + date.getDate()
    if (date.getDate() < 10) {
        displayDayString = '0' + displayDayString
    }

    return displayMonthString + "-" + displayDayString + "-" + date.getFullYear()
}

export function DisplayDateToMillis(displayDate) {
    month = parseInt(displayDate.substring(0, 2)) - 1 //js month is 0-11
    day = parseInt(displayDate.substring(3, 5))
    year = parseInt(displayDate.substring(6, 10))
    date = new Date(year, month, day, 0, 0, 0, 0)
    return date.getTime();
}

