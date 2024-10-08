window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/employee");

    refreshEmployeeTable(); //call table refresh function

    refreshEmployeeForm();//call form refresh function

    //create object call employee
    //employee= new Object();

    //employeeSatatueses = [
        //{id:1, name: 'working'},{id:2, name:'Resign'},{id:3, name:'Delete'}
    //]
    //fillDataIntoSelect(selectEmployeeStatus,'Select Status',employeeSatatueses);

    //employee= new Object();

    //designations = [
        //{id:1, name:'hrManager'},{id:2, name:'salesManager'},{id:3, name:'productManager'}
    //]

    //
   // fillDataIntoSelect(selectCivilstatus,'Select Designation',designations);
     //calling fillDataIntoSelect function
    //fillDataIntoSelect(selectStatus,'Select Status',employeeSatatueses); //calling fillDataIntoSelect function //have to create the selectStatus

    //made a function for this in commonFunction.js and called the function above.
    /*const selectEmployeeStatusElement = document.querySelector('#selectEmployeeStatus');
    selectEmployeeStatusElement.innerHTML="";

    const optionMsgES = document.createElement('option');
    optionMsgES.innerText= 'Select Status';
    optionMsgES.selected= 'Selected';
    optionMsgES.disabled= 'disabled'; 

    //optionMsgES.setAttribute('attributeName','value');

    selectEmployeeStatusElement.appendChild(optionMsgES);

    employeeSatatueses.forEach((element,index) => {
        const option = document.createElement('option');
        option.innerText=element.name;
        option.value = JSON.stringify(element);
        selectEmployeeStatusElement.appendChild(option);
        
    });*/
    //report form
    refreshReportForm();
    //call designation form refresh function
    refreshDesignnationForm();
});

//create function refresh employee table
const refreshEmployeeTable = () => {

    //create array to store employee data list
    employee = [];
    employees =ajaxRequestHere("/employee/showall");

    $.ajax("/employee/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            employees = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            employee =[];
        }
    });


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'empno'},
                              {dataType:'text',propertyName:'callingname'},
                              {dataType:'text',propertyName:'nic'},
                              {dataType:'text',propertyName:'mobileno'},
                              {dataType:'text',propertyName:'email'},
                              {dataType:'function',propertyName:getHasUserAccount},
                              {dataType:'function',propertyName:getEmployeeStatus},
                              {dataType:'function',propertyName:getEmployeeDesignation},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableEmployee, employees,displayproperty,employeeFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
 /*    employees.forEach((element , index) => {
        if (element.employeestatus_id.name == "Resign") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[10].children[3].disabled ="disabled";
            }
            
        }
    }); */

   $('#tableEmployee').dataTable();


}

//create function getEmployeeStatus 
const getEmployeeStatus=(ob)=>{
    //return 'ss';
    //return ob.employeeStatus_id.name;
    if(ob.employeestatus_id.name == 'Working'){

        return '<p class="status-working">'+ ob.employeestatus_id.name +'</p>'

    }
    if(ob.employeestatus_id.name == 'Onleave'){

        return '<p class="status-Onleave">'+ ob.employeestatus_id.name +'</p>'

    }
    if(ob.employeestatus_id.name == 'Resign'){

        return '<p class="status-Resign">'+ ob.employeestatus_id.name +'</p>'

    }

}

/* const getGender =(ob)=>{
    if(ob.gender == 'Female'){
        return '<i class="fas fa-female fa-lg" style="#df77be"></i>';
    }else{
        return '<i class="fas fa-male fa-lg" style="#456faa"></i>';
    }
} */

//function to get designations 
const getEmployeeDesignation=(ob)=>{

    return ob.designation_id.name;

}

const getHasUserAccount=(ob)=>{

    if(ob.hasUserAccount){
        return '<i class="fa-solid fa-circle-xmark fa-2x text-danger"></i>';
    }else{
        return '<i class="fa-solid fa-circle-check fa-2x text-success"></i>';
    }
}

