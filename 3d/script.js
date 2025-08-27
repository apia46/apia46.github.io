const player = {x: 0, y: 0, floor: 0, rotate: 0, lookaround: false}
var loading = true
var startdrag = {x: 0, y: 0}
var lookaroundlocation = {x: 0, y: 0}

document.addEventListener("DOMContentLoaded", ()=>{
	loadStage(plans.hub)
	window.addEventListener("keydown", step)
	grid.style.setProperty("--lookaroundx", 0)
	grid.style.setProperty("--lookaroundy", 0)
	window.addEventListener("mousedown", (event)=>{startdrag.x = event.clientX; startdrag.y = event.clientY; lookaroundlocation.x = Number(grid.style.getPropertyValue("--lookaroundx")); lookaroundlocation.y = Number(grid.style.getPropertyValue("--lookaroundy")); window.addEventListener("mousemove", lookaround)})
	window.addEventListener("mouseup", ()=>{window.removeEventListener("mousemove", lookaround)})
})

function loadStage(stage, startx = undefined, starty = undefined, startangle = undefined){
	clearTimeout(loadingtimeout)
	loading = true
	document.body.classList.add("loading")
	var loadingtimeout = window.setTimeout(()=>{document.body.classList.remove("loading"); loading = false}, 300)
	const grid = document.getElementById("grid")
	grid.innerHTML = ''
	var plan = stage.plan

	for (const floor in plan.floors) {
		let toaddhtml = `<div class="floor" style="--floorheight: ${plan.floors[floor].floorheight}" level="${floor}">`
		plan.floors[floor].grid.forEach((piece, i)=>{
			let entity = plan.entities[piece]
			let tileattributes = ''
			let tilestyles = ''
			if (entity) {
				if (entity.exec) {entity.exec(i)}
				let attributes = ''
				attributes += entity.id ? `id="${entity.id}"`: ''
				attributes += entity.class ? `class="${entity.class}"` : ''
				
				tileattributes += entity.tileclass ? `class="tile ${entity.tileclass}"` : 'class="tile"'
				if (entity.tileattributes) {
					for (const attribute in entity.tileattributes) {
						tileattributes += `${attribute}="${entity.tileattributes[attribute]}"`
					}
				}
				if (entity.tilestyles) {
					for (const style in entity.tilestyles) {
						tilestyles += `${style}: ${entity.tilestyles[style]}; `
					}
				}

				var element = `<div ${attributes}>${entity.content || ''}</div>`
				if (entity.id == 'player') {
					player.x = startx || i % plan.width
					player.y = starty || Math.floor(i / plan.width)
					player.rotate = startangle || plan.startangle || 0
				}
			} else {
				tileattributes = 'class="tile"'
			}

			if (!entity || !entity.nonexistent) { toaddhtml += `<div ${tileattributes} style="--xpos: ${i % plan.width}; --ypos: ${Math.floor(i / plan.width)}; ${tilestyles}">${element || ""}</div>` }
		})
		toaddhtml += `</div>`
		grid.innerHTML += toaddhtml
	}
	step()
	grid.style.setProperty('--playerzoffset', '0px')
}

function step(event = undefined) {
	let forward = 0
	let side = 0
	let turn = 0
	let direction = 0
	switch (event?.key.toLowerCase()) {
		case "arrowup":
		case "w":
			forward = -1
			direction = 0
		break
		case "arrowleft":
		case "a":
			side = -1
			direction = -90
		break
		case "arrowdown":
		case "s":
			forward = 1
			direction = 180
		break
		case "arrowright":
		case "d":
			side = 1
			direction = 90
		break
		case "z":
		case "q":
			if (!event.force && player.lookaround) {break}
			turn = -90
		break
		case "x":
		case "e":
			if (!event.force && player.lookaround) {break}
			turn = 90
		break
		case " ":
			player.lookaround = !player.lookaround
			lookaroundlocation = {x: 0, y: 0}
			grid.style.setProperty("--lookaroundx", 0)
			grid.style.setProperty("--lookaroundy", 0)
		break
	}
	player.rotate += turn
	let movedirection = (player.rotate + direction % 360 + 360) % 360
	
	let to_x = player.x
	let to_y = player.y
	switch ((player.rotate % 360 + 360) % 360) {
		case 0:
			to_x += side
			to_y += forward
		break
		case 90:
			to_x -= forward
			to_y += side
		break
		case 180:
			to_x -= side
			to_y -= forward
		break
		case 270:
			to_x += forward
			to_y -= side
		break
	}
	
	let wasat = document.querySelector(`.floor[level="${player.floor}"] .tile[style*="--xpos: ${player.x}; --ypos: ${player.y};"]`)
	let moved = to_x != player.x || to_y != player.y
	if (moved && wasat.classList.contains('changefloor') && wasat.getAttribute("changefloordirections").split(",").includes(String(movedirection))) {
		player.floor = Number(wasat.getAttribute('dest'))
	}

	let goingto = document.querySelector(`.floor[level="${player.floor}"] .tile[style*="--xpos: ${to_x}; --ypos: ${to_y};"]`)
	let blocked = false
	if (goingto && goingto.classList.contains('cantfrom') && goingto.getAttribute("cantfromdirections").split(",").includes(String(movedirection))) {
	   blocked = true
	}
	if (!loading && goingto && !goingto.classList.contains('nowalk') && !blocked){
		if (moved) {
			player.x = to_x
			player.y = to_y
			if (goingto.classList.contains('exit')) {
				loadStage(plans[goingto.getAttribute("dest")], Number(goingto.getAttribute("exitx")), Number(goingto.getAttribute("exity")), Number(goingto.getAttribute("exitangle")))
			}
		}
		if (goingto.classList.contains('zoffset')) {
			grid.style.setProperty('--playerzoffset', goingto.style.getPropertyValue('--zoffset'))
		} else {
			grid.style.setProperty('--playerzoffset', '0px')
		}
	}
	grid.style.setProperty('--playerx', player.x)
	grid.style.setProperty('--playery', player.y)
	grid.style.setProperty('--playerrotate', player.rotate)
	grid.setAttribute('playerdirection', (player.rotate % 360 + 360) % 360)
	player.lookaround ? document.body.classList.add('lookaround') : document.body.classList.remove('lookaround')
	grid.style.setProperty('--playerflooroffset', document.querySelector(`.floor[level="${player.floor}"]`).style.getPropertyValue('--floorheight'))
	document.querySelector(`.floor[level="${player.floor}"] .tile[style*="--xpos: ${player.x}; --ypos: ${player.y}"]`).appendChild(document.getElementById('player'))
	document.querySelectorAll(`.tile`).forEach(tile=>{
		let diff = Math.abs(tile.style.getPropertyValue('--xpos') - player.x) + Math.abs(tile.style.getPropertyValue('--ypos') - player.y);
		let opacity = 1.5 - diff * 0.25;
		tile.style.setProperty('--bullshitopacity', opacity)
	})
}

function lookaround(event) {
	if (!document.body.classList.contains("lookaround")) {return}
	let enddrag = {x: event.clientX, y: event.clientY}
	let diff = {x: enddrag.x - startdrag.x, y: enddrag.y - startdrag.y}
	if (lookaroundlocation.x + diff.x > 450) {
		lookaroundlocation.x -= 900
		step({force: true, key: "q"})
	}
	if (lookaroundlocation.x + diff.x < -450) {
		lookaroundlocation.x += 900
		step({force: true, key: "e"})
	}
	grid.style.setProperty("--lookaroundx", lookaroundlocation.x + diff.x)
	grid.style.setProperty("--lookaroundy", lookaroundlocation.y + diff.y)
}