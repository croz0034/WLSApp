let Master = {
    init: (ev)=>{
        Navigation.init(ev);
        Lists.init(ev);
        Tournament.init(ev);
        Tap.init(ev);
    }
}

document.addEventListener("DOMContentLoaded", Master.init)