//function for employee form refill
const employeeFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into employee object
    //used JSON.parse stringify to convert them into string and to identify the difference
    employee = JSON.parse(JSON.stringify(ob));
    oldemployee =JSON.parse(JSON.stringify(ob));

    //open employee modal
    $('#employeeAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    textFullName.value= employee.fullname;
    textCallingName.value= employee.callingname;
    textNic.value = employee.nic;
    textMobileNo.value = employee.mobileno;
    textEmail.value = employee.email;
    dateOfBirth.value = employee.dob;
    textLandNo.value = employee.landno;
    textAddress.value = employee.address;
    textNote.value = employee.note;
    selectCivilstatus.value = employee.civilstatus;

    

    //"M" --> this value must be equal to the ajaxresponse value in /showall
    if (employee.gender == "Male"){

        radioGenderMale.checked=true;
    }else{
        radioGenderFemale.checked=true;
    }

    designations = ajaxRequestHere("/designation/showDesignation");
    fillDataIntoSelect(selectDesignation,'Select Designation',designations,'name',employee.designation_id.name);


    employeeSatatueses = ajaxRequestHere("/employeestatus/showStatus");
    fillDataIntoSelect(selectEmployeeStatus,'Select Status',employeeSatatueses,'name',employee.employeestatus_id.name);
    //selectDesignation
    //selectEmployeeStatus

    

    if (userPrivilege.update) {
        btnUpdateEmployee.disabled = "";
        $("#btnUpdateEmployee").css("cursor","pointer");
    } else {
        btnUpdateEmployee.disabled = "disabled";
        $("#btnUpdateEmployee").css("cursor","not-allowed");
    }
    //update button
    btnUpdateEmployee.disabled = "";
    //btnUpdateEmployee.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateEmployee").css("cursor","pointer");

    //add button
    btnAddEmployee.disabled="disabled";
    $("#btnAddEmployee").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(employee.fullname != oldemployee.fullname){
        updates = updates + "fullname has updated," + oldemployee.fullname + "into" + employee.fullname + "\n";
    }

    if(employee.callingname != oldemployee.callingname){
        updates = updates + "callingname has updated," + oldemployee.callingname + "into" + employee.callingname + "\n";
    }

    if(employee.nic != oldemployee.nic){
        updates = updates + "nic has updated," + oldemployee.nic + "into" + employee.nic + "\n";
    }

    if(employee.mobileno != oldemployee.mobileno){
        updates = updates + "mobileno has updated," + oldemployee.mobileno + "into" + employee.mobileno + "\n";
    }

    if(employee.email != oldemployee.email){
        updates = updates + "email has updated," + oldemployee.email + "into" + employee.email + "\n";
    }

    if(employee.dateofbirth != oldemployee.dateofbirth){
        updates = updates + "dateofbirth has updated," + oldemployee.dateofbirth + "into" + employee.dateofbirth + "\n";
    }

    if(employee.address != oldemployee.address){
        updates = updates + "address has updated," + oldemployee.address + "into" + employee.address + "\n";
    }

    if(employee.note != oldemployee.note){
        updates = updates + "note has updated," + oldemployee.note + "into" + employee.note + "\n";
    }

    if(employee.civilstatus != oldemployee.civilstatus){
        updates = updates + "civilstatus has updated," + oldemployee.civilstatus + "into" + employee.civilstatus + "\n";
    }

    if(employee.employeestatus_id.name != oldemployee.employeestatus_id.name){
        updates = updates + "Employee Status has updated,"+ oldemployee.employeestatus_id.name + "into" + employee.employeestatus_id.name + "\n";
    }

    if(employee.designation_id.name != oldemployee.designation_id.name){
        updates = updates + "Designation has updated," + oldemployee.designation_id.name + "into" + employee.designation_id.name +"\n";
    }
    return updates;
}

