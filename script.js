/* Script adds and removes employee objects from a payroll array,
and outputs the annual and monthly payroll cost to the DOM. */

var employeeArray = [];

var toBeDeleted;
// Global variable used to track employeeArray index of employee to be deleted.

function Employee(firstName, lastName, employeeID, jobTitle, salary){
  // Constructor function for Employee class.
  this.firstName = firstName;
  this.lastName = lastName;
  this.employeeID = employeeID;
  this.jobTitle = jobTitle;
  this.salary = salary;
}

var payrollReport, addReport, addEmpSection, removeReport, removeEmpSection, removeButton, removeConfirm, removeDeny, addData, removeData;
// Global DOM references, defined after window.onload.

window.onload = function() {
  payrollReport = document.getElementById("payrollReport");
  addReport = document.getElementById("addReport");
  addEmpSection = document.getElementById("addEmpSection");
  removeReport = document.getElementById("removeReport");
  removeEmpSection = document.getElementById("removeEmpSection");
  removeButton = document.getElementById("removeButton");
  removeConfirm = document.getElementById("removeConfirm");
  removeDeny = document.getElementById("removeDeny");
  addData = addEmpSection.querySelectorAll("input");
  removeData = removeEmpSection.querySelectorAll("input");
  calcPayroll();
};

function calcPayroll() {
  var totalPayroll = 0;
  for (var i = 0; i < employeeArray.length; i++) {
    totalPayroll += parseInt(employeeArray[i].salary, 10);
  }
  payrollReport.innerHTML = "<p>Current annual payroll: $" + totalPayroll + "</p>\n<p>Monthly cost: $" + parseInt((totalPayroll / 12), 10) + "</p>";
}

var addEmployee = function() {
  /* Triggered by an HTML button. Collects info from a set of 5 input
  fields in the DOM. Verifies that all text fields are filled, and that
  the employeeID isn't already in the array. If those tests pass, adds the
  employee to employeeArray. */
  // Make sure all fields are filled.
  for (var i = 0; i < 5; i++) {
    if (addData[i].value === "") {
      addReport.innerHTML = "<p>Please input employee data into all five fields.</p>";
      return;
    }
  }
  var firstName = addData[0].value;
  var lastName = addData[1].value;
  var employeeID = addData[2].value;
  var jobTitle = addData[3].value;
  var salary = addData[4].value;
  // Make sure employeeID isn't already in the array.
  var empFound = false;
  for (i = 0; i < employeeArray.length; i++) {
    if (employeeArray[i].employeeID == employeeID) {
      addReport.innerHTML = "<p>Employee ID Number " + employeeID + " is already in payroll.</p>";
      return;
    }
  }
  employeeArray.push(new Employee(firstName, lastName, employeeID, jobTitle, salary));
  // Tests passed, employee is added.
  // Re-calculate total payroll.
  calcPayroll();
  clearAddFields();
  addReport.innerHTML = "<p>" + firstName + " " + lastName + " (" + jobTitle + ", Employee ID " + employeeID + ", with annual salary $" + salary + ") added successfully to payroll.</p>";
  return;
};

var clearAddFields = function() {
  for (var i = 0; i < 5; i++) {
    addData[i].value = "";}
  addReport.innerHTML = "";
};

