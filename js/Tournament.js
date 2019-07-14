let Scores = {

}

let Tournament = {
    NavTo: (ev) => {
        Tournament.Current = ev.target.id;
        Tournament.HideAll();

        if (Tournament.Brackets[Tournament.Current]) {
            switch (Tournament.Brackets[Tournament.Current].Round) {
                case "Prelim End":
                    document.querySelector("#Prelim").classList.remove("hidden");
                    document.querySelector(".SetUp").classList.remove("hidden");
                    document.querySelector("#Contestants").classList.add("hidden")
                    Tournament.PrelimEnd();
                    break;
                case 1:
                    Tournament.Round1Start();
                    break;
                case 2: document.querySelector("#TourneyProper").classList.remove("hidden");
                    Tournament.Round2Start();
                    break;
                case 3: document.querySelector("#TourneyProper").classList.remove("hidden");
                    Tournament.Round3Start();
                    break;
                case 4:
                    Tournament.Scores();
                    break;

                default:
                    document.querySelector("#Prelim").classList.remove("hidden");
                    document.querySelector(".SetUp").classList.remove("hidden");
                    document.querySelector("#Contestants").classList.add("hidden")
                    break;
            }
        } else {
            document.querySelector("#Prelim").classList.remove("hidden");
            document.querySelector(".SetUp").classList.remove("hidden"); 
            document.querySelector("#Contestants").classList.add("hidden")
            
        document.querySelector(".SetUp").classList.remove("hidden");
        document.querySelector(".CountDown").classList.add("hidden")

        }
    },
    HideAll: ()=>{ 
    let potentials = 
    ["Scores", "TourneyProper", "Contestants","Prelim"]
potentials.forEach((item)=>{
    document.querySelector(`#${item}`).classList.add("hidden")
})
},
    Current: "",
    Brackets: {},
    init: (ev) => {
        document.querySelector("#WLStart").addEventListener("click", Tournament.Prelim);
        document.querySelector("#Deck").addEventListener("click", Tournament.FightSelect);
        document.querySelector("#A").addEventListener("click", Tournament.FightConclude);
        document.querySelector("#B").addEventListener("click", Tournament.FightConclude);
        document.querySelector("#ContinueButton").addEventListener("click", Tournament.Round1Start);

    },
    FightSelect: (ev) => {

        if (document.querySelector(".Active")) {
            document.querySelector(".Active").classList.remove("Active")
        }
        console.log(ev.target.tagName)
        if (ev.target.tagName == "TD") {
            ev.target.parentElement.classList.toggle("Active");

            console.log("Hit")
        } else {
            ev.target.classList.toggle("Active")

        }
    },
    FightConclude: (ev) => {
        let target = document.querySelector(".Active");
        let info = target.getAttribute("info").split(",")
        let Winners;
        let NextRound;
        switch (Tournament.Brackets[Tournament.Current].Round) {
            case 1:
                Winners = Tournament.Brackets[Tournament.Current].Round2;
                NextRound = Tournament.Round2Start;
                break;
            case 2:
                Winners = Tournament.Brackets[Tournament.Current].Round3;
                NextRound = Tournament.Round3Start;
                break;
            case 3:
                Winners = Tournament.Brackets[Tournament.Current].Winner;
                NextRound = Tournament.Scores;
                break;
        }


        if (ev.target.id == "A") {
            Winners.push(info[0]);
            Scores[info[0]].current++;
            if (Scores[info[0]].longest < Scores[info[0]].current) {
                Scores[info[0]].longest = Scores[info[0]].current
            }

            if (Tournament.Brackets[Tournament.Current].Round == 2) {
                Tournament.Brackets[Tournament.Current].RunnerUp.push(info[1])
            }

            if (Tournament.Brackets[Tournament.Current].Round == 3 && Scores[info[1]].current != 0) {
                Scores[info[0]].First.push(Tournament.Current);
                Scores[info[1]].Second.push(Tournament.Current)
            } else if (Tournament.Brackets[Tournament.Current].Round == 3) {
                Scores[info[0]].Third.push(Tournament.Current);
            }
            Scores[info[1]].current = 0;

        } else {

            Winners.push(info[1]);
            Scores[info[1]].current++;
            if (Scores[info[1]].longest < Scores[info[1]].current) {
                Scores[info[1]].longest = Scores[info[1]].current
            }

            if (Tournament.Brackets[Tournament.Current].Round == 2) {
                Tournament.Brackets[Tournament.Current].RunnerUp.push(info[0])
            }


            if (Tournament.Brackets[Tournament.Current].Round == 3 && Scores[info[0]].current != 0) {
                Scores[info[1]].First.push(Tournament.Current);
                Scores[info[0]].Second.push(Tournament.Current)
            } else if (Tournament.Brackets[Tournament.Current].Round == 3) {
                Scores[info[1]].Third.push(Tournament.Current);
            }
            Scores[info[0]].current = 0;
        }
        target.parentNode.removeChild(target)

        if (!document.querySelector("td")) {
            console.log("Continue")
            NextRound();
        }
    },
    Prelim: (ev) => {
        Tournament.Brackets[Tournament.Current] = {}
        let current = Tournament.Brackets[Tournament.Current]
        Lists.Players.forEach((Player) => {
            current[Player.Name] = {
                Prelim: 0,
                longest: Player.current,
                current: Player.current,
                First: [],
                Second: [],
                Third: [],
                comboBreak: 0
            };
            if(!Scores[Player.Name]){
            Scores[Player.Name] = current[Player.Name]};
        })
        Timer.init(ev);
    },
    PrelimEnd: () => {
        Tournament.Brackets[Tournament.Current].Round = "Prelim End";
        document.querySelector("#PrelimBracket").removeEventListener("click", Tournament.AddPoint)
        document.querySelector("#Prelim").classList.add("hidden")

        target = document.querySelector("#Contestants");
        target.classList.remove("hidden")
        target = document.querySelector(".Contestantlist")
        target.innerHTML = "";

        let players = Object.keys(Tournament.Brackets[Tournament.Current])
        players.splice(players.indexOf("Round"), 1)
        console.log(players)
        players.sort(function (a, b) {
            let A = Tournament.Brackets[Tournament.Current][a].Prelim;
            let B = Tournament.Brackets[Tournament.Current][b].Prelim;
            return (A > B) ? -1 : (A < B) ? 1 : 0;
        });
        players.forEach((Player) => {
            additions = document.createElement("li");
            additions.id = Player;
            additions.textContent = `${Player}: ${Tournament.Brackets[Tournament.Current][Player].Prelim} points`;
            target.append(additions)

        })

        target.addEventListener("click", Tournament.PlayerSelect)

        Tournament.Brackets[Tournament.Current].RunnerUp = [];

    },
    PlayerSelect: (ev) => {
        if (ev.target.id) {
            if (ev.target.classList.contains("Selected") || document.querySelectorAll(".Selected").length < 8) {
                ev.target.classList.toggle("Selected");
                document.querySelector("#ContinueButton").textContent = `Players: ${document.querySelectorAll(".Selected").length}`;

            }
        }
    },
    Round1Start: (ev) => {
        Tournament.Brackets[Tournament.Current].Round2 = []
        let Players = Array(0);
        if (ev) {
            let selections = document.querySelectorAll(".Selected")
            console.log(selections.length)
            if (selections.length == 8) {
                selections.forEach((player) => {
                    Players.push(player.id)
                })
            }
        } else {
            Players = Tournament.Brackets[Tournament.Current].Round1
        }
        console.log(Players)
        Tournament.Brackets[Tournament.Current].Round = 1;
        document.querySelector("#Contestants").classList.add("hidden");
        document.querySelector("#TourneyProper").classList.remove("hidden");
        Tournament.Brackets[Tournament.Current].Round1 = Players;
        Tournament.BuildList(Players)




    },
    Round2Start: (ev) => {
        Tournament.Brackets[Tournament.Current].Round3 = [];
        Tournament.Brackets[Tournament.Current].Round = 2;

        let Players = Tournament.Brackets[Tournament.Current].Round2;

        Tournament.BuildList(Players)

    },
    Round3Start: () => {
        Tournament.Brackets[Tournament.Current].Winner = []
        Tournament.Brackets[Tournament.Current].Round = 3;
        let target = document.querySelector("#Deck");
        let roster = `<table>
            <tr><th>Contestant A</th><th> Contestant B</th></tr> `

        let Tourney = Tournament.Brackets[Tournament.Current].Round3.slice()

        let contestant1 = Tourney.pop();
        let contestant2 = Tourney.shift();
        roster += ` <tr info="${contestant1},${contestant2}"> <td> ${contestant1} </td> <td> ${contestant2} </td> </tr> `

        contestant1 = Tournament.Brackets[Tournament.Current].RunnerUp[0];
        contestant2 = Tournament.Brackets[Tournament.Current].RunnerUp[1];

        roster += ` <tr info="${contestant1},${contestant2}"> <td> ${contestant1} </td> <td> ${contestant2} </td> </tr> `

        target.innerHTML = ` ${roster}</table>`



    },
    BuildList: (Players) => {
        Players = Players.slice();
        let target = document.querySelector("#Deck");
        let roster = `<table>
            <tr><th>Contestant A</th><th> Contestant B</th></tr> `

        for (let x = 0; Players.length > 0; x++) {
            console.log(roster)
            let contestant1 = Players.pop();
            let contestant2 = Players.shift();
            roster += ` <tr info="${contestant1},${contestant2}"> <td> ${contestant1} </td> <td> ${contestant2} </td> </tr> `
        }
        console.log(roster)
        target.innerHTML = ` ${roster}</table>`
    },
    Scores: () => {
        console.log(Tournament.Brackets[Tournament.Current]);
        Tournament.Brackets[Tournament.Current].Round = 4;
        document.querySelector("#TourneyProper").classList.add("hidden");
        let target = document.querySelector("#Scores");
        target.classList.remove("hidden");

        target.innerHTML = "";
        console.log("ping");

        Lists.Players.forEach((player) => {
            player = player.Name;
            let additions = `<p class="ScoreSheet" id=${player}><strong>${player}</strong> <br /> Streak : ${Scores[player].longest} <br /> `;
            if (Scores[player].First.length >= 1) {
                additions += `1st place: ${JSON.stringify(Scores[player].First)} <br />`
            };
            if (Scores[player].Second.length >= 1) {
                additions += `2nd place: ${JSON.stringify(Scores[player].Second)} <br />`
            };
            if (Scores[player].Third.length >= 1) {
                additions += `3rd place: ${JSON.stringify(Scores[player].Third)} <br />`
            }
            target.innerHTML += additions;


        })
    }

}

