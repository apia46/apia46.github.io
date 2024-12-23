const PAGETITLES = {
    "index.html": "..__INDEX__..",
    "not_found.html": "!!__ERROR::NOT_FOUND__!!",
    "local\\beneath\\depths.html": "..__DEPTHS_2__..",
    "local\\ocean\\ship\\interview.html": "..__INTERVIEW__..",
    "local\\uncosm\\index.html": "..__UNCOSM__..",
    "local\\uncosm\\where.html": "..__MEMORY_HOLE__..",

    "local\\uncosm\\cavik.html": "??__CAVIK__??",
    "local\\uncosm\\clemens romanus.html": "??__CLEMENS_ROMANUS__??",
    "local\\uncosm\\corru.html": "??__CORRU__??",
    "local\\uncosm\\dog.html": "??__DOG__??",
    "local\\uncosm\\dull.html": "??__DULL__??",
    "local\\uncosm\\effigy.html": "??__EFFIGY__??",
    "local\\uncosm\\flower.html": "??__FLOWER__??",
    "local\\uncosm\\larval.html": "??__LARVAL__??",
    "local\\uncosm\\parasite.html": "??__PARASITE__??",
    "local\\uncosm\\sorry.html": "??__SORRY__??",
    "local\\uncosm\\spire.html": "??__SPIRE__??",
    "local\\uncosm\\surface.html": "??__SURFACE__??",
    "local\\uncosm\\veilk.html": "??__VEILK__??",
    "local\\uncosm\\yuzku.html": "??__YUZKU__??",
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
    "local\\uncosm\\recosm.html": "assets/pages/recosm.png",
    "local\\uncosm\\where.html": "https://corru.observer/img/socials/uncosm.gif",
    "local\\uncosm\\cavik.html": "assets/pages/cavik.png",
    "local\\uncosm\\clemens romanus.html": "assets/pages/memory.png",
    "local\\uncosm\\corru.html": "assets/pages/memory.png",
    "local\\uncosm\\dog.html": "assets/pages/memory.png",
    "local\\uncosm\\dull.html": "assets/pages/memory.png",
    "local\\uncosm\\effigy.html": "assets/pages/effigy.png",
    "local\\uncosm\\flower.html": "assets/pages/memory.png",
    "local\\uncosm\\larval.html": "assets/pages/memory.png",
    "local\\uncosm\\parasite.html": "assets/pages/memory.png",
    "local\\uncosm\\sorry.html": "assets/pages/sorry.png",
    "local\\uncosm\\spire.html": "assets/pages/memory.png",
    "local\\uncosm\\surface.html": "assets/pages/memory.png",
    "local\\uncosm\\veilk.html": "assets/pages/memory.png",
    "local\\uncosm\\yuzku.html": "assets/pages/memory.png",
    "js\\hub.js": "https://corru.observer/img/socials/hub.gif",
    "js\\jokziozo_dialogue.js": "https://corru.observer/img/socials/ozo.gif",
    "js\\shared\\e3a2geli.js": "https://corru.observer/img/socials/frame.gif",
    "js\\beneath_embassy.js": "https://corru.observer/img/socials/frame.gif",
    "js\\embassy_golem.js": "https://corru.observer/img/socials/golms.gif",
    "js\\embassy_precollapse.js": "https://corru.observer/img/socials/embassy.gif",
    "js\\embassy_collapse.js": "https://corru.observer/img/socials/embassy.gif",
}

var data
var currentText
var currentTextName = "custom"
var currentPage = "custom"
var dialogueMenuLatest
var dialogueStack
var conditions = {}
var checks = []

$(()=>{
    fetch('dialogue.json').then((response) => response.json()).then((json) => {
        data = json
        delete data.metadata
        data["custom"] = [
            {
                "title":"::/CUSTOM/",
                "image":"assets/pages/memory.png",
            },
            {
                "context": "custom",
                "type": 0,
                "text": [
                    "start",
                    "    moth",
                    "        hey buddy",
                    "        what's up?"
                ]
            }
        ]
        getPages()
    })
})

