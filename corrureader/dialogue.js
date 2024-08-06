/* dialogue string generation */
//Generates a dialogue tree based on a string
//just a nice way to write stuff instead of hand-coding JSON objects
//template is below the function
function generateDialogueObject(genString) {
	let split = genString.split('\n')
	let obj = {}
    let lastParent = { // used to track depth
        blockShowControl: false, // controls SHOWIF blocks that affect multiple dialogues
        blockShowOnceControl: false // ditto for SHOWONCE
    }

    function parseShowif(showif) {
        let finalShowIf = showif
            .replace('SHOWIF::', '')
            .replace(/'/g, '"')// removes the showif indicator and swaps single quotes for double (required for json parse for whatever reason)
            .replace(/</g, '\\u003c') //apparently < and > throw errors if they're used unescaped in JSON... weird
            .replace(/>/g, '\\u003e')
            .replace(/\\`/g, '`')

        try {
            return upgradeShowIf(JSON.parse(`{ "reasons":${finalShowIf}}`).reasons) 
        } catch(e) {console.log(showif, e)}
    }
	
	split.forEach(initialLine => {
        let line = initialLine.replace(/\s+$/, '') // remove trailing space on RIGHT SIDE only
        let tabs = (line.match(/    /g) || []).length // since left side matters for this
        var text

        //console.log(line)
        //console.log(tabs)
        switch(tabs) {
            // lv0 - branch name. if it starts with end, it's an end function
            // if it's a dialogue branch, just define the object for later and redef lastParent
            case 0: 
                if(line == "") return

                //block handling
                else if(line.startsWith('____')) {
                    let block = line.replace('____', '')

                    if(block.startsWith('SHOWIF')) {
                        lastParent.blockShowControl = parseShowif(block)

                    } else if(block.startsWith('SHOWONCE')) {
                        lastParent.blockShowOnceControl = true

                    } else if(block == 'END') {
                        lastParent.blockShowControl = false
                        lastParent.blockShowOnceControl = false
                    }
                }


                //special handling
                else if(line.startsWith('END::')) { //this is a function to exec at the end of the dialogue
                    obj['end'] = Function(line.replace('END::', ''))
                    lastParent = {}
                } else if(line.startsWith('RESPOBJ::')) { //this is means it's just a reusable response list object definition, not a full dialogue tree
                    obj = {responses: []}
                    lastParent = {"0": obj}
                }

                //regular dialogue handling
                else {
                    obj[line] = { name: line, body: [], responses: [] }
                    lastParent = {"0": obj[line]}
                }
            break

            // lv1 - dialogue from an actor, or responses from an actor
            // if RESPONSES, simply mark that we're in the responses section via lastParent[1]
            // otherwise, it's an actor, so create a dialogue line object and add to lastParent[2]
            case 1:
                lastParent[1] = false 
                lastParent[2] = false // clears depth

                text = line.replace('    ', '')
                if(text == "") return
                if(text.includes("RESPONSES::")) { //actor for responses
                    let newResponses = { name: text.replace('RESPONSES::', ''), replies: [] }
                    lastParent[1] = newResponses
                    lastParent[0].responses.push(newResponses)

                } else if(text.includes("RESPOBJ::")) { //it's the name of a reusable response object, i.e. env.hello.generalReceptionistResponses
                    lastParent[0].responses = parseDialogue(currentPage, text.replace('RESPOBJ::', ''))
                } else { //actor for dialogue
                    let newDialogue = { actor: text }
                    lastParent[1] = newDialogue
                    lastParent[0].body.push(newDialogue)
                }
            break

            // lv2 - dialogue text, OR name/destination for a response
            // if contains <+>, then response - split by that and assign relevant info to the lastParent[1]
            // otherwise, add as text to lastParent[1] - it's just dialogue text
            case 2:
                text = line.replace('        ', '')
                if(text == "") return
                if(!text.includes("<+>")) { //regular actor dialogue
                    lastParent[2] = false // clears depth

                    if(lastParent[1].text) { // if it already has text, make a new object with the same actor
                        let newDialogue = { 
                            actor: lastParent[1].actor,
                            "text": text
                        }
                        lastParent[1] = newDialogue
                        lastParent[0].body.push(newDialogue)
                    } else {
                        lastParent[1].text = text
                    }

                    try{
                    if(lastParent[1].text.includes('TEXEC::')) { //if it contains TEXEC, then that means it has a text exec - a function that returns a string to use when it appears
                        /* since this returns the first thing you give it, it should be either a oneliner or a function that executes and returns something */
                        lastParent[1].texec = Function(`return ${text.replace('TEXEC::', '')}`)
                    }
                    } catch(e) {console.log(e); console.log(lastParent, line)}
                    
                    //if there's a surrounding block control, we add the showIf condition to the dialogue object
                    //same for showonce
                    if(lastParent.blockShowControl) { lastParent[1].showIf = lastParent.blockShowControl; /*console.log(lastParent[1])*/ }
                    if(lastParent.blockShowOnceControl) { lastParent[1].showOnce = lastParent.blockShowOnceControl }
                    
                } else { //reply text and location
                    let replyInfo = text.split('<+>')
                    
                    var replyName = replyInfo[0]
                    var replyDest = replyInfo[1]
                    
                    let replyObj = {
                        name: replyName,
                        destination: replyDest
                    }

                    lastParent[1].replies.push(replyObj)
                    lastParent[2] = replyObj
                    
                    //can be affected by block controls
                    if(lastParent.blockShowControl) { lastParent[2].showIf = lastParent.blockShowControl; /*console.log(lastParent[2])*/ }
                    if(lastParent.blockShowOnceControl) { lastParent[2].showOnce = lastParent.blockShowOnceControl }
                }
            break

            // lv3 - optional details like WAIT and EXEC - exec applies to both replies and dialogue lines
            // wait is only used by dialogue lines, but no harm in checking for it on reply anyway
            // uses lastParent[1] or lastParent[2] based on whether lastParent[2] is false or not (true means parent is reply)
            case 3: 
                var recipient = lastParent[1]
                if(lastParent[2]) recipient = lastParent[2]

                try {
                    text = line.replace('            ', '')
                    newReasons = false
                    
                    if(text == "") return
                    if(text.startsWith("EXEC::")) recipient.exec = Function(line.replace('EXEC::', '').replaceAll('\\', ''))
                    if(text.startsWith("WAIT::")) recipient.wait = line.replace('WAIT::', '') //applies only to dialogue
                    if(text.startsWith("AUTOADVANCE::")) recipient.autoAdvance = true //applies only to dialogue
                    if(text.startsWith("SHOWIF::")) newReasons = parseShowif(line)
                    if(text.startsWith("SHOWONCE::")) recipient.showOnce = true
                    if(text.startsWith("CLASS::")) recipient.class = text.replace('CLASS::', '') //adds specified text as classes (split by space) to the element rendered
                    if(text.startsWith("HIDEREAD::")) recipient.hideRead = true //applies only to replies
                    if(text.startsWith("FAKEEND::")) recipient.fakeEnd = text.replace('FAKEEND::', '') || true //applies only to replies. takes either text to use or nothing

                    if(recipient.showIf && newReasons) {
                        recipient.showIf = recipient.showIf.concat(newReasons)
                    } else if(newReasons) {
                        recipient.showIf = newReasons
                    }
                } catch(e) {
                    console.log("dialogue parsing error, present line is: ", line)
                    throw (e)
                }
            break
        }
    })

    //return just the responses if the object has this - means it's a respobj definition
    //also marks it as such with a special ID for use with tracking 
    if(obj.responses) {
        obj.responses.respobj = Math.random() * 1000
        return obj.responses
    }

    //otherwise, return the full obj
    else return obj
}

function upgradeShowIf(showIf) {
    let newShowIf = showIf

    if(Array.isArray(showIf)) {
        if(Array.isArray(showIf[0])) return showIf //no changes needed
        else newShowIf = [showIf] //simple upgrade to 2D needed
    } else if(typeof showIf == "string") {
        newShowIf = [[showIf]] //ditto
        //if it's a string, it's either an EXEC:: string or a regular string
        //so this can just be wrapped in two arrays
    }

    return newShowIf
}

//takes an actor slug, with or without expression (denoted with ::), and returns an object with relevant info
function getDialogueActor(inputSlug, noExec, page) {
    if(!inputSlug) return null
    let actorSlug = inputSlug
    let expression = 'default'

    if(actorSlug.includes('::')) {
        let split = actorSlug.split("::")
        actorSlug = split[0]
        expression = split[1]
    }

    let actorObj = env.dialogueActors[actorSlug]
    if(!actorObj) throw `no actor object found for ${actorSlug}`
    if (actorObj.pageSpecific) actorObj = actorObj[page] //page specific actors (just other as of v1)
    if(!actorObj.name) actorObj.name = actorSlug //throw a proper name in for later use if there ain't one already

    //anything without expressions is just a regular actor object so we return it immediately
    if(!actorObj.expressions) return actorObj

    //however, anything with expressions will be modified based on the input expression first
    if((!actorObj.expression || actorObj.expression != expression)) { //we'll see how it goes
        actorObj.expression = expression

        if(actorObj.expressions[expression].image) actorObj.image = actorObj.expressions[expression].image
        if(actorObj.expressions[expression].voice) actorObj.voice = actorObj.expressions[expression].voice
        if(actorObj.expressions[expression].type) actorObj.type = actorObj.expressions[expression].type

        //the exec on an expression happens whenever the expression changes, so we execute it
        if(!noExec && actorObj.expressions[expression].exec) actorObj.expressions[expression].exec()
    }
    return actorObj
}

//so that i can changed it later if i decide to add flags which i really dont want to but it might happen
//detects if a reply is either unread or contains any unread replies in subsequent replies (recursion bitch!!!)
//intended ONLY for use within dialogue presently
//returns "unread", "within", or false
function checkUnread(reply, examinedReplies = [], originalReply = reply) {
    //if the destination contains a ::, that means it's super special and will probably do shit, so return false
    //something like that should be marked as HIDEREAD anyway
    //also returns false if the destination is END
    if(reply.destination.includes("::") || reply.destination == "END") return false
    
    //immediately return if the reply hides whether it's been read
    //also returns if it's a fake end - they're usually loops
    if(reply.hideRead || reply.fakeEnd) return false

    //if it's unread, we return right away
    return "unread"
}