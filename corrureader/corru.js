//basic global stuff
//shortcuts
var content = document.querySelector('#content')
var body = document.body

var env = {
    corruStaticBaseVol: 0.4, //base transition volume
    mui: false, //determines whether the mindspike UI is on or not
    dialogues: {}, //dialogues and actors are added to per-page, as needed. this page will not contain them (outside of ones on every page) to avoid spoilers
    entities: {}, //ditto
    cursor: {x:0, y:0}, //fixed coords
    pageCursor: {x:0, y:0}, //page coords
    targeted: [], //used by MUI to cycle targets
    bgm: null,
    dialogueActors: {
        sourceless: {
            type: "sourceless",
        },

        "sourceless quiet": {
            name: "sourceless",
            type: "sourceless",
            voice: false
        },

        "sourceless incoherent": {
            name: "sourceless",
            type: "sourceless incoherent",
        },
    
        moth: {
            image: 'assets/img/sprites/moth/mothman.gif',
            type: "external"
        }, 
    
        unknown: {
            image: 'assets/img/sprites/velzie/smile2.png',
            type: "velzie",
            element: "#velzieface",
            voice: ()=>{play('talksignal', 0.5)}
        },
    
        self: {
            image: 'assets/img/portraits/interloper.gif',
            type: "interloper",
            player: true
        },
    
        sys: {
            image: 'assets/img/mui/mindspikelogoactive.gif',
            type: "mindspike",
            player: true,
            voice: ()=>{play('muiScanner', 2)}
        },

        funfriend: {
            element: "#funfriend",
            image: 'assets/img/sprites/funfriend/funfriend.gif',
            type: "obesk funfriend",
            voice: ()=>{play('talk', 2)}
        },

        proxyfriend: {
            element: "#ffproxy",
            image: 'assets/img/sprites/funfriend/proxyfriend.gif',
            type: "obesk funfriend",
            voice: ()=>{play('talkhigh', 1)}
        },

        akizet: {
            image: 'assets/img/sprites/akizet/portrait.gif',
            type: "obesk qou akizet",
            element: ".truecreature .akizet",
            player: true,
            voice: ()=>play('talk', 2.5)
        },

        bstrd: {
            image: 'assets/img/sprites/bstrd/bstrd.gif',
            type: "bstrd portrait-cover",
            voice: ()=>play('talkgal', 0.4)
        },
    
        actual_site_error: {
            image: 'assets/img/viendbot.png',
            type: "metafiend portrait-dark portrait-contain",
            voice: ()=>{play('muiClick', 2)}
        },

        bugviend: {
            name: '»õGQàº3¾õ”cR%',
            type: "incoherent thoughtform portrait-blocker hallucination",
            image: "assets/img/sprites/combat/foes/hallucinations/portrait.gif",
            voice: ()=>play('fear', 2)
        },

        effigy: {
            image: 'assets/img/local/uncosm/ozo/akieffigy_portrait.gif',
            type: "thoughtform awakened portrait-haze portrait-cover",
            element: "#realgrid .akieffigy",
            voice: ()=>play('talkflower', 1.25)
        }
    },
    totalMessages: 0,
    
    timeouts: [],
    setTimeout: (func, time) => {
        let newTimeout = setTimeout(func, time)
        env.timeouts.push(newTimeout)
        return newTimeout
    },
    clearTimeouts: ()=>{
        env.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });
    },
		
    intervals: [],
    setInterval: (func, time) => {
        let newInterval = setInterval(func, time)
        env.intervals.push(newInterval)
        return newInterval
    },
    clearIntervals: ()=>{
        env.intervals.forEach(interval => {
            clearInterval(interval)
        });
    },

    //local storage of the last x readout log things
    logStore: [],

    //document-based corru events for modding mostly
    hooks: {
        corru_loaded: new CustomEvent('corru_loaded'), 
        corru_entered: new CustomEvent('corru_entered'),
        corru_resources_added: new CustomEvent('corru_resources_added'),
        corru_leaving: new CustomEvent('corru_leaving'),
        corru_changed: new CustomEvent('corru_changed'),
        corru_net: new CustomEvent('corru_net'),
        corru_act: new CustomEvent('corru_act'),
    },

    masks: {
        reality: {
            sound: "realitymask",
            on: ()=>{},
            off: ()=>{},
            maskImage: `url(assets/img/portraits/interloper.gif)`,
            definition: "'displays all of a text at once'"
        },

        dream: {
            sound: "hungermask",
            on: ()=>{},
            off: ()=>{},
            maskImage: `url(assets/img/sprites/daemons/genericscan.gif)`,
            definition: "'reenacts the dialogue sequence'"
        },
    },

    mss: {
        state: 0.5,
        status: "coherent",
        code: 0
    }
}

