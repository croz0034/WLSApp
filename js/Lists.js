let Lists = {
    Players: [],
    Brackets: [],
    init: (ev) => {
        document.querySelector("#AddConfirm").addEventListener("click", Lists.AddConfirm)
    },
    AddConfirm: (ev) => { 
        console.log(Lists[Navigation.Location])
        if(Navigation.Location == "Players"){
           let additions = {Name: document.querySelector("#AddValue").value, current: 0}; Lists[Navigation.Location].push(additions);
            
        } else {
            Lists[Navigation.Location].push(document.querySelector("#AddValue").value);
        }
        Navigation.AddToggle(ev)
        Lists.UpdateList(ev)
    },
    UpdateList: (ev) => {
        let newItem = Lists[Navigation.Location][Lists[Navigation.Location].length - 1]
        let target = document.querySelector(`#${Navigation.Location}`)
        let additions = document.createElement("li");
        target.appendChild(additions)
            if(Navigation.Location == "Brackets"){
        additions.textContent = `${newItem}`
                target = document.querySelector("#Tourney")
                additions = document.createElement("a");
                additions.className = "Tournament";
                additions.id = newItem;
                additions.textContent = newItem;
                target.append(additions)
            } else {
                additions.textContent = `${Lists[Navigation.Location].length}: ${newItem.Name}`
                
                target = document.querySelector("#PrelimBracket")
        additions = document.createElement("button")
        additions.classList = "PrelimButton";
                console.log(newItem)
        additions.id = newItem.Name;
        additions.textContent = Lists.Players.length;
                target.append(additions)
            }
        
        
        
    },
}
