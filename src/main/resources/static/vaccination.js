window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/vaccination");

    refreshVaccinationTable(); //call table refresh function

    refreshVaccinationForm();//call form refresh function


    
});

//create function refresh vaccination table
const refreshVaccinationTable = () => {

    //create array to store vaccination data list
    vaccinationrecord = [];
    vaccinationrecords =ajaxRequestHere("/vaccinationrecord/showall");

    $.ajax("/vaccinationrecord/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            vaccinationrecords = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            vaccinationrecord =[];
        }
    });



    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'vaccino'},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getVaccine},
                              {dataType:'text',propertyName:'dateofvaccination'},
                              {dataType:'text',propertyName:'dateofnextvaccination'},
                              {dataType:'function',propertyName:getDoctor},
                              
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableVaccinationRecord, vaccinationrecords,displayproperty,vaccinationFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*employees.forEach((element , index) => {
        if (element.employeestatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableVaccinationRecord').dataTable();


}

//create function to get pets
const getPetName=(ob)=>{
    return ob.pet_id.name;
}
//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;
}
//create function to get vaccines
const getVaccine=(ob)=>{
    return ob.vaccination_id.name;
}
//create function to get doctors
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



//function for vaccination form refill
const vaccinationFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into vaccinationrecord object
    //used JSON.parse stringify to convert them into string and to identify the difference
    vaccinationrecord = JSON.parse(JSON.stringify(ob));
    oldvaccinationrecord =JSON.parse(JSON.stringify(ob));

    //open vaccinationrecord modal
    $('#vaccinationAddModal').modal('show');

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',vaccinationrecord.owner_id.name);
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name',vaccinationrecord.pet_id.name);

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname',vaccinationrecord.doctor_id.fullname);

    vaccinations = ajaxRequestHere("/vaccination/showVaccination");
    fillDataIntoSelect(selectVaccination, 'Select Vaccine',vaccinations,'name',vaccinationrecord.vaccination_id.name);

    //set value into UI element
    //elementId.value = object.property
    textMobile.value= vaccinationrecord.mobile;
    dateOfVaccination.value= vaccinationrecord.dateofvaccination;
    dateOfNextVaccination.value = vaccinationrecord.dateofnextvaccination;
    textTotalFee.value = vaccinationrecord.totalamount;

    

    if (userPrivilege.update) {
        btnVaccineUpdate.disabled = "";
        $("#btnVaccineUpdate").css("cursor","pointer");
    } else {
        btnVaccineUpdate.disabled = "disabled";
        $("#btnVaccineUpdate").css("cursor","not-allowed");
    }
    //update button
    btnVaccineUpdate.disabled = "";
    //btnVaccineUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnVaccineUpdate").css("cursor","pointer");

    //add button
    btnVaccineAdd.disabled="disabled";
    $("#btnVaccineAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(vaccinationrecord.owner_id.name != oldvaccinationrecord.owner_id.name){
        updates = updates + "owner has been updated," + oldvaccinationrecord.owner_id.name + "into" + vaccinationrecord.owner_id.name + "\n";
    }

    if(vaccinationrecord.mobile != oldvaccinationrecord.mobile){
        updates = updates + "owners mobile has been updated," + oldvaccinationrecord.mobile + "into" + vaccinationrecord.mobile + "\n";
    }

    if(vaccinationrecord.pet_id.name != oldvaccinationrecord.pet_id.name){
        updates = updates + "pet has been updated," + oldvaccinationrecord.pet_id.name + "into" + vaccinationrecord.pet_id.name + "\n";
    }

    if(vaccinationrecord.vaccination_id.name != oldvaccinationrecord.vaccination_id.name){
        updates = updates + "vaccine has been updated," + oldvaccinationrecord.vaccination_id.name + "into" + vaccinationrecord.vaccination_id.name + "\n";
    }

    if(vaccinationrecord.dateofvaccination != oldvaccinationrecord.dateofvaccination){
        updates = updates + "Date of vaccination has been updated," + oldvaccinationrecord.dateofvaccination + "into" + vaccinationrecord.dateofvaccination + "\n";
    }

    if(vaccinationrecord.dateofnextvaccination != oldvaccinationrecord.dateofnextvaccination){
        updates = updates + "Date of next vaccination has been updated," + oldvaccinationrecord.dateofnextvaccination + "into" + vaccinationrecord.dateofnextvaccination + "\n";
    }

    if(vaccinationrecord.doctor_id.name != oldvaccinationrecord.doctor_id.name){
        updates = updates + "Doctor has been updated," + oldvaccinationrecord.doctor_id.name + "into" + vaccinationrecord.doctor_id.name + "\n";
    }

    if(vaccinationrecord.totalamount != oldvaccinationrecord.totalamount){
        updates = updates + "Totalamount has been updated," + oldvaccinationrecord.totalamount + "into" + vaccinationrecord.totalamount + "\n";
    }

    return updates;
}

