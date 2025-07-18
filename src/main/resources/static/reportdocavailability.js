window.addEventListener('load',()=>{


    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/doctor");

    services = ajaxRequestHere("/service/serviceswithspecialization");
    fillDataIntoSelect(selectService,'Select Service',services,'name');
    console.log(services);

});

//create function refresh appointment table
const refreshReportDocAvailability = () => {

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'doctorName'},
                              {dataType:'text',propertyName:'strat_time'},
                              {dataType:'text',propertyName:'end_time'},
                              {dataType:'function',propertyName:getNoofAppointments},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    //fillDataIntoTableWithoutModify(tableReportDocAvailability, doctors, displayproperty);
    fillDataIntoTableOnlyEdit(tableReportDocAvailability, doctors, displayproperty,openEditForm);

}

//create functon to get no of appointments
const getNoofAppointments=(ob)=>{

    const selectedDate = dateOfAppointment.value;
    const serviceId = JSON.parse(selectService.value).id;
    const selectedDoc = ob.doctorName;

    appointments = ajaxRequestHere("/appointment/appointmentByDateandDoctorandservice?doctorId=" + selectedDoc + "&dateofappointment=" + selectedDate + "&serviceId=" + serviceId );
    
    return appointments.id;
} 

//create function get record status 


const generateReport=()=> {


    const selectedDate = dateOfAppointment.value;
    const serviceId = JSON.parse(selectService.value).id;

    doctors = ajaxRequestHere("/availability/availabilityByServiceAndDate?serviceId=" + serviceId + "&date=" + selectedDate);

    refreshReportDocAvailability();   

}

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


//function for appointment form refill
const openEditForm =(ob,rowIndex)=>{

    //open appointment modal
    $('#appointmentAddModal').modal('show');

    console.log('Add from Doctor availability');

    appointment= new Object();
    console.log("This",ob);

    owners = ajaxRequestHere("/owner/showOwner");
    //fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');
    fillDataIntoDataList(ownerList,owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');


    dateOfAppointmentforForm.value = ob.date;
    dateOfAppointmentforForm.disabled= true;
    appointment.dateofappointment =  dateOfAppointmentforForm.value;


    selectDoctor.disabled=true;
    //selectStartTime

    doctors = ajaxRequestHere("/doctor/workingDoctors");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname', ob.doctorName);
    appointment.doctor_id = JSON.parse(selectDoctor.value);
    filterTimeSlot(); 

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectServiceForm,'Select Service',services,'name',JSON.parse(selectService.value).name);
    appointment.service_id = JSON.parse(selectService.value);
    generateServiceFee();

    appointmentSatatueses = ajaxRequestHere("/appointmentstatus/showAppStatus");
    fillDataIntoSelect(selectAppointmentStatus,'Select Status',appointmentSatatueses,'name');
    selectAppointmentStatus.value = JSON.stringify(appointmentSatatueses[0]);
    appointment.appointmentstatus_id = appointmentSatatueses[0];
    selectAppointmentStatus.style.border = "4px solid green";
    selectAppointmentStatus.disabled=true;

    //timeSlots = [];
    //fillDataIntoSelectNew(selectStartTime,'Select Time Slot',timeSlots,'strat_time','end_time',appointment.starttime, appointment.endtime);



    //set value into UI element
    //elementId.value = object.property
    selectDoctor.disabled=true;
    selectServiceForm.disabled=true;
    
    
    

    //add button
    if (userPrivilege.insert) {
        btnAppointmentAdd.disabled ="";
        $("#btnAppointmentAdd").css("cursor","pointer");
    } else {
        btnAppointmentAdd.disabled ="disabled";
        $("#btnAppointmentAdd").css("cursor","not-allowed");
    }

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
        selectServiceForm.style.background = 'rgba(255,0,0,0,1)';
        
    }
    /* if (appointment.dateOfAppointmentforForm == null) {
        errors = errors +"Please Enter a valid date..\n";
        dateOfAppointmentforForm.style.background = 'rgba(255,0,0,0,1)';
        
    } */
    
    return errors;

}

//create function for submit to add an appointment
const buttonFormSubmit = ()=>{
    console.log('add appointment',appointment);
    console.log(window['appointment']);

    appointment.dateofappointment =  dateOfAppointmentforForm.value;

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

//define function to filter time according to doctor
const filterTimeSlot=()=>{

    timeSlots = ajaxRequestHere("/availability/bydatedoctor?date="+dateOfAppointmentforForm.value+"&doctorid="+JSON.parse(selectDoctor.value).id);
    fillDataIntoSelectNew(selectStartTime,'Select Time Slot',timeSlots,'strat_time','end_time');

}

const selectStartTimeValidator=()=>{
     selectStartTime.style.border = "4px solid green";
     timeSlot = JSON.parse(selectStartTime.value);
     appointment.starttime   = timeSlot.strat_time;  
     appointment.endtime = timeSlot.end_time;  

}

//define function to generate service fee automatically
const generateServiceFee =()=>{
    console.log(JSON.parse(selectService.value));

    textServiceFee.value = JSON.parse(selectService.value).price;
    appointment.servicefee = parseFloat(textServiceFee.value);
    console.log("Doctor Fee",appointment.servicefee );
    textServiceFee.style.border = "4px solid green";
}

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