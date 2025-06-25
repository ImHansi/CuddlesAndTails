window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/suppayment");

    refreshSupPaymentTable(); //call table refresh function

    refreshSupPaymentForm();//call form refresh function


});

//create function refresh supplier payment table
const refreshSupPaymentTable = () => {

    //create array to store  supplier payment data list
    supplierpayment = [];
    supplierpayments =ajaxRequestHere("/supplierpayment/showall");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getSupplierName},
                              {dataType:'text',propertyName:'totalamount'},
                              {dataType:'text',propertyName:'paidamount'},
                              {dataType:'text',propertyName:'balanceamount'},
                              {dataType:'text',propertyName:'paymentno'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithPrint(tableSuppayment, supplierpayments,displayproperty,printFunc,true, userPrivilege);


   $('#tableSuppayment').dataTable();


}

//create function to get owners
const getSupplierName=(ob)=>{
    return ob.supplier_id.name;

}

//function for print payment record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

    //open view modal
    $('#supPaymentViewModal').modal('show');

    viewSupplier.innerHTML = ob.supplier_id.name;
    viewTotal.innerHTML = ob.totalamount;
    viewPaid.innerHTML = ob.totalpaidamount;
    viewBalance.innerHTML = ob.totalbalanceamount;
    viewAddDateTime.innerHTML = ob.addeddatetime.split("T")[0] + " " + ob.addeddatetime.split("T")[1];

}

