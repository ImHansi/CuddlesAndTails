window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/Supplier");

    refreshSupplierTable(); //call table refresh function

    refreshSupplierForm();//call form refresh function

    //inner form and table refresh
    refreshInnerFormAndTable();

});

//create function refresh supplier table
const refreshSupplierTable = () => {

    //create array to store Supplier data list
    supplier = [];
    suppliers =ajaxRequestHere("/supplier/showsupplier");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'name'},
                              {dataType:'text',propertyName:'mobile'},
                              {dataType:'text',propertyName:'email'},
                              {dataType:'text',propertyName:'address'},
                              {dataType:'text',propertyName:'email'},
                              {dataType:'function',propertyName:getSupplierStatus},
                              
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableSupplier, suppliers,displayproperty,supplierFormRefill,deleteFunc,printFunc,true, userPrivilege);

    console.log("Suppliers List", suppliers)
    //disable delete button
    suppliers.forEach((element , index) => {
        if (element.supplierstatus_id.name == "inActive") {
            if (userPrivilege.delete) {
                tableSupplier.children[1].children[index].children[7].children[3].disabled ="disabled";
            }
            
        }
    });

   $('#tableSupplier').dataTable();


}

//create function getSupplierStatus 
const getSupplierStatus=(ob)=>{
    //return 'ss';
    //return ob.supplierstatus_id.name;
    if(ob.supplierstatus_id.name == 'Active'){

        return '<p class="status-Active">'+ ob.supplierstatus_id.name +'</p>'

    }
    if(ob.supplierstatus_id.name == 'InActive'){

        return '<p class="status-InActive">'+ ob.supplierstatus_id.name +'</p>'

    }
}

//function for supplier form refill
const supplierFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into supplier object
    //used JSON.parse stringify to convert them into string and to identify the difference
    supplier = JSON.parse(JSON.stringify(ob));
    oldsupplier =JSON.parse(JSON.stringify(ob));
    //open supplier modal
    $('#supplierAddModal').modal('show');
    console.log("supplier",supplier)


    //set value into UI element
    //elementId.value = object.property
    textFullName.value= supplier.name;
    textContactName.value = supplier.contactpersonname;
    textEmail.value = supplier.email;
    textMobileNo.value = supplier.mobile;
    textLandNo.value = supplier.landno;
    textAddress.value = supplier.address;
    textNote.value = supplier.note;
    textBankAccName.value = supplier.supplierbankname;
    textBankAccNo.value= supplier.bankaccountno;
    textBankName.value = supplier.bankname;
    textBranchTown.value = supplier.branchtown;
    

    supplierstatuses = ajaxRequestHere("supplierstatus/showSupplierstatus");
    fillDataIntoSelect(selectSupplierStatus,'Select Status',supplierstatuses,'name',supplier.supplierstatus_id.name);


    /* selectSupplierStatus.addEventListener('change',(event)=>{
        const newSupplierStatus = JSON.parse(event.target.value);
        updateSupplierStatus(newSupplierStatus)
    }) */
   
    if (userPrivilege.update) {
        btnUpdateSupplier.disabled = "";
        $("#btnUpdateSupplier").css("cursor","pointer");
    } else {
        btnUpdateSupplier.disabled = "disabled";
        $("#btnUpdateSupplier").css("cursor","not-allowed");
    }
    //update button
    btnUpdateSupplier.disabled = "";
    //btnUpdateSupplier.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateSupplier").css("cursor","pointer");

    //add button
    btnAddSupplier.disabled="disabled";
    $("#btnAddSupplier").css("cursor","not-allowed");

    refreshInnerFormAndTable();

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(supplier.name != oldsupplier.name){
        updates = updates + "name has updated," + oldsupplier.name + "into" + supplier.name + "\n";
    }

    if(supplier.contactpersonname != oldsupplier.contactpersonname){
        updates = updates + "contactpersonname has updated," + oldsupplier.contactpersonname + "into" + supplier.contactpersonname + "\n";
    }

    if(supplier.email != oldsupplier.email){
        updates = updates + "email has updated," + oldsupplier.email + "into" + supplier.email + "\n";
    }

    if(supplier.mobile != oldsupplier.mobile){
        updates = updates + "mobile has updated," + oldsupplier.mobile + "into" + supplier.mobile + "\n";
    }

    if(supplier.landno != oldsupplier.landno){
        updates = updates + "landno has updated," + oldsupplier.landno + "into" + supplier.landno + "\n";
    }

    if(supplier.address != oldsupplier.address){
        updates = updates + "address has updated," + oldsupplier.address + "into" + supplier.address + "\n";
    }

    if(supplier.note != oldsupplier.note){
        updates = updates + "note has updated," + oldsupplier.note + "into" + supplier.note + "\n";
    }

    if(supplier.supplierbankname != oldsupplier.supplierbankname){
        updates = updates + "supplierbankname has updated," + oldsupplier.supplierbankname + "into" + supplier.supplierbankname + "\n";
    }

    if(supplier.bankaccountno != oldsupplier.bankaccountno){
        updates = updates + "bankaccountno has updated," + oldsupplier.bankaccountno + "into" + supplier.bankaccountno + "\n";
    }

    if(supplier.bankname != oldsupplier.bankname){
        updates = updates + "bankname has updated," + oldsupplier.bankname + "into" + supplier.bankname + "\n";
    }

    if(supplier.branchtown != oldsupplier.branchtown){
        updates = updates + "branchtown has updated," + oldsupplier.branchtown + "into" + supplier.branchtown + "\n";
    }

    if(supplier.supplierstatus_id.name != oldsupplier.supplierstatus_id.name){
        updates = updates + "supplier Status has updated,"+ oldsupplier.supplierstatus_id.name + "into" + supplier.supplierstatus_id.name + "\n";
    }

    return updates;
}

