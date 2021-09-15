var darkSwitch;
$(document).ready(function(){
    darkSwitch = document.getElementById("darkSwitch");
    initTheme();
    $('#darkSwitch').change(resetTheme)
})
function initTheme() {
    var lc = localStorage.getItem("darkSwitch")
    var selected = lc === "dark" || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    darkSwitch.checked = selected;
    apply(selected)
}

function apply(dark) {
    if (dark) {
        document.body.setAttribute("data-theme", "dark");
    } else {
        document.body.removeAttribute("data-theme");
    }
}

function resetTheme() {
    apply(darkSwitch.checked)
    if (darkSwitch.checked) {
        localStorage.setItem("darkSwitch", "dark");
    } else {
        localStorage.removeItem("darkSwitch");
    }
}