env.recentSfx = false
function play(sfxName, pitch = true, volume = 0.75, forcePlay) {
    if(forcePlay) env.recentSfx = false    
    if(env.recentSfx) return
    env.recentSfx = true
    
    //we may change this depending on the SFX played
    var sfx = sfxName
    
    //randomize the pitch slightly by default
    if(pitch === true) {
        sfxmap.rate((Math.random() * 0.2) + 0.9) 
    } else if(typeof pitch == "number") { //set the pitch if specified
        sfxmap.rate(pitch)
    } else { //otherwise false
        sfxmap.rate(1)
    }

    //if this uses a talk sound, we randomly select one of eight
    switch(sfxName) {
        case "talk": sfx = `talk${rand(1, 9)}`; break
        case "talkhigh": sfx = `talkhigh${rand(1, 9)}`; break
        case "talklaugh": sfx = `talklaugh${rand(1, 9)}`; break
        case "talksignal": sfx = `talksignal${rand(1, 9)}`; break
        case "talkcore": sfx = `talkcore${rand(1, 9)}`; break
        case "talkgal": sfx = `talkgal${rand(1, 9)}`; break
        case "talkgel": sfx = `talkgel${rand(1, 9)}`; break
        case "talkcroak": sfx = `talkcroak${rand(1, 9)}`; break
        case "talkchoir": sfx = `talkchoir${rand(1, 9)}`; break
        case "talkflower": sfx = `talkflower${rand(1, 9)}`; break
        case "talkfloweralt": sfx = `talkfloweralt${rand(1, 5)}`; break
        case "talkfairy": sfx = `talkfairy${rand(1, 9)}`; break
        //shot also has a variety
        case "shot": sfx = `shot${rand(1, 7)}`; break
    }

    //duck the BGM briefly so the SFX doesn't layer with it too hard
    if(env.bgm && !env.bgm.isFading && !env.noBgmDuck) {
        env.bgm.volume(0.5)
        setTimeout(()=>{ try{env.bgm.fade(0.5, env.bgm.intendedVol ? env.bgm.intendedVol : 1, 500)} catch(e) {} }, 500)
    }
    
    //play!
    setTimeout(()=>env.recentSfx = false, 50)
    sfxmap.volume(volume)
    sfxmap.play(sfx)    
}

