function updateDialogueActors(fakeGeli, murderer, betterMemholePortraits) {
//hello.html
env.dialogueActors["sentry"] = {
    image: 'assets/img/textures/corruripple.gif',
    type: "sentry obesk",
    player: false
}
//embassy_golem.js
env.dialogueActors["geli"] = {
    name: "geli",
    type: "obesk qou portrait-cover portrait-blocker",
    voice: ()=>play('talkgel', 0.9)
}

if(fakeGeli) {
    env.dialogueActors["geli"].expressions = {
        default: {
            image: "assets/img/sprites/obesk/geli/fake/portrait.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', ''))
        },
        concern: {
            image: "assets/img/sprites/obesk/geli/fake/portrait_concern.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'concern'))
        },
        happy: {
            image: "assets/img/sprites/obesk/geli/fake/portrait_happy.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'happy'))
        },
        think: {
            image: "assets/img/sprites/obesk/geli/fake/portrait_think.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'think'))
        },
        uncanny: {
            image: "assets/img/sprites/obesk/geli/fake/portrait_uncanny.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'uncanny'))
        },
        blueeyes: {
            image: "assets/img/sprites/obesk/geli/fake/portrait_blueeyes.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'blueeyes'))
        },
    }
} else {
    env.dialogueActors["geli"].expressions = {
        default: {
            image: "assets/img/sprites/obesk/geli/portrait.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', ''))
        },
        concern: {
            image: "assets/img/sprites/obesk/geli/portrait_concern.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'concern'))
        },
        happy: {
            image: "assets/img/sprites/obesk/geli/portrait_happy.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'happy'))
        },
        think: {
            image: "assets/img/sprites/obesk/geli/portrait_think.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'think'))
        },
        uncanny: {
            image: "assets/img/sprites/obesk/geli/portrait_uncanny.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'uncanny'))
        },
        blueeyes: {
            image: "assets/img/sprites/obesk/geli/portrait_blueeyes.gif",
            exec: ()=>document.querySelectorAll('#geli').forEach(el=>el.setAttribute('expression', 'blueeyes'))
        },
    }
}

env.dialogueActors["ik"] = {
    name: "karik",
    image: "assets/img/sprites/obesk/ikgol/portrait.gif",
    type: "obesk qou portrait-cover portrait-blocker",
    voice: ()=>play('talkcore', 0.5)
}

env.dialogueActors["kivii"] = {
    name: "dozkallvi",
    image: "assets/img/sprites/combat/foes/kivii/portrait.gif",
    type: "obesk qou portrait-cover portrait-blocker incoherent",
    voice: ()=>play('talkgal', 0.25)
}

env.dialogueActors["translation core"] = {
    image: "assets/img/sprites/combat/foes/translator_sigil.gif",
    type: "obesk qou portrait-cover portrait-blocker incoherent",
    voice: ()=>play('talksignal', 0.4)
}

env.dialogueActors["husk"] = {
    image: "assets/img/sprites/combat/foes/husks/tinynausea.gif",
    type: "obesk qou portrait-cover portrait-fear incoherent",
    voice: ()=>play('talksignal', 0.6)
}
//embassy_precollapse.js
env.dialogueActors["barfriend"] = {
    elementID: "barfriend12",
    image: "assets/img/sprites/obesk/golemportrait.gif",
    type: "obesk",
    voice: ()=>play('talk', 1.5)
}

env.dialogueActors["attendant"] = {
    image: "assets/img/local/embassy/spiredroneportrait.gif",
    type: "obesk groundsmind",
    voice: ()=>play('talk', 0.8)
}
//embassy.js
env.dialogueActors["movefriend"] = {
    elementID: "movefriend0",
    image: "assets/img/local/embassy/liftfriend.gif",
    type: "obesk",
    voice: ()=>play('talk', 0.8)
}

env.dialogueActors["tozik"] = {
    image: "assets/img/sprites/obesk/tozik/portrait.gif",
    type: "obesk qou tozik portrait-contain portrait-blocker",
    element: ".truecreature .tozik",
    voice: ()=>play('talk', 1)
}

env.dialogueActors["gakvu"] = {
    image: "assets/img/sprites/obesk/gakvu/portrait.gif",
    element: ".truecreature .gakvu",
    type: "obesk qou gakvu portrait-contain",
    voice: ()=>play('talklaugh', 1)
}

env.dialogueActors["kazki"] = {
    image: "assets/img/sprites/obesk/kazki/portrait.gif",
    type: "obesk qou kazki portrait-contain",
    voice: ()=>play('talklaugh', 1.2)
}

env.dialogueActors["bozko"] = {
    image: "assets/img/sprites/obesk/bozko/portrait.gif",
    type: "obesk qou bozko portrait-contain",
    voice: ()=>play('talk', 0.8)
}

env.dialogueActors["cavik"] = {
    image: "assets/img/sprites/obesk/cavik/portrait.gif",
    type: "obesk qou cavik portrait-contain",
    voice: ()=>play('talk', 1.3)
}

env.dialogueActors["groundsmind"] = {
    image: "assets/img/local/embassy/groundsmindportrait.gif",
    type: "obesk groundsmind qou",
    voice: ()=>play('talkhigh', 1.2)
}

env.dialogueActors["timestopper"] = {
    type: "timestopper obesk",
    voice: ()=>play('talkhigh', 0.6)
}

env.dialogueActors["echo"] = {
    image: "assets/img/textures/disruptionM.gif",
    type: "obesk",
    voice: ()=>play('talkhigh', 0.8)
}

env.dialogueActors["aggressor"] = {
    image: "assets/img/sprites/aggressor/sigilback.gif",
    type: "incoherent",
    voice: ()=>play('talksignal')
}

env.dialogueActors["itzil"] = {
    image: "assets/img/local/embassy/mindcore1portrait.gif",
    type: "obesk qou",
    voice: ()=>play('talkcore', 2)
}

env.dialogueActors["karik"] = {
    image: "assets/img/local/embassy/mindcore2portrait.gif",
    type: "obesk qou",
    voice: ()=>play('talkcore', 1)
}

env.dialogueActors["itzil quiet"] = {
    name: "itzil",
    image: "assets/img/local/embassy/mindcore1portrait.gif",
    type: "obesk qou",
    voice: false
}

env.dialogueActors["karik quiet"] = {
    name: "karik",
    image: "assets/img/local/embassy/mindcore2portrait.gif",
    type: "obesk qou",
    voice: false
}

env.dialogueActors["miltza"] = {
    image: "assets/img/sprites/obesk/miltza/portrait.gif",
    type: "obesk qou portrait-cover",
    voice: ()=>play('talkgal', 0.8)
}
//globalents.js
env.dialogueActors["envoy"] = {
    image: "assets/img/local/city/envoybutton.gif",
    type: "recollection portrait-bright portrait-cover",
    element: ".envoy",
    voice: ()=>play('talk', 0.9)
}

env.dialogueActors["gordon"] = env.dialogueActors["envoy"]
//jokziozo_dialogue.js
env.dialogueActors["council"] = {
    image: murderer ? 'assets/img/sprites/council/godportrait.gif' : 'assets/img/sprites/council/portrait.gif',
    type: "thoughtform awakened portrait-haze portrait-auto portrait-center",
    voice: ()=>play('talkchoir')
}

env.dialogueActors["isabel"] = {
    image: 'assets/img/local/uncosm/ozo/flowerfriend_portrait.gif',
    type: "thoughtform flowerfriend awakened portrait-cover portrait-haze",
    voice: ()=>play('talkflower')
}

env.dialogueActors["fairy"] = {
    image: 'assets/img/local/uncosm/ozo/sprite_portrait.gif', 
    type: "thoughtform fairy awakened portrait-haze portrait-auto portrait-center",
    voice: ()=>play('talkfairy')
}

env.dialogueActors["incoviewer"] = {
    name: "interviewer",
    image: 'assets/img/local/ocean/ship/interviewerportrait.gif',
    type: "incoherent",
    voice: ()=>play('talk', 1.5)
}
//e3a2geli.js
env.dialogueActors["stowaway"] = {
    image: 'assets/img/sprites/loper.gif',
    type: "thoughtform portrait-top portrait-cover portrait-blocker",
    voice: ()=>play('talkcroak')
}

env.dialogueActors["bsteli"] = {
    name: "geli",
    type: "portrait-round portrait-cover portrait-blocker bastard-color",
    voice: ()=>play('talkgel', 0.9),
    expressions: {
        default: {
            image: "assets/img/sprites/obesk/geli/bsteli/portrait.gif",
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', ''))
        },
        bstrd: {
            class: "bastard-font",
            image: "assets/img/sprites/obesk/geli/bsteli/portrait_bstrd.gif",
            voice: ()=>play('talkgel', 0.75),
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', 'bstrd'))
        },
        concern: {
            image: "assets/img/sprites/obesk/geli/bsteli/portrait_concern.gif",
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', 'concern'))
        },
        happy: {
            image: "assets/img/sprites/obesk/geli/bsteli/portrait_happy.gif",
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', 'happy'))
        },
        think: {
            image: "assets/img/sprites/obesk/geli/bsteli/portrait_think.gif",
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', 'think'))
        },
        uncanny: {
            image: "assets/img/sprites/obesk/geli/bsteli/portrait_uncanny.gif",
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', 'uncanny'))
        },
        blueeyes: {
            image: "assets/img/sprites/obesk/geli/bsteli/portrait_blueeyes.gif",
            exec: ()=>document.querySelectorAll('#bsteli').forEach(el=>el.setAttribute('expression', 'blueeyes'))
        },
    }
}
//cache.html
env.dialogueActors["god"] = {
    image: "assets/img/local/uncosm/tostile.gif",
    type: "thoughtform portrait-contain portrait-bright obesk",
    voice: ()=>play('talkhigh', 0.45),
    element: ".god",
}
//dullvessel.html
env.dialogueActors["pilot cyst"] = {
    elementID: "pilotcyst0",
    image: "assets/img/local/orbit/dullvessel/pilotsphere_tendrils.gif",
    type: "obesk pilotcyst",
    voice: ()=>play('talk', 0.4)
}

env.dialogueActors["glazika"] = {
    elementID: "glazika3",
    image: "assets/img/local/orbit/dullvessel/glazikaeye.gif",
    type: "obesk glazika",
    voice: ()=>play('talk')
}
//orbit.html
//fairy: redundant
//beneath\\index.html
env.dialogueActors["s w   al kk"] = {
    image: "assets/img/local/city/pedestrian5.gif",
    type: "recollection portrait-top portrait-cover incoherent",
    voice: ()=>play('talkcroak', 0.85),
    element: ".civvie",
}

env.dialogueActors["drowning"] = {
    name: "Ƙø¿ƶḳ¿±",
    expressions: {
        default: {
            image: "assets/img/local/beneath/drowningportrait.gif",
            voice: ()=>play("talklaugh", .9),
            type: "recollection thoughtform portrait-darkstatic portrait-cover drowning",
            exec: ()=>{env.abyss.drowningFear(0)}
        },
        scared: {
            image: "assets/img/local/beneath/drowningportrait_scared.gif",
            voice: ()=>play("talklaugh", .75),
            type: "recollection thoughtform portrait-darkstatic portrait-cover drowning drowning_scared",
            exec: ()=>{env.abyss.drowningFear(1)}
        },
        panic: {
            image: "assets/img/local/beneath/drowningportrait_panic.gif",
            voice: ()=>play("talklaugh", .6),
            type: "recollection thoughtform portrait-darkstatic portrait-cover drowning drowning_panic",
            exec: ()=>{env.abyss.drowningFear(2)}
        },
        safe: {
            image: "assets/img/local/beneath/drowningportrait_safe.gif",
            voice: ()=>play("talklaugh", .9),
            type: "recollection thoughtform portrait-darkstatic portrait-cover drowning",
            exec: ()=>{env.abyss.drowningFear(-1)}
        },
    }
}

env.dialogueActors["drowning sourceless"] = {
    name: "$Ø‰Ɍ¿ɇ§",
    type: "drowning_sourceless",
    voice: ()=>play('muiReadout', .75)
}

env.dialogueActors["drowning akizet"] = {
    name: "Â£¿Ž¿",
    type: "recollection thoughtform portrait-darkstatic portrait-cover drowning",
    image: 'assets/img/textures/weyetran.gif',
    voice: ()=>play('talksignal', 1.5),
    player: true
}
//parasite.html
env.dialogueActors["piece"] = {
    image: "assets/img/local/beneath/palpurp.gif",
    type: "thoughtform portrait-cover incoherent",
    voice: ()=>play("talkcore", 3)
}    

env.dialogueActors["shelf"] = {
    image: "assets/img/local/beneath/pieces/shelf.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talkcore", 2.5)
} 

