window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/consultation");

    refreshConsultationTable(); //call table refresh function

    refreshConsultationForm();//call form refresh function


});

//create function refresh consultation table
const refreshConsultationTable = () => {

    //create array to store consultation data list
    consultation = [];
    consultations =ajaxRequestHere("/consultation/showall");

    $.ajax("/consultation/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            consultations = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            consultation =[];
        }
    });


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'consulno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'function',propertyName:getService},
                              {dataType:'text',propertyName:'dateofconsultation'},
                              {dataType:'function',propertyName:getDoctor},
                              {dataType:'function',propertyName:getRecordstatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableConsultation, consultations,displayproperty,consultationFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*consultations.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

    consultations.forEach((element, index) => {
    if (element.recordstatus_id.name === "Delete") {
        const row = tableConsultation.children[1].children[index];
        const deleteButton = row.querySelector('.btn-danger');
        const editButton = row.querySelector('.btn-success');

        if (deleteButton) deleteButton.disabled = true;
        if (editButton) editButton.disabled = true;
    }
    });

   $('#tableConsultation').dataTable();


}


//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}

//create function to get pets
const getPetName=(ob)=>{
    return ob.pet_id.name;

}

//create function to get services
const getService=(ob)=>{
    return ob.service_id.name;

} 

//create functon to get doctors
const getDoctor=(ob)=>{
    //return ob.doctor_id.fullname;
    return ob.doctor_id ? ob.doctor_id.fullname : "N/A";

}

//create function get record status 
const getRecordstatus=(ob)=>{
    
    if(ob.recordstatus_id.name == 'Active'){

        return '<p class="status-Active">'+ ob.recordstatus_id.name +'</p>'

    }
    if(ob.recordstatus_id.name == 'Delete'){

        return '<p class="status-Delete">'+ ob.recordstatus_id.name +'</p>'

    }

}


//function for consultation form refill
const consultationFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into consultation object
    //used JSON.parse stringify to convert them into string and to identify the difference
    consultation = JSON.parse(JSON.stringify(ob));
    oldconsultation =JSON.parse(JSON.stringify(ob));

    //open consultation modal
    $('#consultationAddModal').modal('show');

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname', consultation.doctor_id.fullname);

    appointments = ajaxRequestHere("/appointment/showall");
    fillDataIntoSelect(selectAppNo,'Select Channeling No',appointments,'channelingno',consultation.appointment_id.channelingno);

    /* services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select Service',services,'name',consultation.service_id.name);
 */
    
    textMobile.value = consultation.mobile;
    dateOfConsultation.value=consultation.dateofconsultation;
    textNote.value = consultation.note;

    if (userPrivilege.update) {
        btnConsulUpdate.disabled = "";
        $("#btnConsulUpdate").css("cursor","pointer");
    } else {
        btnConsulUpdate.disabled = "disabled";
        $("#btnConsulUpdate").css("cursor","not-allowed");
    }
    //update button
    btnConsulUpdate.disabled = "";
    //btnConsulUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnConsulUpdate").css("cursor","pointer");

    //add button
    btnConsulAdd.disabled="disabled";
    $("#btnConsulAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    
    if(consultation.note != oldconsultation.note){
        updates = updates + "Medical History has been updated," + oldconsultation.note + "into" + consultation.note + "\n";
    }

    return updates;
}

//function for consultation update button
const buttonConsultationUpdate = ()=>{
    console.log("Update");
    console.log(consultation);
    console.log(oldconsultation);

    //check errors
    const errors = checkConsulFormError();
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

            $.ajax("/consultation" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(consultation),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#consultationAddModal').modal('hide');
                refreshConsultationTable();
                formConsultation.reset();
                refreshConsultationForm();

            }else{
                alert("failed to update following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}

const editFunc =(ob)=>{
    consultationFormRefill();

}

//function for delete consultation record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableConsultation.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following consultation record? \n'
            + '\n Owner is ' + ob.owner_id.name
            + '\n Pet is ' + ob.pet_id.name
            + '\n Date is ' + ob.dateofconsultation,
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/consultation" , {
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
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
                refreshConsultationTable();
            } else {
                alert('Delete Successfully...!!');
            }
        }else {
            row.classList.remove('table-danger')
        }
        /*  else {
             refreshConsultationTable();
             } */
             refreshConsultationTable();

    }, 500);

}


