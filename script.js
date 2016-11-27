var employeeArray = [];

function Employee(firstName, lastName, employeeID, jobTitle, salary){
  // Constructor function for Employee class.
  this.firstName = firstName;
  this.lastName = lastName;
  this.employeeID = employeeID;
  this.jobTitle = jobTitle;
  this.salary = salary;
}

var payrollReport, addReport, addEmpSection, removeReport, removeEmpSection;
// Global DOM references, defined after window.onload.

window.onload = function() {
  payrollReport = document.getElementById("payrollReport");
  addReport = document.getElementById("addReport");
  addEmpSection = document.getElementById("addEmpSection");
  removeReport = document.getElementById("removeReport");
  removeEmpSection = document.getElementById("removeEmpSection");
  calcPayroll();
};

function calcPayroll() {

}

var addEmployee = function() {
  /* Triggered by an HTML button. Collects info from a set of input
  fields in the DOM. Verifies that all text fields are filled, and that
  the employeeID isn't already in the array. If those tests pass, adds the
  employee to employeeArray. */
  var addData = addEmpSection.querySelectorAll("input");
  // Make sure all fields are filled.
  for (var i = 0; i < 5; i++) {
    if (addData[i] === "") {
      addReport.innerHTML = "<p>Please input employee data into all five fields.</p>";
      return;
    }
  }
  var empID = addData[2];
  // Make sure employeeID isn't already in the array.
  var empFound = false;
  for (i = 0; i < employeeArray.length; i++) {
    if (employeeArray[i].employeeID == empID) {
      addReport.innerHTML = "<p>Employee ID Number " + empID + " is already in payroll.</p>";
      return;
    }
  }
  employeeArray.push(new Employee(addData[0], addData[1], empID, addData[3], addData[4]));
};
