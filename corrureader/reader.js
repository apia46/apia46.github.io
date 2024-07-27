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
var currentText
var currentPage
var dialogueMenuLatest

$(()=>{
    fetch('dialogue.json').then((response) => response.json()).then((json) => {
        data = json
        getPages()
    })
})

function getPages(){
    var pages = Object.keys(data)
    var menuContents = ``

    pages.forEach(pageName=>{
        var page = data[pageName]
        var metadata = page.shift()
        var entListHTML = ``

        page.forEach(text=>{
            if (text.type == 4) return //respobj
            entListHTML += `
            <div class="act-option" text="${text.context}" page="${pageName}">${text.context}</div>
            `
        })

        menuContents += `
        <div class="page collapsed" page="${pageName}" style="--pageImg: url(${pageName in PAGEIMAGES ? PAGEIMAGES[pageName] : metadata.image});">
            <div class="pageheader"><span>${pageName in PAGETITLES ? PAGETITLES[pageName] : metadata.title}</span></div>
            <div class="pageents-wrapper">
                <div class="pageents">${entListHTML}</div>
            </div>
        </div>`
    })

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

    //clickable entries
    document.querySelectorAll('.pageents .act-option').forEach(e=>{
        e.addEventListener('click', ()=>{
            parseDialogue(e.getAttribute("page"), e.getAttribute("text"))
        })
    })
    document.querySelector('.page[page="hub.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\hub.js"]'))
    document.querySelector('.page[page="local\\\\ozo.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\jokziozo_dialogue.js"]'))
    document.querySelector('.page[page="local\\\\ozo.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\shared\\\\e3a2geli.js"]'))
    document.querySelector('.page[page="local\\\\ocean\\\\embassy\\\\index.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\embassy_precollapse.js"]'))
    document.querySelector('.page[page="local\\\\ocean\\\\embassy\\\\index.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\embassy_collapse.js"]'))
    document.querySelector('.page[page="local\\\\ocean\\\\embassy\\\\index.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\embassy_golem.js"]'))
    document.querySelector('.page[page="local\\\\beneath\\\\embassy.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\beneath_embassy.js"]'))
    querySelectorAll('.page[page*="local\\\\uncosm\\\\"]').forEach(page=>{
        var pagename = page.getAttribute("page")
        if (pagename == "")
    })
}

function parseDialogue(page, dialogueName){
    currentPage = page
    var dialogue = data[page].find((value)=>{return value.context==dialogueName})
    switch(dialogue.type){
        case 0:
            currentText = generateDialogueObject(dialogue.text.join("\n"))
            document.getElementById("dialogue-box").innerHTML = ""
            dialogueMenuLatest = -1
            display(currentText.start)
        case 4:
            return generateDialogueObject(dialogue.text.join("\n"))
    }
}