//function for vaccination record update button
const buttonVaccinationRUpdate = ()=>{
    console.log("Update");
    console.log(vaccinationrecord);
    console.log(oldvaccinationrecord);

    //check errors
    const errors = checkVaccReFormError();
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

            $.ajax("/vaccinationrecord" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(vaccinationrecord),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#vaccinationAddModal').modal('hide');
                refreshVaccinationTable();
                formVaccination.reset();
                refreshVaccinationForm();

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
    vaccinationFormRefill();

}

//function for delete vaccination record
const deleteFunc =(ob,rowIndex)=>{
    //tableEmployee.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tableVaccinationRecord.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following Vaccination Record? \n'
            + '\n Pet is ' + ob.pet_id.name
            + '\n Owner is ' + ob.owner_id.name
            + '\n Vaccine is ' + ob.vaccination_id.name
            + '\n Date of vaccination is ' + ob.dateofvaccination
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/vaccinationrecord" , {
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
                refreshVaccinationTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }else{
            row.classList.remove('table-danger')
        }
        /*  else {
             refreshVaccinationTable();
             } */
             refreshVaccinationTable();

    }, 500);

}


//function for print vaccination record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshVaccinationTable();

}


//create function for check error
const checkVaccReFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (vaccinationrecord.owner_id==null) {
        errors = errors +"Please select an owner..\n";
        selectOwner.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.mobile == null) {
        errors = errors +"Please Enter a mobile no..\n";
        textMobile.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.pet_id == null) {
        errors = errors +"Please select a pet..\n";
        selectPet.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.vaccination_id== null) {
        errors = errors +"Please Select a vaccine..\n";
        selectVaccination.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.dateofvaccination == null) {
        errors = errors +"Please choose a date..\n";
        dateOfVaccination.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    if (vaccinationrecord.doctor_id == null) {
        errors = errors +"Please select a doctor..\n";
        selectDoctor.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.totalamount== null) {
        errors = errors +"Please Enter the total amount..\n";
        textTotalFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function to submit a vaccination record
const buttonFormSubmit = ()=>{
    console.log('add vaccination record',vaccinationrecord);
    console.log(window['vaccinationrecord']);


    const formErrors = checkVaccReFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following vaccination record? \n'
                                    + '\n Owner is : ' + vaccinationrecord.owner_id.name
                                    + '\n Pet is : ' + vaccinationrecord.pet_id.name
                                    + '\n Vaccine is : ' + vaccinationrecord.vaccination_id.name
                                    + '\n Date of vaccination is : ' + vaccinationrecord.dateofvaccination);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse= ajaxRequestBody("/vaccinationrecord", "POST", vaccinationrecord);


                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshVaccinationTable();
                    formVaccination.reset();
                    refreshVaccinationForm();
                    $("#vaccinationAddModal").modal("hide");
                    
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
const refreshVaccinationForm = () =>{


    vaccinationrecord= new Object();
    oldvaccinationrecord =null;

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname');

    vaccinations = ajaxRequestHere("/vaccination/showVaccination");
    fillDataIntoSelect(selectVaccination, 'Select Vaccine',vaccinations,'name');


    //set text field value as a empty
    selectOwner.style.border ='1px solid #ced4da';
    textMobile.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    selectVaccination.style.border='1px solid #ced4da';
    dateOfVaccination.style.border='1px solid #ced4da';
    dateOfNextVaccination.style.border='1px solid #ced4da';
    selectDoctor.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';
    
    //set default color
    //textFullName.removeAttribute('style');



    //update button
    btnVaccineUpdate.disabled = "disabled";
    //btnVaccineUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnVaccineUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnVaccineAdd.disabled ="";
        $("#btnVaccineAdd").css("cursor","pointer");
    } else {
        btnVaccineAdd.disabled ="disabled";
        $("#btnVaccineAdd").css("cursor","not-allowed");
    }

}

//define function to generate owner mobile automatically
const generateOwnerMobile =()=>{
    console.log(JSON.parse(selectOwner.value));

    textMobile.value = JSON.parse(selectOwner.value).mobile;
    vaccinationrecord.mobile = textMobile.value;
    textMobile.style.border = "4px solid green";
}
//define function to generate vaccine price automatically
const generateVaccinePrice =()=>{
    console.log(JSON.parse(selectVaccination.value));

    textTotalFee.value = JSON.parse(selectVaccination.value).price;
    vaccinationrecord.totalamount = textTotalFee.value;
    textTotalFee.style.border = "4px solid green";
}

//define function to filter pets according to owner
const filterPets=()=>{

    petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid="+JSON.parse(selectOwner.value).id);
    fillDataIntoSelect(selectPet,'Select Pet',petByOwner,'name');

}

// Define function to get the day after 6 months from the date of vaccination
const getDayAfterSixMonths = () => {
    
    const inputDate = document.getElementById('dateOfVaccination').value;
    const date = new Date(inputDate);

    //const MDuration = JSON.parseInt(selectVaccination.value).duration;

    //Add 6 months to the date
    date.setMonth(date.getMonth() + 6);

    //Format the date 
    const formattedDate = date.toISOString().split('T')[0];
    document.getElementById('dateOfNextVaccination').value = formattedDate;
    document.getElementById('dateOfNextVaccination').style.border = "4px solid green";

    console.log(formattedDate);
};



