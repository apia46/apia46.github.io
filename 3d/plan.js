var plan = {
    grid: `
    ##3##
    #3#3#
    3###3
    ###$#
    ..#..
    ..#..
    ..#..
    #####
    ##3##
    ###s#
    ##S##
    #####
    `.replace(/\s/g, '').split(''),
    width: 5,
    height: 12,
    entities: {
        'S': {
            id: 'player',
            exec: (i)=>{
                player.x = i % plan.width
                player.y = Math.floor(i / plan.width)
            }
        },
        '3': {
            class: 'colonthree',
            tileclass: 'dontbullshit'
        },
        's': {
            class: 'sign spacemono',
            tileclass: 'dontbullshit nowalk',
            content: '<b>exhibit a</b><p>freaking <a href="https://corru.observer">observe</a> this shit</p>'
        },
        '$': {
            class: 'sign spacemono',
            tileclass: 'dontbullshit nowalk',
            content: '<b>exhibit a*</b><p>holy fucking <b>bingle</b></p>'
        },
        '.': {
            tileclass: 'empty nowalk'
        }
    }
}