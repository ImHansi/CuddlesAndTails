window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/Doctor");

    //refreshAvailabilityTable(); //call table refresh function

    
    refreshDoctorAvailabilityTable();
    refreshAvailabilityForm();//call form refresh function

    //inner form and table
    refreshAvailabilityTable();
    refreshInnerAvailabilityForm();

});

//create function refresh doctor availability table
const refreshDoctorAvailabilityTable = () => {

    //create array to store doctor availability data list
    doctoravailability = [];
    doctoravailabilitys =ajaxRequestHere("/doctoravailability/showall");

    $.ajax("/doctoravailability/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            doctoravailabilitys = data;
            //doctors = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            doctoravailability =[];
        }
    });



    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getdoctor},
                              {dataType:'text',propertyName:'month'},
                              {dataType:'text',propertyName:'startdate'},
                              {dataType:'text',propertyName:'enddate'},
                              
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableDoctorAvailability, doctoravailabilitys,displayproperty,doctorAFormRefill,deleteDAFunc,printAFunc,true, userPrivilege);


   $('#tableDoctorAvailability').dataTable();


}

const getdoctor = (ob)=>{
    return ob.doctor_id.fullname;
}

const checkAVFormError = () => {
    let errors = "";

    if (doctoravailability.month == null) {
        errors = errors + "Please Enter a Month \n";
        selectDoctor.style.background = 'rgba(255,0,0,0.1)';
    }
    if (doctoravailability.startdate == null) {
        errors = errors + "Please Enter Start Date \n";
        selectMonth.style.background = 'rgba(255,0,0,0.1)';
    }
    if (doctoravailability.doctor_id == null) {
        errors = errors + "Please Select a Doctor \n";
        endDate.style.background = 'rgba(255,0,0,0.1)';
    }
    return errors;
}

//create function for submit to doc availability
const buttonAVSubmit = ()=>{
    
    console.log("submit");


    const formErrors = checkAVFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following doctor availability? \n'
                                    + '\n doctor Name is : ' + doctoravailability.doctor_id.fullname
                                    + '\n Start Date is : ' + doctoravailability.startdate);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/doctoravailability", "POST", doctoravailability);


                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    //refreshAvailabilityTable();
                    formAvailabilityDoctor.reset();
                    refreshAvailabilityForm();
                    $("#availabilityAddModal").modal("hide");
                    
                } else {
                    alert('Save not completed..You have following errors \n' + postServiceResponse);
                }
            }
    
        
    } else {

        //form has errors
        alert("form has following errors..\n" + formErrors);
    }
 
}

//function for doctor form refill
const doctorAFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into doctoravailability object
    //used JSON.parse stringify to convert them into string and to identify the difference
    doctoravailability = JSON.parse(JSON.stringify(ob));
    olddoctoravailability =JSON.parse(JSON.stringify(ob));
    //open doctoravailability modal
    $('#availabilityAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    
    textMonth.value = doctor.licenseno;
    startDate.value = doctor.nic;
    endDate.value = doctor.nic;
    
    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctor,'fullname',ob.doctor_id.fullname);
    
   
    
   
    if (userPrivilege.update) {
        btnUpdateAVDoctor.disabled = "";
        $("#btnUpdateAVDoctor").css("cursor","pointer");
    } else {
        btnUpdateAVDoctor.disabled = "disabled";
        $("#btnUpdateAVDoctor").css("cursor","not-allowed");
    }
    //update button
    btnUpdateAVDoctor.disabled = "";
    //btnUpdateAVDoctor.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateAVDoctor").css("cursor","pointer");

    //add button
    btnAddAVDoctor.disabled="disabled";
    $("#btnAddAVDoctor").css("cursor","not-allowed");

    //refreshInnerFormandTable();

}

//create function for check form update
const checkAVFormUpdate=()=>{
    let updates = "";
    if(doctoravailability.doctor_id.fullname != olddoctoravailability.doctor_id.fullname){
        updates = updates + "fullname has updated," + olddoctoravailability.doctor_id.fullname + " into " + doctoravailability.doctor_id.fullname + "\n";
    }
    if(doctoravailability.month != olddoctoravailability.month){
        updates = updates + "month has updated," + olddoctoravailability.month + " into " + doctoravailability.month + "\n";
    }
    if(doctoravailability.startdate != olddoctoravailability.startdate){
        updates = updates + "startdate has updated," + olddoctoravailability.startdate + " into " + doctoravailability.startdate + "\n";
    }
    if(doctoravailability.enddate != olddoctoravailability.enddate){
        updates = updates + "enddate has updated," + olddoctoravailability.enddate + " into " + doctoravailability.enddate + "\n";
    }

    return updates;
}

