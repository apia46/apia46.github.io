//makes sure an option should actually show
//you can optionally pass an execArg that is sent down through functions (non-EXEC only for now)
function shouldItShow(thing, { execArg } = {}) {
    var showValidity
    var showIf = thing.showIf

    if(showIf) {
        showValidity = getShowValidity(showIf, execArg)
    } else {
        showValidity = true
    }

    //if it should show, check to see if it's a message or dialogue that should only show once
    if(showValidity == true) {
        if(thing.showOnce && thing.text) { //it's a message, so check the current parent for having been seen
            return check(`${page.dialoguePrefix}__${env.currentDialogue.chainName}-${slugify(env.currentDialogue.branch.name)}`, false)

        } else if(thing.showOnce && thing.destination) { //it's a dialogue option
            //++ denotes special moth format (or otherwise 'global')
            console.log(thing)
            if(env.currentDialogue.active) if(env.currentDialogue.chainName.includes("++")) { //TODO: having a current dialogue check in here might be a consistency problem?
                if(env.currentDialogue.chainName.includes("mth++")) { return check(`mth++${page.dialoguePrefix}-${slugify(thing.destination)}`, false) }
                else return check(`${env.currentDialogue.chainName}-${slugify(thing.destination)}`, false)
            }
            //otherwise it's normal
            else return check(`${page.dialoguePrefix}__${env.currentDialogue.chainName}-${slugify(thing.destination)}`, false)
        }
    }

    return showValidity
}

//'upgrades' a 'showIf' object to be its most verbose form ([[thing], [thing, true]])
//this undoes shorthands used across showIf and lets us expect a standard 'shape' when using getShowValidity
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


//sort of like check, but takes either a string, array, or 2d array of CHECK conditions (or EXECs)
//this is used to check if all of the "showIf" conditions are true - primarily in dialogue, but also in stage locks
function getShowValidity(showIf, execArg) {
    if(typeof showIf == "undefined") return true

    var conditions = []

    if(typeof showIf == 'function') {
        //console.log('func, attempting with:', execArg)
        conditions.push(showIf(execArg))

    } else {
        //evaluates 2d array, [[key, val], [key, val]]
        //we do some standardizing since showIfs can come in a few forms
        showIf = upgradeShowIf(showIf)

        showIf.forEach(flag => {
            if(flag[0].startsWith('EXEC::')) { //this means that the flag in question is an exec string, so execute it and put the return in conditions
                conditions.push(Function(`return ${flag[0].replace('EXEC::', '')}`)())
            } else {
                if(flag.length == 1) conditions.push(check(flag[0]))
                else conditions.push(check(flag[0], flag[1]))
            }
        })
    }

    //returns a check of if all conditions are true - .every(boolean) returns true if everything is truthy
    //console.log(conditions)
    return conditions.every(Boolean)
}