$(()=>{
    body = document.body

    document.addEventListener('contextmenu', event => event.preventDefault());

    //activate mousemove event - simply tracks position on both a window and doc level, used for a ton of things
    env.cursor = {x: 0, y: 0}
    env.pageCursor = {x: 0, y: 0}
    env.defbox = document.getElementById('definition-box')
    env.mouseThrottle = false
    env.mouseThrottleSpeed = 50

    window.addEventListener('mousemove', e=> {
        env.cursor.x = e.clientX
        env.cursor.y = e.clientY
        
        env.pageCursor.x = e.pageX
        env.pageCursor.y = e.pageY
        
        env.defbox.style.setProperty("--x", env.cursor.x)
        env.defbox.style.setProperty("--y", env.cursor.y)

        if(typeof env.mouseMove == "function") env.mouseMove() //can be set up per page or per needs as to not need to manage page-internal mousemoves

        env.mouseThrottle = true
        setTimeout(()=>env.mouseThrottle = false, env.mouseThrottleSpeed)
    })
    
    if(localStorage['volume']) {
        Howler.volume(localStorage['volume'])
        document.getElementById('meta-volume-slider').value = localStorage['volume']
    } else Howler.volume(0.5) //we start them at 0.5

    //load volume settings and get the spike-button functional first thing
    document.getElementById('meta-volume-slider').addEventListener('change', e=>{
        localStorage['volume'] = e.target.value
        Howler.volume(e.target.value)
    })

    document.getElementById('meta-volume-toggle').addEventListener('click', e=>{
        var volume = localStorage['volume']
        if(volume > 0) volume = 0; else volume = 0.5

        document.getElementById('meta-volume-slider').value = volume
        document.getElementById('meta-volume-slider').dispatchEvent(new Event('change'))
    })

    window.addEventListener('mousedown', ev=> {
        if(ev.target.closest('.menu') || ev.target.tagName == "INPUT") return;

        if(!body.classList.contains('in-menu')) {
            if(ev.target.id == "meta-icon") {
                MUI("toggle")

            } else if(ev.target.parentElement && ev.target.parentElement.id == "mui-links"){
                switch(ev.target.id) {
                    case "meta-obs":
                        toggleEntMenu()
                    break

                    case "meta-sys":
                        toggleSysMenu()
                    break
                }

            } else {
                switch(ev.button) {
                    case 0: 
                        if(env.mui) MUI("off")
                    break

                    case 2: 
                        MUI("toggle")
                    break
                }
            }
        }
    })

    /*a bunch of times a second, check to see if...
    * 1) they're hovering over a target and the MUI is on - stores targets for a variety of fun activities
    * 2) they're hovering over an element with a definition - moves the definition box to the mouse, updates its text, and adds an active class
    */
    env.hoverIntervalRate = 100
    env.hoverFunc = () => {
        //definition tracking
        let hovering = document.elementFromPoint(env.cursor.x, env.cursor.y)

        if(hovering) {
            if(hovering.hasAttribute('definition')) {
                //flip the position of the transform based on which side of the screen it's on
                if(env.cursor.x < (window.innerWidth / 2)) env.defbox.style.setProperty("--xFlip", 0); else env.defbox.style.setProperty("--xFlip", -1)
                if(env.cursor.y < (window.innerHeight / 2)) env.defbox.style.setProperty("--yFlip", 0); else env.defbox.style.setProperty("--yFlip", -1)

                env.defbox.classList.add('active')

                env.defbox.innerText = hovering.getAttribute('definition')
            } else {
                env.defbox.classList.remove('active')
            }
        }
    }
    env.hoverInterval = () => {
        setTimeout(()=>{
            env.hoverFunc()
            env.hoverInterval()
        }, env.hoverIntervalRate)
    }
    env.hoverInterval()
    
    //////////////////AUDIOOOO/////////////////////////////////
    //audio for permanent fixtures
    document.querySelectorAll(`#mindspike-act, #mindspike-examine, #mindspike-back, #mui-links > *, #meta-icon, .menureturn, #meta-menu .moth-trigger, #system-menu summary, #system-menu .button`).forEach(e=>{
        e.addEventListener('mouseenter', ()=>play('muiHover'))
        e.addEventListener('click', ()=> play('muiClick'))
    })

    document.querySelectorAll(`#meta-menu .mask-trigger`).forEach(e=>{
        e.addEventListener('mouseenter', ()=>play('obeskHover'))
        e.addEventListener('click', ()=> play('obeskToggle'))
    })

    //////////////////////MISC DETECTION + ADJUSTMENTS//////////
    // when the page is reloaded, if the user has a log from the same session, restore it
    //reloadSessionLog()
    //runGPUCheck() //also check their GPU for acceleration cuz it sucks if they don't have it

    //keep track of the browser height - we use this for certain transform scaling algorithms
    function updateUnitlessHeight() { document.documentElement.style.setProperty('--unitlessHeight', window.innerHeight) }
    window.addEventListener('resize', updateUnitlessHeight);
    updateUnitlessHeight()

    //chrome detection for fixing flickering
    if(window.chrome) body.classList.add('chromeyum')

    gmss()
    setInterval(gmss, 300000)
    updateDialogueActors()
})



/* MASK MENU */
function toggleMasksMenu() {
    if(body.getAttribute('menu') == "masks")  {
        body.classList.remove('in-tiny-menu', 'expand-menu')
        body.setAttribute('menu', 'none')
        play('obeskToggle')
    } else {
        //construct new contents
        let menuContents = ``
        let i = 0
        for (const maskName in env.masks) {
            const mask = env.masks[maskName];
            menuContents += `
                <span 
                    class="ozo-mask ozo-mask-${maskName} ${body.getAttribute('mask') == maskName ? "active" : ""}"
                    style="
                        --maskImage: ${mask.maskImage};
                        --maskDelay: ${0.3 + (i * 0.1)}s;
                    "
                    definition="${maskName.toUpperCase()}::${mask.definition}"
                    mask="${maskName}"
                >
                    ${maskName}
                </span>
            `
            i++
        }

        //replace
        document.querySelector('#masks .ozo-mask-grid').innerHTML = menuContents
        
        //sfx for hover, etc
        document.querySelectorAll(`#meta-menu .ozo-mask`).forEach(e=>{
            e.addEventListener('mouseenter', ()=>play('obeskHover'))
            e.addEventListener('click', ()=> {
                let thisMask = e.getAttribute('mask')
                play('obeskClick')

                //handle mask swap on click
                if(body.getAttribute('mask') != thisMask) {
                    mask({name: thisMask})
                    
                    document.querySelectorAll('.ozo-mask.active').forEach(el=>el.classList.remove('active'))
                    e.classList.add('active')
                }
            })
        })

        //show menu
        body.classList.add('in-tiny-menu', 'expand-menu')
        body.setAttribute('menu', 'masks')
        play('obeskToggle')
    }
}

