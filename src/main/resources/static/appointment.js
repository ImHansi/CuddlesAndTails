window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/appointment");
    console.log(userPrivilege);

    refreshAppointmentTable(); //call table refresh function

    refreshAppointmentForm();//call form refresh function

});

//create function refresh appointment table
const refreshAppointmentTable = () => {

    //create array to store appointment data list
    appointment = [];
    appointments =ajaxRequestHere("/appointment/showall");

    $.ajax("/appointment/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            appointments = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            appointment =[];
        }
    });

   


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getChannelingNo},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'text',propertyName:'mobile'},
                              {dataType:'function',propertyName:getDoctor},
                              {dataType:'text',propertyName:'dateofappointment'},
                              {dataType:'text',propertyName:'starttime'},
                              {dataType:'function',propertyName:getService},
                              {dataType:'function',propertyName:getAppointmentStatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableAppointment, appointments,displayproperty,appointmentFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*appointments.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableAppointment.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

    appointments.forEach((element, index) => {
    if (element.appointmentstatus_id.name === "Delete") {
        const row = tableAppointment.children[1].children[index];
        const deleteButton = row.querySelector('.btn-danger');
        const editButton = row.querySelector('.btn-success');

        if (deleteButton) deleteButton.disabled = true;
        if (editButton) editButton.disabled = true;
    }
    });

   $('#tableAppointment').dataTable();


}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}


//create function to get owners
const getChannelingNo=(ob)=>{
    return ob.dateofappointment+"/"+ob.channelingno;

}

//create function to get pets
const getPetName=(ob)=>{
    return ob.pet_id.name;

}

//create functon to get doctors
const getDoctor=(ob)=>{
    //return ob.doctor_id.fullname;
    return ob.doctor_id ? ob.doctor_id.fullname : "N/A";

}

//create functon to get servicers
const getService=(ob)=>{
    return ob.service_id.name;

}

//create function get record status 
const getAppointmentStatus=(ob)=>{
    
    if(ob.appointmentstatus_id.name == 'Pending'){

        return '<p class="status-Pending">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Confirm'){

        return '<p class="status-Confirm">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Complete'){

        return '<p class="status-Complete">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Delete'){

        return '<p class="status-Deleted">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Cancelled'){

        return '<p class="status-Cancelled">'+ ob.appointmentstatus_id.name +'</p>'

    }

}


