window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/doctor");

    refreshDoctorTable(); //call table refresh function

    refreshDoctorForm();//call form refresh function


    //call specialization form refresh function
    refreshSpecializationForm();
});

//create function refresh doctor table
const refreshDoctorTable = () => {

    //create array to store doctor data list
    doctor = [];
    doctors =ajaxRequestHere("/doctor/showall");

    $.ajax("/doctor/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            // doctors = data.filter(doctor => doctor?.employeestatus_id.id !== 3);
            doctors = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            doctor =[];
        }
    });



    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'docno'},
                              {dataType:'text',propertyName:'fullname'},
                              {dataType:'text',propertyName:'licenseno'},
                              {dataType:'text',propertyName:'mobileno'},
                              {dataType:'text',propertyName:'email'},
                              {dataType:'function',propertyName:getDoctorSpecialization},
                              {dataType:'function',propertyName:getHasUserAccount},
                              {dataType:'function',propertyName:getEmployeeStatus},
                              
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableDoctor, doctors,displayproperty,doctorFormRefill,deleteFunc,printFunc,true, userPrivilege);

    console.log("Doctors List", doctors)
    //disable delete button
    /*doctors.forEach((element , index) => {
        if (element.employeestatus_id.name == "Resign") {
            if (userPrivilege.delete) {
                tableDoctor.children[1].children[index].children[9].children[3].disabled ="disabled";
            }
            
        }
    });*/

    doctors.forEach((element, index) => {
    if (element.employeestatus_id.name === "Resign") {
        const row = tableDoctor.children[1].children[index];
        const deleteButton = row.querySelector('.btn-danger');
        const editButton = row.querySelector('.btn-success');

        if (deleteButton) deleteButton.disabled = true;
        if (editButton) editButton.disabled = true;
    }
    });

   $('#tableDoctor').dataTable();


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


/*const getGender =(ob)=>{
    if(ob.gender == 'Female'){
        return '<i class="fas fa-female fa-lg" style="#df77be"></i>';
    }else{
        return '<i class="fas fa-male fa-lg" style="#456faa"></i>';
    }
}*/

const getDoctorSpecialization=(ob)=>{
    return ob.specialization_id.name;
}

const getHasUserAccount=(ob)=>{

    if(ob.hasUserAccount){
        return '<i class="fa-solid fa-circle-check fa-2x text-success"></i>';
    }else{
        return '<i class="fa-solid fa-circle-xmark fa-2x text-danger"></i>';
    }
}

const updateSpecialization = (value)=>{
    doctor.specialization_id = value;
    console.log("Changed value", doctor.specialization_id)
}

const updateEmployeeStatus =(value) =>{
    doctor.employeestatus_id = value;
    console.log("Changed EMP_S Value",doctor.employeestatus_id )
}

