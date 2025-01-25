const plans = {
    hub: {
        plan: {
            grid: `
            ..1.2..
            #######
            =######
            !#S####
            =######
            #######
            `.replace(/\s/g, '').split(''),
            width: 7,
            startangle: 270,
            entities: {
                'S': {
                    id: 'player',
                },
                '.': {
                    nonexistent: true
                },
                '=': {
                    tileclass: 'nowalk'
                },
                '!': {
                    id: 'infoboard',
                    class: 'turn270 spacemono',
                    tileclass: 'nowalk alwaysvisible',
                    content: `<h1>3d tech demo thing</h1>
                    <h2>everything you see is an html element</h2>
                    based on <a href="https://corru.observer">corru.observer</a>; <a href="https://corru.observer/local/beneath?force">this page</a> is a good example<br>
                    i wanted to figure it out for myself, so i recreated it.<br>
                    with some additional features of my own, of course<br>
                    no mobile support, sorry :(<br>
                    <br>
                    <img src="assets/controls.png">`,
                },
                '1': {
                    tileclass: 'exit alwaysvisible',
                    class: 'floatyindicator one',
                    tileattributes: {
                        dest: 'room1',
                        exitx: '2',
                        exity: '11',
                        exitangle: '0',
                    }
                },
                '2': {
                    tileclass: 'exit alwaysvisible',
                    class: 'floatyindicator two',
                    tileattributes: {
                        dest: 'room2',
                        exitx: '2',
                        exity: '3',
                        exitangle: '0',
                    }
                },
            }
        }
    },
    room1: {
        plan: {
            grid: `
            ##3#5
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
            ..!..
            `.replace(/\s/g, '').split(''),
            width: 5,
            entities: {
                'S': {
                    id: 'player',
                },
                '.': {
                    nonexistent: true
                },
                '3': {
                    class: 'colonthree',
                    tileclass: 'dontbullshit'
                },
                's': {
                    class: 'sign spacemono',
                    tileclass: 'dontbullshit nowalk',
                    content: '<b>exhibit 1a</b><p>freaking <a href="https://corru.observer">observe</a> this shit</p>'
                },
                '$': {
                    class: 'sign spacemono',
                    tileclass: 'dontbullshit nowalk',
                    content: '<b>exhibit 1b</b><p>holy fucking <b>bingle</b></p>'
                },
                '5': {
                    class: 'sign spacemono turn90 smallfont',
                    tileclass: 'dontbullshit nowalk',
                    content: '<p>hey did you know there is a css bug where you cant translateZ a child of something with <1 opacity? because i didnt</p>'
                },
                '!': {
                    tileclass: 'exit',
                    tileattributes: {
                        dest: 'hub',
                        exitx: '2',
                        exity: '1',
                        exitangle: '180',
                    }
                }
            }
        }
    },
    room2: {
        plan: {
            grid: `
            #####
            ##p##
            #####
            ##S##
            ..!..
            `.replace(/\s/g, '').split(''),
            width: 5,
            entities: {
                'S': {
                    id: 'player',
                },
                '.': {
                    nonexistent: true
                },
                'p': {
                    class: 'sign spacemono',
                    tileclass: 'dontbullshit nowalk',
                    content: '<p>placeholder</p>'
                },
                '!': {
                    tileclass: 'exit',
                    tileattributes: {
                        dest: 'hub',
                        exitx: '4',
                        exity: '1',
                        exitangle: '180',
                    }
                }
            }
        }
    }
}