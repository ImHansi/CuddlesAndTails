window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/receive");

    refreshReceiveTable(); //call table refresh function

    refreshReceiveForm();//call form refresh function

    //inner form and table
    refreshInnerFormAndTable();
    
}); 


//create function refresh receive table
const refreshReceiveTable = () => {

    receive = [];
    //create array to store receive note data list
    receives =ajaxRequestHere("/receive/showall");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getSupplier},
                              {dataType:'text',propertyName:'received_date'},
                              {dataType:'text',propertyName:'totalamount'},
                              {dataType:'text',propertyName:'discount'},
                              {dataType:'text',propertyName:'netamount'},
                              {dataType:'text',propertyName:'supplierbillno'},
                              {dataType:'function',propertyName:getStatus},
    ];


    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithPrint(tableReceive,receives,displayproperty,printFunc,true, userPrivilege);


   $('#tableReceive').dataTable();


}

//function to get owner name
const getSupplier=(ob)=>{
    return ob.supplier_id.name;
} 


const getStatus = (ob) => {
    if(ob.rnstatus_id.name == 'Requested'){

        return '<p class="status-Requested">'+ ob.rnstatus_id.name +'</p>'

    }
    if(ob.rnstatus_id.name == 'Received'){

        return '<p class="status-Received">'+ ob.rnstatus_id.name +'</p>'

    }
    if(ob.rnstatus_id.name == 'Deleted'){

        return '<p class="status-Deleted">'+ ob.rnstatus_id.name +'</p>'

    }
    
}


//function for view receive record
const printFunc =(ob, rowIndex)=>{
    //open view details
    $('#receiveViewModal').modal('show');

    viewReceiveCode.innerHTML = ob.receivednotecode;
    viewSupplier.innerHTML = ob.supplier_id.name;
    vieworderCode.innerHTML = ob.order_id.ordercode;
    viewReserveDate.innerHTML = ob.received_date;
    viewTotal.innerHTML = ob.totalamount;
    viewNetAmount.innerHTML = ob.netamount;
    viewAddDateTime.innerHTML = ob.addeddatetime.split("T")[0] + " " + ob.addeddatetime.split("T")[1];;
    viewStatus.innerHTML = ob.rnstatus_id.name;
    viewSupplierBNo.innerHTML = ob.supplierbillno;
    viewDiscount.innerHTML = ob.discount;
    viewPaid.innerHTML = ob.paidamount;

    //refresh table area
    let displayPropertyList = [
        { dataType: "function", propertyName: getVaccineName },
        { dataType: "function", propertyName: getVaccinePrice },
        { dataType: "function", propertyName: getVaccineQty },
        { dataType: "function", propertyName: getLineprice },
    ];
    fillDataIntoInnerTable(tableReceiveInner, ob.receivehasvaccinesList, displayPropertyList, deleteInnerForm, false);

    
}

