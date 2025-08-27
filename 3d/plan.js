const plans = {
	hub: {
		plan: {
			floors: {
				'0': {
					grid: `
					..1.2.3..
					HHHHHHHHH
					=#######H
					!#S#####H
					=#######H
					HHHHHHHHH
					`.replace(/\s/g, '').split(''),
					floorheight: "0px"
				}
				
			},
			width: 9,
			startangle: 270,
			entities: {
				'S': {
					id: 'player',
				},
				'.': {
					nonexistent: true
				},
				'=': {
					tileclass: 'nowalk tile2'
				},
				'H': {
					tileclass: 'tile2'
				},
				'!': {
					id: 'infoboard',
					class: 'turn270 spacemono',
					tileclass: 'nowalk alwaysvisible tile2',
					content: `<h1>3d tech demo thing</h1>
					<h2>everything you see is an html element</h2>
					based on <a href="https://corru.observer">corru.observer</a>; <a href="https://corru.observer/local/beneath?force">this page</a> is a good example<br>
					i wanted to figure it out for myself, so i recreated it.<br>
					with some additional features of my own, of course<br>
					tested on firefox win11; not sure if other configurations work<br>
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
				'3': {
					tileclass: 'exit alwaysvisible',
					class: 'floatyindicator three',
					tileattributes: {
						dest: 'room3',
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
			floors: {
				'0': {
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
					floorheight: "0px",
				}
			},
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
			floors: {
				'0': {
					grid: `
					#1u##
					##s##
					#####
					##S##
					..!..
					`.replace(/\s/g, '').split(''),
					floorheight: "0px"
				},
				'1': {
					grid: `
					..d2#
					HHHHH
					HH5HH
					HHHHH
					.....
					`.replace(/\s/g, '').split(''),
					floorheight: "400px"
				}
			},
			width: 5,
			entities: {
				'S': {
					id: 'player',
				},
				'.': {
					nonexistent: true
				},
				's': {
					class: 'sign spacemono',
					tileclass: 'dontbullshit nowalk',
					content: '<p>i have done what corru could not. i have implemented the third dimension</p>'
				},
				'H': {
					tileclass: 'tile2'
				},
				'!': {
					tileclass: 'exit',
					tileattributes: {
						dest: 'hub',
						exitx: '4',
						exity: '1',
						exitangle: '180',
					}
				},
				'1': {
					tileclass: 'zoffset',
					tilestyles: {
						'--zoffset': '100px',
					}
				},
				'u': {
					tileclass: 'zoffset changefloor cantfrom',
					tilestyles: {
						'--zoffset': '200px',
					},
					tileattributes: {
						dest: '1',
						changefloordirections: [90, 180],
						cantfromdirections: [270]
					}
				},
				'd': {
					tileclass: 'empty zoffset changefloor',
					tilestyles: {
						'--zoffset': '-200px',
					},
					tileattributes: {
						dest: '0',
						changefloordirections: [270]
					}
				},
				'2': {
					tileclass: 'zoffset',
					tilestyles: {
						'--zoffset': '-100px',
					}
				},
				'5': {
					class: 'sign spacemono turn180 smallfont',
					tileclass: 'dontbullshit nowalk tile2',
					content: '<p>yeah. i know. incredible, right?</p>'
				},
			}
		}
	},
	room3: {
		plan: {
			floors: {
				'0': {
					grid: `
					#####
					##s##
					#####
					##S##
					..!..
					`.replace(/\s/g, '').split(''),
					floorheight: "0px"
				},
				'1': {
					grid: `
					#####
					#####
					##g##
					#####
					#####
					`.replace(/\s/g, '').split(''),
					floorheight: "1000px"
				}
			},
			width: 5,
			entities: {
				'S': {
					id: 'player',
				},
				'.': {
					nonexistent: true
				},
				's': {
					class: 'sign spacemono',
					tileclass: 'dontbullshit nowalk',
					content: '<p>look up, using the lookaround feature that corru also doesnt have</p>'
				},
				'H': {
					tileclass: 'tile2'
				},
				'!': {
					tileclass: 'exit',
					tileattributes: {
						dest: 'hub',
						exitx: '6',
						exity: '1',
						exitangle: '180',
					}
				},
				'g': {
					id: 'gullible',
					tileclass: 'dontbullshit',
					content: 'gullible'
				}
			}
		}
	}
}