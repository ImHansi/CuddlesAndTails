window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/pet");


    refreshOwnerTable();

    refreshOwnerForm();

    
});

//create function refresh owner table
const refreshOwnerTable = () => {

    //create array to store owner data list
    owner = [];
    owners =ajaxRequestHere("/owner/showOwner");

    $.ajax("/owner/showOwner",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            owners = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            owner =[];
        }
    });



    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'name'},
                              {dataType:'text',propertyName:'nic'},
                              {dataType:'text',propertyName:'mobile'},
                              {dataType:'text',propertyName:'email'},
                              {dataType:'text',propertyName:'address'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableOwner, owners,displayproperty,ownerFormRefill,deleteOwnerFunc,printOwnerFunc,true, userPrivilege);

    //disable delete button
    /*owners.forEach((element , index) => {
        if (element.status_id.name == "deseased") {
            if (userPrivilege.delete) {
                tablePet.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableOwner').dataTable();


}

//function for owner form refill
const ownerFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into pet object
    //used JSON.parse stringify to convert them into string and to identify the difference
    owner = JSON.parse(JSON.stringify(ob));
    oldowner =JSON.parse(JSON.stringify(ob));

    //open pet modal
    $('#customerAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    textOwnersName.value= owner.name;
    textNic.value= owner.nic;
    textMobileNo.value= owner.mobile;
    textEmail.value= owner.email;
    textAddress.value= owner.address;
    

    if (userPrivilege.update) {
        btnOwnerUpdate.disabled = "";
        $("#btnOwnerUpdate").css("cursor","pointer");
    } else {
        btnOwnerUpdate.disabled = "disabled";
        $("#btnOwnerUpdate").css("cursor","not-allowed");
    }
    //update button
    btnOwnerUpdate.disabled = "";
    //btnOwnerUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnOwnerUpdate").css("cursor","pointer");

    //add button
    btnOwnerAdd.disabled="disabled";
    $("#btnOwnerAdd").css("cursor","not-allowed");

}

//fn for form check update on owner form
const checkOwnerFormUpdate =()=>{
    let updates = "";
    if(owner.name != oldowner.name){
        updates = updates + "name has been updated," + oldowner.name + " into " + owner.name + "\n";
    }
    if(owner.nic != oldowner.nic){
        updates = updates + "nic has been updated," + oldowner.nic + " into " + owner.nic + "\n";
    }
    if(owner.mobile != oldowner.mobile){
        updates = updates + "mobile has been updated," + oldowner.mobile + " into " + owner.mobile + "\n";
    }
    if(owner.email != oldowner.email){
        updates = updates + "email has been updated," + oldowner.email + " into " + owner.email + "\n";
    }
    if(owner.address != oldowner.address){
        updates = updates + "address has been updated," + oldowner.address + " into " + owner.address + "\n";
    }
   return updates;

    

}

//function for owner update button
const buttonOwnerUpdate = ()=>{
    console.log("Update");
    console.log(owner);
    console.log(oldowner);

    //check errors
    const errors = checkOwnerFormError();
    if(errors == ""){
        
    //check available update
    let updates = checkOwnerFormUpdate();
    if(updates ==""){
        alert("Nothing Updated");
    }else{

        //get user confirmation
        let userConfirm = confirm("Are you sure to do the following changes..? \n" + updates);

        if(userConfirm){
            //call put service
            let putServiceresponce;

            $.ajax("/owner" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(owner),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#customerAddModal').modal('hide');
                refreshOwnerTable();
                formOwner.reset();
                refreshOwnerForm();

            }else{
                alert("failed to update following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}

//function for delete pet record
const deleteOwnerFunc =(ob,rowIndex)=>{
    //tablePet.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableOwner.children[1].children[rowIndex];
    row.classList.add('table-danger');

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following owner? \n'
            + '\n Name is ' + ob.name
            + '\n NIC is ' + ob.nic
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/owner" , {
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
                refreshOwnerTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }
        
             refreshOwnerTable();

    }, 500);

}

//function for print pet record
const printOwnerFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshOwnerTable();

}

//create function to check error
const checkOwnerFormError =()=>{

    let errors ='';

    if (owner.name==null) {
        errors = errors +"Please Enter a valid owner Name..\n";
        textOwnersName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (owner.nic==null) {
        errors = errors +"Please Enter a valid NIC..\n";
        textNic.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (owner.mobile== null) {
        errors = errors +"Please Enter a valid mobile..\n";
        textMobileNo.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (owner.email== null) {
        errors = errors +"Please Enter a valid email..\n";
        textEmail.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (owner.address== null) {
        errors = errors +"Please Enter a valid address..\n";
        textAddress.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;
}

//create function for add button to submit owner 
const buttonOwnerSubmit = ()=>{
    console.log('add owner',owner);
    console.log(window['owner']);


    const formErrors = checkOwnerFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following Owner? \n'
                                    + '\n Name is : ' + owner.name
                                    + '\n NIC is : ' + owner.nic);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/owner", "POST", owner);



                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshOwnerTable();
                    formOwner.reset();
                    refreshOwnerForm();
                    $("#customerAddModal").modal("hide");
                    
                } else {
                    alert('Save not completed..You have following errors \n' + postServiceResponse);
                }
            }
    
        
    } else {

        //form has errors
        alert("form has following errors..\n" + formErrors);
    }
 
}

//Owner form refresh
const refreshOwnerForm =()=>{
    owner = new Object();
    oldowner = null;

    textOwnersName.style.border ='1px solid #ced4da';
    textNic.style.border ='1px solid #ced4da';
    textMobileNo.style.border ='1px solid #ced4da';
    textEmail.style.border ='1px solid #ced4da';
    textAddress.style.border ='1px solid #ced4da';

     //update button
     btnOwnerUpdate.disabled = "disabled";
     //btnOwnerUpdate.style.cursor ="not-allowed";
     //jquery
     $("#btnOwnerUpdate").css("cursor","not-allowed");
 
     //add button
     if (userPrivilege.insert) {
        btnOwnerAdd.disabled ="";
         $("#btnOwnerAdd").css("cursor","pointer");
     } else {
        btnOwnerAdd.disabled ="disabled";
         $("#btnOwnerAdd").css("cursor","not-allowed");
     }
}