//function for appointment form refill
const appointmentFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into appointment object
    //used JSON.parse stringify to convert them into string and to identify the difference
    appointment = JSON.parse(JSON.stringify(ob));
    oldappointment =JSON.parse(JSON.stringify(ob));

    //open appointment modal
    $('#appointmentAddModal').modal('show');


    

    owners = ajaxRequestHere("/owner/showOwner");
    //fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',appointment.owner_id.name);
    fillDataIntoDataList(ownerList,owners,'name',appointment.owner_id.name);
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name',appointment.pet_id.name);

    doctors = ajaxRequestHere("/doctor/workingDoctors");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname',appointment.doctor_id.fullname);

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select Service',services,'name',appointment.service_id.name);

    appointmentSatatueses = ajaxRequestHere("/appointmentstatus/showAppStatus");
    fillDataIntoSelect(selectAppointmentStatus,'Select Status',appointmentSatatueses,'name',appointment.appointmentstatus_id.name);

    timeSlots = [];
    fillDataIntoSelectNew(selectStartTime,'Select Time Slot',timeSlots,'strat_time','end_time',appointment.starttime, appointment.endtime);



    //set value into UI element
    //elementId.value = object.property
    dateOfAppointment.value= appointment.dateofappointment;
    textMobile.value=appointment.mobile;
    textServiceFee.value=appointment.servicefee;
    

    if (userPrivilege.update) {
        btnAppointmentUpdate.disabled = "";
        $("#btnAppointmentUpdate").css("cursor","pointer");
    } else {
        btnAppointmentUpdate.disabled = "disabled";
        $("#btnAppointmentUpdate").css("cursor","not-allowed");
    }
    //update button
    btnAppointmentUpdate.disabled = "";
    //btnAppointmentUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnAppointmentUpdate").css("cursor","pointer");

    //add button
    btnAppointmentAdd.disabled="disabled";
    $("#btnAppointmentAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(appointment.owner_id.name != oldappointment.owner_id.name){
        updates = updates + "Owner has been updated," + oldappointment.owner_id.name + "into" + appointment.owner_id.name +"\n";
    }

    if(appointment.doctor_id.fullname != oldappointment.doctor_id.fullname){
        updates = updates + "Doctor has been updated," + oldappointment.doctor_id.fullname + "into" + appointment.doctor_id.fullname +"\n";
    }

    if(appointment.pet_id.name != oldappointment.pet_id.name){
        updates = updates + "Pet has been updated," + oldappointment.pet_id.name + "into" + appointment.pet_id.name +"\n";
    }

    if(appointment.owner_id.mobile != oldappointment.owner_id.mobile){
        updates = updates + "Owners mobile has been updated," + oldappointment.owner_id.mobile + "into" + appointment.owner_id.mobile +"\n";
    }

    if(appointment.dateofappointment != oldappointment.dateofappointment){
        updates = updates + "Date of appointment has been updated," + oldappointment.dateofappointment + "into" + appointment.dateofappointment +"\n";
    }

    if(appointment.service_id.name != oldappointment.service_id.name){
        updates = updates + "Service has been updated,"+ oldappointment.service_id.name + "into" + appointment.service_id.name + "\n";
    }

    if(appointment.service_id.price != oldappointment.service_id.price){
        updates = updates + "Service charge has been updated,"+ oldappointment.service_id.price + "into" + appointment.service_id.price + "\n";
    }

    if(appointment.appointmentstatus_id.name != oldappointment.appointmentstatus_id.name){
        updates = updates + "Appointment Status has been updated,"+ oldappointment.appointmentstatus_id.name + "into" + appointment.appointmentstatus_id.name + "\n";
    }

    return updates;
}

//function for appointment update button
const buttonAppointmentUpdate = ()=>{
    console.log("Update");
    console.log(appointment);
    console.log(oldappointment);

   //2) check form errors
   let errors = checkAppointmentFormError();
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
                   let putServiceResponce = ajaxRequestBody("/appointment", "PUT", appointment)
                   //6) check put service response
                   if (putServiceResponce == "OK") {
                       Swal.fire({
                           icon: 'success',
                           html: 'Updated Successfully',
                           showConfirmButton: true,
                       }).then(() => {
                        refreshAppointmentTable();
                        formAppointment.reset();
                        refreshAppointmentForm();
                        $('#appointmentAddModal').modal('hide');
                       });
                   } else {
                       Swal.fire({
                           icon: 'error',
                           html: 'Failed to Update Appointment Details',
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
    appointmentFormRefill();

}

//function for delete appointment record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';
    const row = tableAppointment.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

   //need a time to change the color
    setTimeout(function () {
    // get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to REMOVE following Appointment? <br>'
            + 'Pet is : ' + ob.pet_id.name
            + '<br> Owner is : ' + ob.owner_id.name
            + '<br> Date of Appointment is : ' + ob.dateofappointment,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxRequestBody("/appointment", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "Ok") {
                refreshAppointmentTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Appointment Deleted Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete selected appointment \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        }
    });

    }, 500);

}


//function for print appointmnet record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

    //open view modal
    $('#appointmentViewModal').modal('show');

    viewChannelingNo.innerHTML = ob.channelingno;
    viewOwner.innerHTML = ob.owner_id.name;
    viewPet.innerHTML = ob.pet_id.name;
    viewDate.innerHTML = ob.dateofappointment;
    viewDoctor.innerHTML = ob.doctor_id.fullname;
    viewService.innerHTML = ob.service_id.name;
    viewTime.innerHTML = ob.starttime;
    
}