//function for supplier update button
const buttonSupplierUpdate = ()=>{
   //1) check update button
   console.log("update");
   console.log(supplier);
   console.log(oldsupplier);

   //2) check form errors
   let errors = checkSupplierFormError();
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
                   let putServiceResponce = ajaxRequestBody("/supplier", "PUT", supplier)
                   //6) check put service response
                   if (putServiceResponce == "OK") {
                       Swal.fire({
                           icon: 'success',
                           html: 'Update Successfully',
                           showConfirmButton: true,
                       }).then(() => {
                        refreshSupplierTable();
                        formSupplier.reset();
                        refreshSupplierForm();
                        $('#supplierAddModal').modal('hide');
                       });
                   } else {
                       Swal.fire({
                           icon: 'error',
                           html: 'Failed to Update supplier Details',
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
    supplierFormRefill();

}

//function for delete supplier record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableSupplier.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);
    

    //need a time to change the color
    setTimeout(function () {
    // get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to REMOVE following Supplier? <br>'
            + 'Name is : ' + ob.name
            + '<br> Mobile is : ' + ob.mobile,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxRequestBody("/supplier", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "Ok") {
                refreshSupplierTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Supplier has been deleted Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete supplier \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        }
    });

    }, 500);

}


//function for print supplier record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}
//function for print
function printpage() { 
    window.print(); 
}

//add function
function add(param){

    refreshSupplierTable();

}

//create function for check error
const checkSupplierFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (supplier.name==null) {
        errors = errors +"Please Enter a valid Full Name..\n";
        textFullName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.contactpersonname == null) {
        errors = errors +"Please Enter a contact person name..\n";
        textContactName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.email == null) {
        errors = errors +"Please Enter a email..\n";
        textEmail.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.mobile== null) {
        errors = errors +"Please Select a mobile..\n";
        textMobileNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.address == null) {
        errors = errors +"Please Enter a valid address..\n";
        textAddress.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.supplierstatus_id == null) {
        errors = errors +"Please Enter a status..\n";
        selectSupplierStatus.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.supplierbankname == null) {
        errors = errors +"Please Enter supplier bank name..\n";
        textBankAccName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.bankaccountno == null) {
        errors = errors +"Please Enter a bank account No..\n";
        textBankAccNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.bankname == null) {
        errors = errors +"Please Enter a bank Name No..\n";
        textBankName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.branchtown == null) {
        errors = errors +"Please Enter a branch town..\n";
        textBranchTown.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;

}

