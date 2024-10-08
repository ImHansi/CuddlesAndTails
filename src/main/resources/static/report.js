window.addEventListener('load',()=>{


    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/employee");

    designations = ajaxRequestHere("/designation/showDesignation");
    fillDataIntoSelect(selectDesignation,'Select Designation',designations,'name');


    employeeSatatueses = ajaxRequestHere("/employeestatus/showStatus");
    fillDataIntoSelect(selectEmployeeStatus,'Select Status',employeeSatatueses,'name');

    employees =ajaxRequestHere("/reportdataonleaveemployees");

    refreshEmployeeTable(); //call table refresh function

});

const generateReport=()=> {

    employees =ajaxRequestHere("/reportdataonleaveemployees?status="+JSON.parse(selectEmployeeStatus.value).id+"&designation="+JSON.parse(selectDesignation.value).id);
    refreshEmployeeTable();

}

//create function refresh employee table
const refreshEmployeeTable = () => {

    //create array to store employee data list
    employee = [];
   

    /*$.ajax("/reportdataonleaveemployees",{
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
    });*/


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
    fillDataIntoTable(tableEmployeerReport, employees,displayproperty,employeeFormRefill,deleteFunc,printFunc,false, userPrivilege);

    //disable delete button
 /*    employees.forEach((element , index) => {
        if (element.employeestatus_id.name == "Resign") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[10].children[3].disabled ="disabled";
            }
            
        }
    }); */

   $('#tableEmployeerReport').dataTable();


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
        return '<i class="fa-solid fa-circle-check fa-2x text-success"></i>';
    }else{
        return '<i class="fa-solid fa-circle-xmark fa-2x text-danger"></i>';
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



const editFunc =(ob)=>{
    employeeFormRefill();

}

//function for delete employee record
const deleteFunc =(ob,rowIndex)=>{


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
