var statistics =  {};
START_DATE = midNight(new Date())
END_DATE = midNight("2022-07-25")
DAY_IN_MILLIS = 1000 * 3600 * 24
var activeState;

function eachDay(start, end, callback) {
    current  = new Date(start);
    while(current <= end) {
        callback(new Date(current))     
        current.setDate(current.getDate() + 1)
    }
}

function dayDiff(start, end) {
    return (end.getTime() - start.getTime()) / DAY_IN_MILLIS
}

function renderData() {
    console.log("render " + JSON.stringify(statistics))
    $("#days-all").text(statistics.all)
    $("#days-weekend").text(statistics.weekend)
    $("#days-hollidays").text(statistics.hollidays)
    $("#days-left").text(statistics.left)
    $("#total-hours").text(statistics.left * 7)
    var table = $("#hollidays")
    table.empty();
    statistics.events.forEach(event => {
        start = formatDate(event.start),
        end = formatDate(event.end)
        until = Math.round(dayDiff(START_DATE, event.start))
        date = start == end ? start : start + "-" + end
        table.append(`<tr>
        <th scope="row">${event.name}</th>
            <td>${until} (${event.schoolUntil}) Tage</td>
            <td>${event.length}</td>
            <td>${date}</td>
        </tr>`)
    })
}

function midNight(str) {
    var date = new Date(str);
    date.setHours(0, 0, 0, 0)
    return date;
}

function formatDate(date) {
    return date.toLocaleDateString("de-DE")
}

function formatName(name) {
    //year number
    name = name.replace(/(2)\d{3}/g, "")
    //useless words
    name = name.replace(new RegExp(activeState, "ig"), "")
    //duplicate whitespaces
    name = name.replace(/\s+/g,' ')
    return name.trim()
}

function outsideDate(date, start, end) {
    return date > end || date < start
}

function collectStatistics(region, year) {
    console.log("collectStatistics: " + region + " " + year)
    activeState = region
    var days = []
    var allEvents = []
    eachDay(START_DATE, END_DATE, (day) => days.push(day))
    statistics.all = days.length
    days = days.filter(day => day.getDay() % 6)
    statistics.weekend = statistics.all - days.length
    statistics.hollidays = 0
    Promise.all([
        fetch('data/ferien_' + region + '_' + year[0] + '.ics').then(response => response.text()),
        fetch('data/feiertage_' + region + '_' + year[0] + '.ics').then(response => response.text()),
        fetch('data/ferien_' + region + '_' + year[1] + '.ics').then(response => response.text()),
        fetch('data/feiertage_' + region + '_' + year[1] + '.ics').then(response => response.text())
    ]).then(responses => {
        responses.forEach(text => {
            var jcalData = ICAL.parse(text)
            var comp = new ICAL.Component(jcalData)
            var events = comp.getAllSubcomponents("vevent")
            events.forEach(rawEvent => {
                var event = new ICAL.Event(rawEvent)
                var start = event.startDate.toJSDate()
                var end = event.endDate.toJSDate()
                end.setDate(end.getDate() - 1)
                before = days.length
                days = days.filter(day => outsideDate(day, start, end))
                if (before != days.length) {
                    duration = before - days.length;
                    statistics.hollidays += duration
                    allEvents.push({
                        name: formatName(event.summary),
                        start: start,
                        end: end,
                        length: duration
                    })
                }
            })
        })
        allEvents.forEach(event => {
            event.schoolUntil = days.filter(day => !outsideDate(day, START_DATE, event.start)).length
        })
        allEvents.sort((a,b) => a.start - b.start)
        statistics.events = allEvents
        statistics.left = days.length
        renderData()
    })
}
$(function() {
    let stateSelect = $('#state');
    let yearSelect = $('#year');

    function updateSelection() {
        collectStatistics(stateSelect.val(), yearSelect.val().split("/"))
    }
    stateSelect.on('change', updateSelection)
    yearSelect.on('change', updateSelection)
    updateSelection();
});