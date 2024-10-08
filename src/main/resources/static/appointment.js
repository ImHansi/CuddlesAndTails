window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/appointment");

    refreshAppointmentTable(); //call table refresh function

    refreshAppointmentForm();//call form refresh function

});

//create function refresh appointment table
const refreshAppointmentTable = () => {

    //create array to store appointment data list
    appointment = [];
    appointments =ajaxRequestHere("/appointment/showall");

    $.ajax("/appointment/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            appointments = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            appointment =[];
        }
    });

   


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'channelingno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'text',propertyName:'mobile'},
                              {dataType:'function',propertyName:getDoctor},
                              {dataType:'text',propertyName:'dateofappointment'},
                              {dataType:'function',propertyName:getTime},
                              {dataType:'function',propertyName:getAppointmentStatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableAppointment, appointments,displayproperty,appointmentFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*appointments.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableAppointment.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableAppointment').dataTable();


}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}

//create function to get pets
const getPetName=(ob)=>{
    return ob.pet_id.name;

}

//create functon to get doctors
const getDoctor=(ob)=>{
    return ob.doctor_id.fullname;

}

//create function to get appointment time
const getTime=(ob)=>{
    return ob.appointmenttime_id.name;

}

//create function get record status 
const getAppointmentStatus=(ob)=>{
    
    if(ob.appointmentstatus_id.name == 'Complete'){

        return '<p class="status-Complete">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Pending'){

        return '<p class="status-Pending">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Deleted'){

        return '<p class="status-Deleted">'+ ob.appointmentstatus_id.name +'</p>'

    }

}


//function for appointment form refill
const appointmentFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into appointment object
    //used JSON.parse stringify to convert them into string and to identify the difference
    appointment = JSON.parse(JSON.stringify(ob));
    oldappointment =JSON.parse(JSON.stringify(ob));

    //open appointment modal
    $('#appointmentAddModal').modal('show');


    

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',appointment.owner_id.name);
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name',appointment.pet_id.name);

    doctors = ajaxRequestHere("/doctor/workingHouseDoctors");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname',appointment.doctor_id.fullname);

    appointmentTimes = ajaxRequestHere("/appointmenttime/showTime");
    fillDataIntoSelect(selectTime,'Select a Time',appointmentTimes,'name',appointment.appointmenttime_id.name);



    //set value into UI element
    //elementId.value = object.property
    dateOfAppointment.value= appointment.dateofappointment;
    textMobile.value=appointment.mobile;
    textAddress.value=appointment.address;
    textEmail.value=appointment.email;
    

    if (userPrivilege.update) {
        btnAppointmentUpdate.disabled = "";
        $("#btnAppointmentUpdate").css("cursor","pointer");
    } else {
        btnAppointmentUpdate.disabled = "disabled";
        $("#btnAppointmentUpdate").css("cursor","not-allowed");
    }
    //update button
    btnAppointmentUpdate.disabled = "";
    //btnAppointmentUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnAppointmentUpdate").css("cursor","pointer");

    //add button
    btnAppointmentAdd.disabled="disabled";
    $("#btnAppointmentAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(appointment.owner_id.name != oldappointment.owner_id.name){
        updates = updates + "Owner has been updated," + oldappointment.owner_id.name + "into" + appointment.owner_id.name +"\n";
    }

    if(appointment.doctor_id.name != oldappointment.doctor_id.name){
        updates = updates + "Doctor has been updated," + oldappointment.doctor_id.name + "into" + appointment.doctor_id.name +"\n";
    }

    if(appointment.owner_id.mobile != oldappointment.owner_id.mobile){
        updates = updates + "Owners mobile has been updated," + oldappointment.owner_id.mobile + "into" + appointment.owner_id.mobile +"\n";
    }

    if(appointment.dateofappointment != oldappointment.dateofappointment){
        updates = updates + "Date of appointment has been updated," + oldappointment.dateofappointment + "into" + appointment.dateofappointment +"\n";
    }

    if(appointment.appointmenttime_id.name != oldappointment.appointmenttime_id.name){
        updates = updates + "Appointment time has been updated," + oldappointment.appointmenttime_id.name + "into" + appointment.appointmenttime_id.name +"\n";
    }

    if(appointment.owner_id.address != oldappointment.owner_id.address){
        updates = updates + "Owners Address has been updated," + oldappointment.owner_id.address + "into" + appointment.owner_id.address +"\n";
    }

    if(appointment.owner_id.email != oldappointment.owner_id.email){
        updates = updates + "Owners email has been updated," + oldappointment.owner_id.email + "into" + appointment.owner_id.email +"\n";
    }

    if(appointment.taxi_id.name != oldappointment.taxi_id.name){
        updates = updates + "Taxi has been updated," + oldappointment.taxi_id.name + "into" + appointment.taxi_id.name +"\n";
    }
    return updates;
}

