window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/appointment");

    refreshQuickAppointmentForm();//call form refresh function


});

//create function for form refresh 
const refreshQuickAppointmentForm = () =>{


    appointment= new Object();
    oldappointment =null;

    payment= new Object();
    oldpayment = null;

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select Service',services,'name');

    timeSlots = [];
    fillDataIntoSelectNew(selectStartTime,'Select Time Slot',timeSlots,'strat_time','end_time');

    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name');
    
    //set text field value as a empty
    selectOwner.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    dateOfAppointment.style.border='1px solid #ced4da';
    selectStartTime.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';
    textPaidFee.style.border='1px solid #ced4da';
    textBalanceFee.style.border='1px solid #ced4da';

}

//create function for check error
const checkQuickAppointmentFormError =() =>{
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
    if (payment.paymentmethod_id==null) {
        errors = errors +"Please enter a payment method..\n";
        selectMethod.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (payment.totalamount==null) {
        errors = errors +"Please calculate the total amount..\n";
        textTotalFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (payment.paidamount==null) {
        errors = errors +"Please enter a paid amount..\n";
        textPaidFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (payment.balanceamount==null) {
        errors = errors +"Please calculate the balance\n";
        textBalanceFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function for submit to add an quick appointment
const buttonFormSubmit = ()=>{
    console.log('add appointment',appointment);
    console.log(window['appointment']);

    console.log('add payment',payment);
    console.log(window['payment']);

    const formErrors = checkQuickAppointmentFormError();
    payment.appointment_id = appointment;
     // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Appointment? <br>'
                + '<br> Owner is : ' + appointment.owner_id.name
                + '<br> Pet is : ' + appointment.pet_id.name
                + '<br> Date is : ' + appointment.dateofappointment
                + '<br> Total Amount is : ' + payment.totalamount,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
             
                let postServerResponce = ajaxRequestBody("/quickappointment", "POST", payment);
              
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
                //refreshAppointmentTable();
                //refreshPaymentTable();
                formQuickappointment.reset();
                refreshQuickAppointmentForm();
                //$('#appointmentAddModal').modal('hide');
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

//define function to generate total fee--> order fee + vaccination fee + consultation fee
const generateTotalFee =()=>{
    const totalFee = parseFloat(appointment.service_id.price ?? 0);
    textTotalFee.value = totalFee;
    payment.totalamount = totalFee;
    textBalanceFee.value =totalFee;
    textTotalFee.style.border = "4px solid green";
    console.log(`Total Fee: ${totalFee}`);
    

}

//define function to generate the balance paid amount - total amount
const generateBalance =()=>{
    payment.paidamount = parseFloat(textPaidFee.value);
    console.log("PAID", payment.paidamount)
    const balance = parseFloat(payment.paidamount || 0) - parseFloat(payment.totalamount ?? 0);
    textBalanceFee.value = balance;
    textBalanceFee.style.border = "4px solid green";
    payment.balanceamount = balance;
    console.log(`Balance : ${balance}`);
    
}

//define function to filter pets according to owner
const filterPets=()=>{

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

}

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