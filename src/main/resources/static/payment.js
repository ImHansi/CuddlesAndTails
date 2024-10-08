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

    $.ajax("/payment/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            payments = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            payment =[];
        }
    });


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'paymentno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'text',propertyName:'totalamount'},
                              {dataType:'text',propertyName:'paidamount'},
                              {dataType:'text',propertyName:'balanceamount'},
                              {dataType:'function',propertyName:getRecordstatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tablePayment, payments,displayproperty,paymentFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*consultations.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tablePayment').dataTable();


}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

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


//function for payment form refill
const paymentFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into payment object
    //used JSON.parse stringify to convert them into string and to identify the difference
    payment = JSON.parse(JSON.stringify(ob));
    oldpayment =JSON.parse(JSON.stringify(ob));

    //open payment modal
    $('#paymentAddModal').modal('show');

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',payment.owner_id.name);
    
    
    orders = ajaxRequestHere("/order/showsorder");
    fillDataIntoSelect(selectInvoice,'Select Invoice',orders,'invoiceno',payment.order_id.invoiceno);
    
    
    vaccinationrecords = ajaxRequestHere("/vaccinationrecord/showall");
    fillDataIntoSelect(selectVaccineNo,'Select Vaccination No',vaccinationrecords,'vaccino',payment.vaccinationrecord_id.vaccino);
    
    
    consultations = ajaxRequestHere("/consultation/showall");
    fillDataIntoSelect(selectConsulNo,'Select Consultation No',consultations,'consulno',payment.consultation_id.consulno);
    
    
    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name',payment.paymentmethod_id.name);
    
    
    textInvoiceFee.value = payment.orderfee;
    textVaccinationFee.value=payment.vaccinationfee;
    textConsultationFee.value=payment.consultationfee;
    textTotalFee.value=payment.totalamount;
    textPaidFee.value=payment.paidamount;
    textBalanceFee.value=payment.balanceamount;


    

    if (userPrivilege.update) {
        btnPaymentUpdate.disabled = "";
        $("#btnPaymentUpdate").css("cursor","pointer");
    } else {
        btnPaymentUpdate.disabled = "disabled";
        $("#btnPaymentUpdate").css("cursor","not-allowed");
    }
    //update button
    btnPaymentUpdate.disabled = "";
    //btnPaymentUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnPaymentUpdate").css("cursor","pointer");

    //add button
    btnPaymentAdd.disabled="disabled";
    $("#btnPaymentAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(payment.owner_id.name != oldpayment.owner_id.name){
        updates = updates + "Owner has been updated," + oldpayment.owner_id.name + "into" + payment.owner_id.name + "\n";
    }

    if(payment.order_id.invoiceno != oldpayment.order_id.invoiceno){
        updates = updates + "Invoice No has been updated," + oldpayment.order_id.invoiceno + "into" + payment.order_id.invoiceno + "\n";
    }

    if(payment.vaccinationrecord_id.vaccino != oldpayment.vaccinationrecord_id.vaccino){
        updates = updates + "vaccination record No has been updated," + oldpayment.vaccinationrecord_id.vaccino + "into" + payment.vaccinationrecord_id.vaccino + "\n";
    }

    if(payment.consultation_id.consulno != oldpayment.consultation_id.consulno){
        updates = updates + "Consultation No has been updated," + oldpayment.consultation_id.consulno + "into" + payment.consultation_id.consulno + "\n";
    }

    if(payment.paymentmethod_id.name != oldpayment.paymentmethod_id.name){
        updates = updates + "payment method has been updated," + oldpayment.paymentmethod_id.name + "into" + payment.paymentmethod_id.name + "\n";
    }

    if(payment.totalamount != oldpayment.totalamount){
        updates = updates + "Total amount has been updated," + oldpayment.totalamount + "into" + payment.totalamount + "\n";
    }

    if(payment.paidamount != oldpayment.paidamount){
        updates = updates + "Paid amount has been updated," + oldpayment.paidamount + "into" + payment.paidamount + "\n";
    }

    if(payment.balanceamount != oldpayment.balanceamount){
        updates = updates + "balance amount has been updated," + oldpayment.balanceamount + "into" + payment.balanceamount + "\n";
    }


    
    return updates;
}

