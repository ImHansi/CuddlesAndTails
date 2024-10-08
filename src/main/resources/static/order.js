window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/order");

    refreshOrderTable(); //call table refresh function

    refreshOrderForm();//call form refresh function

    
});

//create function refresh order table
const refreshOrderTable = () => {

    //create array to store order data list
    orders =ajaxRequestHere("/order/showorder");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'invoiceno'},
                              {dataType:'function',propertyName:getOwner},
                              {dataType:'text',propertyName:'added_date'},
                              {dataType:'function',propertyName:getUser},
                              {dataType:'function',propertyName:getTotalAmount},
                              {dataType:'function',propertyName:getStaus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableOrder,orders,displayproperty,orderFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
     orders.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableOrder.children[1].children[index].children[7].children[2].disabled ="disabled";
            }
            
        }
    });

   $('#tableOrder').dataTable();


}

//function to get owner name
const getOwner=(ob)=>{
    return ob.owner_id.name;
}

const getUser = (ob) => {
    return ob.addeduser_id;
}

const getTotalAmount = (ob) => {
    return ob.totalamount;
}

const getStaus = (ob) => {
    if (ob.recordstatus_id.name == 'Active') {
        return '<span class="text-success fw-bold">Active</span>'
    } else {
        return '<span class="text-danger fw-bold">Delete</span>';
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
    textMobile.value= order.mobileno;
    textNote.value= order.note;
    textTotalFee.value = order.totalamount;
    
    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',order.owner_id.name);

    

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
    if(order.owner_id.name != oldorder.owner_id.name){
        updates = updates + "Owner has been updated," + oldorder.owner_id.name + "into" + order.owner_id.name +"\n";
    }
    if(order.mobileno != oldorder.mobileno){
        updates = updates + "mobileno has updated," + oldorder.mobileno + "into" + order.mobileno + "\n";
    }

    if(order.note != oldorder.note){
        updates = updates + "note has updated," + oldorder.note + "into" + order.note + "\n";
    }

    if(order.totalamount != oldorder.totalamount){
        updates = updates + "total amount has updated," + oldorder.totalamount + "into" + order.totalamount + "\n";
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
            + 'Name is : ' + ob.owner_id.name
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

    if (order.owner_id==null) {
        errors = errors +"Please select an owner..\n";
        selectOwner.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (order.mobileno == null) {
        errors = errors +"Please Enter a  mobile no..\n";
        textMobile.style.background = 'rgba(255,0,0,0,1)';
        
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
                + '<br> Owner is : ' + order.owner_id.name
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

    order.orderhasproductsList = new Array();

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    //set text field value as a empty
    
    selectOwner.style.border='1px solid #ced4da';
    textMobile.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';

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

    refreshInnerFormAndTable();
}

//define function to generate owner mobile automatically
const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    order.mobileno = textMobile.value;
    textMobile.style.border = "4px solid green";
}

//inner form area starts here

const refreshInnerFormAndTable = ()=>{
    
    orderhasproducts = {};

    products = ajaxRequestHere("/product/showall");
    fillDataIntoSelect(selectProduct,'Select Products',products,'name');

    //refresh innertable
    let displayPropertyList = [
        { dataType: "function", propertyName: getProductName },
        { dataType: "function", propertyName: getProductPrice },
        { dataType: "function", propertyName: getProductQty },
        { dataType: "function", propertyName: getLineprice },
    ];

    fillDataIntoInnerTable(InnerTable,order.orderhasproductsList,displayPropertyList, deleteInnerForm);

    let totalAmount = 0.00;
    for (const orhpro of order.orderhasproductsList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orhpro.lineprice);
    }

    textTotalFee.value = parseFloat(totalAmount).toFixed(2);
    textTotalFee.style.border = "1px solid #ced4da";
    textTotalFee.disabled = "disabled";
    order.totalamount = textTotalFee.value;
   
    productPrice.value ="";
    txtQuantity.value = "";
    productLinePrice.value ="";

    selectProduct.style.border = "1px solid #ced4da";
    productPrice.style.border = "1px solid #ced4da";
    txtQuantity.style.border = "1px solid #ced4da";
    productLinePrice.style.border = "1px solid #ced4da";


}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove order..? <br>'
            + '<br> Product Name : ' + innerOb.product_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = order.orderhasproductsList.map(orhpro => orhpro.product_id.id).indexOf(innerOb.product_id.id);
            if (extIndex != -1) {
                order.orderhasproductsList.splice(extIndex, 1);
                refreshInnerFormAndTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Product Removed Successfully...!',
                    icon: 'success'
                });
            }
        }
    });
}

const getProductName = (innerOb) => {
    return innerOb.product_id.name;
}

const getProductPrice = (innerOb) => {
    return parseFloat(innerOb.price).toFixed(2);//why to fixed --> convert to string
}

const getProductQty = (innerOb) => {
    return parseFloat(innerOb.quantity).toFixed(3);
}

const getLineprice = (innerOb) => {
    return parseFloat(innerOb.lineprice).toFixed(2);
}

const generateUnitPrice = () => {
    let slctProduct = JSON.parse(selectProduct.value);
    productPrice.value = parseFloat(slctProduct.salesprice).toFixed(2);
    productPrice.style.border = "1px solid green";
    productPrice.disabled = "disabled";
    orderhasproducts.price = productPrice.value;
}

const textQtyValidator = () => {
    if (new RegExp("^([1-9][0-9]{0,3})|([1-9][0-9]{0,3}[.][0-9]{1,3})$").test(txtQuantity.value)) {
        productLinePrice.value = (parseFloat(txtQuantity.value) * parseFloat(productPrice.value)).toFixed(2);
        productLinePrice.style.border = "2px solid green";
        txtQuantity.style.border = "2px solid green";
        productLinePrice.disabled = "disabled";
        orderhasproducts.lineprice = productLinePrice.value;
        orderhasproducts.quantity = txtQuantity.value;
        buttonInnerAdd.disabled = "";
    } else {
        productLinePrice.value = "";
        productLinePrice.style.border = "2px solid #ced4da";
        txtQuantity.style.border = "2px solid red";
        productLinePrice.disabled = "disabled";
        orderhasproducts.lineprice = null;
        orderhasproducts.quantity = null;
    }
}

const checkInnerFormError = () => {
    let errors = "";

    if (orderhasproducts.product_id.id == null) {
        errors = errors + "Please select product \n";
    }
    if (orderhasproducts.quantity == null) {
        errors = errors + "Please enter Quantity \n";
    }
    return errors;
}

const btnInnerAdd = () => {
    //check duplicate 
    let selectInProduct = JSON.parse(selectProduct.value);
    let extPro = false;

    for (const orhpro of order.orderhasproductsList) {
        if (selectInProduct.id == orhpro.product_id.id) {
            extPro = true;
            break;
        }
    }
    if (extPro) {
        Swal.fire({
            title: "Selected Product Already Ext",
            html: "(select another Product)",
            icon: "warning"
        });
        orderhasproducts = {};
        productPrice.value = "";
        txtQuantity.value = "";
        productLinePrice.value = "";
        selectProduct.style.border = "1px solid #ced4da";
        productPrice.style.border = "1px solid #ced4da";
        txtQuantity.style.border = "1px solid #ced4da";
        productLinePrice.style.border = "1px solid #ced4da";
    
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selecteed Product? <br>'
                    + '<br> Product Name :' + orderhasproducts.product_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    order.orderhasproductsList.push(orderhasproducts);
                    refreshInnerFormAndTable();
                }
                Swal.fire({
                    title: 'Success',
                    html: 'Product added successfully!',
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



