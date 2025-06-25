window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/order");

    refreshOrderTable(); //call table refresh function

    refreshOrderForm();//call form refresh function

    //inner form and table
    refreshInnerFormAndTable();
    
});

//create function refresh order table
const refreshOrderTable = () => {

    order = [];
    //create array to store order data list
    orders =ajaxRequestHere("/order/showorder");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getSupplier},
                              {dataType:'text',propertyName:'ordercode'},
                              {dataType:'text',propertyName:'requiredate'},
                              {dataType:'text',propertyName:'totalamount'},
                              {dataType:'function',propertyName:getStatus},
    ];


    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableOrder,orders,displayproperty,orderFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
     /* orders.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableOrder.children[1].children[index].children[7].children[2].disabled ="disabled";
            }
            
        }
    }); */

   $('#tableOrder').dataTable();


}

//function to get owner name
const getSupplier=(ob)=>{
    return ob.supplier_id.name;
} 


const getStatus = (ob) => {
    if(ob.orderstatus_id.name == 'Pending'){

        return '<p class="status-Pending">'+ ob.orderstatus_id.name +'</p>'

    }
    if(ob.orderstatus_id.name == 'Approved'){

        return '<p class="status-Approved">'+ ob.orderstatus_id.name +'</p>'

    }
    if(ob.orderstatus_id.name == 'Delivered'){

        return '<p class="status-Delivered">'+ ob.orderstatus_id.name +'</p>'

    }
    if(ob.orderstatus_id.name == 'Cancelled'){

        return '<p class="status-Cancelled">'+ ob.orderstatus_id.name +'</p>'

    }
}

//function for order form refill
const orderFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into employee object
    //used JSON.parse stringify to convert them into string and to identify the difference
    order = JSON.parse(JSON.stringify(ob));
    oldorder =JSON.parse(JSON.stringify(ob));

    //open employee modal
    $('#orderAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    textNote.value= order.note;
    textTotalFee.value = order.totalamount;
    requiredDate.value= order.requiredate;
    
    suppliers = ajaxRequestHere("/supplier/showsupplier");
    fillDataIntoSelect(selectSupplier,'Select Supplier',suppliers,'name',order.supplier_id.name);

    

    if (userPrivilege.update) {
        btnUpdateOrder.disabled = "";
        $("#btnUpdateOrder").css("cursor","pointer");
    } else {
        btnUpdateOrder.disabled = "disabled";
        $("#btnUpdateOrder").css("cursor","not-allowed");
    }
    //update button
    btnUpdateOrder.disabled = "";
    //btnUpdateOrder.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateOrder").css("cursor","pointer");

    //add button
    btnAddOrder.disabled="disabled";
    $("#btnAddOrder").css("cursor","not-allowed");

    refreshInnerFormAndTable();
}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(order.supplier_id.name != oldorder.supplier_id.name){
        updates = updates + "Supplier has been updated," + oldorder.supplier_id.name + " into " + order.supplier_id.name +"\n";
    }

    if(order.note != oldorder.note){
        updates = updates + "Note has updated," + oldorder.note + " into " + order.note + "\n";
    }

    if(order.requiredate != oldorder.requiredate){
        updates = updates + "Require date has updated," + oldorder.requiredate + " into " + order.requiredate + "\n";
    }

    if(order.totalamount != oldorder.totalamount){
        updates = updates + "Total amount has updated," + oldorder.totalamount + " into " + order.totalamount + "\n";
    }

    return updates;
}