//function for print
function printpage() { 
    let modalContent = document.getElementById('supPaymentViewModal').innerHTML;
    
    let newWindow = window.open('', '', 'width=800,height=600');

    newWindow.document.write(`
        <html>
            <head>
                <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>
                <title>Payment Details</title>
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

    refreshSupPaymentTable();

}


//create function for check error
const checkPayFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (supplierpayment.supplier_id==null) {
        errors = errors +"Please enter a supplier..\n";
        selectSupplierName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplierpayment.paymentmethod_id==null) {
        errors = errors +"Please enter a payment method..\n";
        selectMethod.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplierpayment.totalamount==null) {
        errors = errors +"Please calculate the total amount..\n";
        textTotalAmount.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplierpayment.paidamount==null) {
        errors = errors +"Please enter a paid amount..\n";
        textPaidAmount.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplierpayment.balanceamount==null) {
        errors = errors +"Please calculate the balance\n";
        textBalanceAmount.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function for submit a payment record
const buttonFormSubmit = ()=>{
    console.log('add payment',supplierpayment);
    console.log(window['supplierpayment']);


    const formErrors = checkPayFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following payment record? \n'
                                    + '\n Total amount is : ' + supplierpayment.totalamount);


            if (userConfirm) {
                //pass data into backend
                //check server response


                let postServiceResponse = ajaxRequestBody("/supplierpayment", "POST", supplierpayment);



                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshSupPaymentTable();
                    formSuppayment.reset();
                    refreshSupPaymentForm();
                    $("#suppaymentAddModal").modal("hide");
                    
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
const refreshSupPaymentForm = () =>{

    supplierpayment= new Object();
    oldsupplierpayment =null;

    supplierpayment.supplierpaymenthasreceivesList = new Array();

    suppliers = ajaxRequestHere("/supplier/showsupplier");
    fillDataIntoSelect(selectSupplierName, "Select Supplier", suppliers, "name");


    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name');
    
    //set text field value as a empty
    selectSupplierName.style.border='1px solid #ced4da';
    selectMethod.style.border='1px solid #ced4da';
    textTotalAmount.style.border='1px solid #ced4da';
    textPaidAmount.style.border='1px solid #ced4da';
    textBalanceAmount.style.border='1px solid #ced4da';
    

    //add button
    if (userPrivilege.insert) {
        btnPaymentAdd.disabled ="";
        $("#btnPaymentAdd").css("cursor","pointer");
    } else {
        btnPaymentAdd.disabled ="disabled";
        $("#btnPaymentAdd").css("cursor","not-allowed");
    }

    refreshInnerFormAndTable();
}

//inner form starts here 

//to get receive note to the selected supplier
const getReceiveBySupplier = () => {
    const currentSupId = JSON.parse(selectSupplierName.value).id;
    selectSupplierName.style.border = "4px solid green";
    receiveFilter = ajaxRequestHere("/receive/getReceivebysupplier?supplierid=" + currentSupId);
    fillDataIntoSelect(selectReceiveNote, "Select Receive note", receiveFilter, "receivednotecode");
}

//to get inner total , paid and balance 
/* const getInnerAmounts = ()=> {
    const innerValues = JSON.parse(selectReceiveNote.value);
    textTotalFee.value = parseFloat(innerValues.totalamount);
    textNetFee.value = parseFloat(innerValues.netamount);
    textPaidFee.value = parseFloat(innerValues.paidamount);
} */

const refreshInnerFormAndTable = () => {

    supplierpaymenthasreceive = {};

    receives = ajaxRequestHere("/receive/showall");
    fillDataIntoSelect(selectReceiveNote, "Select Receive note", receives, "receivednotecode");

    //refresh table area
    const displayPropertyList = [
        { dataType: "function", propertyName: getReceiveId },
        { dataType: "function", propertyName: getTotal },
        { dataType: "function", propertyName: getPaid },
        { dataType: "function", propertyName: getBalance },
    ];
    fillDataIntoInnerTable(InnerTable, supplierpayment.supplierpaymenthasreceivesList, displayPropertyList, deleteInnerForm);

    let TotalAmount = 0.00;
    for (const suppayreceive of supplierpayment.supplierpaymenthasreceivesList) {
        TotalAmount = parseFloat(TotalAmount) + parseFloat(suppayreceive.totalamount);
    }
    //toFixed krpu gmnm mek string ekk bawata convert wenwa, mek aaye calculation wlt gnnw nm ek oni wididhta hadagnnd
    textTotalAmount.value = parseFloat(TotalAmount).toFixed(2);
    textTotalAmount.style.border = "1px solid #ced4da";
    textTotalAmount.disabled = "disabled";
    supplierpayment.totalamount = textTotalAmount.value;

    let PaidAmount = 0.00;
    for (const suppayreceive of supplierpayment.supplierpaymenthasreceivesList) {
        PaidAmount = parseFloat(PaidAmount) + parseFloat(suppayreceive.paidamount);
    }
    textPaidAmount.value = parseFloat(PaidAmount).toFixed(2);
    textPaidAmount.style.border = "1px solid #ced4da";
    textPaidAmount.disabled = "disabled";
    supplierpayment.paidamount = textPaidAmount.value;

    let BalanceAmount = 0.00;
    for (const suppayreceive of supplierpayment.supplierpaymenthasreceivesList) {
        BalanceAmount = parseFloat(BalanceAmount) + parseFloat(suppayreceive.balanceamount);
    }
    textBalanceAmount.value = parseFloat(BalanceAmount).toFixed(2);
    textBalanceAmount.style.border = "1px solid #ced4da";
    textBalanceAmount.disabled = "disabled";
    supplierpayment.balanceamount = textBalanceAmount.value;

    textTotalFee.value = "";
    textBalanceFee.value = "";
    textPaidFee.value = "";
    selectReceiveNote.style.border = "1px solid #ced4da";
    textBalanceFee.style.border = "1px solid #ced4da";
    textTotalFee.style.border = "1px solid #ced4da";
    textPaidFee.style.border = "1px solid #ced4da";
}




//define function to generate total fee
const generateTotalFee =()=>{
    let selectReceive = JSON.parse(selectReceiveNote.value);
    textTotalFee.value = (parseFloat(selectReceive.netamount) - parseFloat(selectReceive.paidamount)).toFixed(2);
    textTotalFee.style.border = "4px solid green";
    textTotalFee.disabled = "disabled";
    supplierpaymenthasreceive.totalamount = textTotalAmount.value;
    
}

//define function to generate the balance paid amount - total amount
const generateBalance =()=>{
    textBalanceFee.value = (parseFloat(textPaidFee.value) - parseFloat(textTotalFee.value)).toFixed(2);
    textBalanceFee.style.border = "4px solid green";
    textBalanceFee.disabled = "disabled";
    buttonInnerAdd.disabled = "";
    supplierpaymenthasreceive.balanceamount = textBalanceFee.value;
    supplierpaymenthasreceive.paidamount = textPaidFee.value;
    
}

const getReceiveId = (innerOb) => {
    return innerOb.receive_id.receivednotecode;
}

const getTotal = (innerOb) => {
    return parseFloat(innerOb.totalamount).toFixed(2);
}

const getPaid = (innerOb) => {
    return parseFloat(innerOb.paidamount).toFixed(2);
}

const getBalance = (innerOb) => {
    return parseFloat(innerOb.balanceamount).toFixed(2);
}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Are you sure to remove the receive details?',
        text: "Receive code: " + innerOb.receive_id.receivednotecode,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = supplierpayment.supplierpaymenthasreceivesList.map(suppayreceive => suppayreceive.receive_id.id).indexOf(innerOb.receive_id.id);
            if (extIndex != -1) {
                supplierpayment.supplierpaymenthasreceivesList.splice(extIndex, 1);
                Swal.fire({
                    icon: 'success',
                    title: 'receive note Removed Successfully!',
                    showConfirmButton: true,
                }).then(() => {
                    refreshInnerFormAndTable();
                });
            }
        }
    });
}

const checkInnerFormError = () => {
    let errors = "";

    if (supplierpaymenthasreceive.receive_id.id == null) {
        errors = errors + "Please select receive note \n";
    }
    if (supplierpaymenthasreceive.totalamount == null) {
        errors = errors + "Please enter total amount \n";
    }
    if (supplierpaymenthasreceive.paidamount == null) {
        errors = errors + "Please enter paid amount \n";
    }
    if (supplierpaymenthasreceive.balanceamount == null) {
        errors = errors + "Please enter balance amount \n";
    }
    return errors;
}

const innerSubmit = () => {
    //check duplicate 
    let selectReceive = JSON.parse(selectReceiveNote.value);
    let extReceive = false;

    for (const suppayirn of supplierpayment.supplierpaymenthasreceivesList) {
        if (selectReceive.id == suppayreceive.receive_id.id) {
            extReceive = true;
            break;
        }
    }
    if (extReceive) {
        Swal.fire({
            icon: 'warning',
            html: 'Selected Receive Already Exist...!',
            showConfirmButton: true,
        });
        supplierpaymenthasreceive = {};
        textTotalFee.value = "";
        textBalanceFee.value = "";
        textPaidFee.value = "";
        selectReceiveNote.style.border = "1px solid #ced4da";
        textBalanceFee.style.border = "1px solid #ced4da";
        textTotalFee.style.border = "1px solid #ced4da";
        textPaidFee.style.border = "1px solid #ced4da";
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            Swal.fire({
                title: 'Are you sure to submit the selected receive note?',
                html: "Receive note Name: " + supplierpaymenthasreceive.receive_id.receivednotecode,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Receive note added successfully!',
                        showConfirmButton: true,
                    }).then(() => {
                        supplierpayment.supplierpaymenthasreceivesList.push(supplierpaymenthasreceive);
                        refreshInnerFormAndTable();
                    });
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Inner Form Has Following Errors',
                text: errors,
                showConfirmButton: true,
            });
        }
    }
}