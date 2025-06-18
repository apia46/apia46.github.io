function load() {
    const graph = document.getElementById("graph");
    var previousMouseX;
    var previousMouseY;
    function lookaround(event) {
        graph.style.setProperty("--posX", graph.style.getPropertyValue("--posX")||0 + event.clientX - previousMouseX)
        graph.style.setProperty("--posY", graph.style.getPropertyValue("--posY")||0 + event.clientY - previousMouseY)
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
    graph.addEventListener("mousedown", (event)=>{previousMouseX = event.clientX; previousMouseY = event.clientY; graph.addEventListener("mousemove", lookaround)})
    graph.addEventListener("mouseup", ()=>{graph.removeEventListener("mousemove", lookaround)})
}