//function for order update button
const buttonOrderUpdate = ()=>{
   //1) check update button
   console.log("update");
   console.log(order);
   console.log(oldorder);

   //2) check form errors
   let errors = checkOrderFormError();
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
                   let putServiceResponce = ajaxRequestBody("/order", "PUT", order)
                   //6) check put service response
                   if (putServiceResponce == "OK") {
                       Swal.fire({
                           icon: 'success',
                           html: 'Update Successfully',
                           showConfirmButton: true,
                       }).then(() => {
                        refreshOrderTable();
                        FormOrder.reset();
                        refreshOrderForm();
                        $('#orderAddModal').modal('hide');
                       });
                   } else {
                       Swal.fire({
                           icon: 'error',
                           html: 'Failed to Update order Details',
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
    orderFormRefill();

}

//function for delete order record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableOrder.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);
    

    //need a time to change the color
    setTimeout(function () {
    // get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to REMOVE following Order? <br>'
            + 'Name is : ' + ob.supplier_id.name
            + '<br> Total Amount is : ' + ob.totalamount,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxRequestBody("/order", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "Ok") {
                refreshOrderTable();

                Swal.fire({
                    title: 'Success',
                    text: 'order Delete Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete order \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        }
    });

    }, 500);

}


//function for view employee record
const printFunc =(ob, rowIndex)=>{
    
}

//function for print
function printpage() { 
    window.print(); 
}

//create function for check error
const checkOrderFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (order.supplier_id==null) {
        errors = errors +"Please select a supplier..\n";
        selectSupplier.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (order.requiredate == null) {
        errors = errors +"Please Enter a required date..\n";
        requiredDate.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (order.totalamount == null) {
        errors = errors +"Please Enter a total amount..\n";
        textTotalFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function for submit to add order
const buttonFormSubmit = ()=>{
    //)check button 
    console.log('add order',order);
    console.log(window['order']);

    // Check form error
    const formErrors = checkOrderFormError();
    // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Order? <br>'
                + '<br> Supplier is : ' + order.supplier_id.name
                + '<br> Total is : ' + order.totalamount,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/order", "POST", order);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshOrderTable();
                    FormOrder.reset();
                    refreshOrderForm();
                    $('#orderAddModal').modal('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Save successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit order \n' + postServerResponce,
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
const refreshOrderForm = () =>{

    order= new Object();
    oldorder =null;

    order.orderhasvaccinesList = new Array();

    suppliers = ajaxRequestHere("/supplier/showsupplier");
    fillDataIntoSelect(selectSupplier,'Select supplier',suppliers,'name');

    //set text field value as a empty
    
    selectSupplier.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';
    requiredDate.style.border='1px solid #ced4da';

    //update button
    btnUpdateOrder.disabled = "disabled";
    //btnUpdateOrder.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateOrder").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAddOrder.disabled ="";
        $("#btnAddOrder").css("cursor","pointer");
    } else {
        btnAddOrder.disabled ="disabled";
        $("#btnAddOrder").css("cursor","not-allowed");
    }

    //refreshInnerFormAndTable();
}

//define function to generate owner mobile automatically
/* const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    order.mobileno = textMobile.value;
    textMobile.style.border = "4px solid green";
} */

//inner form area starts here

const refreshInnerFormAndTable = ()=>{
    
    orderhasvaccines = {};

    vaccines = ajaxRequestHere("/vaccine/showall");
    fillDataIntoSelect(selectVaccine,'Select Vaccines',vaccines,'name');

    //refresh innertable
    let displayPropertyList = [
        { dataType: "function", propertyName: getVaccineName },
        { dataType: "function", propertyName: getVaccineQty },
        { dataType: "function", propertyName: getVaccinePrice },
        { dataType: "function", propertyName: getLineprice },
    ];

    fillDataIntoInnerTable(InnerTable,order.orderhasvaccinesList,displayPropertyList, deleteInnerForm);

    let totalAmount = 0.00;
    for (const orhpro of order.orderhasvaccinesList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orhpro.lineprice);
    }

    textTotalFee.value = parseFloat(totalAmount).toFixed(2);
    textTotalFee.style.border = "1px solid #ced4da";
    textTotalFee.disabled = "disabled";
    order.totalamount = textTotalFee.value;
   
    vaccinePrice.value ="";
    txtQuantity.value = "";
    vaccineLinePrice.value ="";

    selectVaccine.style.border = "1px solid #ced4da";
    vaccinePrice.style.border = "1px solid #ced4da";
    txtQuantity.style.border = "1px solid #ced4da";
    vaccineLinePrice.style.border = "1px solid #ced4da";


}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove order..? <br>'
            + '<br> Vaccine Name : ' + innerOb.vaccine_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = order.orderhasvaccinesList.map(orhpro => orhpro.vaccine_id.id).indexOf(innerOb.vaccine_id.id);
            if (extIndex != -1) {
                order.orderhasvaccinesList.splice(extIndex, 1);
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
    orderhasvaccines.price = vaccinePrice.value;
}

const textQtyValidator = () => {
    if (new RegExp("^([1-9][0-9]{0,3})|([1-9][0-9]{0,3}[.][0-9]{1,3})$").test(txtQuantity.value)) {
        vaccineLinePrice.value = (parseFloat(txtQuantity.value) * parseFloat(vaccinePrice.value)).toFixed(2);
        vaccineLinePrice.style.border = "4px solid green";
        txtQuantity.style.border = "4px solid green";
        vaccineLinePrice.disabled = "disabled";
        orderhasvaccines.lineprice = vaccineLinePrice.value;
        orderhasvaccines.quantity = txtQuantity.value;
        buttonInnerAdd.disabled = "";
    } else {
        vaccineLinePrice.value = "";
        vaccineLinePrice.style.border = "4px solid #ced4da";
        txtQuantity.style.border = "4px solid red";
        vaccineLinePrice.disabled = "disabled";
        orderhasvaccines.lineprice = null;
        orderhasvaccines.quantity = null;
    }
}

const checkInnerFormError = () => {
    let errors = "";

    if (orderhasvaccines.vaccine_id.id == null) {
        errors = errors + "Please select vaccine \n";
    }
    if (orderhasvaccines.quantity == null) {
        errors = errors + "Please enter Quantity \n";
    }
    return errors;
}

const btnInnerAdd = () => {
    //check duplicate 
    let selectInVaccine = JSON.parse(selectVaccine.value);
    let extVac = false;

    for (const orhpro of order.orderhasvaccinesList) {
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
        orderhasvaccines = {};
        vaccinePrice.value = "";
        txtQuantity.value = "";
        vaccineLinePrice.value = "";
        selectVaccine.style.border = "1px solid #ced4da";
        vaccinePrice.style.border = "1px solid #ced4da";
        txtQuantity.style.border = "1px solid #ced4da";
        vaccineLinePrice.style.border = "1px solid #ced4da";
    
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selecteed Vaccine? <br>'
                    + '<br> Vaccine Name :' + orderhasvaccines.vaccine_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    order.orderhasvaccinesList.push(orderhasvaccines);
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