function getPages(){
    document.querySelector(".pagelist").innerHTML = ""
    var pages = Object.keys(data)
    var menuContents = ``

    pages.forEach(pageName=>{
        var page = data[pageName]
        var metadata = page.shift()
        var entListHTML = ``
        var mothChat = false
        if (pageName == "js\\combat\\combatActorsJson.js") return
        if (Object.keys(page).length == 1 && page[0].type == 1) {
            entListHTML = `
            <div class="message moth" actor="moth">
                <img src="assets/img/blank.gif">
                <h2>!!__moth__!!</h2>
                <p><pre>${page[0].text.join("\n")}</pre></p>
            </div>`
        } else {
            page.forEach(text=>{
                if (!(text.type == 0 || text.type == 2) || text.context == "mth++${page.dialoguePrefix}") return
                var mothChatName
                if (text.type == 2) {
                    mothChatName = text.text[0].slice(12, -2)
                    mothChat = true
                }
                entListHTML += `
                <div class="act-option" text="${text.context}" page="${pageName}">${mothChatName||text.context}</div>`
            })
        }
        page.unshift(metadata)
        menuContents += `
        <div class="page collapsed" page="${pageName}" style="--pageImg: url(${PAGEIMAGES[pageName] || metadata.image});">
            <div class="pageheader">
                <span>${PAGETITLES[pageName] || metadata.title}</span>
                ${mothChat?'<i class="moth-sigil"></i>':''}
            </div>
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
    document.querySelector('.page[page="local\\\\ocean\\\\embassy\\\\golem.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\embassy_golem.js"]'))
    document.querySelector('.page[page="local\\\\beneath\\\\embassy.html"] .pageents-wrapper').appendChild(document.querySelector('.page[page="js\\\\beneath_embassy.js"]'))
    var memhole = document.querySelector('.page[page="local\\\\uncosm\\\\where.html"] .pageents-wrapper')
    document.querySelectorAll('.page[page*="local\\\\uncosm\\\\"]').forEach(page=>{
        var pagename = page.getAttribute("page")
        if (pagename == "local\\uncosm\\recosm.html" || pagename == "local\\uncosm\\where.html" || pagename == "local\\uncosm\\index.html") return
        memhole.appendChild(page)
    })
    document.querySelector('.pagelist').insertBefore(document.querySelector('.page[page="js\\\\globalents.js"]'), document.querySelector('.pagelist').firstChild)
    document.querySelector('.pagelist').insertBefore(document.querySelector('.page[page="custom"]'), document.querySelector('.pagelist').firstChild)
}

function parseDialogue(page, dialogueName){
    conditions = {}
    checks = []
    currentPage = page
    var dialogue = data[page].find((value)=>{return value.context==dialogueName}) || console.error(Error(`dialogue "${dialogueName} was not found on page "${page}"`))
    switch(dialogue.type){
        case 0:
            dialogueStack = [dialogueName=="mth++${page.dialoguePrefix}"?"moth_chat":dialogueName]
            currentText = generateDialogueObject(dialogue.text.join("\n"))
            currentTextName = dialogueName
            document.getElementById("export").setAttribute("definition", `NOTE::'exports most recently viewed log::"${currentTextName}"'`)

            var mothComment = data[page]?.find((value)=>{return value.context=="mothComment"})?.text?.join("\n") || false
            /*console.log(mothComment)
            try {mothComment = eval("()=>{"+mothComment+"}")()}
            catch(err) {
                if (err.name == "TypeError") {
                    console.log(err.message.match("^[^ ]+")[0])
                } 
            }*/ //bad fucking idea

            document.getElementById("dialogue-box").innerHTML = ``
            document.getElementById("textheader").innerHTML = `
            <div class="headerbox" style="--img: url(${PAGEIMAGES[page] || data[page][0].image})">
                <span class="headertext">${page}::${dialogueName=="mth++${page.dialoguePrefix}"?"moth_chat":dialogueName}</span>
            </div>
            ${mothComment?`<div class="message moth" actor="moth">
                <img src="assets/img/blank.gif">
                <h2>!!__moth__!!</h2>
                <p><pre>${mothComment}</pre></p>
            </div>`:""}`
            document.getElementById("dialogue-box").style.setProperty("--margintop", String(document.getElementById("textheader").offsetHeight)+"px")
            dialogueMenuLatest = -1
            display(currentText.start)
            if (body.getAttribute("mask") == "dream") showNext() //sorry for the jank
            break;
        case 2:
            parseDialogue(page, "mth++${page.dialoguePrefix}")
            break;
        case 4:
            return generateDialogueObject(dialogue.text.join("\n"))
        default:
            throw ["invalid dialogue case???", dialogue]
    }
}

function display(text){
    var dialogueHtml = ``
    var previousActor = ""
    if (text.name != "start") {
        dialogueStack.length = dialogueMenuLatest+1
        dialogueStack.push(text.name)
        document.querySelector(".headertext").innerHTML = `${currentPage}::${dialogueStack.join("​::")}`
    }
    text.body.forEach(dialogue=>{
        var actor = getDialogueActor(dialogue.actor, true, currentPage)

        var portrait = ``

        var showIfText = ""
        if (dialogue.showIf) {
            showIfText = []
            var thischecks = []
            dialogue.showIf.forEach(condition=>{
                var isFalse = condition.includes(false) ? "¬" : ""
                showIfText.push(isFalse+condition[0]+(condition[1]?" == "+condition[1]:""))
                conditions[condition[0]] = condition.length==2?condition[1]:true
                thischecks.push([condition[0], condition.length==2?condition[1]:true])
            })
            checks.push(thischecks)
            showIfText = "SHOWIF::" + showIfText.join(", ")
        }
        if (actor != previousActor && actor.image) portrait = `<div class="dialogue-portrait" style="--background-image: url(${actor.image});"></div>`
        dialogueHtml += `
        <div class="dialogue-message actor-${dialogue.actor.replace("::", " expression__")} ${actor.player ? "from-player" : ""} ${actor.type} ${dialogue.class || ""} ${dialogue.showIf?`showify" check="${checks.length-1}`:''} ${dialogue.wait?`showify" wait="${dialogue.wait}`:''}" actor="${actor.name}">
            ${dialogue.showIf||dialogue.showOnce?`<div class="dialogueheader">${showIfText}${dialogue.showIf&&dialogue.showOnce?" ":""}${dialogue.showOnce?"SHOWONCE":""}</div>`:""}
            ${portrait}
            <div class="dialogue-text">
                ${dialogue.text}
            </div>
        </div>`
        if (dialogue.wait) dialogueHtml += `
            <div class="wait"><span>WAIT ${dialogue.wait} MS</span></div>`
        previousActor = actor
    })
    dialogueMenuLatest += 1
    dialogueHtml += `<div id="dialogue-menu-${dialogueMenuLatest}" class="dialogue-menu"></div>`
    document.getElementById("dialogue-box").insertAdjacentHTML('beforeend', dialogueHtml)
    if (text.responses) {
        text.responses.forEach(response=>{
            var actor = getDialogueActor(response.name, true, currentPage)
            document.getElementById(`dialogue-menu-${dialogueMenuLatest}`).insertAdjacentHTML('beforeend', `
                <div class="dialogue-actor ${actor.type} dialogue-options-${actor.name} actor-${actor.name}">
                    <div class="dialogue-portrait" style="--background-image: url(${actor.image})"></div>
                    <div class="dialogue-options"></div>
                </div>`)
            var options = document.querySelector(`#dialogue-menu-${dialogueMenuLatest} .dialogue-options-${actor.name} .dialogue-options`)
            var thisDialogueMenu = dialogueMenuLatest
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
                    var thischecks = []
                    reply.showIf.forEach(condition=>{
                        var isFalse = condition.includes(false) ? "¬" : ""
                        showIfText.push(isFalse+condition[0])
                        if (!Object.hasOwn(conditions, condition[0])) conditions[condition[0]] = condition.length==2?condition[1]:true
                        thischecks.push([condition[0], condition.length==2?condition[1]:true])
                    })
                    checks.push(thischecks)
                }
                if (reply.exec || reply.showIf) definition = `definition='${reply.exec?"EXEC::"+String(reply.exec).escapeHtml():""}${reply.exec&&showIfText?"\n":""}${showIfText?"SHOWIF::"+showIfText.join(", "):""}${showIfText&&reply.showOnce?"\n":""}${reply.showOnce?"SHOWONCE":""}'`

                options.insertAdjacentHTML("beforeend", `
                <span class="reply ${isEnd ? "end-reply" : ""} ${reply.class || ""} ${reply.showIf?`showify" check="${checks.length-1}`:``}" reply="${reply.destination}" name="${replyName}" ${isEnd ? `endtext="${isEnd}"` : ''} ${!isEnd ? readAttribute : ""} ${definition}>${replyName}</span>
                `)
                
                var replyObj = Array.from(document.querySelectorAll(`#dialogue-menu-${dialogueMenuLatest} .dialogue-options span[name="${replyName}"]`)).at(-1)
                replyObj.addEventListener('click', function(e) {
                    if(reply.exec) {
                        try { reply.exec() } catch(e) {console.log(e)}
                    }
                    dialogueMenuLatest = thisDialogueMenu
                    var box = document.getElementById("dialogue-box")
                    if (box.lastChild != replyObj.parentElement.parentElement.parentElement) {while (box.lastChild != replyObj.parentElement.parentElement.parentElement) box.removeChild(box.lastChild)}
                    //determine how to handle the reply based on any special prefixes or names
                    let replyValue = this.attributes.reply.value
                    if(replyValue == "END") { //end of dialogue
                        //endDialogue(env.currentDialogue.chain.end) ehh?
                    } else {
                        [].slice.call(options.children).forEach(thisReply=>{if (!thisReply.classList.contains("end-reply") && !(thisReply.getAttribute("read") == "hidden")) thisReply.setAttribute("read", "unread")})
                        if(body.getAttribute("mask") == "dream") document.getElementById("dialogue-box").classList.add("dialogue-click-proceed")
                        if(!(replyObj.getAttribute("read") == "hidden")) replyObj.setAttribute("read", "read")
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
    updateParameters()
}

function changeDialogue(to){
    document.getElementById("dialogue-box").innerHTML = ""
    parseDialogue(currentPage, to)
}

String.prototype.escapeHtml = function(){
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&apos;'
    };
    return this.replace(/[&<>"']/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};

function exportDialogue(){
    document.getElementById("savetext").value = data[currentPage].find((value)=>{return value.context==currentTextName}).text.join("\n")
    document.getElementById("savetext").select()
}

function importDialogue(){
    var text = document.getElementById("savetext").value.split("\n")
    var title = "custom"
    if (text[0].charAt(0) == "\"") title = text.shift().slice(1,-1)
    
    var alreadyExists = data["custom"].find((value)=>{return value.context==title})
    if (alreadyExists) {
        alreadyExists.text = text
    } else {
        data["custom"].push({
            "context": title,
            "type": 0,
            "text": text
        })
    }
    getPages()
}

function updateParameters(){
    paramsObj = document.getElementById("parameters")
    var paramsHTML = `<div class="toggle" onclick="this.parentNode.classList.toggle('active')"></div>`
    Object.keys(conditions).forEach(condition=>{
        var isString = typeof(conditions[condition]) == "string"
        paramsHTML += `
        <div class="parameter ${isString?`string" oninput="updateShowIf('${condition}', this.children[0].value)"`:`${conditions[condition]?"":"false"}" onclick="this.classList.toggle('false'); updateShowIf('${condition}',!this.classList.contains('false'))"`}>
            ${isString?`<input type='text' value='${conditions[condition]}'></input>`:""}
            <span>${condition}</span>
        </div>`
    })
    if (Object.keys(conditions).length == 0) {
        paramsHTML += `<i>* empty *</i>`
    }
    paramsObj.innerHTML = paramsHTML
    updateShowIf()
}

function updateShowIf(condition, value){
    if (condition) conditions[condition] = value
    if (checks.length == 0) return
    document.querySelectorAll(".showify").forEach(element=>{
        var show = true
        checks[Number(element.getAttribute("check"))].forEach(check=>{
            if (conditions[check[0]]!=check[1]) show = false
        })
        if (show) element.classList.remove("unshow")
        else element.classList.add("unshow")
    })
}

function startDream(){
    showNext()
    document.getElementById("dialogue-box").classList.add("dialogue-click-proceed")
}

function showNext(event){
    if (event?.shiftKey) {
        Array.from(document.querySelectorAll("#dialogue-box > .dialogue-message.sent:not(.unshow), #dialogue-box > .dialogue-menu.sent")).at(-1).classList.remove("sent")
    } else {
        var next = document.querySelector("#dialogue-box > .dialogue-message:not(.sent):not(.unshow), #dialogue-box > .dialogue-menu:not(.sent)")
        if (!next) return
        next.classList.add("sent")
        var actor = next.getAttribute("actor")
        if (env.dialogueActors[actor]?.voice) env.dialogueActors[actor].voice()
        else play("muiReadout")
        if (next.classList.contains("dialogue-menu") || !document.querySelector("#dialogue-box > .dialogue-message:not(.sent):not(.unshow), #dialogue-box > .dialogue-menu:not(.sent)")) document.getElementById("dialogue-box").classList.remove("dialogue-click-proceed")
        else {
            var wait = next.getAttribute("wait")
            if (wait) setTimeout(() => document.getElementById("dialogue-box").classList.add("dialogue-click-proceed"), Number(wait))
            else document.getElementById("dialogue-box").classList.add("dialogue-click-proceed")
        }
    }
    document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight;
}

function endDream(){
    document.getElementById("dialogue-box").classList.remove("dialogue-click-proceed")
}