//function for consultation update button
const buttonPaymentUpdate = ()=>{
    console.log("Update");
    console.log(payment);
    console.log(oldpayment);

    //check errors
    const errors = checkPayFormError();
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

            $.ajax("/payment" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(payment),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#paymentAddModal').modal('hide');
                refreshPaymentTable();
                formPayment.reset();
                refreshPaymentForm();

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
    paymentFormRefill();

}

//function for delete payment record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tablePayment.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following payment record? \n'
            + '\n Owner is ' + ob.owner_id.name
            + '\n Total amount is ' + ob.totalamount
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/payment" , {
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
                alert('Delete Successfully...!!');
                refreshPaymentTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }
        
        
             refreshPaymentTable();

    }, 500);

}


//function for print payment record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshPaymentTable();

}


//create function for check error
const checkPayFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (payment.owner_id==null) {
        errors = errors +"Please select an owner..\n";
        selectOwner.style.background = 'rgba(255,0,0,0,1)';
        
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

//create function for submit a payment record
const buttonFormSubmit = ()=>{
    console.log('add payment',payment);
    console.log(window['payment']);


    const formErrors = checkPayFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following consultation record? \n'
                                    + '\n Owner is : ' + payment.owner_id.name
                                    + '\n Total amount is : ' + payment.totalamount
                                    + '\n Payment No is : ' + payment.paymentno);


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

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    orders = ajaxRequestHere("/order/showsorder");
    fillDataIntoSelect(selectInvoice,'Select Invoice',orders,'invoiceno');
    
    
    vaccinationrecords = ajaxRequestHere("/vaccinationrecord/showall");
    fillDataIntoSelect(selectVaccineNo,'Select Vaccination No',vaccinationrecords,'vaccino');
    
    
    consultations = ajaxRequestHere("/consultation/showall");
    fillDataIntoSelect(selectConsulNo,'Select Consultation No',consultations,'consulno');
    
    
    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name');
    

   
    //set text field value as a empty
    selectOwner.style.border ='1px solid #ced4da';
    textMobile.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    dateOfConsultation.style.border='1px solid #ced4da';
    selectService.style.border='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    textServiceFee.style.border='1px solid #ced4da';
    textDoctorFee.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';
    

    //set default color
    //textFullName.removeAttribute('style');



    //update button
    btnPaymentUpdate.disabled = "disabled";
    //btnPaymentUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnPaymentUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnPaymentAdd.disabled ="";
        $("#btnPaymentAdd").css("cursor","pointer");
    } else {
        btnPaymentAdd.disabled ="disabled";
        $("#btnPaymentAdd").css("cursor","not-allowed");
    }

    
}


//define function to generate invoice fee automatically
const generateOrderFee =()=>{
    console.log(JSON.parse(selectInvoice.value));

    textInvoiceFee.value = JSON.parse(selectInvoice.value).totalamount;
    payment.orderfee = parseFloat(textInvoiceFee.value);
    textInvoiceFee.style.border = "4px solid green";
}

//define function to generate vaccination fee automatically
const generateVaccinationFee =()=>{
    console.log(JSON.parse(selectVaccineNo.value));

    textVaccinationFee.value = JSON.parse(selectVaccineNo.value).totalamount;
    payment.vaccinationfee = parseFloat(textVaccinationFee.value);
    textVaccinationFee.style.border = "4px solid green";
}

//define function to generate consultation fee automatically
const generateConsultationFee =()=>{
    console.log(JSON.parse(selectConsulNo.value));

    textConsultationFee.value = JSON.parse(selectConsulNo.value).totalfee;
    payment.consultationfee = parseFloat(textConsultationFee.value);
    textConsultationFee.style.border = "4px solid green";
}

//define function to generate total fee--> order fee + vaccination fee + consultation fee
const generateTotalFee =()=>{
    const totalfee = payment.orderfee + payment.vaccinationfee + payment.consultationfee;
    textTotalFee.value = totalfee;
    textTotalFee.style.border = "4px solid green";
    console.log(`Total Fee: ${totalfee}`);
    

}

//define function to generate the balance paid amount - total amount
const generateBalance =()=>{
    payment.totalamount = parseFloat(textTotalFee.value);
    payment.paidamount = parseFloat(textPaidFee.value);
    const balance = payment.paidamount - payment.totalamount;
    textBalanceFee.value = balance;
    textBalanceFee.style.border = "4px solid green";
    console.log(`Balance : ${balance}`);
    
}




