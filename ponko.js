let selection = [];
let categories = ["clipboard", "profiles", "communications", "sites"];
let currentTab = "clipboard";
let editMode = false;
let removeMode = false;
let data = {};

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

function clearAll() {
    let current = selection.slice();
    for (let k = 0; k < current.length; k++) {
        clickFilter(current[k]);
    }
}

function showTab(tab) {
    if (selection.includes(tab)) {
        return;
    }
    clearAll();
    clickFilter(tab);
    currentTab = tab;
    editMode = false;
    removeMode = false;
    updateButtons()
}

function saveData() {
    localStorage.setItem("ponkoData", JSON.stringify(data));
}

function loadData() {
    let saved = localStorage.getItem("ponkoData");
    if (saved) {
        data = JSON.parse(saved);
    } else {
        let oldClips = localStorage.getItem("ponkoClips");
        data = {
            clipboard: oldClips ? JSON.parse(oldClips) : [],
            profiles: [
                { name: "LinkedIn", text: "https://www.linkedin.com/in/vdabao" },
                { name: "GitHub", text: "https://github.com/vdabao" },
                { name: "JobStreet", text: "https://ph.jobstreet.com/profiles/318dfvv0ff" },
                { name: "Facebook", text: "https://www.facebook.com/victoreanand/" }
            ],
            communications: [
                { name: "Messenger", text: "https://www.facebook.com/messages/t" },
                { name: "Private Email", text: "https://mail.google.com/mail/u/0/#inbox" },
                { name: "Public Email", text: "https://mail.google.com/mail/u/1/#inbox" },
                { name: "UP Email", text: "https://mail.google.com/mail/u/2/#inbox" },
                { name: "UP Alumni Email", text: "https://mail.google.com/mail/u/3/#inbox" },
                { name: "EEE Email", text: "https://mail.google.com/mail/u/4/#inbox" }
            ],
            sites: []
        };
    }
    for (let c = 0; c < categories.length; c++) {
        for (let k = 0; k < data[categories[c]].length; k++) {
            makeItem(categories[c], k);
        }
    }
}

function makeItem(tab, index) {
    let div = document.createElement("div");
    div.className = "item " + tab;
    if (selection.includes(tab)) {
        div.className += " show";
    }
    div.dataset.tab = tab;
    div.dataset.index = index;
    div.innerText = data[tab][index].name;
    div.onclick = function () { itemClick(div); };
    document.querySelector(".item-container").appendChild(div);
}

function itemClick(element) {
    let tab = element.dataset.tab;
    let item = data[tab][element.dataset.index];
    if (editMode) {
        editItem(element);
    } else if (removeMode) {
        removeItem(element);
    } else if (tab == "clipboard") {
        navigator.clipboard.writeText(item.text);
        element.innerText = "Copied!";
        setTimeout(function () { element.innerText = item.name; }, 800);
    } else {
        window.open(item.text, '_blank');
    }
}

function fixLink(text) {
    text = text.trim();
    if (text != "" && !text.includes("://")) {
        text = "https://" + text;
    }
    return text;
}

function addItem() {
    let tab = currentTab;
    let name = prompt("Name of the new item:");
    if (name == null || name.trim() == "") {
        return;
    }
    let text;
    if (tab == "clipboard") {
        text = prompt("Text to copy when clicked:");
    } else {
        text = prompt("Link to open when clicked:");
        if (text != null) {
            text = fixLink(text);
        }
    }
    if (text == null || (tab != "clipboard" && text == "")) {
        return;
    }
    data[tab].push({ name: name.trim(), text: text });
    saveData();
    makeItem(tab, data[tab].length - 1);
}

function editItem(element) {
    let tab = element.dataset.tab;
    let item = data[tab][element.dataset.index];
    let name = prompt("Edit name:", item.name);
    if (name == null || name.trim() == "") {
        return;
    }
    let text;
    if (tab == "clipboard") {
        text = prompt("Edit text to copy:", item.text);
    } else {
        text = prompt("Edit link:", item.text);
        if (text != null) {
            text = fixLink(text);
        }
    }
    if (text == null || (tab != "clipboard" && text == "")) {
        return;
    }
    item.name = name.trim();
    item.text = text;
    saveData();
    element.innerText = item.name;
}

function updateButtons() {
    let editButton = document.getElementById("button-edit");
    let removeButton = document.getElementById("button-remove");
    if (editMode) {
        if (!editButton.className.includes(" selected")) {
            editButton.className += " selected";
        }
    } else {
        editButton.className = editButton.className.replace(" selected", "");
    }
    if (removeMode) {
        if (!removeButton.className.includes(" selected")) {
            removeButton.className += " selected";
        }
    } else {
        removeButton.className = removeButton.className.replace(" selected", "");
    }
}

function toggleEditButton() {
    editMode = !editMode;
    if (editMode == true) {
        removeMode = false;
    }
    updateButtons();
}

function toggleRemoveButton() {
    removeMode = !removeMode;
    if (removeMode == true) {
        editMode = false;
    }
    updateButtons();
}

function removeItem(element) {
    let tab = element.dataset.tab;
    let index = parseInt(element.dataset.index);
    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }
    data[tab].splice(index, 1);
    saveData();
    element.remove();
}

window.onload = function () {
    loadData();
    showTab("clipboard");
};