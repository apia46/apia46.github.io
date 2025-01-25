const player = {x: 0, y: 0, rotate: 0}

document.addEventListener("DOMContentLoaded", ()=>{
    loadStage()
})

function loadStage(){
    const grid = document.getElementById("grid")

    plan.grid.forEach((piece, i)=>{
        let entity = plan.entities[piece]
        if (entity) {
            if (entity.exec) {entity.exec(i)}
            let attributes = ''
            attributes += entity.id ? `id="${entity.id}"`: ''
            attributes += entity.class ? `class="${entity.class}"`: ''
            var element = `<div ${attributes}>${entity.content || ''}</div>`
        }
        grid.innerHTML += `<div class="tile ${entity?.tileclass || ''}" style="--xpos: ${i % plan.width}; --ypos: ${Math.floor(i / plan.width)};">${element || ""}</div>`
    })
    step()
}

window.addEventListener("keydown", step)

function step(event = undefined) {
    let forward = 0
    let side = 0
    let turn = 0
    switch (event?.key.toLowerCase()) {
        case "arrowup":
        case "w":
            forward -= 1
        break
        case "arrowleft":
        case "a":
            side -= 1
        break
        case "arrowdown":
        case "s":
            forward += 1;
        break
        case "arrowright":
        case "d":
            side += 1
        break
        case "q":
            turn -= 90
        break
        case "e":
            turn += 90
        break
    }
    player.rotate += turn
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
    if (document.querySelector(`.tile[style*="--xpos: ${to_x}; --ypos: ${to_y};"]`) && !document.querySelector(`.tile[style*="--xpos: ${to_x}; --ypos: ${to_y};"]`).classList.contains('nowalk')){
        player.x = to_x
        player.y = to_y
    }
    grid.style.setProperty('--playerx', player.x)
    grid.style.setProperty('--playery', player.y)
    grid.style.setProperty('--playerrotate', player.rotate)
    document.querySelector(`.tile[style*="--xpos: ${player.x}; --ypos: ${player.y};"]`).appendChild(document.getElementById('player'))
    document.querySelectorAll(`.tile`).forEach(tile=>{
        let diff = Math.abs(tile.style.getPropertyValue('--xpos') - player.x) + Math.abs(tile.style.getPropertyValue('--ypos') - player.y);
        let opacity = 1.5 - diff * 0.25;
        tile.style.setProperty('--bullshitopacity', opacity)
    })
}