//function for employee update button
const buttonEmployeeUpdate = ()=>{
    console.log("Update");
    console.log(employee);
    console.log(oldemployee);

    //check errors
    const errors = checkEmpFormError();
    if(errors == ""){
        
    //check available update
    let updates = checkFormUpdate();
    if(updates ==""){
        alert("Nothing Updated");
    }else{

        //get user confirmation
        let userConfirm = confirm("Are you sure to do the following changes..? \n" + updates);

        if(userConfirm){
            //call put service
            let putServiceresponce;

            $.ajax("/employee" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(employee),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#employeeAddModal').modal('hide');
                refreshEmployeeTable();
                formEmployee.reset();
                refreshEmployeeForm();

            }else{
                alert("failed to update because of following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}

const editFunc =(ob)=>{
    employeeFormRefill();

}

//function for delete employee record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableEmployee.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);
    

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following Employee? \n'
            + '\n Name is ' + ob.callingname
            + '\n NIC is ' + ob.nic
            + '\n Status is ' + ob.employeestatus_id.name
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/employee" , {
                type:"DELETE",
                data: JSON.stringify(ob) ,
                contentType: "application/json" ,
                async: false,
                success: function (data) {
                    console.log("Success "+data);
                    deleteServerResponse = data;
                },
                error:function (resData) {
                    console.log("Success "+resData);
                    deleteServerResponse = resData;
                }
            });

            if (deleteServerResponse == 'OK') {
                alert('Deleted Successfully...!!');
                refreshEmployeeTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        } 
        
        /*else {
            row.classList.remove('table-danger')
        }
          else {
             refreshEmployeeTable();
             } */
             refreshEmployeeTable();

    }, 500);

}


//function for view employee record
const printFunc =(ob, rowIndex)=>{
    console.log('print');
    //open view modal
    $('#employeeViewModal').modal('show');

    viewFullname.innerHTML = ob.fullname;
    viewEmpNo.innerHTML = ob.empno;
    viewNic.innerHTML = ob.nic;
    viewEmail.innerHTML = ob.email;
    viewMobileno.innerHTML = ob.mobileno;
    viewLandno.innerHTML = ob.landno;
    viewDob.innerHTML = ob.dob;
    viewAddress.innerHTML = ob.address;
    viewNote.innerHTML = ob.note;


}

//function for print
function printpage() { 
    window.print(); 
    }

//add function
function add(param){

    refreshEmployeeTable();

}


//create function validate full name 
/* const fullNameValidator = (feildId)=>{

    const fullNamePattern ='^([A-Z][a-z]{2,20}[\\s]){1,20}([A-Z][a-z]{2,20})$';
    const regPattern = new RegExp(fullNamePattern);

    if (feildId.value !='') {
        if (regPattern.test(feildId.value)) {
            feildId.style.border ='4px solid green';
            employee.fullname = feildId.value; //value bind into object property

            //generate calling name list
            callingNameDatalist = feildId.value.split(' ');
            //console.log(callingNameDatalist);
            callingNamelist.innerHTML='';

            callingNameDatalist.forEach(element => {
                const option = document.createElement('option');
                option.value = element;
                callingNamelist.appendChild(option);
            });


        } else {
            feildId.style.border ='4px solid red';
            employee.fullname = null;
        }
    } else {
        feildId.style.border ='4px solid red';
        employee.fullname = null;
    }

} */

//create function validate calling name 
/* const callingNameValidator = (feildId)=> {

    const callingNameValue =feildId.value; */

    /*let extCN = false;
    for(let element of callingNameDatalist){
        if (element == callingNameValue) {
            extCN = true;
            break;  
        }
    };

    if (extCN) {
        feildId.style.border ='2px solid green';
    }else{
        feildId.style.border ='2px solid red';
    }*/
/* 
    const index = callingNameDatalist.map(element=>element).indexOf(callingNameValue);
    console.log(index);
    if (index!=-1) {
        feildId.style.border ='4px solid green';
        employee.callingname = callingNameValue;
    } else {
        feildId.style.border ='4px solid red';
        employee.callingname = null;
    }

} */

//create function for check error
const checkEmpFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (employee.fullname==null) {
        errors = errors +"Please Enter a valid Full Name..\n";
        textFullName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.callingname == null) {
        errors = errors +"Please Enter a Calling Name..\n";
        textCallingName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.nic == null) {
        errors = errors +"Please Enter a valid NIC..\n";
        textNic.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.gender== null) {
        errors = errors +"Please Select a gender..\n";
        //textCallingName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.email == null) {
        errors = errors +"Please Enter a valid Email..\n";
        textEmail.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.mobileno == null) {
        errors = errors +"Please Enter a valid Mobile..\n";
        textMobileNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.civilstatus == null) {
        errors = errors +"Please Enter a civil status..\n";
        selectCivilstatus.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.employeestatus_id== null) {
        errors = errors +"Please Enter a status..\n";
        selectEmployeeStatus.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (employee.designation_id== null) {
        errors = errors +"Please Enter a designation..\n";
        selectDesignation.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;

}

//create function for submit to add employee
const buttonFormSubmit = ()=>{
    console.log('add employee',employee);
    console.log(window['employee']);

    //need to check error
    //alert(checkEmpFormError());

    const formErrors = checkEmpFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following employee? \n'
                                    + '\n Full Name is : ' + employee.fullname
                                    + '\n NIC is : ' + employee.nic
                                    + '\n email is : ' + employee.email
                                    + '\n status is : ' + employee.employeestatus_id.name);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/employee", "POST", employee);

                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshEmployeeTable();
                    formEmployee.reset();
                    refreshEmployeeForm();
                    $("#employeeAddModal").modal("hide");
                    
                } else {
                    alert('Save not completed..You have following errors \n' + postServiceResponse);
                }
            }
    
        
    } else {

        //form has errors
        alert("form has following errors..\n" + formErrors);
    }
 
}

