let Navigation = {
    Location:  "Tournament",
    init: ()=>{
        document.querySelector(".Burger").addEventListener("click", Navigation.MenuToggle)
        document.querySelector("nav").addEventListener("click", Navigation.NavPress);
        document.querySelectorAll(".AddButton").forEach((button)=>{button.addEventListener("click", Navigation.AddToggle)})
        document.querySelector("#AddCancel").addEventListener("click", Navigation.AddToggle);
        
        Navigation.ToDestination()
    },
    MenuToggle: ()=>{
        document.querySelector("nav").classList.toggle("active")
    },
    NavPress: (ev)=>{
        if(ev.target.classList){
        Navigation.MenuToggle(ev);
        Navigation.Location = ev.target.classList[0];
        Navigation.ToDestination()
        console.log(ev.target.classList[0])
        
        if (ev.target.id) {Tournament.NavTo(ev)}}
    },
    ToDestination: ()=>{
        let location = String(Navigation.Location)
        document.querySelectorAll(".Page").forEach((page)=>{
            page.classList.add("hidden")
        }); document.querySelector(`#${location}`).classList.remove("hidden")
        document.querySelector(".Title").textContent = location;
        location = location.slice(0, (location.length - 1))
        document.querySelector("#AddPrompt").textContent = `${location}:`;
    },
    AddToggle: (ev)=>{ document.querySelector("#Popup").classList.toggle("hidden");
        document.querySelector("#AddValue").value = ""
    }
}