function display(text){
    var dialogueHtml = ``
    var previousActor = ""
    text.body.forEach(dialogue=>{
        var actor = getDialogueActor(dialogue.actor, true)

        var portrait = ``

        var showIfText = ""
        if (dialogue.showIf) {
            showIfText = []
            dialogue.showIf.forEach(condition=>{
                var isFalse = condition.includes(false) ? "¬" : ""
                showIfText.push(isFalse+condition[0])
            })
            showIfText = "SHOWIF::" + String(showIfText)
        }
        
        if (actor != previousActor && actor.image) portrait = `<div class="dialogue-portrait" style="--background-image: url(${actor.image});"></div>`
        dialogueHtml += `
        <div class="dialogue-message actor-${dialogue.actor.replace("::", " expression__")} ${actor.player ? "from-player" : ""} ${actor.type} ${dialogue.class || ""} sent">
            ${dialogue.showIf||dialogue.showOnce?`<div class="dialogueheader">${showIfText}${dialogue.showIf&&dialogue.showOnce?" ":""}${dialogue.showOnce?"SHOWONCE":""}</div>`:""}
            ${portrait}
            <div class="dialogue-text">
                ${dialogue.text}
            </div>
        </div>
        `
        if (dialogue.wait) dialogueHtml += `
            <div class="wait"><span>WAIT ${dialogue.wait} MS</span></div>
        `
        previousActor = actor
    })
    dialogueMenuLatest += 1
    dialogueHtml += `<div id="dialogue-menu-${dialogueMenuLatest}" class="dialogue-menu"></div>`
    document.getElementById("dialogue-box").insertAdjacentHTML('beforeend', dialogueHtml)
    if (text.responses) {
        text.responses.forEach(response=>{
            var actor = getDialogueActor(response.name, true)
            document.getElementById(`dialogue-menu-${dialogueMenuLatest}`).insertAdjacentHTML('beforeend', `
                <div class="dialogue-actor ${actor.type} dialogue-options-${actor.name} actor-${actor.name} sent">
                    <div class="dialogue-portrait" style="--background-image: url(${actor.image})"></div>
                    <div class="dialogue-options"></div>
                </div>
            `)
            var options = document.querySelector(`#dialogue-menu-${dialogueMenuLatest} .dialogue-options-${actor.name} .dialogue-options`)
            response.replies.forEach(reply=>{
                var replyName = reply.name == "function" ? reply.name() : reply.name.trim()

                var isEnd //corru, you didnt have to do it like this. what the fuck
                if(reply.fakeEnd || reply.destination == "END") isEnd = reply.fakeEnd || "(end chat)" 

                options.setAttribute("replysummary", (options.getAttribute("replysummary")?options.getAttribute("replysummary")+" ":"")+(isEnd?reply.name:reply.destination))

                var readState = checkUnread(reply)
                if(readState == false) readState = "read"
                var readAttribute = reply.hideRead ? 'read="hidden"' : `read=${readState}`
                
                var definition = ""
                var showIfText = false
                if (reply.showIf) {
                    showIfText = []
                    reply.showIf.forEach(condition=>{
                        var isFalse = condition.includes(false) ? "¬" : ""
                        showIfText.push(isFalse+condition[0])
                    })
                }
                if (reply.exec || reply.showIf) definition = `definition='${reply.exec?"EXEC::"+reply.exec:""}${reply.exec&&showIfText?"\n":""}${showIfText?"SHOWIF::"+showIfText.join(", "):""}${showIfText&&reply.showOnce?"\n":""}${reply.showOnce?"SHOWONCE":""}'`

                options.insertAdjacentHTML("beforeend", `
                <span class="reply ${isEnd ? "end-reply" : ""} ${reply.class || ""}" reply="${reply.destination}" name="${replyName}" ${isEnd ? `endtext="${isEnd}"` : ''} ${!isEnd ? readAttribute : ""} ${definition}>${replyName}</span>
                `)
                
                var replyObj = document.querySelector(`#dialogue-menu-${dialogueMenuLatest} .dialogue-options span[name="${replyName}"]`)
                replyObj.addEventListener('mousedown', function(e) {

                    if(reply.exec) {
                        try { reply.exec() } catch(e) {console.log(e)}
                    }

                    var box = document.getElementById("dialogue-box")
                    if (box.lastChild != replyObj.parentElement.parentElement.parentElement) {while (box.lastChild != replyObj.parentElement.parentElement.parentElement) box.removeChild(box.lastChild)}
                    //determine how to handle the reply based on any special prefixes or names
                    let replyValue = this.attributes.reply.value
                    if(replyValue == "END") { //end of dialogue
                        //endDialogue(env.currentDialogue.chain.end) ehh?
                    } else {
                        [].slice.call(options.children).forEach(thisReply=>{thisReply.setAttribute("read", "unread")})
                        replyObj.setAttribute("read", "read")
                        if(replyValue.includes('CHANGE::')) { //changing to different dialogue
                        changeDialogue(replyValue.replace('CHANGE::', ''))
                    } else if(replyValue.includes('EXEC::')) { //executing a function - the function given should end dialogue or change it, otherwise may softlock
                        Function(`${replyValue.replace('EXEC::', '')}`)()
                    } else {
                        display(currentText[replyValue])
                    }}
                })
                replyObj.addEventListener('mouseenter', ()=>play('muiHover'))
                replyObj.addEventListener('click', ()=> play('muiClick'))
            })
            var sameoptions = 0
            document.querySelectorAll(".dialogue-options").forEach(thisOptions=>{
                if (thisOptions.getAttribute("replysummary") == options.getAttribute("replysummary")) sameoptions += 1
            })
            if (sameoptions > 1) options.classList.add("seen")
        })
    }
}

function changeDialogue(to){
    document.getElementById("dialogue-box").innerHTML = ""
    parseDialogue(currentPage, to)
}