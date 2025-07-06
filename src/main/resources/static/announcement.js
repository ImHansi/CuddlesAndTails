window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/announcement");

    refreshAnnouncementTable(); //call table refresh function

    refreshAnnouncementForm();//call form refresh function

    
});

//create function refresh employee table
const refreshAnnouncementTable = () => {

    //create array to store employee data list
    announcement = [];
    announcements =ajaxRequestHere("/announcement/showall");

    $.ajax("/announcement/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            announcements = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            announcement =[];
        }
    });

//announcementArray.forEach(ansmt => (
    //))

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'dateofpublication'},
                              {dataType:'text',propertyName:'title'},
                              {dataType:'text',propertyName:'description'},
                              {dataType:'imagearray',propertyName:'image'},
                              {dataType:'text',propertyName:'dateofevent'},
                              {dataType:'text',propertyName:'duration'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableAnnouncement, announcement,displayproperty,announcementFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
   /* announcements.forEach((element , index) => {
        if (element.employeestatus_id.name == "Resign") {
            if (userPrivilege.delete) {
                tableEmployee.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableAnnouncement').dataTable();


}



//function for employee form refill
const announcementFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into announcement object
    //used JSON.parse stringify to convert them into string and to identify the difference
    announcement = JSON.parse(JSON.stringify(ob));
    oldannouncement =JSON.parse(JSON.stringify(ob));

    //open announcement modal
    $('#announcementAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    dateOfPublication.value= announcement.dateofpublication;
    textTitle.value= announcement.title;
    textDescription.value = announcement.description;
    fileAnnoImage.value = announcement.image;
    dateOfEvent.value = announcement.dateofevent;
    textDuration.value = announcement.duration;


    

    if (userPrivilege.update) {
        btnAnnounceUpdate.disabled = "";
        $("#btnAnnounceUpdate").css("cursor","pointer");
    } else {
        btnAnnounceUpdate.disabled = "disabled";
        $("#btnAnnounceUpdate").css("cursor","not-allowed");
    }
    //update button
    btnAnnounceUpdate.disabled = "";
    //btnAnnounceUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnAnnounceUpdate").css("cursor","pointer");

    //add button
    btnAnnounceAdd.disabled="disabled";
    $("#btnAnnounceAdd").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(announcement.dateofpublication != oldannouncement.dateofpublication){
        updates = updates + "date of publication has updated," + oldannouncement.dateofpublication + " into " + announcement.dateofpublication + "\n";
    }

    if(announcement.title != oldannouncement.title){
        updates = updates + "title has updated," + oldannouncement.title + " into " + announcement.title + "\n";
    }

    if(announcement.description != oldannouncement.description){
        updates = updates + "description has updated," + oldannouncement.description + " into " + announcement.description + "\n";
    }

    if(announcement.image != oldannouncement.image){
        updates = updates + "image has updated," + oldannouncement.image + " into " + announcement.image + "\n";
    }

    if(announcement.dateofevent != oldannouncement.dateofevent){
        updates = updates + "date of event has updated," + oldannouncement.dateofevent + " into " + announcement.dateofevent + "\n";
    }

    if(announcement.duration != oldannouncement.duration){
        updates = updates + "duration has updated," + oldannouncement.duration + " into " + announcement.duration + "\n";
    }
    return updates;
}

//function for announcement update button
const buttonAnnouncementUpdate = ()=>{
    console.log("Update");
    console.log(announcement);
    console.log(oldannouncement);

   //2) check form errors
   let errors = checkAnnouncementFormError();
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
                   let putServiceResponce = ajaxRequestBody("/announcement", "PUT", announcement)
                   //6) check put service response
                   if (putServiceResponce == "OK") {
                       Swal.fire({
                           icon: 'success',
                           html: 'Updated Successfully',
                           showConfirmButton: true,
                       }).then(() => {
                        refreshAnnouncementTable();
                        FormAnnouncement.reset();
                        refreshAnnouncementForm();
                        $('#announcementAddModal').modal('hide');
                       });
                   } else {
                       Swal.fire({
                           icon: 'error',
                           html: 'Failed to Update Announcement Details',
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
    announcementFormRefill();

}

//function for delete announcement record
const deleteFunc =(ob,rowIndex)=>{
    tableAnnouncement.children[1].children[rowIndex].style.backgroundColor = 'red';

     //need a time to change the color
    setTimeout(function () {
    // get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to REMOVE following Announcement? <br>'
            + 'Title is : ' + ob.title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxRequestBody("/announcement", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "Ok") {
                refreshAnnouncementTable();

                Swal.fire({
                    title: 'Success',
                    text: 'Announcement Deleted Successfully!',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete the selected Announcement \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        }
    });

    }, 500);

}


//function for print announcement record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshAnnouncementTable();

}


//create function for check error
const checkAnnounceFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (announcement.dateofpublication==null) {
        errors = errors +"Please Enter a valid date..\n";
        dateOfPublication.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (announcement.title == null) {
        errors = errors +"Please Enter a title..\n";
        textTitle.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (announcement.description == null) {
        errors = errors +"Please Enter a description..\n";
        textDescription.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (announcement.image== null) {
        errors = errors +"Please put an image..\n";
        textImage.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (announcement.dateofevent == null) {
        errors = errors +"Please Enter a valid date of event..\n";
        dateOfEvent.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (announcement.duration == null) {
        errors = errors +"Please Enter a duration..\n";
        textDuration.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;

}

//create function for submit to add announcement
const buttonFormSubmit = ()=>{
    console.log('add announcement',announcement);
    console.log(window['announcement']);


    const formErrors = checkAnnounceFormError();
    // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Announcement? <br>'
                + '<br> Title is : ' + ob.title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/announcement", "POST", announcement);
                // Check post service response
                if (postServerResponce == "OK") {
                    refreshAnnouncementTable();
                    FormAnnouncement.reset();
                    refreshAnnouncementForm();
                    $('#announcementAddModal').modal('hide');

                    Swal.fire({
                        title: 'Success',
                        html: 'Saved successfully!',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit the Announcement \n' + postServerResponce,
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
const refreshAnnouncementForm = () =>{


    announcement= new Object();
    oldannouncement =null;


    //set text field value as a empty
    dateOfPublication.style.border ='1px solid #ced4da';
    textTitle.style.border ='1px solid #ced4da';
    textDescription.style.border ='1px solid #ced4da';
    fileAnnoImage.style.border='1px solid #ced4da';
    dateOfEvent.style.border='1px solid #ced4da';
    textDuration.style.border='1px solid #ced4da';

    


    //set default color
    textTitle.removeAttribute('style');



    //update button
    btnAnnounceUpdate.disabled = "disabled";
    //btnUpdateEmployee.style.cursor ="not-allowed";
    //jquery
    $("#btnAnnounceUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAnnounceAdd.disabled ="";
        $("#btnAnnounceAdd").css("cursor","pointer");
    } else {
        btnAnnounceAdd.disabled ="disabled";
        $("#btnAnnounceAdd").css("cursor","not-allowed");
    }

    
   


}
