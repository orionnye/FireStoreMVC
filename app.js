// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAG-ZzCxAPP8z1yOjNQC89bgHmn9YQgjPE",
    authDomain: "firetest-a48ba.firebaseapp.com",
    databaseURL: "https://firetest-a48ba.firebaseio.com",
    projectId: "firetest-a48ba",
    storageBucket: "firetest-a48ba.appspot.com",
    messagingSenderId: "297075847453",
    appId: "1:297075847453:web:566238cb4d52689b"
}
const app = firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const db = firebase.firestore(app)
// KN: common sub expression -> probably convert to well named variable
const docRef = db.collection("list").orderBy("timeStamp")
const dones = db.collection("list").where("done", "==", true)
const todos = db.collection("list").where("done", "==", false)
const grid = document.getElementById("grid")

//user input
const dataEntry = document.getElementById("dataEntry")
//Button functions
let activeButton = document.getElementById("Active")
let completeButton = document.getElementById("Complete")
let allButton = document.getElementById("All")
let rightBar = document.getElementById("right")
let leftBar = document.getElementById("left")

activeButton.onclick = function() {
    // console.log("YOU CLICKED ACTIVE!!!")
    leftBar.style.width = "0%"
    rightBar.style.width = "66%"
    dataEntry.focus()
    activeButton.style.fontSize = "20px"
    completeButton.style.fontSize = "15px"
    allButton.style.fontSize = "15px"
    display(todos)
}
allButton.onclick = function() {
    // console.log("YOU CLICKED ALL!!!")
    leftBar.style.width = "33%"
    rightBar.style.width = "33%"
    activeButton.style.fontSize = "15px"
    completeButton.style.fontSize = "15px"
    allButton.style.fontSize = "20px"
    dataEntry.focus()
    displayAll()
}
completeButton.onclick = function() {
    // console.log("YOU CLICKED COMPLETE!!!")
    leftBar.style.width = "66%"
    rightBar.style.width = "0%"
    activeButton.style.fontSize = "15px"
    completeButton.style.fontSize = "20px"
    allButton.style.fontSize = "15px"
    dataEntry.focus()
    display(dones)
}
//initial display
displayAll()

//CLOUD FUNCTIONS
function cloudPush(taskName, completion) {
    let timeStamp = new Date().getTime()
    //  KN: manual Promise handling -> learn also how to do this with async functions.
    db.collection("list").doc(taskName).set({ done: completion, timeStamp: timeStamp })
    .then(function() {
        console.log(taskName, "successfully created!");
    }).catch((error) => {
        console.error("Error writing document: ", error)
    })
}
async function cloudPushAsync(taskName, completion) {
    let timeStamp = new Date().getTime()
    try {
        let result = await db.collection("list").doc(taskName).set({ done: completion, timeStamp });
        console.log(taskName, "successfully created!");
    } catch(e) {
        console.error("Error writing document: ", error)
    }
}
function cloudUpdate(taskName, completion) {
    db.collection("list").doc(taskName).update({ done: completion }).then(function() {
        console.log(taskName, "successfully modified!");
    }).catch((error) => {
        console.error("Error writing document: ", error)
    })
}
function cloudRemove(taskName) {
    db.collection("list").doc(taskName).delete().then(function() {
        console.log(taskName, "successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error)
    })
}
//Display functions
function createElement(name, properties, innerText = "") {
    let element = document.createElement(name)
    Object.assign(element, properties)
    element.innerText = innerText
    return element
}
function addRow(task, completion) {
    if (document.getElementById(task) <= "") {
        let row = createElement("div", {id: task.toString(), className: "row"})
        // let checkSpace = createElement("div", {className: "checkBocks"})
        let container = createElement("label", {className: "container"})
        let checkbox = createElement("input", {type: "checkbox", id: "checkbox", checked: completion })
        checkbox.onclick = function() {
            dataEntry.focus()
            cloudUpdate(task, checkbox.checked)
        }
        let checkSpan = createElement("span", {className: "checkmark"})
        //fix task reference
        let taskName = createElement("div", {className: "taskName"}, task)
        let removeSpace = createElement("div", {className: "removeSpace"})
        let removeButton = createElement("button", {className: "removeButton"})
        removeButton.onclick = function() {
            dataEntry.focus()
            cloudRemove(task)
        }
        grid.appendChild(row)
        // row.appendChild(checkSpace)
        // checkSpace.appendChild(container)
        row.appendChild(container)
        container.appendChild(checkbox)
        container.appendChild(checkSpan)
        row.appendChild(taskName)
        row.appendChild(removeSpace)
        removeSpace.appendChild(removeButton)
        removeButton.innerText = "X"
    }
}
//  KN: task should be called taskId, and ideally we should use Typescript with a type on it. : string
function modifyRow(task, completion) {
    let docRow = document.getElementById(task)
    if (!docRow <= "") {
        let checkBox = docRow.getElementsByTagName("checkbox")
        checkBox.checked = completion
    }
}
function removeRow(task) {
    let docRow = document.getElementById(task)
    if (docRow <= "") {
        console.log(task, "does not exist.")
    } else {
        grid.removeChild(docRow)
    }
}

function clearRows() {
    grid.innerHTML = ""
}
//You can optimize this for speed if necessary
function display(list) {
    clearRows()
    list.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            addRow(doc.id, doc.data().done)
        })
    }).catch((error) => {
        console.log("Got an error: ", error)
    })
}
function displayAll() {
    clearRows()
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            addRow(doc.id, doc.data().done)
        })
    })
}

//cloud listener and Update
docRef.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
        //Add Row
        if (change.type === "added") {
            // console.log("New Task: ", change.doc.data())
            addRow(change.doc.id, change.doc.data().done)
        }
        //Changed Row
        if (change.type === "modified") {
            // console.log("Modified Task: ", change.doc.data())
            modifyRow(change.doc.id, change.doc.data().done)
        }
        //removed Row
        if (change.type === "removed") {
            // console.log("Removed Task: ", change.doc.data())
            removeRow(change.doc.id)
        }
    })
})
//text Bar User Input
dataEntry.addEventListener("keydown", event => {
    if (event.key == "Enter" && dataEntry.value !== "") {
        console.log("pushing")
        cloudPush(dataEntry.value, false)
        dataEntry.value = ""
    }
})