//create function for submit to add order
const buttonFormSubmit = ()=>{
    //)check button 
    console.log('add supplier',supplier);
    console.log(window['supplier']);

    // Check form error
    const formErrors = checkSupplierFormError();
    // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Supplier? <br>'
                + '<br> Suppliers Name is : ' + supplier.name
                + '<br> Mobile No is : ' + supplier.mobile,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/supplier", "POST", supplier);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshSupplierTable();
                    formSupplier.reset();
                    refreshSupplierForm();
                    $('#supplierAddModal').modal('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Saved Supplier successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit Supplier \n' + postServerResponce,
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
const refreshSupplierForm = () =>{
    supplier= new Object();
    oldsupplier =null;

    supplier.supplierhasvaccinesList = new Array();

    supplierstatuses = ajaxRequestHere("/supplierstatus/showSupplierstatus");
    fillDataIntoSelect(selectSupplierStatus,'Select Status',supplierstatuses,'name');
    selectSupplierStatus.value = JSON.stringify(supplierstatuses[0]);
    supplier.supplierstatus_id = supplierstatuses[0];
    selectSupplierStatus.style.border = "4px solid green";

    //set text field value as a empty
    textFullName.style.border ='1px solid #ced4da';
    textContactName.style.border ='1px solid #ced4da';
    textEmail.style.border ='1px solid #ced4da';
    textMobileNo.style.border='1px solid #ced4da';
    textLandNo.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    textBankAccName.style.border='1px solid #ced4da';
    textBankAccNo.style.border='1px solid #ced4da';
    textBankName.style.border='1px solid #ced4da';
    textBranchTown.style.border='1px solid #ced4da';
    
    //set default color
    textFullName.removeAttribute('style');

    //update button
    btnUpdateSupplier.disabled = "disabled";
    //btnUpdateSupplier.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateSupplier").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAddSupplier.disabled ="";
        $("#btnAddSupplier").css("cursor","pointer");
    } else {
        btnAddSupplier.disabled ="disabled";
        $("#btnAddSupplier").css("cursor","not-allowed");
    }

    //refreshInnerFormAndTable();

}

//inner form area starts here

const refreshInnerFormAndTable = ()=>{
    
    supplierhasvaccines = {};

    vaccines = ajaxRequestHere("/vaccine/showall");
    fillDataIntoSelect(selectSupplierVaccine,'Select Vaccines',vaccines,'name');

    //refresh innertable
    let displayPropertyList = [
        { dataType: "function", propertyName: getVaccineName },
    ];

    fillDataIntoInnerTable(tableInner,supplier.supplierhasvaccinesList,displayPropertyList, deleteInnerForm);

    selectSupplierVaccine.style.border = "1px solid #ced4da";

}

const deleteInnerForm = (innerOb) => {
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are You sure to remove this vaccine..? <br>'
            + '<br> vaccine Name : ' + innerOb.vaccine_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = supplier.supplierhasvaccinesList.map(suphpro => suphpro.vaccine_id.id).indexOf(innerOb.vaccine_id.id);
            if (extIndex != -1) {
                supplier.supplierhasvaccinesList.splice(extIndex, 1);
                refreshInnerFormAndTable();

                Swal.fire({
                    title: 'Success',
                    text: 'vaccine Removed Successfully...!',
                    icon: 'success'
                });
            }
        }
    });
}

const getVaccineName = (innerOb) => {
    return innerOb.vaccine_id.name;
}


const checkInnerFormError = () => {
    let errors = "";

    if (supplierhasvaccines.vaccine_id.id == null) {
        errors = errors + "Please select vaccine \n";
    }
    return errors;
}

const btnInnerAdd = () => {
    //check duplicate 
    let selectInVaccine = JSON.parse(selectSupplierVaccine.value);
    let extVac = false;

    for (const suphpro of supplier.supplierhasvaccinesList) {
        if (selectInVaccine.id == suphpro.vaccine_id.id) {
            extVac = true;
            break;
        }
    }
    if (extVac) {
        Swal.fire({
            title: "Selected vaccine Already Exist",
            html: "(select another vaccine)",
            icon: "warning"
        });
        supplierhasvaccines = {};
        selectSupplierVaccine.style.border = "1px solid #ced4da";
        
    
    } else {
        let errors = checkInnerFormError();
        if (errors == "") {
            swal.fire({
                title: 'Confirm Addition',
                html: 'Are you Sure to Submit selected vaccine? <br>'
                    + '<br> vaccine Name :' + supplierhasvaccines.vaccine_id.name,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    supplier.supplierhasvaccinesList.push(supplierhasvaccines);
                    refreshInnerFormAndTable();
                }
                Swal.fire({
                    title: 'Success',
                    html: 'vaccine added successfully!',
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