//function for print
const btnPrintRow = () => {
    console.log("print");

    // Get the table and its surrounding content from the modal
    const printContent = document.querySelector("#appointmentViewModal .modal-body").innerHTML;

    // Open new window
    let newWindow = window.open("", "_blank");

    // Write the full document with Bootstrap styles
    newWindow.document.write(`
        <html>
        <head>
            <title>Appointment Details</title>
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
            <h2>Appointment Details</h2>
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

    refreshAppointmentTable();

}


//create function for check error
const checkAppointmentFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (appointment.owner_id== null) {
        errors = errors +"Please Enter a owner..\n";
        selectOwner.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (appointment.pet_id== null) {
        errors = errors +"Please Enter a pet..\n";
        selectPet.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (appointment.service_id== null) {
        errors = errors +"Please Enter a service..\n";
        selectService.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (appointment.dateofappointment == null) {
        errors = errors +"Please Enter a valid date..\n";
        dateOfAppointment.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function for submit to add an appointment
const buttonFormSubmit = ()=>{
    console.log('add appointment',appointment);
    console.log(window['appointment']);

    const formErrors = checkAppointmentFormError();
     // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Appointment? <br>'
                + '<br> Owner is : ' + appointment.owner_id.name
                + '<br> Pet is : ' + appointment.pet_id.name
                + '<br> Date is : ' + appointment.dateofappointment,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/appointment", "POST", appointment);
                // Check post service response
                if (postServerResponce == "OK") {
                    Swal.fire({
                        title: 'Success',
                        html: 'Saved successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit the appointment \n' + postServerResponce,
                        icon: 'error'
                    });
                }
                refreshAppointmentTable();
                formAppointment.reset();
                refreshAppointmentForm();
                $('#appointmentAddModal').modal('hide');
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
const refreshAppointmentForm = () =>{


    appointment= new Object();
    oldappointment =null;

    owners = ajaxRequestHere("/owner/showOwner");
    //fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');
    fillDataIntoDataList(ownerList,owners,'name');

    console.log(ownerList);
    console.log(owners);

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select Service',services,'name');

    appointmentSatatueses = ajaxRequestHere("/appointmentstatus/showAppStatus");
    fillDataIntoSelect(selectAppointmentStatus,'Select Status',appointmentSatatueses,'name');
    selectAppointmentStatus.value = JSON.stringify(appointmentSatatueses[0]);
    appointment.appointmentstatus_id = appointmentSatatueses[0];
    selectAppointmentStatus.style.border = "4px solid green";


     timeSlots = [];
    fillDataIntoSelectNew(selectStartTime,'Select Time Slot',timeSlots,'strat_time','end_time');



    //set text field value as a empty
    textOwnerName.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    textMobile.style.border ='1px solid #ced4da';
    textServiceFee.style.border ='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    selectService.style.border='1px solid #ced4da';
    dateOfAppointment.style.border='1px solid #ced4da';
    selectStartTime.style.border='1px solid #ced4da';


    //set default color
    //textFullName.removeAttribute('style');

    //MIN MAX DANNA DATE EKATA


    //update button
    btnAppointmentUpdate.disabled = "disabled";
    //btnAppointmentUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnAppointmentUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAppointmentAdd.disabled ="";
        $("#btnAppointmentAdd").css("cursor","pointer");
    } else {
        btnAppointmentAdd.disabled ="disabled";
        $("#btnAppointmentAdd").css("cursor","not-allowed");
    }

}

//define function to generate owner mobile automatically
/* const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    appointment.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
} */
//define function to generate owner address automatically
/* const generateOwnerAddress =()=>{
    console.log(JSON.parse(selectOwner.value));

    textAddress.value = JSON.parse(selectOwner.value).address;
    appointment.address = textAddress.value;
    textAddress.style.border = "4px solid green";
} */
//define function to generate owner email automatically
/* const generateOwnerEmail =()=>{
    console.log(JSON.parse(selectOwner.value));

    textEmail.value = JSON.parse(selectOwner.value).email;
    appointment.email = textEmail.value;
    textEmail.style.border = "4px solid green";
}
 */


//define function to generate service fee automatically
const generateServiceFee =()=>{
    console.log(JSON.parse(selectService.value));

    textServiceFee.value = JSON.parse(selectService.value).price;
    appointment.servicefee = parseFloat(textServiceFee.value);
    console.log("Doctor Fee",appointment.servicefee );
    textServiceFee.style.border = "4px solid green";
}

//define function to filter pets according to owner
/* const filterPets=()=>{

    const selectOwner = document.getElementById("selectOwner");
    const selectPet = document.getElementById("selectPet");

    //check if the owner is selected
    if (selectOwner.value) {
    selectPet.disabled = false;

    const ownerId = JSON.parse(selectOwner.value).id;
    const petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid="+ ownerId);
    fillDataIntoSelect(selectPet,'Select Pet',petByOwner,'name');

    }else {
        //Disable the pet dropdown
        selectPet.disabled = true; 
        selectPet.innerHTML = '<option value="" selected disabled>Select Pet</option>';
  }

} */

//define function to filter pets according to owner
const filterTimeSlot=()=>{

    timeSlots = ajaxRequestHere("/availability/bydatedoctor?date="+dateOfAppointment.value+"&doctorid="+JSON.parse(selectDoctor.value).id);
    fillDataIntoSelectNew(selectStartTime,'Select Time Slot',timeSlots,'strat_time','end_time');

}


const selectStartTimeValidator=()=>{
     selectStartTime.style.border = "4px solid green";
     timeSlot = JSON.parse(selectStartTime.value);
     appointment.starttime   = timeSlot.strat_time;  
     appointment.endtime = timeSlot.end_time;  

}


//function to choose a date up to 7 days from today
const setAppointmentDateRange = () => {
  const dateInput = document.getElementById("dateOfAppointment");
  const today = new Date();

  const toDateString = (date) => date.toISOString().split('T')[0];

  const minDate = toDateString(today);

  const maxDateObj = new Date(today);
  maxDateObj.setDate(today.getDate() + 6);
  const maxDate = toDateString(maxDateObj);

  dateInput.min = minDate;
  dateInput.max = maxDate;
};


//service form refresh
const refreshServiceForm =()=>{
    serviceob = new Object();
    serviceoldob = null; 
}

//create function for submit service form
const btnServiceSubmit=()=>{
    console.log("submit service form");

    if (serviceob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ serviceob.name + " service Value..?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/service" , "POST" , serviceob);
            if (postResponse == "OK") {
                alert("Save successfully..!");
 
                services = ajaxRequestHere("/service/showService");
                fillDataIntoSelect(selectService, 'Select Service..', services, 'name', selectService.value);
                selectService.style.border = "2px solid green";
                //bind value 
                appointment.service_id =JSON.parse(selectService.value);
                refreshServiceForm();
                $("#collapseService").collapse('hide');
            } else {
                alert("Save NOT completed...! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter service name...!");
    }
}


//function to get the doctors on selected appointment date and the service
/* const filterAvailableDoctors = () => {
  const serviceSelect = document.getElementById("selectService");
  const dateInput = document.getElementById("dateOfAppointment");
  const doctorSelect = document.getElementById("selectDoctor");

  const selectedService = serviceSelect.value;
  const selectedDate = dateInput.value;

  doctorSelect.innerHTML = '<option value="" selected disabled>Select A Doctor</option>';

  if (!selectedService || !selectedDate) {
    return;
  }

  const doctors = ajaxRequestHere(`/doctor/available?date=${selectedDate}&serviceid=${selectedService}`);

  // Fill the doctor select element
  fillDataIntoSelect(doctorSelect, 'Select A Doctor', doctors, 'name');
}; */

const filterDoctors = () => {
    const selectService = document.getElementById("selectService");
    const selectDoctor = document.getElementById("selectDoctor");

    // Check if a service is selected
    if (selectService.value) {
        selectDoctor.disabled = false;

        const serviceId = JSON.parse(selectService.value).id; // if service value is a JSON string
        const doctors = ajaxRequestHere("/doctor/workingDoctorByService?serviceId=" + serviceId);
        
        fillDataIntoSelect(selectDoctor, 'Select Doctor', doctors,'fullname');
    } else {
        selectDoctor.disabled = true;
        selectDoctor.innerHTML = '<option value="" selected disabled>Select Doctor</option>';
    }
};

/* const dataListValidator = (element, objectName, property) => {
    const elementValue = element.value;

    //find the matched object from the global array
    const matchedObj = owners.find(obj => obj.name === elementValue);

    if (matchedObj) {
        element.style.border = "4px solid green";
        window[objectName][property] = { id: matchedObj.id };
    } else {
        element.style.border = "4px solid red";
        window[objectName][property] = null;
        alert("Invalid selection. Please choose a valid option from the list.");
    }
}; */
/* 
const dataListValidator = (element, objectName, property) => {
    const elementValue = element.value;

    // Find the matched owner object by name
    const matchedOwner = owners.find(obj => obj.name === elementValue);

    if (matchedOwner) {
        element.style.border = "4px solid green";

        // Set the owner ID in the target object (e.g., pet.owner_id = { id: ... })
        window[objectName][property] = { id: matchedOwner.id };

        // 👉 Set the mobile number
        document.getElementById("textMobile").value = matchedOwner.mobile;
        document.getElementById("textMobile").style.border = "4px solid green";

        // 👉 Filter and show pets by this owner
        filterPetsByOwnerId(matchedOwner.id);

    } else {
        element.style.border = "4px solid red";
        window[objectName][property] = null;

        // Clear mobile
        document.getElementById("textMobile").value = "";
        document.getElementById("textMobile").style.border = "";

        // Clear pet list
        clearPetDropdown();

        alert("Invalid selection. Please choose a valid option from the list.");
    }
}; */

/* const filterPetsByOwnerId = (ownerId) => {
    const selectPet = document.getElementById("selectPet");

    if (ownerId) {
        selectPet.disabled = false;

        const petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid=" + ownerId);
        fillDataIntoSelect(selectPet, 'Select Pet', petByOwner, 'name');
    } else {
        clearPetDropdown();
    }
}; */

/* const clearPetDropdown = () => {
    const selectPet = document.getElementById("selectPet");
    selectPet.disabled = true;
    selectPet.innerHTML = '<option value="" selected disabled>Select Pet</option>';
}; */


const dataListValidator = (element, objectName, property) => {
    const elementValue = element.value;

    // Try to match the owner by name from the global owners array
    const matchedOwner = owners.find(obj => obj.name === elementValue);

    if (matchedOwner) {
        element.style.border = "4px solid green";

        //Set owner object
        //window[objectName][property] = { id: matchedOwner.id };
        window[objectName][property] = matchedOwner;

        //owner's mobile number
        const textMobile = document.getElementById("textMobile");
        textMobile.value = matchedOwner.mobile;
        textMobile.style.border = "4px solid green";
        appointment.mobile = textMobile.value;

        //Filter pets by owner ID and populate the select
        const selectPet = document.getElementById("selectPet");
        const petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid=" + matchedOwner.id);

        //Fill the dropdown
        selectPet.innerHTML = '<option value="" disabled selected>Select Pet</option>';
        petByOwner.forEach(pet => {
            const option = document.createElement("option");
            option.text = pet.name;
            //option.value = JSON.stringify({ id: pet.id });
            option.value = JSON.stringify(pet);
            selectPet.appendChild(option);
        });

        selectPet.disabled = false;

    } else {
        //Invalid input
        element.style.border = "4px solid red";
        window[objectName][property] = null;

        //Clear mobile and pets
        document.getElementById("textMobile").value = "";
        document.getElementById("textMobile").style.border = "";
        const selectPet = document.getElementById("selectPet");
        selectPet.disabled = true;
        selectPet.innerHTML = '<option value="" disabled selected>Select Pet</option>';

        alert("Invalid selection. Please choose a valid option from the list.");
    }
};
