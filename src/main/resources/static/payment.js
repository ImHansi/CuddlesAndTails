window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/payment");

    refreshPaymentTable(); //call table refresh function

    refreshPaymentForm();//call form refresh function


});

//create function refresh payment table
const refreshPaymentTable = () => {

    //create array to store payment data list
    payment = [];
    payments =ajaxRequestHere("/payment/showall");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'paymentno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'text',propertyName:'totalamount'},
                              {dataType:'text',propertyName:'paidamount'},
                              {dataType:'text',propertyName:'balanceamount'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithPrint(tablePayment, payments,displayproperty,printFunc,true, userPrivilege);


   $('#tablePayment').dataTable();


}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}

//function for print payment record
const printFunc =(ob, rowIndex)=>{
    console.log(ob,'print');

    //open view modal
    $('#paymentViewModal').modal('show');

    viewAppointmentNo.innerHTML = ob.appointment_id.channelingno;
    viewDate.innerHTML = ob.appointment_id.dateofappointment;
    viewDoctor.innerHTML = ob.appointment_id.doctor_id.fullname;
    viewTime.innerHTML = ob.appointment_id.starttime;
    viewOwner.innerHTML = ob.owner_id.name;
    viewPet.innerHTML = ob.appointment_id.pet_id.name;
    viewService.innerHTML = ob.appointment_id.service_id.name;
    viewAddedDate.innerHTML = ob.addeddatetime.split("T")[0] + " " + ob.addeddatetime.split("T")[1];
    viewTotal.innerHTML = ob.totalamount;
    viewPaid.innerHTML = ob.paidamount;
    viewBalance.innerHTML = ob.balanceamount;
    

}

//function for print
const btnPrintRow = () => {
    console.log("print");

    // Get the table and its surrounding content from the modal
    const printContent = document.querySelector("#paymentViewModal .modal-body").innerHTML;

    // Open new window
    let newWindow = window.open("", "_blank");

    // Write the full document with Bootstrap styles
    newWindow.document.write(`
        <html>
        <head>
            <title>Payment Details</title>
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
            <h2>Payment Details</h2>
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

    refreshPaymentTable();

}


//create function for check error
const checkPayFormError =() =>{
//need to check all required fields(property)
    let errors ='';

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

//create function for submit a payment record
const buttonFormSubmit = ()=>{
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


    const formErrors = checkPayFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following payment record? \n'
                                    + '\n Total amount is : ' + payment.totalamount);


            if (userConfirm) {
                //pass data into backend
                //check server response


                let postServiceResponse = ajaxRequestBody("/payment", "POST", payment);



                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshPaymentTable();
                    formPayment.reset();
                    refreshPaymentForm();
                    $("#paymentAddModal").modal("hide");
                    
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
const refreshPaymentForm = () =>{

    payment= new Object();
    oldpayment =null;

    appointments = ajaxRequestHere("/appointment/pendingAppointments");
    fillDataIntoSelectNewFour(selectAppNo,'Select Channeling No & Owner',appointments,'channelingno','owner_id.name','service_id.name','pet_id.name');

    //vaccinationrecords = ajaxRequestHere("/vaccinationrecord/pendingVaccinationRecordes");
    //fillDataIntoSelect(selectVaccineNo,'Select Vaccination No',vaccinationrecords,'vaccino');
    
    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name');
    
    //set text field value as a empty
    //textAppointmentFee.style.border='1px solid #ced4da';
    //textVaccinationFee.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';
    textPaidFee.style.border='1px solid #ced4da';
    textBalanceFee.style.border='1px solid #ced4da';
    

    //add button
    if (userPrivilege.insert) {
        btnPaymentAdd.disabled ="";
        $("#btnPaymentAdd").css("cursor","pointer");
    } else {
        btnPaymentAdd.disabled ="disabled";
        $("#btnPaymentAdd").css("cursor","not-allowed");
    }

    
}


//define function to generate vaccination fee automatically
/* const generateVaccinationFee =()=>{
    console.log(JSON.parse(selectVaccineNo.value));

    textVaccinationFee.value = JSON.parse(selectVaccineNo.value).totalamount;
    payment.vaccinationfee = parseFloat(textVaccinationFee.value);
    const vaccinationDetails = JSON.parse(selectVaccineNo.value);
    payment.owner_id = {id: vaccinationDetails.owner_id.id};
    textVaccinationFee.style.border = "4px solid green";
} */

//define function to generate consultation fee automatically
const generateAppointmentFee =()=>{
    console.log(JSON.parse(selectAppNo.value));

    const appointmentDetails = JSON.parse(selectAppNo.value);
    const totalFee = parseFloat(appointmentDetails.servicefee ?? 0 ) + parseFloat(appointmentDetails.doctor_id?.specialization_id?.doctorfee ?? 0) 
    //textAppointmentFee.value = totalFee;
    textTotalFee.value = totalFee;
    payment.totalamount = totalFee;
    payment.owner_id = {id: appointmentDetails.owner_id.id};
    //payment.appointmentfee = parseFloat(textAppointmentFee.value);
    textTotalFee.style.border = "4px solid green";
    console.log(`Total Fee: ${totalFee}`);
}

//define function to generate total fee--> order fee + vaccination fee + consultation fee
/* const generateTotalFee =()=>{
    //const totalFee = parseFloat(payment.vaccinationfee ?? 0) + parseFloat(payment.appointmentfee ?? 0);
    const totalFee = parseFloat(payment.appointmentfee ?? 0);
    textTotalFee.value = totalFee;
    payment.totalamount = totalFee;
    textBalanceFee.value =totalFee;
    textTotalFee.style.border = "4px solid green";
    console.log(`Total Fee: ${totalFee}`);
    

} */

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

function handlePaymentMethodChange(selectElement) {
  const selectedText = selectElement.options[selectElement.selectedIndex].text.trim().toLowerCase();
  const referenceField = document.getElementById("referenceField");

  if (selectedText === "card") {
    referenceField.style.display = "block";
    textPaidFee.disabled = true;
    textPaidFee.value = textTotalFee.value;
    payment.paidamount = parseFloat(textTotalFee.value);
    textBalanceFee.value = "0";
    payment.balanceamount = 0;
  } else {
    referenceField.style.display = "none";
    textPaidFee.disabled = false;
  }
}






