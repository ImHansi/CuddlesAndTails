window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/payment");

    refreshQuickAppointmentForm();//call form refresh function


    //call owner form refresh function
    refreshOwnerForm();

    //call pet form refresh function
    refreshPetForm();
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

    const paid = parseFloat(textPaidFee.value);
    const total = parseFloat(textTotalFee.value);

    if (isNaN(paid) || isNaN(total) || paid < total) {
        Swal.fire({
            title: "Error",
            html: "Have to pay the full Amount!",
            icon: "error"
        });
        textPaidFee.value = "";
        textBalanceFee.value = "";
        return;
    }

    const formErrors = checkQuickAppointmentFormError();
    payment.appointment_id = appointment;
     // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Appointment? <br>'
                + '<br> Owner is : ' + appointment.owner_id.name + ' (' + appointment.owner_id.mobile + ')'
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

//owner form refresh
const refreshOwnerForm = () =>{
    ownerob = new Object();

    textOwnersName.style.border ='1px solid #ced4da';
    textNic.style.border ='1px solid #ced4da';
    textMobileNo.style.border ='1px solid #ced4da';
    textEmail.style.border ='1px solid #ced4da';
    textAddress.style.border ='1px solid #ced4da';

}

//pet form refresh
const refreshPetForm = ()=> {
    petob = new Object();

    //to get owners
    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoDataList(ownerList,owners,'name');

    pettypes = ajaxRequestHere("/pettype/showPettype"); 
    fillDataIntoSelect(selectPetType,'Select pet type',pettypes,'name');


    breeds = ajaxRequestHere("/breed/showBreed"); 
    fillDataIntoSelect(selectPetBreed,'Select Breed',breeds,'name');

    textOwnerName.style.border ='1px solid #ced4da';
    textPetName.style.border ='1px solid #ced4da';
    selectPetType.style.border='1px solid #ced4da';
    selectPetBreed.style.border='1px solid #ced4da';
    textWeight.style.border='1px solid #ced4da';
    textAge.style.border='1px solid #ced4da';

    //radio button set check false

    radioGenderMale.checked=false;
    radioGenderFemale.checked =false;


}

//function to submit owner form
const btnOwnerSubmit=()=>{
    console.log("submit Owner form");
    console.log(ownerob)

    if (ownerob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ ownerob.name + " ?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/owner" , "POST" , ownerob);
            if (postResponse == "OK") {
                alert("Saved successfully!");
 
                owners = ajaxRequestHere("/owner/showOwner");
                fillDataIntoSelect(selectOwner, 'Select Owner', owners, 'name', selectOwner.value);
                
                //bind value 
                petob.owner_id =JSON.parse(selectOwner.value);
                refreshOwnerForm();
                $("#collapseOwner").collapse('hide');
            } else {
                alert("Save NOT completed...! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter owner name...!");
    }
}

//function to submit pet details form
const btnPetSubmit=()=>{
    console.log("submit pet form");
    console.log(petob)

    //check the owner ?
    /* const selectedOwner = selectOwner.value;
    if (!selectedOwner) {
        alert("Please select an owner for the pet.");
        return;
    } */

    //bind value 
    //petob.owner_id =JSON.parse(textOwnerName.value).id;
    //petob.owner_id = JSON.parse(document.getElementById("textOwnerName").value);

    if (petob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ petob.name + " ?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/pet" , "POST" , petob);
            if (postResponse == "OK") {
                alert("Saved successfully!");

                pets = ajaxRequestHere("/pet/showall");
                fillDataIntoSelect(selectPet, 'Select Pet', pets, 'name', selectPet.value);
                
                
                refreshPetForm();
                $("#collapsePet").collapse('hide');
            } else {
                alert("Save NOT completed...! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter Pet name!");
    }
}

const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    appointment.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}

//function for print doctor record
const printFunc =()=>{
    console.log('print');
    console.log("app FUNC INPUT:", appointment);
    console.log("pay FUNC INPUT:", payment);

    viewService.innerHTML = appointment.service_id?.name ?? "N/A";
    viewDate.innerHTML = appointment.dateofappointment ?? "N/A";
    // viewTime.innerHTML = appt.starttime ?? "N/A"; // if needed
    viewDoctor.innerHTML = appointment.doctor_id?.fullname ?? "N/A";
    viewPet.innerHTML = appointment.pet_id?.name ?? "N/A";
    viewOwner.innerHTML = appointment.owner_id?.name ?? "N/A";

    // Payment-related details (from main object)
    viewTotal.innerHTML = payment.totalamount ?? "0.00";
    viewPaid.innerHTML = payment.paidamount ?? "0.00";
    viewBalance.innerHTML = payment.balanceamount ?? "0.00";

}

//function for print
const printpage = () => { 
    console.log("print");

    const printContent = document.querySelector("#printCardArea").innerHTML;

    // Open new window
    let newWindow = window.open("", "_blank");

    // Write the full document with Bootstrap styles
    newWindow.document.write(`
        <html>
        <head>
            <title> Receipt </title>
            <link rel='stylesheet' href='/resources/bootstrap-5.2.3/bootstrap-5.2.3/css/bootstrap.min.css'></link>
            <style>
                body {
                    padding: 20px;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                    @media print {
                    .btn {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <h2>Doctor Availability Details</h2>
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
  
//define function to filter breed according to pet type
const filterBreed=()=>{

    const selectPetType = document.getElementById("selectPetType");
    const selectPetBreed = document.getElementById("selectPetBreed");

    //check if the pettype is selected
    if (selectPetType.value) {
    selectPetBreed.disabled = false;

    const pettypeId = JSON.parse(selectPetType.value).id;
    const breedByPettype = ajaxRequestHere("/breed/showBreedbypettype?pettypeid="+ pettypeId);
    fillDataIntoSelect(selectPetBreed,'Select Breed',breedByPettype,'name');

    }else {
        //Disable the breed dropdown
        selectPetBreed.disabled = true; 
        selectPetBreed.innerHTML = '<option value="" selected disabled>Select Pet</option>';
  }

}

/* const dataListValidator = (elementId,object,property)=>{

    let elementValue = elementId.value;
    elementId.style.border = "4px solid green";
    petob.owner_id = JSON.parse(elementValue).id;
    
} */

const dataListValidator = (element, objectName, property) => {
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
};  

//validater to check the paid amount
const generateValidAmount = () => {
    if (new RegExp(/^[1-9][0-9]{0,6}([.][0-9]{2})?$/).test(textPaidFee.value) && parseFloat(textPaidFee.value) >= parseFloat(textTotalFee.value)) {
        textPaidFee.style.border = "4px solid green";
        payment.paidamount = textPaidFee.value;
    } else {
        textPaidFee.style.border = "4px solid red";
        textBalanceFee.style.border = "3px solid red";
        
    }
} 