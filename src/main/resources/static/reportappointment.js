window.addEventListener('load',()=>{


    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/appointment");

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    
    appointmentStatus = ajaxRequestHere("/appointmentstatus/showAppStatus");
    fillDataIntoSelect(selectAppointmentStatus,'Select a Status',appointmentStatus,'name');

    appointments =ajaxRequestHere("/appointment/showall");

    refreshAppointmentTable(); //call table refresh function

    
});

//create function refresh appointment table
const refreshAppointmentTable = () => {
   
    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'channelingno'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'function',propertyName:getPetName},
                              {dataType:'text',propertyName:'mobile'},
                              {dataType:'function',propertyName:getService},
                              {dataType:'function',propertyName:getDoctor},
                              {dataType:'text',propertyName:'dateofappointment'},
                              {dataType:'function',propertyName:getTime},
                              {dataType:'function',propertyName:getAppointmentStatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableReportAppointment, appointments, displayproperty,appointmentFormRefill,deleteFunc,printFunc,false, userPrivilege);

    //disable delete button
    /*appointments.forEach((element , index) => {
        if (element.recordstatus_id.name == "Delete") {
            if (userPrivilege.delete) {
                tableAppointment.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tableReportAppointment').dataTable();


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

const generateReport=()=> {

    appointments =ajaxRequestHere("/appointment/getappointmentreport?doctor="+ JSON.parse(selectDoctor.value).id+"&appointmentstatus="+JSON.parse(selectAppointmentStatus.value).id+"&date="+slctStartDate.value);
    refreshAppointmentTable();   

}


//function for appointment form refill
const appointmentFormRefill =(ob,rowIndex)=>{
    
}

const editFunc =(ob)=>{

}

//function for delete appointment record
const deleteFunc =(ob,rowIndex)=>{

}


//function for print appointmnet record
const printFunc =(ob, rowIndex)=>{

}