//create function for form refresh 
const refreshEmployeeForm = () =>{


    employee= new Object();
    oldemployee =null;

    designations = ajaxRequestHere("/designation/showDesignation");
    /*designations = [
        {id:1, name:'hrManager'},{id:2, name:'salesManager'},{id:3, name:'productManager'}
    ]*/
    fillDataIntoSelect(selectDesignation,'Select Designation',designations,'name');


    employeeSatatueses = ajaxRequestHere("/employeestatus/showStatus");

    /*employeeSatatueses = [
        {id:1, name: 'working'},{id:2, name:'resign'},{id:3, name:'delete'}
    ]*/
    fillDataIntoSelect(selectEmployeeStatus,'Select Status',employeeSatatueses,'name');

    //set text field value as a empty
    textFullName.style.border ='1px solid #ced4da';
    textCallingName.style.border ='1px solid #ced4da';
    //callingNamelist.innerHTML = '1px solid #ced4da';
    textNic.style.border ='1px solid #ced4da';
    dateOfBirth.style.border='1px solid #ced4da';
    textEmail.style.border='1px solid #ced4da';
    textMobileNo.style.border='1px solid #ced4da';
    textLandNo.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    selectCivilstatus.style.border='1px solid #ced4da';
    selectEmployeeStatus.style.border='1px solid #ced4da';
    selectDesignation.style.border='1px solid #ced4da';

    //radio button set check false

    radioGenderMale.checked=false;
    radioGenderFemale.checked =false;

    //static select element 

    //selectCivilstatus.value='';
    //selectEmployeeStatus.value='';

    //set default color
    textFullName.removeAttribute('style');



    //update button
    btnUpdateEmployee.disabled = "disabled";
    //btnUpdateEmployee.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateEmployee").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAddEmployee.disabled ="";
        $("#btnAddEmployee").css("cursor","pointer");
    } else {
        btnAddEmployee.disabled ="disabled";
        $("#btnAddEmployee").css("cursor","not-allowed");
    }
}

 //create function for generate age
