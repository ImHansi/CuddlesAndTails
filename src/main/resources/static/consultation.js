window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/consultation");

    refreshConsultationTable(); //call table refresh function

    refreshConsultationForm();//call form refresh function


});

//create function refresh consultation table
const refreshConsultationTable = () => {

    //create array to store consultation data list
    consultation = [];
    consultations =ajaxRequestHere("/consultation/showall");

    $.ajax("/consultation/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            consultations = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            consultation =[];
        }
    });


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'consulno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'function',propertyName:getService},
                              {dataType:'text',propertyName:'dateofconsultation'},
                              {dataType:'function',propertyName:getDoctor},
                              {dataType:'text',propertyName:'totalfee'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableConsultation, consultations,displayproperty,consultationFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*consultations.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableConsultation').dataTable();


}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}

//create function to get pets
const getPetName=(ob)=>{
    return ob.pet_id.name;

}

//create function to get services
const getService=(ob)=>{
    return ob.service_id.name;

}

//create functon to get doctors
const getDoctor=(ob)=>{
    return ob.doctor_id.fullname;

}

//create function get record status 
const getRecordstatus_id=(ob)=>{
    
    if(ob.recordstatus_id.name == 'Active'){

        return '<p class="status-Active">'+ ob.recordstatus_id.name +'</p>'

    }
    if(ob.recordstatus_id.name == 'Delete'){

        return '<p class="status-Delete">'+ ob.recordstatus_id.name +'</p>'

    }

}


//function for consultation form refill
const consultationFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into consultation object
    //used JSON.parse stringify to convert them into string and to identify the difference
    consultation = JSON.parse(JSON.stringify(ob));
    oldconsultation =JSON.parse(JSON.stringify(ob));

    //open consultation modal
    $('#consultationAddModal').modal('show');

    appointments = ajaxRequestHere("/appointment/showall");
    fillDataIntoSelect(selectAppNo,'Select Channeling No',appointments,'channelingno',consultation.appointment_id.channelingno);

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',consultation.owner_id.name);
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name',consultation.pet_id.name);

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select Service',services,'name',consultation.service_id.name);

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname',consultation.doctor_id.fullname);

    textMobile.value = consultation.mobile;
    dateOfConsultation.value=consultation.dateofconsultation;
    textServiceFee.value=consultation.servicefee;
    textDoctorFee.value=consultation.doctorfee;
    textTotalFee.value=consultation.totalfee;


    

    if (userPrivilege.update) {
        btnConsulUpdate.disabled = "";
        $("#btnConsulUpdate").css("cursor","pointer");
    } else {
        btnConsulUpdate.disabled = "disabled";
        $("#btnConsulUpdate").css("cursor","not-allowed");
    }
    //update button
    btnConsulUpdate.disabled = "";
    //btnConsulUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnConsulUpdate").css("cursor","pointer");

    //add button
    btnConsulAdd.disabled="disabled";
    $("#btnConsulAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(consultation.owner_id.name != oldconsultation.owner_id.name){
        updates = updates + "Owner has been updated," + oldconsultation.owner_id.name + "into" + consultation.owner_id.name + "\n";
    }

    if(consultation.mobile != oldconsultation.mobile){
        updates = updates + "Mobile no has been updated," + oldconsultation.mobile + "into" + consultation.mobile + "\n";
    }

    if(consultation.pet_id.name != oldconsultation.pet_id.name){
        updates = updates + "Pet has been updated," + oldconsultation.pet_id.name + "into" + consultation.pet_id.name + "\n";
    }

    if(consultation.dateofconsultation != oldconsultation.dateofconsultation){
        updates = updates + "Date of consultation has been updated," + oldconsultation.dateofconsultation + "into" + consultation.dateofconsultation + "\n";
    }

    if(consultation.service_id.name != oldconsultation.service_id.name){
        updates = updates + "Service has been updated," + oldconsultation.service_id.name + "into" + consultation.service_id.name + "\n";
    }

    if(consultation.doctor_id.fullname != oldconsultation.doctor_id.fullname){
        updates = updates + "Doctor has been updated," + oldconsultation.doctor_id.fullname + "into" + consultation.doctor_id.fullname + "\n";
    }

    if(consultation.servicefee != oldconsultation.servicefee){
        updates = updates + "Service fee has been updated," + oldconsultation.servicefee + "into" + consultation.servicefee + "\n";
    }

    if(consultation.doctorfee != oldconsultation.doctorfee){
        updates = updates + "Doctor fee has been updated," + oldconsultation.doctorfee + "into" + consultation.doctorfee + "\n";
    }

    if(consultation.totalfee != oldconsultation.totalfee){
        updates = updates + "Total fee has been updated," + oldconsultation.totalfee + "into" + consultation.totalfee + "\n";
    }

    
    return updates;
}