env.dialogueActors["smiling piece"] = {
    image: "assets/img/local/beneath/pieces/g.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talklaugh", 3)
}        

env.dialogueActors["many-eyed piece"] = {
    image: "assets/img/local/beneath/pieces/m.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talkgal", 2.5)
} 

env.dialogueActors["curled piece"] = {
    image: "assets/img/local/beneath/pieces/a.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talk", 3)
}

env.dialogueActors["calm piece"] = {
    image: "assets/img/local/beneath/pieces/b.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talk", 0.6)
}

env.dialogueActors["pleased piece"] = {
    image: "assets/img/local/beneath/pieces/c.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talk", 3.3)
}

env.dialogueActors["weeping piece"] = {
    image: "assets/img/local/beneath/pieces/i.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talkcore", 3.5)
}

env.dialogueActors["friendly piece"] = {
    image: "assets/img/local/beneath/pieces/k.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talklaugh", 2.5)
}

env.dialogueActors["four-eyed piece"] = {
    image: "assets/img/local/beneath/pieces/ka.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talkcore", 3)
}

env.dialogueActors["stacked-eye piece"] = {
    image: "assets/img/local/beneath/pieces/t.gif",
    type: "thoughtform portrait-cover incoherent obesk incoherent-mild",
    voice: ()=>play("talk", 0.8)
}
//street.html
env.dialogueActors["cashier"] = {
    image: 'assets/img/local/city/realeye.gif',
    type: "recollection portrait-bright portrait-cover",
    element: "#realgrid .cashier.cafegfx",
    voice: ()=>play('talk', 2)
}