//function for print
const btnPrintRow = () => {
    console.log("print");

    // Get the table and its surrounding content from the modal
    const printContent = document.querySelector("#receiveViewModal .modal-body").innerHTML;

    // Open new window
    let newWindow = window.open("", "_blank");

    // Write the full document with Bootstrap styles
    newWindow.document.write(`
        <html>
        <head>
            <title>Receive Note Details</title>
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
            <h2>Receive Note Details</h2>
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

//create function for check error
const checkReceiveFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (receive.supplier_id==null) {
        errors = errors +"Please select a supplier..\n";
        selectSupplier.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (receive.order_id == null) {
        errors = errors +"Please Enter a order code..\n";
        selectOrderCode.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (receive.received_date == null) {
        errors = errors +"Please Enter a reserved date..\n";
        dateOfReceive.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (receive.totalamount == null) {
        errors = errors +"Please Enter a total amount..\n";
        textTotalAmount.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (receive.netamount == null) {
        errors = errors +"Please Enter a net amount..\n";
        textNetAmount.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create functionto add receive note
const buttonFormSubmit = ()=>{
    //)check button 
    console.log('add receive',receive);
    console.log(window['receive']);

    // Check form error
    const formErrors = checkReceiveFormError();
    // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Receive note? <br>'
                + '<br> Supplier is : ' + receive.supplier_id.name
                + '<br> Total is : ' + receive.totalamount,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/receive", "POST", receive);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshReceiveTable();
                    formReceive.reset();
                    refreshReceiveForm();
                    $('#receiveAddModal').modal('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Saved successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Receive note \n' + postServerResponce,
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
const refreshReceiveForm = () =>{

    receive= new Object();
    oldreceive =null;

    receive.receivehasvaccinesList = new Array();

    suppliers = ajaxRequestHere("/supplier/showsupplier");
    fillDataIntoSelect(selectSupplier,'Select supplier',suppliers,'name');

    //orders = ajaxRequestHere("/order/showorder");
    //fillDataIntoSelect(selectOrderCode,'Select Order code',orders,'ordercode');


    //set text field value as a empty
    
    selectSupplier.style.border='1px solid #ced4da';
    selectOrderCode.style.border='1px solid #ced4da';
    dateOfReceive.style.border='1px solid #ced4da';
    textTotalAmount.style.border='1px solid #ced4da';
    textDiscount.style.border='1px solid #ced4da';
    textNetAmount.style.border='1px solid #ced4da';

    textDiscount.value = 0;
    receive.discount = textDiscount.value;

    //add button
    if (userPrivilege.insert) {
        btnReceiveAdd.disabled ="";
        $("#btnReceiveAdd").css("cursor","pointer");
    } else {
        btnReceiveAdd.disabled ="disabled";
        $("#btnReceiveAdd").css("cursor","not-allowed");
    }

}

//filter pending orders according to the selected supplier
const filterOrders=()=>{

    const selectSupplier = document.getElementById("selectSupplier");
    const selectOrderCode = document.getElementById("selectOrderCode");

    //check if the supplier is selected
    if (selectSupplier.value) {
    selectOrderCode.disabled = false;

    const supplierId = JSON.parse(selectSupplier.value).id;
    const orderBySupplier = ajaxRequestHere("/order/showpendingbysupplier?supplierid="+ supplierId);
    fillDataIntoSelect(selectOrderCode,'Select Order Code',orderBySupplier,'ordercode');

    }else {
        //Disable the pet dropdown
        selectOrderCode.disabled = true; 
        selectOrderCode.innerHTML = '<option value="" selected disabled>Select Order Code</option>';
  }

}

//inner form area starts here

const getVaccineByOrder = () => {
    const currentorderId = JSON.parse(selectOrderCode.value).id;
    selectOrderCode.style.border = "4px solid green";
    VaccineFilter = ajaxRequestHere("/vaccine/showallbyorder?orderid=" + currentorderId);
    fillDataIntoSelect(selectVaccine, "Select Vaccine", VaccineFilter, "name");
}

const refreshInnerFormAndTable = ()=>{
    
    receivehasvaccines = {};

    //vaccines = ajaxRequestHere("/vaccine/showall");
    //fillDataIntoSelect(selectVaccine,'Select Vaccines',vaccines,'name');

    //refresh innertable
    let displayPropertyList = [
        { dataType: "function", propertyName: getVaccineName },
        { dataType: "function", propertyName: getVaccineQty },
        { dataType: "function", propertyName: getVaccinePrice },
        { dataType: "function", propertyName: getLineprice },
    ];

    fillDataIntoInnerTable(InnerTable,receive.receivehasvaccinesList,displayPropertyList, deleteInnerForm);

    let totalAmount = 0.00;
    for (const orhpro of receive.receivehasvaccinesList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orhpro.lineprice);
    }

    textTotalAmount.value = parseFloat(totalAmount).toFixed(2);
    textTotalAmount.style.border = "1px solid #ced4da";
    textTotalAmount.disabled = "disabled";
    receive.totalamount = textTotalAmount.value;

    let netAmount = 0.00;
    for (const orhpro of receive.receivehasvaccinesList) {
        netAmount = parseFloat(netAmount) + parseFloat(orhpro.lineprice);
    }

    textNetAmount.value = parseFloat(netAmount).toFixed(2);
    textNetAmount.style.border = "1px solid #ced4da";
    textNetAmount.disabled = "disabled";
    receive.netamount = textNetAmount.value;
   
    vaccinePrice.value ="";
    txtQuantity.value = "";
    vaccineLinePrice.value ="";
    textBatchNo.value = "";
    dateOfExpire.value = "";

    selectVaccine.style.border = "1px solid #ced4da";
    vaccinePrice.style.border = "1px solid #ced4da";
    txtQuantity.style.border = "1px solid #ced4da";
    vaccineLinePrice.style.border = "1px solid #ced4da";
    textBatchNo.style.border = "1px solid #ced4da";
    dateOfExpire.style.border = "1px solid #ced4da";


}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove vaccine..? <br>'
            + '<br> Vaccine Name : ' + innerOb.vaccine_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = receive.receivehasvaccinesList.map(orhpro => orhpro.vaccine_id.id).indexOf(innerOb.vaccine_id.id);
            if (extIndex != -1) {
                receive.receivehasvaccinesList.splice(extIndex, 1);
                refreshInnerFormAndTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Vaccine Removed Successfully...!',
                    icon: 'success'
                });
            }
        }
    });
}

const getVaccineName = (innerOb) => {
    return innerOb.vaccine_id.name;
}

const getVaccinePrice = (innerOb) => {
    return parseFloat(innerOb.price).toFixed(2);//why to fixed --> convert to string
}

const getVaccineQty = (innerOb) => {
    return parseFloat(innerOb.quantity).toFixed(3);
}

const getLineprice = (innerOb) => {
    return parseFloat(innerOb.lineprice).toFixed(2);
}

const generateUnitPrice = () => {
    let slctVaccine = JSON.parse(selectVaccine.value);
    vaccinePrice.value = parseFloat(slctVaccine.salesprice).toFixed(2);
    vaccinePrice.style.border = "4px solid green";
    vaccinePrice.disabled = "disabled";
    receivehasvaccines.price = vaccinePrice.value;
}

const textQtyValidator = () => {
    if (new RegExp("^([1-9][0-9]{0,3})|([1-9][0-9]{0,3}[.][0-9]{1,3})$").test(txtQuantity.value)) {
        vaccineLinePrice.value = (parseFloat(txtQuantity.value) * parseFloat(vaccinePrice.value)).toFixed(2);
        vaccineLinePrice.style.border = "4px solid green";
        txtQuantity.style.border = "4px solid green";
        vaccineLinePrice.disabled = "disabled";
        receivehasvaccines.lineprice = vaccineLinePrice.value;
        receivehasvaccines.quantity = txtQuantity.value;
        buttonInnerAdd.disabled = "";
    } else {
        vaccineLinePrice.value = "";
        vaccineLinePrice.style.border = "4px solid #ced4da";
        txtQuantity.style.border = "4px solid red";
        vaccineLinePrice.disabled = "disabled";
        receivehasvaccines.lineprice = null;
        receivehasvaccines.quantity = null;
    }
}

const generateNetAmount = () => {
    textNetAmount.value = (parseFloat(textTotalAmount.value) * parseFloat(textDiscount.value) / 100).toFixed(2);
    textNetAmount.value = (parseFloat(textTotalAmount.value) - textNetAmount.value).toFixed(2);
    textNetAmount.style.border = "2px solid #ced4da";
    textDiscount.style.border = "2px solid #ced4da";
    textNetAmount.disabled = "disabled";
    receive.netamount = textNetAmount.value;
}

const checkInnerFormError = () => {
    let errors = "";

    if (receivehasvaccines.vaccine_id.id == null) {
        errors = errors + "Please select vaccine \n";
    }
    if (receivehasvaccines.quantity == null) {
        errors = errors + "Please enter Quantity \n";
    }
    return errors;
}

const btnInnerAdd = () => {
    //check duplicate 
    let selectInVaccine = JSON.parse(selectVaccine.value);
    let extVac = false;

    for (const orhpro of receive.receivehasvaccinesList) {
        if (selectInVaccine.id == orhpro.vaccine_id.id) {
            extVac = true;
            break;
        }
    }
    if (extVac) {
        Swal.fire({
            title: "Selected Vaccine Already Exists!",
            html: "(select another Vaccine)",
            icon: "warning"
        });
        receivehasvaccines = {};
        vaccinePrice.value = "";
        txtQuantity.value = "";
        vaccineLinePrice.value = "";
        textBatchNo.value = "";
        dateOfExpire.value = "";
        selectVaccine.style.border = "1px solid #ced4da";
        vaccinePrice.style.border = "1px solid #ced4da";
        txtQuantity.style.border = "1px solid #ced4da";
        vaccineLinePrice.style.border = "1px solid #ced4da";
        textBatchNo.style.border = "1px solid #ced4da";
        dateOfExpire.style.border = "1px solid #ced4da";
    
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            receivehasvaccines.batchno = document.getElementById("textBatchNo").value.trim();
            receivehasvaccines.expiredate = document.getElementById("dateOfExpire").value;
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selecteed Vaccine? <br>'
                    + '<br> Vaccine Name :' + receivehasvaccines.vaccine_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    receive.receivehasvaccinesList.push(receivehasvaccines);
                    refreshInnerFormAndTable();
                }
                Swal.fire({
                    title: 'Success',
                    html: 'Vaccine added successfully!',
                    icon: 'success'
                });
            });
        } else {
            Swal.fire({
                title: 'Form Error',
                html: 'Inner Form Has Following errors <br>' + errors,
                icon: 'error'
            });
        }
    }
    }