let Timer = {
    Duration: 0,
    init: (ev) => {
        document.querySelector(".SetUp").classList.add("hidden");
        document.querySelector(".CountDown").classList.remove("hidden")
        Timer.Duration = document.querySelector("#WLSTime").value;

        Timer.Run(ev)
    },
    Run: (ev) => {
        document.querySelector("#PrelimBracket").addEventListener("click", Timer.AddPoint)

        document.querySelector(".countDownText").textContent = `${Timer.Duration}:00`;
        let minutes = Timer.Duration;
        let seconds = 0;

        let pocketwatch = setInterval(() => {
            let Progress = (minutes * 60 + seconds) / (Timer.Duration * 60);
            document.querySelector(".countDownBar").style.width = `${Progress * 100}vw`
            let timerbase = document.querySelector(".countDownText")
            if (seconds == 0 && minutes > 0) {
                minutes--;
                seconds = 59;
                timerbase.textContent = `${minutes} : ${seconds}`
            } else if (seconds > 0) {
                seconds--;
                timerbase.textContent = `${minutes} : ${seconds}`
            } else {
                clearInterval(pocketwatch);
                Tournament.PrelimEnd();
            }
        }, 1000)
    },
    AddPoint: (ev) => {
        console.log("click")
        console.log(ev.target.id)
        if (ev.target.id) {
            console.log(Tournament.Brackets[Tournament.Current])
            console.log(Tournament.Brackets[Tournament.Current][ev.target.id]);
            Tournament.Brackets[Tournament.Current][ev.target.id].Prelim++
        }


    }
}


let stages = ["Prelim", "Round 1", "SemiFinal", "Final"]
