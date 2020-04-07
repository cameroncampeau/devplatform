function getJobOnThisPage() {
    return {
        name: document.querySelector(".jobsearch-JobInfoHeader-title").innerText,
        company: document.querySelector(".jobsearch-DesktopStickyContainer-companyrating").innerText,
        url: window.location.href,
        time: Date.now(),
    }
}
async function getJobViewHistory() {
    var job = getJobOnThisPage();
    var recorded_job = await fetch("https://localhost/jobsearch/Job/" + job.name).then(res => res.json());

    return recorded_job;
}
async function saveJob(job) {
    return await fetch({url: "https://localhost/jobsearch/Job", body: JSON.stringify(job)})
}
function displayJobViewHistory(job) {
    var el = document.createElement("div");
    el.innerHTML = `
        <div style="color:#ececec; position:fixed; right: 0px; z-index:9999; color:red;">${new Date(job.time).toDateString()}</div>
    `
    return el;
}
async function init() {
    try {
        var job = getJobViewHistory();
        displayJobViewHistory(job)
    } catch(e) {
        var job = getJobOnThisPage();
        await saveJob(job);
    }
}

init();