/*const calculateAge = (element) => {
    let dob = element.value; 

    let currentDate = new Date();
    let dateDOB = new Date(dob); 

    console.log(currentDate);
    console.log(dateDOB);

    let diffTime = currentDate.getTime() - dateDOB.getTime();
    let diffDate = new Date(diffTime);

    let age = Math.abs(diffDate.getFullYear() - 1970);
    console.log("age is :" + age);

    if (age > 18) {
        textReq.required = true; 
        divSample.style.display = "block";
    } else {
        divSample.style.display = "block";
    }
} */


/* //create fn for generate gender n dob
const generateGenderDOB = (element) => {
    let nicValue = element.value;

    let year,month,date;
    let days;
    let dob;

    if (new RegExp('^([6789][0-9]{8}[VX])|(([1][9])|([2][0]))([0-9]{10})$').test(nicValue)) {
        if (nicValue.length == 10) {
            year = "19" + nicValue.substring(0, 2);
            days = nicValue.substring(2, 5);
        }
        if (nicValue.length == 12) {
            year = nicValue.substring(0, 4);
            days = nicValue.substring(4, 7);
        }
        console.log(year);
        console.log(days);

        if (days < 500) {
            slctMale.checked = true;
        } else {
            slctFemale.checked = true;
            days = days -500;
        }

        console.log(days);
        let DOBDate = new Date(year);
        console.log(DOBDate);
        if (year % 4 != 0){
            DOBDate.setDate(parseInt(days)-1);
        }else{
        //DOBDate.setFullYear(year);
        DOBDate.setDate(parseInt(days));
        }

        console.log(DOBDate);

        month = DOBDate.getMonth() +1;
        if (month < 10) month = "0" +month;
        date = DOBDate.getDate();
        if (date < 10) date = "0" +date; {  
        }

        dob =  year + "-" +month+"-"+date;
        hbdTxt.value = dob;

    } else {

    }
} */


//designation form refresh
const refreshDesignnationForm =()=>{
    designationob = new Object();
    designationoldob = null;

}

//create function for submit designation form
const btnDesignationSubmit=()=>{
    console.log("submit designation form");

    if (designationob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ designationob.name + "Designation Value..?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/designation" , "POST" , designationob);
            if (postResponse == "OK") {
                alert("Save successfully..!");
 
                designations = ajaxRequestHere("/designation/showDesignation");
                fillDataIntoSelect(selectDesignation, 'Select Desiganation..', designations, 'name', selectDesignation.value);
                selectDesignation.style.border = "2px solid green";
                //bind value 
                employee.designation_id =JSON.parse(selectDesignation.value);
                refreshDesignationForm();
                $("#collapseDesi").collapse('hide');
            } else {
                alert("Save NOT completed...! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter designation name...!");
    }
}


const refreshReportForm=()=>{

    employeeSatatueses = ajaxRequestHere("/employeestatus/showStatus");

    fillDataIntoSelect(employeeStatus,'Select Status',employeeSatatueses,'name');

}

//report generating functions here 
const generateReport = () => {
    let selectedStatus = document.getElementById('employeeStatus').value;
    
    if (selectedStatus) {
      let employees = ajaxRequestBody(`/employee?showEmployeebyEstatus=${selectedStatus}`, 'GET', null);
    
      if (employees && employees.length > 0) {
          displayReport(employees);
      } else {
          alert("No employees found with the selected status.");
      }
    } else {
      alert("Please select an employee status.");
    }
    }
    
    const displayReport = (employees) => {
    let reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = '';
    
    let table = document.createElement('table');
    table.style.border='1px solid black';
    let headerRow = table.insertRow(0);
    
    headerRow.insertCell(0).innerHTML = "Employee ID";
    headerRow.insertCell(1).innerHTML = "Name";
    headerRow.insertCell(2).innerHTML = "Status";
    
    employees.forEach((employee, index) => {
      let row = table.insertRow(index + 1);
      row.insertCell(0).innerHTML = employee.id;
      row.insertCell(1).innerHTML = employee.fullname;
      row.insertCell(2).innerHTML = employee.employeestatus_id.value;
    });
    
    reportContainer.appendChild(table);
    }