//function for consultation update button
const buttonConsultationUpdate = ()=>{
    console.log("Update");
    console.log(consultation);
    console.log(oldconsultation);

    //check errors
    const errors = checkConsulFormError();
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

            $.ajax("/consultation" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(consultation),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#consultationAddModal').modal('hide');
                refreshConsultationTable();
                formConsultation.reset();
                refreshConsultationForm();

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
    consultationFormRefill();

}

//function for delete consultation record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableConsultation.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following consultation record? \n'
            + '\n Owner is ' + ob.owner_id.name
            + '\n Pet is ' + ob.pet_id.name
            + '\n Date is ' + ob.dateofconsultation
            + '\n Total amount is ' + ob.totalfee
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/consultation" , {
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
                refreshConsultationTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }else {
            row.classList.remove('table-danger')
        }
        /*  else {
             refreshConsultationTable();
             } */
             refreshConsultationTable();

    }, 500);

}


//function for print appointment record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshConsultationTable();

}


//create function for check error
const checkConsulFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (consultation.owner_id==null) {
        errors = errors +"Please select an owner..\n";
        selectOwner.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.mobile==null) {
        errors = errors +"Please enter a mobile no..\n";
        textMobile.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.pet_id==null) {
        errors = errors +"Please select a pet..\n";
        selectPet.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.dateofconsultation==null) {
        errors = errors +"Please choose a date..\n";
        dateOfConsultation.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.service_id==null) {
        errors = errors +"Please select a service..\n";
        selectService.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.doctor_id==null) {
        errors = errors +"Please select a doctor..\n";
        selectDoctor.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.servicefee==null) {
        errors = errors +"Please enter a service fee..\n";
        textServiceFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (consultation.doctorfee==null) {
        errors = errors +"Please enter a doctor fee..\n";
        textDoctorFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    //if (consultation.totalfee==null) {
        //errors = errors +"Please enter the total amount..\n";
        //textTotalFee.style.background = 'rgba(255,0,0,0,1)';
        
    //}
    return errors;

}

//create function for submit a consultation record
const buttonFormSubmit = ()=>{
    console.log('add consultation',consultation);
    console.log(window['consultation']);


    const formErrors = checkConsulFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following consultation record? \n'
                                    + '\n Owner is : ' + consultation.owner_id.name
                                    + '\n Pet is : ' + consultation.pet_id.name
                                    + '\n Date is : ' + consultation.dateofconsultation
                                    + '\n Total fee is : ' + consultation.totalfee);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/consultation", "POST", consultation);



                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshConsultationTable();
                    formConsultation.reset();
                    refreshConsultationForm();
                    $("#consultationAddModal").modal("hide");
                    
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
const refreshConsultationForm = () =>{


    consultation= new Object();
    oldconsultation =null;

    appointments = ajaxRequestHere("/appointment/showall");
    fillDataIntoSelect(selectAppNo,'Select Channeling No',appointments,'channelingno');

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select a Service',services,'name');

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');


   
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
    btnConsulUpdate.disabled = "disabled";
    //btnConsulUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnConsulUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnConsulAdd.disabled ="";
        $("#btnConsulAdd").css("cursor","pointer");
    } else {
        btnConsulAdd.disabled ="disabled";
        $("#btnConsulAdd").css("cursor","not-allowed");
    }

    
}

/*//define function to generate owner mobile automatically
const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}*/

//define function to generate service fee automatically
const generateServiceFee =()=>{
    console.log(JSON.parse(selectService.value));

    textServiceFee.value = JSON.parse(selectService.value).price;
    consultation.servicefee = parseFloat(textServiceFee.value);
    console.log("Doctor Fee",consultation.servicefee );
    textServiceFee.style.border = "4px solid green";
}

//define function to generate doctor fee automatically
const generateDoctorFee =()=>{
    console.log(JSON.parse(selectDoctor.value));
    textDoctorFee.value = JSON.parse(selectDoctor.value).doctorfee;
    consultation.doctorfee = parseFloat(textDoctorFee.value);
    console.log("Doctor Fee",consultation.doctorfee );
    textDoctorFee.style.border = "4px solid green";
}

//define function to generate total fee--> service fee + doctor fee
const generateTotalFee =()=>{
    console.log("Req sent");
    const totalfee = (consultation.servicefee  || 0) + (consultation.doctorfee || 0 );
    textTotalFee.value = totalfee;
    textTotalFee.style.border = "4px solid green";
    console.log(`Total Fee: ${totalfee}`);
}

//define function to generate owner name automatically
const generateOwnerName =()=>{
    console.log(JSON.parse(selectAppNo.value));

    selectOwner.value = JSON.parse(selectAppNo.value).owner_id.name;
    consultation.owner_id = selectOwner.value;
    selectOwner.style.border = "4px solid green";
}

/*//define function to generate doctor automatically
const generateDoctor =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}

//define function to generate pet automatically
const generatePet =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}

//define function to generate date of consultation automatically
const generateDateofconsultation =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    consultation.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}*/