var removeEmployee = function(){
  /* Like addEmployee(), triggered by an HTML button. Collects info from a set
  of 2 input fields in the DOM; function will work with incomplete info (i.e.,
  just employeeID or lastName fields filled). If no matches are found, or if
  multiple or conflicting matches are found, function reports that to the user
  and makes no changes. If search finds just one match, function asks for
  confirmation of deletion, deletes the employee, reports confirmation,
  and clears the input boxes. */
  var lastName = removeData[0].value;
  var employeeID = removeData[1].value;
  var noEmpID = (employeeID.length === 0);
  var noLastName = (lastName.length === 0);
  var lastNamesFound = [];
  var i;
  // Check to make sure search fields have been filled.
  if ((noEmpID) && (noLastName)) {
    removeReport.innerHTML = "<p>Search fields are empty. Please input a last name, an employee ID number, or both.</p>";
    return;
  } else if ((!noEmpID) && (noLastName)) {
    // If user searches by employeeID, but not lastName, things are pretty simple.
    for (i = 0; i < employeeArray.length; i++) {
      if (employeeArray[i].employeeID == employeeID) {
        confirmRemove(i);
        return;
      }
    }
    // If it got this far, no employeeID match was found.
    removeReport.innerHTML = "<p>No employee found with ID number " + employeeID + ".</p>";
    return;
  } else if ((noEmpID) && (!noLastName)) {
    // If user searches by lastName, but not employeeID, could find 0, 1, or multiple matches.
    for (i = 0; i < employeeArray.length; i++) {
      if (employeeArray[i].lastName == lastName) {
        lastNamesFound.push(i);
      }
    }
    if (lastNamesFound.length === 0) {
      removeReport.innerHTML = "<p>No employee found with last name " + lastName + ".</p>";
      return;
    } else if (lastNamesFound.length > 1) {
      removeReport.innerHTML = "<p>Multiple employees found with last name " + lastName + ". Please refine your search by including an employee ID number.</p>";
      return;
    } else if (lastNamesFound.length === 1) {
      confirmRemove(i);
      return;
    }
  } else if ((!noEmpID) && (!noLastName)) {
    // If user searches for both, a bunch of possible outcomes.
    // Search for unique employeeID first, and hope for success.
    for (i = 0; i < employeeArray.length; i++) {
      if (employeeArray[i].employeeID == employeeID) {
        if (employeeArray[i].lastName == lastName) {
          confirmRemove(i);
          return;
        } else {
          confirmRemove(i, "lastName", lastName);
          return;
        }
      }
    }
    // If we got to this point, the employeeID didn't match. Now check last names.
    for (i = 0; i < employeeArray.length; i++) {
      if (employeeArray[i].lastName == lastName) {
        lastNamesFound.push(i);
      }
      if (lastNamesFound.length === 0) {
        removeReport.innerHTML = "<p>No employee found with either employee ID number " + employeeID + " or last name " + lastName + ".</p>";
        return;
      } else if (lastNamesFound.length > 1) {
        removeReport.innerHTML = "<p>Multiple employees found with last name " + lastName + ", but none of them have employee ID number " + employeeID + ". Please modify your search.</p>";
        return;
      } else if (lastNamesFound.length === 1) {
        confirmRemove(lastNamesFound[0], "employeeID", employeeID);
        return;
      }
    }
  }
};

var confirmRemove = function(index, mismatch, value) {
  /* Confirms that the user wants to delete the employee. If there was a
  mismatched employeeID or lastName, this reports the mismatch too. */
  removeButton.className = "hidden";
  removeConfirm.className = "visible";
  removeDeny.className = "visible";
  var warningText = "";
  if (mismatch == "employeeID") {
    warningText = "<p>An employee with last name " + employeeArray[index].lastName + " was found, but does not have employee ID number " + value + ".</p>\n";
  }
  if (mismatch == "lastName") {
    warningText = "<p>An employee with ID number " + employeeArray[index].employeeID + " was found, but does not have last name " + value + ".</p>\n";
  }
  removeReport.innerHTML = warningText + "Remove " + employeeArray[index].firstName + " " + employeeArray[index].lastName + ", ID number " + employeeArray[index].employeeID + "? (Press \"Confirm\" to continue, or \"Go Back\" to modify search.)";
  toBeDeleted = index;
};

var completeRemoval = function() {
  // Called by the "Confirm" button in the Remove Employee section.
  removeButton.className = "visible";
  removeConfirm.className = "hidden";
  removeDeny.className = "hidden";
  clearRemoveFields();
  removeReport.innerHTML = employeeArray[toBeDeleted].firstName + " " + employeeArray[toBeDeleted].lastName + " (ID number " + employeeArray[toBeDeleted].employeeID + ") removed from payroll.";
  employeeArray.splice(toBeDeleted, 1);
  calcPayroll();
  toBeDeleted = undefined;
};

var clearRemoveFields = function() {
  for (var i = 0; i < 2; i++) {
    removeData[i].value = "";}
  removeReport.innerHTML = "";
};

var goBack = function() {
  removeButton.className = "visible";
  removeConfirm.className = "hidden";
  removeDeny.className = "hidden";
  removeReport.innerHTML = "";
  toBeDeleted = undefined;
};
