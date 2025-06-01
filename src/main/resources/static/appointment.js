window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/appointment");

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
    const displayproperty = [ {dataType:'text',propertyName:'channelingno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'text',propertyName:'mobile'},
                              {dataType:'function',propertyName:getDoctor},
                              {dataType:'text',propertyName:'dateofappointment'},
                              {dataType:'function',propertyName:getTime},
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

   $('#tableAppointment').dataTable();


}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}

//create function to get pets
const getPetName=(ob)=>{
    return ob.pet_id.name;

}

//create functon to get doctors
const getDoctor=(ob)=>{
    return ob.doctor_id.fullname;

}

//create function to get appointment time
const getTime=(ob)=>{
    return ob.appointmenttime_id.name;

}

//create function get record status 
const getAppointmentStatus=(ob)=>{
    
    if(ob.appointmentstatus_id.name == 'Complete'){

        return '<p class="status-Complete">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Pending'){

        return '<p class="status-Pending">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Deleted'){

        return '<p class="status-Deleted">'+ ob.appointmentstatus_id.name +'</p>'

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
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',appointment.owner_id.name);
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name',appointment.pet_id.name);

    doctors = ajaxRequestHere("/doctor/workingHouseDoctors");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname',appointment.doctor_id.fullname);

    appointmentTimes = ajaxRequestHere("/appointmenttime/showTime");
    fillDataIntoSelect(selectTime,'Select a Time',appointmentTimes,'name',appointment.appointmenttime_id.name);



    //set value into UI element
    //elementId.value = object.property
    dateOfAppointment.value= appointment.dateofappointment;
    textMobile.value=appointment.mobile;
    textAddress.value=appointment.address;
    textEmail.value=appointment.email;
    

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

    if(appointment.doctor_id.name != oldappointment.doctor_id.name){
        updates = updates + "Doctor has been updated," + oldappointment.doctor_id.name + "into" + appointment.doctor_id.name +"\n";
    }

    if(appointment.owner_id.mobile != oldappointment.owner_id.mobile){
        updates = updates + "Owners mobile has been updated," + oldappointment.owner_id.mobile + "into" + appointment.owner_id.mobile +"\n";
    }

    if(appointment.dateofappointment != oldappointment.dateofappointment){
        updates = updates + "Date of appointment has been updated," + oldappointment.dateofappointment + "into" + appointment.dateofappointment +"\n";
    }

    if(appointment.appointmenttime_id.name != oldappointment.appointmenttime_id.name){
        updates = updates + "Appointment time has been updated," + oldappointment.appointmenttime_id.name + "into" + appointment.appointmenttime_id.name +"\n";
    }

    if(appointment.owner_id.address != oldappointment.owner_id.address){
        updates = updates + "Owners Address has been updated," + oldappointment.owner_id.address + "into" + appointment.owner_id.address +"\n";
    }

    if(appointment.owner_id.email != oldappointment.owner_id.email){
        updates = updates + "Owners email has been updated," + oldappointment.owner_id.email + "into" + appointment.owner_id.email +"\n";
    }

    if(appointment.taxi_id.name != oldappointment.taxi_id.name){
        updates = updates + "Taxi has been updated," + oldappointment.taxi_id.name + "into" + appointment.taxi_id.name +"\n";
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
                        FormAppointment.reset();
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

}

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
    if (appointment.doctor_id== null) {
        errors = errors +"Please Enter a doctor..\n";
        selectDoctor.style.background = 'rgba(255,0,0,0,1)';
        
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
                FormAppointment.reset();
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
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    doctors = ajaxRequestHere("/doctor/workingHouseDoctors");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    appointmentTimes = ajaxRequestHere("/appointmenttime/showTime");
    fillDataIntoSelect(selectTime,'Select a time',appointmentTimes,'name');


    //set text field value as a empty
    selectOwner.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    textMobile.style.border ='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    dateOfAppointment.style.border='1px solid #ced4da';
    selectTime.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    textEmail.style.border='1px solid #ced4da';
    


    //set default color
    //textFullName.removeAttribute('style');



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
const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    appointment.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}
//define function to generate owner address automatically
const generateOwnerAddress =()=>{
    console.log(JSON.parse(selectOwner.value));

    textAddress.value = JSON.parse(selectOwner.value).address;
    appointment.address = textAddress.value;
    textAddress.style.border = "4px solid green";
}
//define function to generate owner email automatically
const generateOwnerEmail =()=>{
    console.log(JSON.parse(selectOwner.value));

    textEmail.value = JSON.parse(selectOwner.value).email;
    appointment.email = textEmail.value;
    textEmail.style.border = "4px solid green";
}


//define function to filter pets according to owner
const filterPets=()=>{

    petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid="+JSON.parse(selectOwner.value).id);
    fillDataIntoSelect(selectPet,'Select Pet',petByOwner,'name');

}


//define function to get a date within a week
function validateAppointmentDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();

    // Set the time to midnight for accurate date comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculate the date one week from today
    const oneWeekFromToday = new Date(today);
    oneWeekFromToday.setDate(today.getDate() + 7);

    if (selectedDate >= today && selectedDate <= oneWeekFromToday) {
        // The selected date is valid
        input.setCustomValidity(""); // Clear any previous error
    } else {
        // The selected date is invalid
        input.setCustomValidity("Please select a date that is today or within the first week from today.");
    }
}

// Attach the validation function to the input field
document.getElementById("dateOfAppointment").addEventListener("change", function() {
    validateAppointmentDate(this);
});