//function for doctor form refill
const doctorFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into doctor object
    //used JSON.parse stringify to convert them into string and to identify the difference
    doctor = JSON.parse(JSON.stringify(ob));
    olddoctor =JSON.parse(JSON.stringify(ob));
    //open doctor modal
    $('#doctorAddModal').modal('show');
    console.log("doctor",doctor)


    //set value into UI element
    //elementId.value = object.property
    textFullName.value= doctor.fullname;
    textLisenceNo.value = doctor.licenseno;
    textNic.value = doctor.nic;
    //dateOfBirth.value = doctor.dob.split('T')[0];
    dateOfBirth.value = doctor.dob;
    textMobileNo.value = doctor.mobileno;
    textEmail.value = doctor.email;
    textLandNo.value = doctor.landno;
    textAddress.value = doctor.address;
    textNote.value = doctor.note;
    textDoctorFee.value= doctor.specialization_id.doctorfee;
    selectCivilstatus.value = doctor.civilstatus;
    selectAvailableType.value = doctor.doctoravailabilitytype;


 

    //"M" --> this value must be equal to the ajaxresponse value in /showall
    if (doctor.gender == "Male"){

        radioGenderMale.checked=true;
    }else{
        radioGenderFemale.checked=true;
    }

    Specializations = ajaxRequestHere("/specialization/showspecialization");
    fillDataIntoSelect(selectSpecialization,'Select Specialization',Specializations,'name',doctor.specialization_id.name);
    //doctor.specialization_id.name part is only used in this refill function
   
    selectSpecialization.addEventListener('change', (event) => {
        const newSpecializationId = JSON.parse(event.target.value);
        updateSpecialization(newSpecializationId)
    })

    employeeSatatueses = ajaxRequestHere("/employeestatus/showStatus");
    fillDataIntoSelect(selectEmployeeStatus,'Select Status',employeeSatatueses,'name',doctor.employeestatus_id.name);
    
    // console.log("Specializations",Specializations)
    // console.log("employeeSatatueses",employeeSatatueses)

    selectEmployeeStatus.addEventListener('change',(event)=>{
        const newEmployeeStatus = JSON.parse(event.target.value);
        updateEmployeeStatus(newEmployeeStatus)
    })

    /*const civilStatuses = [
        { name: 'Married', value: 'Married' },
        { name: 'Unmarried', value: 'Unmarried' }
    ];
    fillDataIntoSelect(selectCivilstatus, 'Select Civil Status', civilStatuses, 'value', doctor.civilstatus);
    */
   
    if (userPrivilege.update) {
        btnUpdateDoctor.disabled = "";
        $("#btnUpdateDoctor").css("cursor","pointer");
    } else {
        btnUpdateDoctor.disabled = "disabled";
        $("#btnUpdateDoctor").css("cursor","not-allowed");
    }
    //update button
    btnUpdateDoctor.disabled = "";
    //btnUpdateDoctor.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateDoctor").css("cursor","pointer");

    //add button
    btnAddDoctor.disabled="disabled";
    $("#btnAddDoctor").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(doctor.fullname != olddoctor.fullname){
        updates = updates + "fullname has updated," + olddoctor.fullname + " into " + doctor.fullname + "\n";
    }

    if(doctor.licenseno != olddoctor.licenseno){
        updates = updates + "licenseno has updated," + olddoctor.licenseno + " into " + doctor.licenseno + "\n";
    }

    if(doctor.nic != olddoctor.nic){
        updates = updates + "nic has updated," + olddoctor.nic + " into " + doctor.nic + "\n";
    }

    if(doctor.mobileno != olddoctor.mobileno){
        updates = updates + "mobileno has updated," + olddoctor.mobileno + " into " + doctor.mobileno + "\n";
    }

    if(doctor.landno != olddoctor.landno){
        updates = updates + "landno has updated," + olddoctor.landno + " into " + doctor.landno + "\n";
    }

    if(doctor.dateOfBirth != olddoctor.dateOfBirth){
        updates = updates + "dob has updated," + olddoctor.dateOfBirth + " into " + doctor.dateOfBirth + "\n";
    }

    if(doctor.email != olddoctor.email){
        updates = updates + "email has updated," + olddoctor.email + " into " + doctor.email + "\n";
    }

    if(doctor.address != olddoctor.address){
        updates = updates + "address has updated," + olddoctor.address + " into " + doctor.address + "\n";
    }

    if(doctor.note != olddoctor.note){
        updates = updates + "note has updated," + olddoctor.note + " into " + doctor.note + "\n";
    }

    if(doctor.doctorfee != olddoctor.doctorfee){
        updates = updates + "doctorfee has updated," + olddoctor.doctorfee + " into " + doctor.doctorfee + "\n";
    }

    if(doctor.doctoravailabilitytype != olddoctor.doctoravailabilitytype){
        updates = updates + "doctoravailabilitytype has updated," + olddoctor.doctoravailabilitytype + " into " + doctor.doctoravailabilitytype + "\n";
    }

    if(doctor.civilstatus != olddoctor.civilstatus){
        updates = updates + "civilstatus has updated," + olddoctor.civilstatus + " into " + doctor.civilstatus + "\n";
    }

    if(doctor.employeestatus_id.name != olddoctor.employeestatus_id.name){
        updates = updates + "Employee Status has updated,"+ olddoctor.employeestatus_id.name + " into " + doctor.employeestatus_id.name + "\n";
    }

    if(doctor.specialization_id.name != olddoctor.specialization_id.name){
        updates = updates + "specialization has updated," + olddoctor.specialization_id.name + " into " + doctor.specialization_id.name +"\n";
    }
    return updates;
}


//function for doctor update button
const buttonDoctorUpdate = ()=>{
   //1) check update button
   console.log("update");
   console.log(doctor);
   console.log(olddoctor);

   //2) check form errors
   let errors = checkDoctorFormError();
   if (errors == "") {
       //3) check what we have to update
       let updates = checkFormUpdate();
       if (updates == "") {
           Swal.fire({
               icon: 'info',
               html: 'Nothing to Update..!',
               showConfirmButton: true,
           });
       } else {
           //4) get user confirmation
           Swal.fire({
               title: 'Are you sure to UPDATE the following record?',
               html: updates,
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, update it!'
           }).then((result) => {
               if (result.isConfirmed) {
                   //5) call put service
                   let putServiceResponce = ajaxRequestBody("/doctor", "PUT", doctor)
                   //6) check put service response
                   if (putServiceResponce == "OK") {
                       Swal.fire({
                           icon: 'success',
                           html: 'Updated Successfully..!',
                           showConfirmButton: true,
                       }).then(() => {
                        $('#doctorAddModal').modal('hide');
                        refreshDoctorTable();
                        FormDoctor.reset();
                        refreshDoctorForm();
                        
                       });
                   } else {
                       Swal.fire({
                           icon: 'error',
                           html: 'Failed to Update doctor Details',
                           text: putServiceResponce,
                           showConfirmButton: true,
                       });
                   }
               }
           });
       }
   } else {
       Swal.fire({
           icon: 'error',
           html: 'Form has some errors... please check the form again..',
           text: errors,
           showConfirmButton: true,
       });
   }
}