//MUI toggles
function MUI(state) {
    switch(state){
        case "toggle":
            if(env.mui) MUI("off")
            else MUI("on")
        break

        case "on":
            if(!env.mui) play('muiToggle')
            body.classList.add('mui-active')
            env.mui = true
        break

        case "off":
            if(env.mui) play('muiToggle')
            body.classList.remove('mui-active')
            env.mui = false
        break
    }
}

/* AUDIO */
//static cuz we always use it

//global SFX map
var sfxmap = new Howl({
    src: ['assets/csfxmap.ogg'],
    preload: true,
    html5: false,
    volume: 0.75,
    sprite: {
        talk1: [0, 1000],
        talk2: [1000, 1000],
        talk3: [2000, 1000],
        talk4: [3000, 1000],
        talk5: [4000, 1000],
        talk6: [5000, 1000],
        talk7: [6000, 1000],
        talk8: [7000, 1000],
        muiToggle: [8000, 1000],
        muiScanner: [9000, 1000],
        muiReadout: [10000, 1000],
        muiHover: [11000, 1000],
        muiClick: [12000, 1000],
        criticalError: [13000, 11000],
        talkhigh1: [24000, 1000],
        talkhigh2: [25000, 1000],
        talkhigh3: [26000, 1000],
        talkhigh4: [27000, 1000],
        talkhigh5: [28000, 1000],
        talkhigh6: [29000, 1000],
        talkhigh7: [30000, 1000],
        talkhigh8: [31000, 1000],
        talklaugh1: [32000, 1000],
        talklaugh2: [33000, 1000],
        talklaugh3: [34000, 1000],
        talklaugh4: [35000, 1000],
        talklaugh5: [36000, 1000],
        talklaugh6: [37000, 1000],
        talklaugh7: [38000, 1000],
        talklaugh8: [39000, 1000],
        talksignal1: [40000, 1000],
        talksignal2: [41000, 1000],
        talksignal3: [42000, 1000],
        talksignal4: [43000, 1000],
        talksignal5: [44000, 1000],
        talksignal6: [45000, 1000],
        talksignal7: [46000, 1000],
        talksignal8: [47000, 1000],
        hit: [48000, 1000],
        miss: [49000, 1000],
        crit: [50000, 1000],
        chomp: [51000, 1000],
        stab: [52000, 1000],
        status: [54000, 2000],
        shot1: [56000, 1000],
        shot2: [58000, 1500],
        shot3: [60000, 1000],
        shot4: [62000, 1500],
        shot5: [66000, 1500],
        shot6: [68000, 2000],
        click1: [70000, 250],
        click2: [70250, 500],
        destabilize: [72000, 2000],
        mend: [74000, 2000],
        talkcore1: [76000, 1000],
        talkcore2: [77000, 1000],
        talkcore3: [78000, 1000],
        talkcore4: [79000, 1000],
        talkcore5: [80000, 1000],
        talkcore6: [81000, 1000],
        talkcore7: [82000, 1000],
        talkcore8: [83000, 1000],
        talkgal1: [84000, 1000],
        talkgal2: [85000, 1000],
        talkgal3: [86000, 1000],
        talkgal4: [87000, 1000],
        talkgal5: [88000, 1000],
        talkgal6: [89000, 1000],
        talkgal7: [90000, 1000],
        talkgal8: [91000, 1000],
        fear: [92000, 2000],
        guard: [94000, 2000],
        dull: [96000, 3000],
        obeskClick: [100000, 1000],
        obeskHover: [101000, 1000],
        obeskToggle: [102000, 2000],
        talkgel1: [104000, 1000],
        talkgel2: [105000, 1000],
        talkgel3: [106000, 1000],
        talkgel4: [107000, 1000],
        talkgel5: [108000, 1000],
        talkgel6: [109000, 1000],
        talkgel7: [110000, 1000],
        talkgel8: [111000, 1000],
        unitymask: [112000, 4000],
        realitymask: [116000, 5000],
        hungermask: [124000, 5000],
        talkcroak1: [132000, 1000],
        talkcroak2: [133000, 1000],
        talkcroak3: [134000, 1000],
        talkcroak4: [135000, 1000],
        talkcroak5: [136000, 1000],
        talkcroak6: [137000, 1000],
        talkcroak7: [138000, 1000],
        talkcroak8: [139000, 1000],
        talkchoir1: [140000, 2000],
        talkchoir2: [142000, 2000],
        talkchoir3: [144000, 2000],
        talkchoir4: [146000, 2000],
        talkchoir5: [148000, 2000],
        talkchoir6: [150000, 2000],
        talkchoir7: [152000, 2000],
        talkchoir8: [154000, 2000],
        talkflower1: [156000, 1000],
        talkflower2: [157000, 1000],
        talkflower3: [158000, 1000],
        talkflower4: [159000, 1000],
        talkflower5: [160000, 1000],
        talkflower6: [161000, 1000],
        talkflower7: [162000, 1000],
        talkflower8: [163000, 1000],
        talkfloweralt1: [164000, 1000],
        talkfloweralt2: [165000, 1000],
        talkfloweralt3: [166000, 1000],
        talkfloweralt4: [167000, 1000],
        talkfairy1: [168000, 1000],
        talkfairy2: [169000, 1000],
        talkfairy3: [170000, 1000],
        talkfairy4: [171000, 1000],
        talkfairy5: [172000, 1000],
        talkfairy6: [173000, 1000],
        talkfairy7: [174000, 1000],
        talkfairy8: [175000, 1000],
        __default: [0, 1]
    }
});

