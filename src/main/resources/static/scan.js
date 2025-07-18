window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/consultation");

    refreshScanForm();//call form refresh function


});

//create function for check error
const checkScanFormError =() =>{
//need to check all required fields(property)
    let errors ='';


    if (consultation.mobile==null) {
        errors = errors +"Please enter a mobile no..\n";
        textMobile.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    if (consultation.dateofconsultation==null) {
        errors = errors +"Please choose a date..\n";
        dateOfConsultation.style.background = 'rgba(255,0,0,0,1)';
        
    }
    /* if (consultation.service_id==null) {
        errors = errors +"Please select a service..\n";
        selectService.style.background = 'rgba(255,0,0,0,1)';
        
    } */
    
    return errors;

}

//create function for submit a consultation record
const buttonFormSubmit = ()=>{
    console.log('add consultation',consultation);
    console.log(window['consultation']);


    const formErrors = checkScanFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following consultation record? \n'
                                    + '\n Channeling No is : ' + consultation.channelingno
                                    + '\n Owner is : ' + consultation.owner_id.name
                                    + '\n Pet is : ' + consultation.pet_id.name
                                    + '\n Date is : ' + consultation.dateofconsultation);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/scan", "POST", consultation);

                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    formScan.reset();
                    refreshScanForm();
                    // Clear image preview
                    const imgPreview = document.getElementById('imagePreview');
                    if (imgPreview) {
                        imgPreview.src = '';
                        imgPreview.style.display = 'none';
                    }
        
                    // Clear PDF preview
                    const pdfPreview = document.getElementById('pdfPreview');
                    if (pdfPreview) {
                        pdfPreview.src = '';
                        pdfPreview.style.display = 'none';
                    }
                    
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
const refreshScanForm = () =>{


    consultation= new Object();
    oldconsultation =null;

    services = ajaxRequestHere("/service/serviceswithoutspecialization");
    fillDataIntoSelect(selectService,'Select Service',services,'name');

    appointments = ajaxRequestHere("/appointment/showall");
    fillDataIntoSelect(selectAppNo,'Select Channeling No',appointments,'channelingno');

    //set text field value as a empty
   
    textMobile.style.border ='1px solid #ced4da';
    dateOfConsultation.style.border='1px solid #ced4da';
    selectService.style.border='1px solid #ced4da';
    selectAppNo.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
   
    //add button
    if (userPrivilege.insert) {
        btnScanAdd.disabled ="";
        $("#btnScanAdd").css("cursor","pointer");
    } else {
        btnScanAdd.disabled ="disabled";
        $("#btnScanAdd").css("cursor","not-allowed");
    }

    
}

const generateAppointmentOtherDetails =()=>{
    console.log(JSON.parse(selectAppNo.value));

    const selectedAppointment = JSON.parse(selectAppNo.value);

    const appointmentDate = selectedAppointment.dateofappointment;
    const mobile = selectedAppointment.mobile;
    //document.getElementById('textDoctor').value = selectedAppointment.doctor_id.fullname;
    const channelingNo = selectedAppointment.channelingno;

    dateOfConsultation.value = appointmentDate;
    textMobile.value = mobile;

    //consultation.doctor_id = { id: selectedAppointment.doctor_id.id };
    consultation.pet_id = selectedAppointment.pet_id;
    consultation.owner_id =selectedAppointment.owner_id;
    //consultation.service_id =selectedAppointment.service_id;
    consultation.mobile = mobile;
    consultation.channelingno = channelingNo;
    consultation.dateofconsultation = appointmentDate;
    
    dateOfConsultation.style.border = "4px solid green";
    textMobile.style.border = "4px solid green";

} 



//define function to filter Appointments according to the service
const filterAppointments=()=>{

    const selectService = document.getElementById("selectService");
    const selectAppNo = document.getElementById("selectAppNo");

    //check if the service is selected
    if (selectService.value) {
    selectAppNo.disabled = false;

    const serviceId = JSON.parse(selectService.value).id;
    const appointmentByService = ajaxRequestHere("/appointment/showallbyservice?serviceid="+ serviceId);
    fillDataIntoSelectNewFour(selectAppNo,'Select Channeling No & Owner',appointmentByService,'channelingno','owner_id.name','service_id.name','pet_id.name');

    }else {
        //Disable the appointment dropdown
        selectAppNo.disabled = true; 
        selectAppNo.innerHTML = '<option value="" selected disabled>Select Appointment</option>';
  }

}


const buttonClearImagecon = () => {
    if (consultation.consulfile != null) {
        const userConfirmImgDlt = confirm("Are you sure to delete this file?");
        if (userConfirmImgDlt) {
            // Clear the object property
            consultation.consulfile = null;

            // Clear image preview
            const imgPreview = document.getElementById('imagePreview');
            if (imgPreview) {
                imgPreview.src = '';
                imgPreview.style.display = 'none';
            }

            // Clear PDF preview
            const pdfPreview = document.getElementById('pdfPreview');
            if (pdfPreview) {
                pdfPreview.src = '';
                pdfPreview.style.display = 'none';
            }

            // Clear the file input
            const fileInput = document.getElementById('fileImage');
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }
};

/* const buttonClearImagecon = () => {
    if (consultation.consulfile != null) {
        let userConfirmImgDlt = confirm("Are you sure to delete this File?");
        if (userConfirmImgDlt) {
            consultation.consulfile = null; 

            // Clear preview image
            document.getElementById('imagePreview').src = null;

            // Clear file input (if used)
            document.getElementById('fileImage').value = '';
        }
    }
}; */
