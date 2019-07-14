let UserName
let Tap = {
    Failed: false,
    TapMode: "Read",
    init: () => {
        setTimeout(() => {
            nfc.addNdefListener(Tap.Discovered, Tap.Win, Tap.Lose)
        }, 200);
    },
    Win: () => {
        console.log("Listening for NFC Tags")
    },
    Lose: () => {
        console.log("Error adding NFC listener")
    },

    Discovered: (nfcEvent) => {
            Tap.Read(nfcEvent)
        
        let playerlist = [];
        Lists.Players.forEach((Player)=>{
            playerlist.push(Player.Name)
        });
        if(!playerlist || !playerlist.includes(UserName)){
            console.log(CurrentCardTournament)
            console.log(UserName)
            Lists.Players.push({Name: UserName, current: CurrentCardTournament.current});
            Lists.UpdateList();
        } else {
            
            Tap.Write(nfcEvent)
        }
        }
    ,
    Read: (nfcEvent) => {

        CurrentCard = {
            ID: "",
            TextItems: [],
            EventStats: EventStatsBase
        };
        var tag = nfcEvent.tag.ndefMessage;
        if (!tag) {
            return null
        }
        for (let i = 0; i < tag.length; i++) {
            Tap.Decode(tag[i].payload, tag[i].type)
        }
    },
    Write: (nfcEvent) => {
        let WriteValue = CurrentCard.EventStats;
        console.log(WriteValue)
        
        var message = [];
        if (CurrentCard.ID) {
            let ID = CurrentCard.ID
            let WebSite = "ORK";
            if (WebSite == "ORK") {
                message.push(ndef.uriRecord(`https://amtgard.com/ork/orkui/index.php?Route=Player/index/${CurrentCard.ID}`))
            } 
            else { 
                message.push(ndef.uriRecord(`https://croz0034.github.io/ProjectDragon#name=${CurrentCard.EventStats.Name}&&ID=${CurrentCard.ID}`))
            }
        }
        if (CurrentCard.TextItems.length > 0) {
            CurrentCard.TextItems.forEach((item) => {
                message.push(ndef.textRecord(item))
            })
        }
        
        message.push(ndef.textRecord(`Event=${JSON.stringify(WriteValue)}`))
        
        let tourneyStats = {Name: UserName, current:  Scores[UserName].current};
        
        message.push(ndef.textRecord(`Tournament=${JSON.stringify(tourneyStats)}`))
        console.log(WriteValue)
        console.log(CurrentCard)
        nfc.write(message, Tap.WrittenMsg, Tap.FailedMsg)
    },
    Decode: (CharArray, tagtype) => {
        let text = String.fromCharCode.apply(null, CharArray);
        tagtype = String.fromCharCode(tagtype);
        console.log(tagtype)
        if (tagtype == "T") {
            let arrival = text.replace("\u0002en", "")
            console.log(arrival)
            if (arrival.split("=")[0] == "Event") {
                CurrentCard.EventStats = JSON.parse(arrival.split("=")[1])
                console.log(CurrentCard)
            } else if(arrival.split("=")[0] == "Tournament") {
                CurrentCard.CurrentCardTournament = JSON.parse(arrival.split("=")[1])
            }else {
                CurrentCard.TextItems.push(arrival);
            }
        } else {
            if (text.includes("&&")) {
                CurrentCard.ID = text.split("ID=")[1];
            } else {
                CurrentCard.ID = text.split("/").pop();
            }
            console.log(CurrentCard.ID)
        }

        if(CurrentCard.EventStats.Name){ UserName = CurrentCard.EventStats.Name}
        if(CurrentCardTournament.Name){
            UserName = CurrentCardTournament.Name
        }
    },
    WrittenMsg: () => {
        alert("Sucessfull Write");
        let Consumables = document.getElementById("Consumables");
            Consumables.innerHTML = "";
        Tap.Failed = false;
        CardWindows.ReadWindow();
    },
    FailedMsg: () => {
        Tap.Failed = true;
        alert("Something went wrong")
    }
}
let CurrentCard = {
    ID: "",
    TextItems: [],
    EventStats: {
        Name: "",
        Team: "",
        Gold: "",
        Points: "",
        Inventory: {}
    }
};
let EventStatsBase = {
    Name: "",
    Team: "",
    Gold: "",
    Points: "",
    Inventory: {}
};
let CurrentCardTournament = {Name: "", current: 0}