/* 
    mask control
    simple methods for controlling active masks

    there's always a mask active (even default)
*/
function mask({name, retrigger = false, playSound = true}) {
    let current = body.getAttribute('mask') || "reality"
    let currentMask = env.masks[current]
    let newMask = env.masks[name]

    if(typeof newMask == "undefined") throw `bad mask detected - ${name}`
    if(playSound) {
        env.recentSfx = false
        sfxmap.stop()
        play(newMask.sound, true, 0.5)
    }
    body.setAttribute('mask', name)
    if(current != name && typeof currentMask.off == "function") currentMask.off()
    if((current != name && typeof newMask.on == "function") || retrigger) newMask.on()
}

/* 
    SYSTEM MENU 
    nothing crazy, just toggling
    more stuff will happen here in the future most likely (i.e. settings)
    we actually turn on the MUI since some things are logged here
*/
function toggleSysMenu() {
    if(body.getAttribute('menu') == "system")  {
        MUI('off')
        body.classList.remove('in-menu')
        body.setAttribute('menu', 'none')
    } else {
        //show menu
        MUI('on')
        body.classList.add('in-menu')
        body.setAttribute('menu', 'system')
        play('muiScanner')
    }
}

//easy menu exit
function exitMenu(closeMUIToo = true) {

    delete env.draggable
    play('muiToggle')

    body.classList.remove('in-menu', 'in-tiny-menu', 'expand-menu')
    body.setAttribute('menu', 'none')

    if(closeMUIToo) MUI('off')
    env.unsavedChanges = false
}

//??? wa da he
async function gmss() {
    let mss = {
        state: 0.5,
        status: "coherent",
        code: 0
    }

    try {
        await fetch("https://state.corru.network/").then(response => response.json()).then(json=> {mss = json})
    } catch(err) {console.log(err)} //probably internet issue

    document.querySelectorAll('.mindsci-status').forEach(el=>{
        el.setAttribute('state', mss.state)
        el.setAttribute('status', mss.status)
        el.setAttribute('code', mss.code)
        el.setAttribute('definition', `GAD::'${mss.status}'`)
    })

    let oldCode = env.mss ? env.mss.code : -99
    env.mss = mss

    if((typeof env.fakenet != 'number' && mss.code != oldCode) || oldCode == -99) updateCode()
}

function updateCode() { 
    let num = typeof env.fakenet == 'number' ? env.fakenet : env.mss.code
    body.setAttribute('c', num ) 

    switch(num) { //for specific states, use 'c' instead of 'n' - 'n' is a general ordering
        case -2: case -1: body.setAttribute('n', 'i'); break
        case 0: body.setAttribute('n', 'c'); break
        case 2: case 1: body.setAttribute('n', 'o'); break
    }
    
    env.effectiveNet = num
    document.dispatchEvent(new CustomEvent('corru_net'));
}
