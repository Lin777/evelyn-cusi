jQuery(document).ready(function ($) {


    /*======= Skillset *=======*/

    $('.level-bar-inner').css('width', '0');

    $(window).on('load', function () {

        $('.level-bar-inner').each(function () {

            var itemWidth = $(this).data('level');

            $(this).animate({
                width: itemWidth
            }, 800);

        });

    });

    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();

    /* jQuery RSS - https://github.com/sdepold/jquery-rss */
    $("#rss-feeds").rss(

        //Change this to your own rss feeds
        "http://feeds.feedburner.com/TechCrunch/startups",

        {
            // how many entries do you want?
            // default: 4
            // valid values: any integer
            limit: 3,

            // the effect, which is used to let the entries appear
            // default: 'show'
            // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
            effect: 'slideFastSynced',

            // outer template for the html transformation
            // default: "<ul>{entries}</ul>"
            // valid values: any string
            layoutTemplate: "<div class='item'>{entries}</div>",

            // inner template for each entry
            // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
            // valid values: any string
            entryTemplate: '<h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fa fa-external-link"></i>Read more</a></div>'

        }
    );


    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    GitHubActivity.feed({ username: "caseyscarborough", selector: "#ghfeed" });


});


/* ----------- */

let currentLang = "es"
let profileData = null
let experiencesData = []
let projectsData = []

async function loadData() {
    const [profileRes, expRes, projRes] = await Promise.all([
        fetch("./data/profile.json"),
        fetch("./data/experience.json"),
        fetch("./data/projects.json")
    ])

    profileData = await profileRes.json()
    experiencesData = await expRes.json()
    projectsData = await projRes.json()

    renderAll()
}

function renderAll() {
    renderProfile()
    renderExperiences()
    renderProjects()
}

function renderProfile() {
    document.getElementById("profile-name").textContent = profileData.name
    document.getElementById("profile-title").textContent = profileData.title[currentLang]
    document.getElementById("profile-subtitle").textContent = profileData.subtitle[currentLang]

    document.getElementById("profile-linkedin").href = profileData.linkedin
    document.getElementById("profile-github").href = profileData.github
    document.getElementById("profile-email").href = "mailto:" + profileData.email

    document.getElementById("profile-cta").textContent = profileData.cta[currentLang]
}

function renderExperiences() {
    const container = document.getElementById("experience-list")

    container.innerHTML = experiencesData.map(exp => `
    <div class="experience-card">
      <h3>${exp.role[currentLang]}</h3>
      <p>${exp.company} · ${exp.period[currentLang]}</p>
      <p>${exp.location[currentLang]}</p>
      <p>${exp.description[currentLang]}</p>
      <ul>
        ${exp.highlights[currentLang].map(h => `<li>${h}</li>`).join("")}
      </ul>
    </div>
  `).join("")
}

function renderProjects() {
    const container = document.getElementById("projects-list")

    container.innerHTML = projectsData.map(project => `
    <div class="project-card">
      <p class="project-category">${project.category[currentLang]}</p>
      <h3>${project.title[currentLang]}</h3>
      <p>${project.description[currentLang]}</p>
      <div class="metric">
        <span>${project.metric.value}</span>
        <span>${project.metric.label[currentLang]}</span>
      </div>
      <div class="tech">
        ${project.tech.map(t => `<span>${t}</span>`).join("")}
      </div>
    </div>
  `).join("")
}

document.addEventListener("DOMContentLoaded", () => {
    loadData()

    document.getElementById("btn-es").onclick = () => {
        currentLang = "es"
        renderAll()
    }

    document.getElementById("btn-en").onclick = () => {
        currentLang = "en"
        renderAll()
    }
})