//function for appointment update button
const buttonAppointmentUpdate = ()=>{
    console.log("Update");
    console.log(appointment);
    console.log(oldappointment);

    //check errors
    const errors = checkAppointmentFormError();
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

            $.ajax("/appointment" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(appointment),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#appointmentAddModal').modal('hide');
                refreshAppointmentTable();
                formAppointment.reset();
                refreshAppointmentForm();

            }else{
                alert("failed to update beacuse of following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}

const editFunc =(ob)=>{
    appointmentFormRefill();

}

//function for delete appointment record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';
    const row = tableAppointment.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following appointment? \n'
            + '\n Pet is ' + ob.pet_id.name
            + '\n Owner is ' + ob.owner_id.name
            + '\n Appointment date is ' + ob.dateofappointment
        );

        if (userConfirm) {


            //call delete service
            let deleteServerResponse;

            $.ajax("/appointment" , {
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
                refreshAppointmentTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        } 
        
        /* else {
            row.classList.remove('table-danger')
        }
          else {
             refreshAppointmentTable();
             } */
             refreshAppointmentTable();

    }, 500);

}


//function for print appointmnet record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshAppointmentTable();

}


//create function for check error
const checkAppointmentFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (appointment.owner_id== null) {
        errors = errors +"Please Enter a owner..\n";
        selectOwner.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (appointment.pet_id== null) {
        errors = errors +"Please Enter a pet..\n";
        selectPet.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (appointment.doctor_id== null) {
        errors = errors +"Please Enter a doctor..\n";
        selectDoctor.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (appointment.dateofappointment == null) {
        errors = errors +"Please Enter a valid date..\n";
        dateOfAppointment.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function for submit to add an appointment
const buttonFormSubmit = ()=>{
    console.log('add appointment',appointment);
    console.log(window['appointment']);

    

    const formErrors = checkAppointmentFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following appointment? \n'
                                    + '\n Owner Name is : ' + appointment.owner_id.name
                                    + '\n Pet is : ' + appointment.pet_id.name
                                    + '\n date is : ' + appointment.dateofappointment);


            if (userConfirm) {


                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/appointment", "POST", appointment);


                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshAppointmentTable();
                    formAppointment.reset();
                    refreshAppointmentForm();
                    $("#appointmentAddModal").modal("hide");
                    
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
const refreshAppointmentForm = () =>{


    appointment= new Object();
    oldappointment =null;

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    doctors = ajaxRequestHere("/doctor/workingHouseDoctors");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    appointmentTimes = ajaxRequestHere("/appointmenttime/showTime");
    fillDataIntoSelect(selectTime,'Select a time',appointmentTimes,'name');


    //set text field value as a empty
    selectOwner.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    textMobile.style.border ='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    dateOfAppointment.style.border='1px solid #ced4da';
    selectTime.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    textEmail.style.border='1px solid #ced4da';
    


    //set default color
    //textFullName.removeAttribute('style');



    //update button
    btnAppointmentUpdate.disabled = "disabled";
    //btnAppointmentUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnAppointmentUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAppointmentAdd.disabled ="";
        $("#btnAppointmentAdd").css("cursor","pointer");
    } else {
        btnAppointmentAdd.disabled ="disabled";
        $("#btnAppointmentAdd").css("cursor","not-allowed");
    }

    
   


}

//define function to generate owner mobile automatically
const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    appointment.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}
//define function to generate owner address automatically
const generateOwnerAddress =()=>{
    console.log(JSON.parse(selectOwner.value));

    textAddress.value = JSON.parse(selectOwner.value).address;
    appointment.address = textAddress.value;
    textAddress.style.border = "4px solid green";
}
//define function to generate owner email automatically
const generateOwnerEmail =()=>{
    console.log(JSON.parse(selectOwner.value));

    textEmail.value = JSON.parse(selectOwner.value).email;
    appointment.email = textEmail.value;
    textEmail.style.border = "4px solid green";
}


//define function to filter pets according to owner
const filterPets=()=>{

    petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid="+JSON.parse(selectOwner.value).id);
    fillDataIntoSelect(selectPet,'Select Pet',petByOwner,'name');

}


//define function to get a date within a week
function validateAppointmentDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();

    // Set the time to midnight for accurate date comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculate the date one week from today
    const oneWeekFromToday = new Date(today);
    oneWeekFromToday.setDate(today.getDate() + 7);

    if (selectedDate >= today && selectedDate <= oneWeekFromToday) {
        // The selected date is valid
        input.setCustomValidity(""); // Clear any previous error
    } else {
        // The selected date is invalid
        input.setCustomValidity("Please select a date that is today or within the first week from today.");
    }
}

// Attach the validation function to the input field
document.getElementById("dateOfAppointment").addEventListener("change", function() {
    validateAppointmentDate(this);
});


