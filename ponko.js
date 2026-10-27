let selection = [];

function clickButton(buttonID) {
    if (document.getElementById(buttonID).className.includes(" selected")) {
        document.getElementById(buttonID).className = document.getElementById(buttonID).className.replace(" selected", "");
        for (i = 0; i < selection.length; i++) {
            if (selection[i] == buttonID) {
                selection.splice(i, 1);
            }
        }
    } else {
        document.getElementById(buttonID).className = document.getElementById(buttonID).className + " selected";
        selection.push(buttonID);
    }
}

//STILL BUGGED FOR MULTIPLE KEYWORDS
function clickFilter(buttonID) {
    clickButton(buttonID);
    let items = document.getElementsByClassName("item");
    for (i = 0; i < items.length; i++) {
        let keys = items[i].className.split(" ");
        for (j = 1; j < keys.length; j++) {
            if (selection.includes(keys[j])) {
                items[i].className += " show";
                break
            } else {
                items[i].className = items[i].className.replace(" show", "");
            }
        }
    }
}