env.dialogueActors["cousin"] = {
    image: 'assets/img/local/city/realeye.gif',
    type: "recollection portrait-bright portrait-cover",
    voice: ()=>play('talk', 1)
}

env.dialogueActors["slim streetwalker"] = {
    image: "assets/img/local/city/pedestrian3.gif",
    type: "recollection portrait-top portrait-cover incoherent",
    voice: ()=>play('talk', 0.85),
    element: ".slim",
}

env.dialogueActors["stre wal k"] = {
    image: "assets/img/local/city/pedestrian1.gif",
    type: "recollection portrait-top portrait-cover incoherent",
    voice: ()=>play('muiToggle', 0.5),
    element: ".creep",
}

env.dialogueActors["cloaked streetwalker"] = {
    image: 'assets/img/local/city/realeye.gif',
    type: "recollection portrait-bright portrait-cover",
    element: ".busy",
    voice: ()=>play('talk', 0.9)
}

env.dialogueActors["television"] = {
    image: "assets/img/local/city/tv.gif",
    type: "recollection",
    voice: ()=>play("talkcore", 3)
}

env.dialogueActors["obesk"] = {
    image: "assets/img/local/city/tv.gif",
    type: "recollection obesk qou",
    voice: ()=>play("talkcore", 1.2)
}

