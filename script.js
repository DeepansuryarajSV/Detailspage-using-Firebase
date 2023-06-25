

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyCCga5PtdvkG0c1djvNw2a3Xd_fBLLT73w",
    authDomain: "nrich-assessment.firebaseapp.com",
    projectId: "nrich-assessment",
    storageBucket: "nrich-assessment.appspot.com",
    messagingSenderId: "1075672676954",
    appId: "1:1075672676954:web:e37c593246de8ea42af663",
    measurementId: "G-86J5GRCPN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const dataRef = ref(database, "users/");

var submitBtn = document.getElementById('submitbtn');
var closeBtn = document.getElementById('closebtn');
var updatemodal = document.getElementById('update-modal');
var updatebtn = document.getElementById('updatebtn');

let currentKey;

const getVal = (id) => {
    return document.getElementById(`${id}`).value;
}

const resetVal = (id) => {
    document.getElementById(`${id}`).value = "";
}

const setVal = (id, val) => {
  document.getElementById(`${id}`).value = val;
}

const setKey = (key) => {
  currentKey = key;
}

const displayData = (data) => {
    const tableContainer = document.getElementById('table-container');
    let table = document.getElementById('data-table');
  
    if (!table) {
      table = document.createElement("table");
      table.id = "data-table";
      table.classList.add("data-table");
      tableContainer.appendChild(table);
    }
  
    const headerRow = document.createElement("tr");
    const headers = ["Name", "Email", "Message", "Actions"];
  
    // Create header cells
    headers.forEach((headerText) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
    });

    headerRow.classList.add('thead');
  
    // Clear existing rows
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
  
    // Append the header row to the table
    table.appendChild(headerRow);
  
    const tbody = document.createElement("tbody");
  
    // Iterate over the data and create rows
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const entry = data[key];
        const dataRow = document.createElement("tr");
  
        // Create cells and populate with data
        const nameCell = document.createElement("td");
        nameCell.textContent = entry.Name;
        dataRow.appendChild(nameCell);
  
        const emailCell = document.createElement("td");
        emailCell.textContent = entry.Email;
        dataRow.appendChild(emailCell);
  
        const messageCell = document.createElement("td");
        messageCell.textContent = entry.Message;
        dataRow.appendChild(messageCell);
  
        const actionsCell = document.createElement("td");
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.classList.add('updatebtn')
        // Add event listener for the update button
        updateButton.addEventListener("click", () => {
          // Call a function to handle the update action
          handleUpdate(key, entry);
        });
        actionsCell.appendChild(updateButton);
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('deletebtn');
        // Add event listener for the delete button
        deleteButton.addEventListener("click", () => {
          // Call a function to handle the delete action
          handleDelete(key);
        });
        actionsCell.appendChild(deleteButton);
  
        dataRow.appendChild(actionsCell);
  
        // Append the data row to the tbody
        tbody.appendChild(dataRow);
      }
    }
  
    // Append the tbody to the table
    table.appendChild(tbody);
  
    tableContainer.appendChild(table);
  };
  
  // Example functions to handle update and delete actions
  
  
window.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

const fetchData = () => {
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        displayData(data);
    });
}


const submitDetails = () => {
    const newData = {
        Name: getVal("name"),
        Email: getVal("email"),
        Message: getVal("message")
    };

    push(dataRef,newData)
    .then(() => {
        alert("Data inserted Successfully");
        resetVal("name");
        resetVal("email");
        resetVal("message");
        fetchData();
    })
    .catch((error) => {
        console.error("Error inserting data: ", error);
    });
}

const toggleBlur = () => {
  const mainContainer = document.querySelector('.main-container');
  mainContainer.classList.toggle('blur');
}

const closeEvent = () => {
  updatemodal.style.visibility = 'hidden';
  toggleBlur()
}

function handleUpdate(key, entry) {
  toggleBlur()
  updatemodal.style.visibility = "visible";
  setVal('uname', entry.Name);
  setVal('uemail', entry.Email);
  setVal('umessage', entry.Message);
  setKey(key);
}

const updateDetails = () => {
  update(ref(database, "users/" + currentKey), {
    Name: getVal('uname'),
    Email: getVal('uemail'),
    Message: getVal('umessage')
  })
  .then(() => {
    updatemodal.style.visibility = "hidden";
    toggleBlur();
  })
  .catch((error) => {
    alert(error);
  })
}

function handleDelete(key) {
  remove(ref(database, "users/" + key))
  .then(() => {
    alert("Data Deleted Successfully")
  })
  .catch((error) => {
    alert(error);
  })
}

submitBtn.addEventListener('click', submitDetails);
closeBtn.addEventListener('click', closeEvent);
updatebtn.addEventListener('click', updateDetails);




