window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/Supplier");

    refreshSupplierTable(); //call table refresh function

    refreshSupplierForm();//call form refresh function

});

//create function refresh supplier table
const refreshSupplierTable = () => {

    //create array to store Supplier data list
    supplier = [];
    suppliers =ajaxRequestHere("/supplier/showall");

    $.ajax("/supplier/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            suppliers = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            supplier =[];
        }
    });



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
    /*doctors.forEach((element , index) => {
        if (element.employeestatus_id.name == "Resign") {
            if (userPrivilege.delete) {
                tableDoctor.children[1].children[index].children[9].children[3].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableSupplier').dataTable();


}

//create function getSupplierStatus 
const getEmployeeStgetSupplierStatusatus=(ob)=>{
    //return 'ss';
    //return ob.supplierstatus_id.name;
    if(ob.supplierstatus_id.name == 'Active'){

        return '<p class="status-working">'+ ob.supplierstatus_id.name +'</p>'

    }
    if(ob.supplierstatus_id.name == 'Inactive'){

        return '<p class="status-Onleave">'+ ob.supplierstatus_id.name +'</p>'

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
    

    supplierstatuses = ajaxRequestHere("/supplierstatus/showStatus");
    fillDataIntoSelect(selectSupplierStatus,'Select Status',supplierstatuses,'name',supplier.supplierstatus_id.name);


    selectSupplierStatus.addEventListener('change',(event)=>{
        const newSupplierStatus = JSON.parse(event.target.value);
        updateSupplierStatus(newSupplierStatus)
    })
   
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
const btnUpdateSupplier = ()=>{
    //1) check update button
    console.log("Update");
    console.log(supplier);
    console.log(oldsupplier);


    //2) check form errors
    const errors = checkSupplierFormError();
    if(errors == ""){
        
    //3) check available update
    let updates = checkFormUpdate();
    if(updates ==""){
        Swal.fire({
            icon: 'info',
            html: 'Nothing to update..!',
            showConfirmButton: true,
        });
    }else{
        //4) get user confirmation
        let userConfirm = confirm("Are you sure to do the following changes..? \n" + updates);

        if(userConfirm){
            
            let supplierStatusId = supplier.supplierstatus_id.id;

            //5) call put service
            let putServiceresponce;
            //6) check put service response
            $.ajax("/supplier" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(supplier),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#supplierAddModal').modal('hide');
                refreshSupplierTable();
                formSupplier.reset();
                refreshSupplierForm();

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
    supplierFormRefill();

}

//function for delete supplier record
const deleteFunc =(ob,rowIndex)=>{
    // tableSupplier.children[1].children[rowIndex].style.backgroundColor = 'red'
    const row = tableSupplier.children[1].children[rowIndex];
    row.classList.add('table-danger');
    
    console.log(ob)

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following Supplier? \n'
            + '\n Supplier Name is ' + ob.name
            + '\n Mobile is ' + ob.mobile
            + '\n Email is ' + ob.email
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/supplier" , {
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
                refreshSupplierTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }
        
        /* else {
            row.classList.remove('table-danger')
        }
         else {
             refreshSupplierTable();
             } */
             refreshSupplierTable();

    }, 500);

}


//function for print supplier record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

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
    if (supplier.landno == null) {
        errors = errors +"Please Enter a valid landno..\n";
        textLandNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.address == null) {
        errors = errors +"Please Enter a valid address..\n";
        textAddress.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.supplierstatus_id == null) {
        errors = errors +"Please Enter a status..\n";
        selectSupplierStatus.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (supplier.note == null) {
        errors = errors +"Please Enter a note..\n";
        textNote.style.background = 'rgba(255,0,0,0,1)';
        
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

//create function for submit to add a supplier
const buttonFormSubmit = ()=>{
    console.log('add supplier',supplier);
    console.log(window['supplier']);


    //need to check error
    //alert(checkSupplierFormError());

    const formErrors = checkSupplierFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following supplier? \n'
                                    + '\n Full Name is : ' + supplier.name
                                    + '\n Mobile No is : ' + supplier.mobile
                                    + '\n Email is : ' + supplier.email);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/supplier", "POST", supplier);


                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshSupplierTable();
                    formSupplier.reset();
                    refreshSupplierForm();
                    $("#supplierAddModal").modal("hide");
                    
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
const refreshSupplierForm = () =>{


    supplier= new Object();
    oldsupplier =null;

    supplierstatuses = ajaxRequestHere("/supplierstatus/showStatus");
    fillDataIntoSelect(selectSupplierStatus,'Select Status',supplierstatuses,'name');

    //set text field value as a empty
    textFullName.style.border ='1px solid #ced4da';
    textContactName.style.border ='1px solid #ced4da';
    textEmail.style.border ='1px solid #ced4da';
    textMobileNo.style.border='1px solid #ced4da';
    textLandNo.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    selectSupplierStatus.style.border='1px solid #ced4da';
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

}