env.dialogueActors["something"] = {
    image: "assets/img/local/city/tv.gif",
    type: "recollection incoherent",
    voice: ()=>play("talkcore", 0.5)
}
//isabel: redundant
env.dialogueActors["isabel_c"] = {
    name: "isabel",
    image: 'assets/img/local/uncosm/ozo/flowerfriend_portrait.gif',
    type: "thoughtform flowerfriend recollection portrait-cover portrait-bright",
    voice: ()=>play('talkfloweralt', 1)
}
//interview.html
env.dialogueActors["interviewer"] = {
    elementID: "buddy",
    image: 'assets/img/local/ocean/ship/interviewerportrait.gif',
    voice: ()=>play('talk', 1.5)
}
//incoviewer:: redundant
//cavik.html
env.dialogueActors["origin"] = {
    type: "thoughtform portrait-contain obesk qou portrait-dark",
    image: 'assets/img/textures/weyetran.gif',
    voice: ()=>play('talksignal', 2),
    player: true
}
//cavik:: redundant
env.dialogueActors["c a"] = {
    image: "assets/img/sprites/obesk/cavik/paintrait2.gif",
    type: "obesk qou cavik portrait-contain",
    voice: ()=>play('talksignal', 0.75)
}

env.dialogueActors["cv i k"] = {
    image: "assets/img/sprites/obesk/cavik/paintrait.gif",
    type: "incoherent cavik portrait-contain",
    voice: ()=>play('talksignal', 0.75)
}
//clemens romanus.html
//origin:: redundant
env.dialogueActors["other"] = {
    pageSpecific: true,
    "local\\uncosm\\clemens romanus.html": {
        type: "thoughtform portrait-contain obesk qou portrait-dark",
        image: 'assets/img/textures/ceyetran.gif',
        voice: ()=>play('talksignal', 1.5)   
    },
    "local\\uncosm\\dull.html": {
        type: "thoughtform portrait-contain obesk qou portrait-dark loose-thought",
        image: 'assets/img/sprites/obesk/larval/larval5.gif',
        voice: ()=>play('talksignal', 1)
    },
    "local\\uncosm\\spire.html": {
        type: "thoughtform portrait-contain obesk qou portrait-dark",
        image: 'assets/img/textures/ceyetran.gif',
        voice: ()=>play('talksignal', 1.25)
    },
    "local\\uncosm\\yuzku.html": {
        type: "thoughtform portrait-contain obesk portrait-dark",
        image: 'assets/img/textures/eyetran.gif',
        voice: ()=>play('talkcore', 1.5)
    }
}