const editFunc =(ob)=>{
    doctorFormRefill();

}

//function for delete doctor record
const deleteFunc =(ob,rowIndex)=>{
    //tableDoctor.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableDoctor.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

    //need a time to change the color
    setTimeout(function () {
    // get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to REMOVE following Doctor? <br>'
            + 'Name is : ' + ob.fullname
            + '<br> NIC is : ' + ob.nic
            + '<br> Mobile No is : ' + ob.mobileno,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxRequestBody("/doctor", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "OK") {
                refreshDoctorTable();

               Swal.fire({
                    title: 'Success',
                    text: 'Doctor Deleted Successfully!',
                    icon: 'success'
                });
            } else {

                
                 Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete Doctor details \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        } 
    });

    }, 500);

}


//function for print doctor record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

    //open view modal
    $('#doctorViewModal').modal('show');

    viewFullname.innerHTML = ob.fullname;
    viewLisenceNo.innerHTML = ob.licenseno;
    viewNic.innerHTML = ob.nic;
    viewEmail.innerHTML = ob.email;
    viewMobileno.innerHTML = ob.mobileno;
    viewLandno.innerHTML = ob.landno;
    viewDob.innerHTML = ob.dob;
    viewAddress.innerHTML = ob.address;
    viewNote.innerHTML = ob.note;
    viewSpecialization.innerHTML = ob.specialization_id.name;
    viewCivilstatus.innerHTML = ob.civilstatus;
    viewEmployeestatus.innerHTML = ob.employeestatus_id.name;
    viewDoctorfee.innerHTML = ob.specialization_id.doctorfee;
    viewAvailabilitytype.innerHTML = ob.doctoravailabilitytype;
    viewImage.src = `/doctor/image/${ob.id}`;

}

//function for print
function printpage() { 
    let modalContent = document.getElementById('doctorViewModal').innerHTML;
    
    let newWindow = window.open('', '', 'width=800,height=600');

    newWindow.document.write(`
        <html>
            <head>
                <title>Print Modal</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                </style>
            </head>
            <body>
                ${modalContent}
            </body>
        </html>
    `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
}

//add function
function add(param){

    refreshDoctorTable();

}


//create function validate full name 
const fullNameValidator = (feildId)=>{

    const fullNamePattern ='^([A-Z][a-z]{2,20}[\\s]){1,20}([A-Z][a-z]{2,20})$';
    const regPattern = new RegExp(fullNamePattern);

    if (feildId.value !='') {
        if (regPattern.test(feildId.value)) {
            feildId.style.border ='4px solid green';
            doctor.fullname = feildId.value; //value bind into object property

            //generate calling name list
            //callingNameDatalist = feildId.value.split(' ');
            //console.log(callingNameDatalist);
           // callingNamelist.innerHTML='';

            //callingNameDatalist.forEach(element => {
                //const option = document.createElement('option');
                //option.value = element;
                //callingNamelist.appendChild(option);
            //});


        } else {
            feildId.style.border ='4px solid red';
            doctor.fullname = null;
        }
    } else {
        feildId.style.border ='4px solid red';
        doctor.fullname = null;
    }

}


//create function for check error
const checkDoctorFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (doctor.fullname==null) {
        errors = errors +"Please Enter a valid Full Name..\n";
        textFullName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.licenseno == null) {
        errors = errors +"Please Enter a licenseno..\n";
        textLisenceNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.nic == null) {
        errors = errors +"Please Enter a valid NIC..\n";
        textNic.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.gender== null) {
        errors = errors +"Please Select a gender..\n";
        //textCallingName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.email == null) {
        errors = errors +"Please Enter a valid Email..\n";
        textEmail.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.mobileno == null) {
        errors = errors +"Please Enter a valid Mobile..\n";
        textMobileNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.doctoravailabilitytype == null) {
        errors = errors +"Please Enter a availability type..\n";
        selectAvailableType.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.civilstatus == null) {
        errors = errors +"Please Enter a civil status..\n";
        selectCivilstatus.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.employeestatus_id == null) {
        errors = errors +"Please Enter a status..\n";
        selectEmployeeStatus.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (doctor.specialization_id == null) {
        errors = errors +"Please Enter a specialization..\n";
        selectSpecialization.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;

}

//create function for add a doctor
const buttonFormSubmit = ()=>{
    //)check button 
    console.log('add doctor',doctor);
    console.log(window['doctor']);

    // Check form error
    const formErrors = checkDoctorFormError();
    // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Doctor? <br>'
                + '<br> Name is : ' + doctor.fullname
                + '<br> NIC is : ' + doctor.nic
                + '<br> Email is : ' + doctor.email
                + '<br> Status is : ' + doctor.employeestatus_id.name,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/doctor", "POST", doctor);
                // Check post service response
                if (postServerResponce == "OK") {
                    Swal.fire({
                        title: 'Success',
                        html: 'Saved successfully!',
                        icon: 'success'
                    }).then(() => {
                        $('#doctorAddModal').modal('hide');
                        refreshDoctorTable();
                        FormDoctor.reset();
                        refreshDoctorForm();    
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit doctor \n' + postServerResponce,
                        icon: 'error'
                    });
                } 
            }
        });
    } else {
        Swal.fire({
            title: 'Form Error',
            html: 'The form has the following errors. Please check the form again:\n' + formErrors,
            icon: 'error'
        });
    }
 
}

