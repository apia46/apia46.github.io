const PAGETITLES = {
    "index.html": "..__INDEX__..",
    "not_found.html": "!!__ERROR::NOT_FOUND__!!",
    "local\\beneath\\depths.html": "..__DEPTHS_2__..",
    "local\\ocean\\ship\\interview.html": "..__INTERVIEW__..",
    "local\\uncosm\\index.html": "..__UNCOSM__..",
    "local\\uncosm\\where.html": "..__MEMORY_HOLE__..",

    "local\\uncosm\\cavik.html": "??__MEMHOLE::CAVIK__??",
    "local\\uncosm\\clemens romanus.html": "??__MEMHOLE::CLEMENS_ROMANUS__??",
    "local\\uncosm\\corru.html": "??__MEMHOLE::CORRU__??",
    "local\\uncosm\\dog.html": "??__MEMHOLE::DOG__??",
    "local\\uncosm\\dull.html": "??__MEMHOLE::DULL__??",
    "local\\uncosm\\effigy.html": "??__MEMHOLE::EFFIGY__??",
    "local\\uncosm\\flower.html": "??__MEMHOLE::FLOWER__??",
    "local\\uncosm\\larval.html": "??__MEMHOLE::LARVAL__??",
    "local\\uncosm\\parasite.html": "??__MEMHOLE::PARASITE__??",
    "local\\uncosm\\sorry.html": "??__MEMHOLE::SORRY__??",
    "local\\uncosm\\spire.html": "??__MEMHOLE::SPIRE__??",
    "local\\uncosm\\surface.html": "??__MEMHOLE::SURFACE__??",
    "local\\uncosm\\veilk.html": "??__MEMHOLE::VEILK__??",
    "local\\uncosm\\yuzku.html": "??__MEMHOLE::YUZKU__??",
}
const PAGEIMAGES = {
    "not_found.html": "assets/pages/not_found.png",
    "concepts\\critta.html": "assets/pages/critta.png",
    "concepts\\enemy.html": "assets/pages/enemy.png",
    "concepts\\prog.html": "assets/pages/prog.png",
    "hello.html": "assets/pages/hello.png",
    "local\\depths.html": "assets/pages/depths.png",
    "local\\beneath\\depths.html": "assets/pages/depths2.png",
    "local\\beneath\\index.html": "assets/pages/beneath.png",
    "local\\beneath\\parasite.html": "assets/pages/parasite.png",
    "local\\ocean\\ship\\elsewhere.html": "https://corru.observer/img/socials/code__clemens%20romanus.gif",
    "local\\ocean\\ship\\interview.html": "assets/pages/interview.png",
    "local\\city\\street.html": "https://corru.observer/img/local/city/street.gif",
}

var data

$(()=>{
    fetch('dialogue.json').then((response) => response.json()).then((json) => {
        data = json
        getPages()
    })
})

function getPages(){
    var pages = Object.keys(data)
    var menuContents = ``

    for (const pageNum in pages) {
        var pageName = pages[pageNum]
        var page = data[pageName]
        var metadata = page.shift()
        //console.log(pageName, metadata)
        var entListHTML = ``

        for (const textNum in page) {
            var text = page[textNum]
            //console.log(text)
            entListHTML += `
            <div class="act-option" text="${text.context}" page="${pageName}">${text.context}</div>
            `
        }

        menuContents += `
        <div class="page" page="${pageName}" style="--pageImg: url(${pageName in PAGEIMAGES ? PAGEIMAGES[pageName] : metadata.image});">
            <div class="pageheader"><span>${pageName in PAGETITLES ? PAGETITLES[pageName] : metadata.title}</span></div>
            <div class="pageents-wrapper">
                <div class="pageents">${entListHTML}</div>
            </div>
        </div>`
    }

    //add html
    document.querySelector("#readout .pagelist").insertAdjacentHTML('beforeend', menuContents)
    //sfx for hover, etc
    document.querySelectorAll(`#readout .pageheader, #readout .ent[entname]`).forEach(e=>{
        e.addEventListener('mouseenter', ()=>play('muiHover'))
        e.addEventListener('click', ()=> play('muiClick'))
    })

    //collapse toggle
    document.querySelectorAll('#readout .pageheader').forEach(e=>{ //pageheaders collapse/uncollapse their parents
        e.addEventListener('click', ()=>e.parentElement.classList.toggle('collapsed'))
    })
} 