//function for print appointment record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

    //open view modal
    $('#consultationViewModal').modal('show');

    viewChannelingNo.innerHTML = ob.appointment_id.channelingno;
    viewOwner.innerHTML = ob.owner_id.name;
    viewPet.innerHTML = ob.pet_id.name;
    viewDate.innerHTML = ob.dateofconsultation;
    viewDoctor.innerHTML = ob.doctor_id ? ob.doctor_id.fullname : "N/A";
    viewService.innerHTML = ob.service_id.name;
    viewMedicalSummary.innerHTML = ob.note;

}

//function for print
const btnPrintRow = () => {
    console.log("print");

    // Get the table and its surrounding content from the modal
    const printContent = document.querySelector("#consultationViewModal .modal-body").innerHTML;

    // Open new window
    let newWindow = window.open("", "_blank");

    // Write the full document with Bootstrap styles
    newWindow.document.write(`
        <html>
        <head>
            <title>Consultation Details</title>
            <link rel='stylesheet' href='/resources/bootstrap-5.2.3/bootstrap-5.2.3/css/bootstrap.min.css'></link>
            <style>
                body {
                    padding: 20px;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <h2>Consultation Details</h2>
            ${printContent}
        </body>
        </html>
    `);

    newWindow.document.close();

    // Wait for styles to load, then print
    setTimeout(() => {
        newWindow.print();
        newWindow.close();
    }, 500);
};

//add function
function add(param){

    refreshConsultationTable();

}


//create function for check error
const checkConsulFormError =() =>{
//need to check all required fields(property)
    let errors ='';


    if (consultation.mobile==null) {
        errors = errors +"Please enter a mobile no..\n";
        textMobile.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    if (consultation.dateofconsultation==null) {
        errors = errors +"Please choose a date..\n";
        dateOfConsultation.style.background = 'rgba(255,0,0,0,1)';
        
    }
    /* if (consultation.service_id==null) {
        errors = errors +"Please select a service..\n";
        selectService.style.background = 'rgba(255,0,0,0,1)';
        
    } */
    
    return errors;

}

//create function for submit a consultation record
const buttonFormSubmit = ()=>{
    console.log('add consultation',consultation);
    console.log(window['consultation']);


    const formErrors = checkConsulFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following consultation record? \n'
                                    + '\n Channeling No is : ' + consultation.channelingno
                                    + '\n Owner is : ' + consultation.owner_id.name
                                    + '\n Pet is : ' + consultation.pet_id.name
                                    + '\n Date is : ' + consultation.dateofconsultation);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/consultation", "POST", consultation);

                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshConsultationTable();
                    formConsultation.reset();
                    refreshConsultationForm();
                    $("#consultationAddModal").modal("hide");
                    
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
const refreshConsultationForm = () =>{


    consultation= new Object();
    oldconsultation =null;

    appointments = ajaxRequestHere("/appointment/showall");
    fillDataIntoSelect(selectAppNo,'Select Channeling No',appointments,'channelingno');

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    //set text field value as a empty
   
    textMobile.style.border ='1px solid #ced4da';
    dateOfConsultation.style.border='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    selectAppNo.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    
    
    //set default color
    //textFullName.removeAttribute('style');



    //update button
    btnConsulUpdate.disabled = "disabled";
    //btnConsulUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnConsulUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnConsulAdd.disabled ="";
        $("#btnConsulAdd").css("cursor","pointer");
    } else {
        btnConsulAdd.disabled ="disabled";
        $("#btnConsulAdd").css("cursor","not-allowed");
    }

    
}

/*

//define function to generate owner mobile automatically
const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}*/


