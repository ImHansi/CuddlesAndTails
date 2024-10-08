window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/Announcement");

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

    //check errors
    const errors = checkAnnounceFormError();
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

            $.ajax("/announcement" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(announcement),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#announcementAddModal').modal('hide');
                refreshAnnouncementTable();
                formAnnouncement.reset();
                refreshAnnouncementForm();

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
    announcementFormRefill();

}

//function for delete announcement record
const deleteFunc =(ob,rowIndex)=>{
    tableAnnouncement.children[1].children[rowIndex].style.backgroundColor = 'red';

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following announcement? \n'
            + '\n title is ' + ob.title
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/announcement" , {
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
                refreshAnnouncementTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }
        
             refreshAnnouncementTable();

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
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following announcement? \n'
                                    + '\n title is : ' + announcement.title);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/announcement", "POST", announcement);



                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshAnnouncementTable();
                    formAnnouncement.reset();
                    refreshAnnouncementForm();
                    $("#announcementAddModal").modal("hide");
                    
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