//create function for form refresh 
const refreshDoctorForm = () =>{


    doctor= new Object();
    olddoctor =null;

    Specializations = ajaxRequestHere("/specialization/showspecialization");
    fillDataIntoSelect(selectSpecialization,'Select Specialization',Specializations,'name');


    employeeSatatueses = ajaxRequestHere("/employeestatus/showStatus");
    fillDataIntoSelect(selectEmployeeStatus,'Select Status',employeeSatatueses,'name');

    selectEmployeeStatus.value = JSON.stringify(employeeSatatueses[0]);
    doctor.employeestatus_id = employeeSatatueses[0];
    selectEmployeeStatus.style.border = "2px solid green";

    //set text field value as a empty
    textFullName.style.border ='1px solid #ced4da';
    textLisenceNo.style.border ='1px solid #ced4da';
    //callingNamelist.innerHTML = '1px solid #ced4da';
    textNic.style.border ='1px solid #ced4da';
    dateOfBirth.style.border='1px solid #ced4da';
    textMobileNo.style.border='1px solid #ced4da';
    textLandNo.style.border='1px solid #ced4da';
    textEmail.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    textDoctorFee.style.border='1px solid #ced4da';
    selectSpecialization.style.border='1px solid #ced4da';
    selectCivilstatus.style.border='1px solid #ced4da';
    selectAvailableType.style.border='1px solid #ced4da';
    selectEmployeeStatus.style.border='1px solid #ced4da';
    

    //radio button set check false

    radioGenderMale.checked=false;
    radioGenderFemale.checked =false;

    //static select element 

    //selectCivilstatus.value='';
    //selectEmployeeStatus.value='';

    //set default color
    textFullName.removeAttribute('style');



    //update button
    btnUpdateDoctor.disabled = "disabled";
    //btnUpdateDoctor.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateDoctor").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAddDoctor.disabled ="";
        $("#btnAddDoctor").css("cursor","pointer");
    } else {
        btnAddDoctor.disabled ="disabled";
        $("#btnAddDoctor").css("cursor","not-allowed");
    }

    
   


}

/* //create function for generate age
const calculateAge = (element) => {
    let dob = element.value; // meke hambenn string value ekk

    let currentDate = new Date();
    let dateDOB = new Date(dob); // meke hmbenn date object ekk

    console.log(currentDate);
    console.log(dateDOB);

    let diffTime = currentDate.getTime() - dateDOB.getTime();
    let diffDate = new Date(diffTime);

    let age = Math.abs(diffDate.getFullYear() - 1970);
    console.log("age is :" + age);

    if (age > 18) {
        textReq.required = true; //mek dmmam automa arkt focus weno
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


//specialization form refresh
const refreshSpecializationForm =()=>{
    specializationob = new Object();

}

//create function for submit Specialization form
const btnSpecializationSubmit=()=>{
    console.log("submit Specialization form");
    console.log(specializationob)

    if (specializationob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ specializationob.name + " specialization Value..?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/specialization" , "POST" , specializationob);
            if (postResponse == "OK") {
                alert("Save successfully..!");
 
                specializations = ajaxRequestHere("/specialization/showspecialization");
                fillDataIntoSelect(selectSpecialization, 'Select Specialization..', specializations, 'name', selectSpecialization.value);
                selectDesignation.style.border = "2px solid green";
                //bind value 
                doctor.specialization_id =JSON.parse(selectSpecialization.value);
                refreshSpecializationForm();
                $("#collapseSpecial").collapse('hide');
            } else {
                alert("Save NOT completed...! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter specialization name...!");
    }
}

//define function to generate doctor fee automatically
const generateDoctorFee =()=>{
    console.log(JSON.parse(selectSpecialization.value));

    textDoctorFee.value = JSON.parse(selectSpecialization.value).doctorfee;
    doctor.doctorfee = textDoctorFee.value;
    textDoctorFee.style.border = "4px solid green";
}