//function for doctor availability update button
const buttonADoctorUpdate = ()=>{
    console.log("Update");
    console.log(doctoravailability);
    console.log(olddoctoravailability);


    //check errors
    const errors = checkAVFormError();
    if(errors == ""){
        
    //check available update
    let updates = checkAVFormUpdate();
    if(updates ==""){
        alert("Nothing Updated");
    }else{

        //get user confirmation
        let userConfirm = confirm("Are you sure to do the following changes..? \n" + updates);

        if(userConfirm){
                //call put service
            let putServiceresponce;

            $.ajax("/doctoravailability" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(doctoravailability),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#availabilityAddModal').modal('hide');
                //refreshAvailabilityTable();
                formAvailabilityDoctor.reset();
                refreshAvailabilityForm();

            }else{
                alert("failed to update following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}

//function for delete doctor record
const deleteDAFunc =(ob,rowIndex)=>{
    // tableDoctor.children[1].children[rowIndex].style.backgroundColor = 'red'
    const row = tableDoctorAvailability.children[1].children[rowIndex];
    row.classList.add('table-danger');
    
    console.log(ob)

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following Doctor Availability? \n'
            + '\n Name is ' + ob.doctor_id.fullname
           
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/doctoravailability" , {
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
                refreshAvailabilityTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }
        
        /* else {
            row.classList.remove('table-danger')
        }
         else {
             refreshAvailabilityTable();
             } */
             refreshAvailabilityTable();

    }, 500);

}

//create function for form refresh 
const refreshAvailabilityForm = () =>{


    doctoravailability= new Object();
    olddoctoravailability =null;

    doctoravailability.doctorhasavailabilityList = new Array();

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select Doctor',doctors,'fullname');


    
    //set text field value as a empty
    
    selectDoctor.style.border='1px solid #ced4da';
    textMonth.style.border='1px solid #ced4da';
    startDate.style.border='1px solid #ced4da';
    endDate.style.border='1px solid #ced4da';
    



    //update button
    btnUpdateAVDoctor.disabled = "disabled";
    //btnUpdateAVDoctor.style.cursor ="not-allowed";
    //jquery
    $("#btnUpdateAVDoctor").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAddAVDoctor.disabled ="";
        $("#btnAddAVDoctor").css("cursor","pointer");
    } else {
        btnAddAVDoctor.disabled ="disabled";
        $("#btnAddAVDoctor").css("cursor","not-allowed");
    }

    
    //refreshInnerFormandTable();


}

const printAFunc = ()=>{

}

// Define function to get the 7th day from a given date
const getSeventhDay = () => {
    // Parse the input date
    const inputDate = document.getElementById('startDate').value;
    const date = new Date(inputDate);

    // Add 7 days to the date
    date.setDate(date.getDate() + 7);

    // Format the date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    document.getElementById('endDate').value = formattedDate;
    document.getElementById('endDate').style.border = "4px solid green";

    console.log(formattedDate);
};

// Function to validate the selected date
const validateSelectedDate = () => {
    console.log("Called")
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const selectedDate = new Date(document.getElementById('availableDate').value);

    // Check if the selected date is within the start and end dates (inclusive)
    if (selectedDate >= startDate && selectedDate <= endDate) {
        document.getElementById('availableDate').style.border = "4px solid green";
        console.log("Valid date selected.");
    } else {
        document.getElementById('availableDate').style.border = "4px solid red";
        alert("Please select a date within the start and end dates.");
    }
};


//Doctor availability inner form starts here

const refreshInnerFormAndTable = ()=>{
    doctorhasavailability = {};

    //refresh innertable
    const displayPropertyList = [
        { dataType: "text", propertyName:"date"},
        { dataType: "text", propertyName: "strat_time" },
        { dataType: "text", propertyName: "end_time" },
    ];

    fillDataIntoTableWithDelete(tableInner,doctoravailability.doctorhasavailabilityList,displayPropertyList, deleteInnerForm);
    $("#InnerTable").dataTable();

   
    availableDate.value ="";
    startTime.value = "";
    endTime.value ="";

    availableDate.style.border='1px solid #ced4da';
    startTime.style.border='1px solid #ced4da';
    endTime.style.border='1px solid #ced4da';


}

const deleteInnerForm =(innerOb)=>{

}

//inner form submit
 const innerSubmit = () => {
    console.log("submit");

    let selectDate = availableDate.value;
    let extDate = false;

    for(const doclist of doctoravailability.doctorhasavailabilityList){
        if(selectDate.value == doclist.date){
            extDate = true;
            break;
        }
    }
    if(extDate){
        alert("selected date already exists!");
        doctorhasavailability = {};
        availableDate.value ="";
        startTime.value = "";
        endTime.value ="";
        availableDate.style.border='1px solid #ced4da';
        startTime.style.border='1px solid #ced4da';
        endTime.style.border='1px solid #ced4da';

    } else {

        let errors = checkInnerFormError();
        if(errors == ""){
            let userConfirm = confirm("Are you sure to Submit these doctor availability dates ?" );
            if (userConfirm){
                alert("Doctor Availability Added Successfully!");
                doctoravailability.doctorhasavailabilityList.push(doctorhasavailability);
                refreshInnerFormAndTable();
            }
        } else{
            alert("Inner Form Has Following Errors \n"+ errros)
        }
    }
        
    
}