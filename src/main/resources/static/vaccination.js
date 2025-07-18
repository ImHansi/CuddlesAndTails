window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/vaccinationrecord");

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

    vaccinationrecords.forEach((element, index) => {
    if (element.recordstatus_id.name === "Delete") {
        const row = tableVaccinationRecord.children[1].children[index];
        const deleteButton = row.querySelector('.btn-danger');
        const editButton = row.querySelector('.btn-success');

        if (deleteButton) deleteButton.disabled = true;
        if (editButton) editButton.disabled = true;
    }
    });

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
    return ob.vaccine_id.name;
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

    vaccinations = ajaxRequestHere("/vaccine/showall");
    fillDataIntoSelectNew(selectVaccination, 'Select Vaccine',vaccinations,'name','duration',vaccinationrecord.vaccine_id.name);

    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name',vaccinationrecord.paymentmethod_id.name);
    


    //set value into UI element
    //elementId.value = object.property
    textMobile.value= vaccinationrecord.mobile;
    dateOfVaccination.value= vaccinationrecord.dateofvaccination;
    dateOfNextVaccination.value = vaccinationrecord.dateofnextvaccination;
    textTotalFee.value = vaccinationrecord.totalamount;
    textPaidFee.value = vaccinationrecord.paidamount;
    textBalanceFee.value = vaccinationrecord.balanceamount;

    selectOwner.disabled = true;
    selectPet.disabled = true;
    selectDoctor.disabled = true;
    selectVaccination.disabled = true;
    selectMethod.disabled = true;
    textMobile.disabled = true;
    dateOfVaccination.disabled = true;
    dateOfNextVaccination.disabled = true;
    textTotalFee.disabled = true;
    textPaidFee.disabled = true;
    textBalanceFee.disabled = true;

    

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

    if(vaccinationrecord.vaccine_id.name != oldvaccinationrecord.vaccine_id.name){
        updates = updates + "vaccine has been updated," + oldvaccinationrecord.vaccine_id.name + "into" + vaccinationrecord.vaccine_id.name + "\n";
    }

    if(vaccinationrecord.dateofvaccination != oldvaccinationrecord.dateofvaccination){
        updates = updates + "Date of vaccination has been updated," + oldvaccinationrecord.dateofvaccination + "into" + vaccinationrecord.dateofvaccination + "\n";
    }

    if(vaccinationrecord.dateofnextvaccination != oldvaccinationrecord.dateofnextvaccination){
        updates = updates + "Date of next vaccination has been updated," + oldvaccinationrecord.dateofnextvaccination + "into" + vaccinationrecord.dateofnextvaccination + "\n";
    }

    if(vaccinationrecord.doctor_id.fullname != oldvaccinationrecord.doctor_id.fullname){
        updates = updates + "Doctor has been updated," + oldvaccinationrecord.doctor_id.fullname + "into" + vaccinationrecord.doctor_id.fullname + "\n";
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
            + '\n Vaccine is ' + ob.vaccine_id.name
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
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
                refreshVaccinationTable();
            } else {
                alert('Delete Successfully...!!');
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

    //open view modal
    $('#vaccinationViewModal').modal('show');

    viewVaccinationRecordNo.innerHTML = ob.vaccino;
    viewOwner.innerHTML = ob.owner_id.name;
    viewPet.innerHTML = ob.pet_id.name;
    viewVaccinationName.innerHTML = ob.vaccine_id.name;
    viewVaccinationDate.innerHTML = ob.dateofvaccination;
    viewNextVaccinationDate.innerHTML = ob.dateofnextvaccination;
    viewDoctor.innerHTML = ob.doctor_id.fullname;
    viewAddedDate.innerHTML = ob.addeddatetime.split("T")[0] + " " + ob.addeddatetime.split("T")[1];
    viewTotal.innerHTML = ob.totalamount;
    viewPaid.innerHTML = ob.paidamount;
    viewBalance.innerHTML = ob.balanceamount;

}