env.dialogueActors["mind"] = {
    type: "thoughtform obesk",
    image: 'assets/img/textures/eyetran.gif',
    voice: ()=>play('talk', 0.4)
}
//corru.html
env.dialogueActors["stupid"] = {
    type: "thoughtform portrait-contain portrait-darkripple larval loose-thought",
    image: 'assets/img/sprites/obesk/larval/larval1.gif',
    voice: ()=>play('talkcore', 2),
    player: true
}

env.dialogueActors["elder"] = {
    type: "thoughtform portrait-contain portrait-darkripple obesk larval loose-thought",
    image: 'assets/img/sprites/obesk/larval/larval6.gif',
    voice: ()=>play('talkcore', 0.85)
}

env.dialogueActors["guard"] = {
    type: "thoughtform portrait-contain portrait-darkripple obesk larval loose-thought",
    image: 'assets/img/sprites/obesk/larval/larval4.gif',
    voice: ()=>play('talkcore', 1.25)
}
//dog.html
//stupid:: redundant
env.dialogueActors["kind"] = {
    type: "thoughtform portrait-contain portrait-darkripple obesk larval loose-thought",
    image: 'assets/img/sprites/obesk/larval/larval8.gif',
    voice: ()=>play('talkcore', 1.75)
}

env.dialogueActors["dog"] = {
    type: "thoughtform portrait-cover portrait-dark obesk",
    image: "assets/img/local/embassy/isoportrait.gif",
    voice: ()=>play('talkgel', 3)
}
//dull.html
//origin:: redundant
//other:: redundant
//mind:: redundant
//flower.html
env.dialogueActors["flower"] = {
    name: "flower",
    image: 'assets/img/textures/yeyetran.gif',
    type: "thoughtform portrait-contain portrait-dark",
    voice: ()=>play('talkfloweralt', 1.5)
}

env.dialogueActors["wiser"] = {
    type: "thoughtform portrait-contain obesk qou portrait-dark",
    image: 'assets/img/textures/eyetran.gif',
    voice: ()=>play('talkcore', 2),
    player: true
}
//larval.html
//stupid:: redundant
env.dialogueActors["hesitant"] = {
    type: "thoughtform portrait-contain portrait-darkripple obesk larval loose-thought",
    image: 'assets/img/sprites/obesk/larval/larval3.gif',
    voice: ()=>play('talkcore', 0.75)
}
//uncosm\\parasite.html
//stupid:: redundant
//elder:: redundant
//guard:: redundant
//recosm.html
//god:: redundant
env.dialogueActors["friend"] = {
    image: "assets/img/textures/eyetran.gif",
    type: "thoughtform portrait-contain portrait-dark incoherenthello",
    voice: ()=>play('talklaugh', 0.4),
    element: ".friend",
}
//spire.html
//stupid:: redundant
//other:: redundant
//surface.html
//stupid:: redundant
env.dialogueActors["tired"] = {
    type: "thoughtform portrait-contain portrait-darkripple larval qou loose-thought",
    image: 'assets/img/sprites/obesk/larval/larval2.gif',
    voice: ()=>play('talkcore', 1.5)
}
//where.html
env.dialogueActors["¥Óñ«J"] = {
    type: "thoughtform incoherent portrait-cover portrait-blocker loose-thought",
    image: 'assets/img/sprites/akizet/eyeswarped.gif',
    voice: ()=>play('talkcore', 0.5)
}
//yuzku.html
//stupid:: redundant
//hesitant:: redundant
//other:: redundant
if(betterMemholePortraits) {
    env.dialogueActors["stupid"].image = 'assets/img/sprites/obesk/larval/larval1h.gif'
    env.dialogueActors["kind"].image = 'assets/img/sprites/obesk/larval/larval8h.gif'
    env.dialogueActors["hesitant"].image = 'assets/img/sprites/obesk/larval/larval3h.gif'
    env.dialogueActors["elder"].image = 'assets/img/sprites/obesk/larval/larval6h.gif'
    env.dialogueActors["tired"].image = 'assets/img/sprites/obesk/larval/larval2h.gif'
}
}