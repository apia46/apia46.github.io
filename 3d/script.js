var player = {x: 0, y: 0, rotate: 0}

document.addEventListener("DOMContentLoaded", ()=>{
    loadStage()
})

function loadStage(){
    var grid = document.getElementById("grid")

    plan.grid.forEach((piece, i)=>{
        switch (piece) {
            case "S":
                player.x = i % plan.width
                player.y = Math.floor(i / plan.width)
                grid.innerHTML += `<div id="player"></div>`
            case "#":
                grid.innerHTML += `<div class="tile" style="--xpos: ${i % plan.width}; --ypos: ${Math.floor(i / plan.width)};"></div>`
            break
        }
    })
    step()
}

window.addEventListener("keydown", step)

function step(event = undefined) {
    var forward = 0
    var side = 0
    var turn = 0
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
    switch ((player.rotate % 360 + 360) % 360) {
        case 0:
            player.x += side
            player.y += forward
        break
        case 90:
            player.x -= forward
            player.y += side
        break
        case 180:
            player.x -= side
            player.y -= forward
        break
        case 270:
            player.x += forward
            player.y -= side
        break
    }
    grid.style.setProperty('--playerx', player.x)
    grid.style.setProperty('--playery', player.y)
    grid.style.setProperty('--playerrotate', player.rotate)
    document.querySelector(`.tile[style*="--xpos: ${player.x}; --ypos: ${player.y};"]`).appendChild(document.getElementById('player'))
}