//function for print
const btnPrintRow = () => {
    console.log("print");

    // Get the table and its surrounding content from the modal
    const printContent = document.querySelector("#vaccinationViewModal .modal-body").innerHTML;

    // Open new window
    let newWindow = window.open("", "_blank");

    // Write the full document with Bootstrap styles
    newWindow.document.write(`
        <html>
        <head>
            <title>Vaccination Details</title>
            <link rel='stylesheet' href='/resources/bootstrap-5.2.3/bootstrap-5.2.3/css/bootstrap.min.css'></link>
            <style>
                body {
                    padding: 20px;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                    /* Hide buttons and footer in print */
                @media print {
                    .btn, .modal-footer {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <h2>Vaccination Details</h2>
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
    if (vaccinationrecord.vaccine_id== null) {
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
    if (vaccinationrecord.paymentmethod_id==null) {
        errors = errors +"Please enter a payment method..\n";
        selectMethod.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.totalamount== null) {
        errors = errors +"Please Enter the total amount..\n";
        textTotalFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.paidamount==null) {
        errors = errors +"Please enter a paid amount..\n";
        textPaidFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccinationrecord.balanceamount==null) {
        errors = errors +"Please calculate the balance\n";
        textBalanceFee.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function to submit a vaccination record
const buttonFormSubmit = ()=>{
    console.log('add vaccination record',vaccinationrecord);
    console.log(window['vaccinationrecord']);

    const paid = parseFloat(textPaidFee.value);
    const total = parseFloat(textTotalFee.value);

    if (isNaN(paid) || isNaN(total) || paid < total) {
        Swal.fire({
            title: "Error",
            html: "Have to pay the full Amount!",
            icon: "error"
        });
        textPaidFee.value = "";
        textBalanceFee.value = "";
        return;
    }


    const formErrors = checkVaccReFormError();

    // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Vaccination Record? <br>'
                + '<br> Owner is : ' + vaccinationrecord.owner_id.name
                + '<br> Pet is : ' + vaccinationrecord.pet_id.name
                + '<br> Vaccine is : ' + vaccinationrecord.vaccine_id.name
                + '<br> Date of vaccination is : ' + vaccinationrecord.dateofvaccination,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServiceResponse= ajaxRequestBody("/vaccinationrecord", "POST", vaccinationrecord);

                // Check post service response
                if (postServiceResponse === "OK") {
                    Swal.fire({
                        title: 'Success',
                        html: 'Saved successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit the Vaccination Record \n' + postServiceResponse,
                        icon: 'error'
                    });
                }
                refreshVaccinationTable();
                formVaccination.reset();
                refreshVaccinationForm();
                $("#vaccinationAddModal").modal("hide");
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
const refreshVaccinationForm = () =>{


    vaccinationrecord= new Object();
    oldvaccinationrecord =null;

    owners = ajaxRequestHere("/owner/showOwner");
    //fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');
    fillDataIntoDataListTwo(ownerList,owners,'name','nic');
    
    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

    doctors = ajaxRequestHere("/doctor/availableDoctorsToday");
    doctor = ajaxRequestHere("/doctor/showloggeddoctor");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname');

    selectDoctor.style.border='1px solid #ced4da';
    if(doctor != null){
        selectDoctor.value = JSON.stringify(doctor);
        vaccinationrecord.doctor_id = doctor;
        selectDoctor.style.border="4px solid green";
        selectDoctor.disabled = true;
    }

    vaccinations = ajaxRequestHere("/vaccine/showall");
    fillDataIntoSelectNew(selectVaccination, 'Select Vaccine',vaccinations,'name','duration');

    paymentmethods = ajaxRequestHere("/paymentmethod/showspaymentmethod");
    fillDataIntoSelect(selectMethod,'Select Method',paymentmethods,'name');
    


    //set text field value as a empty
    textOwnerName.style.border ='1px solid #ced4da';
    textMobile.style.border ='1px solid #ced4da';
    selectPet.style.border ='1px solid #ced4da';
    selectVaccination.style.border='1px solid #ced4da';
    dateOfNextVaccination.style.border='1px solid #ced4da';
    textTotalFee.style.border='1px solid #ced4da';
    selectMethod.style.border='1px solid #ced4da';
    textPaidFee.style.border='1px solid #ced4da';
    textBalanceFee.style.border='1px solid #ced4da';
    
    //Set today's date for dateOfVaccination
    dateOfVaccination.value = new Date().toISOString().split('T')[0];
    vaccinationrecord.dateofvaccination = dateOfVaccination.value;
    dateOfVaccination.style.border = "4px solid green";
    dateOfVaccination.disabled= true;
    dateOfNextVaccination.disabled= true;
    textTotalFee.disabled= true;

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

    textTotalFee.value = JSON.parse(selectVaccination.value).salesprice;
    vaccinationrecord.totalamount = textTotalFee.value;
    textTotalFee.style.border = "4px solid green";
}

//define function to filter pets according to owner
const filterPets=()=>{

   const selectOwner = document.getElementById("selectOwner");
    const selectPet = document.getElementById("selectPet");

    //check if the owner is selected
    if (selectOwner.value) {
    selectPet.disabled = false;

    const ownerId = JSON.parse(selectOwner.value).id;
    const petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid="+ ownerId);
    fillDataIntoSelect(selectPet,'Select Pet',petByOwner,'name');

    }else {
        //Disable the pet dropdown
        selectPet.disabled = true; 
        selectPet.innerHTML = '<option value="" selected disabled>Select Pet</option>';
  }
}

// Define function to get the day after the given weeks from the date of vaccination
function calculateNextVaccinationDate() {
    const vaccineSelect = document.getElementById("selectVaccination");
    const nextDateInput = document.getElementById("dateOfNextVaccination");

    if (vaccineSelect.value) {
        const selectedVaccine = JSON.parse(vaccineSelect.value);
        const weeks = parseInt(selectedVaccine.duration); // duration in weeks

        const today = new Date();
        today.setDate(today.getDate() + weeks * 7); // add weeks in days

        const formattedDate = today.toISOString().split('T')[0];
        nextDateInput.value = formattedDate;
        //nextDateInput.style.border = "4px solid green";
        vaccinationrecord.dateofnextvaccination = nextDateInput.value;
        dateOfNextVaccination.style.border = "4px solid green";
    } else {
        nextDateInput.value = "";
        nextDateInput.style.border = "1px solid #ccc";
    }
}

//define function to generate the balance paid amount - total amount
const generateBalance =()=>{
    vaccinationrecord.paidamount = parseFloat(textPaidFee.value);
    console.log("PAID", vaccinationrecord.paidamount)
    const balance = parseFloat(vaccinationrecord.paidamount || 0) - parseFloat(vaccinationrecord.totalamount ?? 0);
    textBalanceFee.value = balance;
    textBalanceFee.style.border = "4px solid green";
    vaccinationrecord.balanceamount = balance;
    console.log(`Balance : ${balance}`);
    
}

//validater to check the paid amount
const generateValidAmount = () => {
    if (new RegExp(/^[1-9][0-9]{0,6}([.][0-9]{2})?$/).test(textPaidFee.value) && parseFloat(textPaidFee.value) >= parseFloat(textTotalFee.value)) {
        textPaidFee.style.border = "4px solid green";
        vaccinationrecord.paidamount = textPaidFee.value;
    } else {
        textPaidFee.style.border = "4px solid red";
        textBalanceFee.style.border = "3px solid red";
        
    }
} 


function handlePaymentMethodChange(selectElement) {
  const selectedText = selectElement.options[selectElement.selectedIndex].text.trim().toLowerCase();
  const referenceField = document.getElementById("referenceField");

  if (selectedText === "card") {
    referenceField.style.display = "block";
    textPaidFee.disabled = true;
    textPaidFee.value = textTotalFee.value;
    vaccinationrecord.paidamount = parseFloat(textTotalFee.value);
    textBalanceFee.value = "0";
    vaccinationrecord.balanceamount = 0;
  } else {
    referenceField.style.display = "none";
    textPaidFee.disabled = false;
  }
}

const dataListValidator = (element, objectName, property) => {
    const elementValue = element.value;

    // Try to match the owner by name from the global owners array
    //const matchedOwner = owners.find(obj => obj.name === elementValue);
    const matchedOwner = owners.find(owner => `${owner.name} - ${owner.nic}` === elementValue);

    if (matchedOwner) {
        element.style.border = "4px solid green";

        //Set owner object
        //window[objectName][property] = { id: matchedOwner.id };
        window[objectName][property] = matchedOwner;

        //owner's mobile number
        const textMobile = document.getElementById("textMobile");
        textMobile.value = matchedOwner.mobile;
        textMobile.style.border = "4px solid green";
        vaccinationrecord.mobile = textMobile.value;

        //Filter pets by owner ID and populate the select
        const selectPet = document.getElementById("selectPet");
        const petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid=" + matchedOwner.id);

        //Fill the dropdown
        selectPet.innerHTML = '<option value="" disabled selected>Select Pet</option>';
        petByOwner.forEach(pet => {
            const option = document.createElement("option");
            option.text = pet.name;
            //option.value = JSON.stringify({ id: pet.id });
            option.value = JSON.stringify(pet);
            selectPet.appendChild(option);
        });

        selectPet.disabled = false;

    } else {
        //Invalid input
        element.style.border = "4px solid red";
        window[objectName][property] = null;

        //Clear mobile and pets
        document.getElementById("textMobile").value = "";
        document.getElementById("textMobile").style.border = "";
        const selectPet = document.getElementById("selectPet");
        selectPet.disabled = true;
        selectPet.innerHTML = '<option value="" disabled selected>Select Pet</option>';

        alert("Invalid selection. Please choose a valid option from the list.");
    }
};