//define function to generate owner name automatically 
/* const generateOwnerName =()=>{
    console.log(JSON.parse(selectAppNo.value));

    selectOwner.value = JSON.parse(selectAppNo.value).owner_id.name;
    consultation.owner_id = selectOwner.value;
    selectOwner.style.border = "4px solid green";
} */




/* const refreshConsultationForm = async () => {

    consultation = {};
    oldconsultation = null;

    // 1. Load appointments
    appointments = ajaxRequestHere("/appointment/showall");
    fillDataIntoSelect(selectAppNo, 'Select Channeling No', appointments, 'channelingno');

    // 2. Load all doctors (optional if dropdown is needed)
    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor, 'Select A Doctor', doctors, 'fullname');

    // 3. Get logged doctor user
    const loggedUser = await  ajaxRequestHere("/user/loggeduser");

    console.log("loggedUser =", loggedUser);

    if (loggedUser && loggedUser.doctor_id) {
        const loggedDoctor = loggedUser.doctor_id;

        // 4. Insert doctor into the select box and mark as selected
        const option = document.createElement("option");
        option.value = JSON.stringify(loggedDoctor);
        option.text = loggedDoctor.fullname;
        option.selected = true;

        const selectDoctor = document.getElementById("selectDoctor");
        selectDoctor.insertBefore(option, selectDoctor.firstChild);
        selectDoctor.style.border = "4px solid green";

        // 5. Assign doctor to consultation object
        consultation.doctor_id = loggedDoctor;
    } else {
        console.warn("Logged user does not have a doctor_id.");
    }

    // 6. Clear input borders
    textMobile.style.border = '1px solid #ced4da';
    dateOfConsultation.style.border = '1px solid #ced4da';

    // 7. Handle button states
    btnConsulUpdate.disabled = true;
    $("#btnConsulUpdate").css("cursor", "not-allowed");

    if (userPrivilege.insert) {
        btnConsulAdd.disabled = false;
        $("#btnConsulAdd").css("cursor", "pointer");
    } else {
        btnConsulAdd.disabled = true;
        $("#btnConsulAdd").css("cursor", "not-allowed");
    }
}; */






const generateAppointmentOtherDetails =()=>{
    console.log(JSON.parse(selectAppNo.value));

    const selectedAppointment = JSON.parse(selectAppNo.value);

    const appointmentDate = selectedAppointment.dateofappointment;
    const mobile = selectedAppointment.mobile;
    //document.getElementById('textDoctor').value = selectedAppointment.doctor_id.fullname;
    const channelingNo = selectedAppointment.channelingno;

    dateOfConsultation.value = appointmentDate;
    textMobile.value = mobile;

    //consultation.doctor_id = { id: selectedAppointment.doctor_id.id };
    consultation.pet_id = selectedAppointment.pet_id;
    consultation.owner_id =selectedAppointment.owner_id;
    consultation.service_id =selectedAppointment.service_id;
    consultation.mobile = mobile;
    consultation.channelingno = channelingNo;
    consultation.dateofconsultation = appointmentDate;
    
    dateOfConsultation.style.border = "4px solid green";
    textMobile.style.border = "4px solid green";

} 



//define function to filter Appointments according to the service
const filterAppointments=()=>{

    const selectDoctor = document.getElementById("selectDoctor");
    const selectAppNo = document.getElementById("selectAppNo");

    //check if the service is selected
    if (selectDoctor.value) {
    selectAppNo.disabled = false;

    const doctorId = JSON.parse(selectDoctor.value).id;
    const appointmentByDoctor = ajaxRequestHere("/appointment/showallbydoctor?doctorid="+ doctorId);
    fillDataIntoSelectNewFour(selectAppNo,'Select Channeling No & Owner',appointmentByDoctor,'channelingno','owner_id.name','service_id.name','pet_id.name');

    }else {
        //Disable the appointment dropdown
        selectAppNo.disabled = true; 
        selectAppNo.innerHTML = '<option value="" selected disabled>Select Appointment</option>';
  }

}
/*//define function to generate doctor automatically
const generateDoctor =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}

//define function to generate pet automatically
const generatePet =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}

//define function to generate date of consultation automatically
const generateDateofconsultation =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}*/



