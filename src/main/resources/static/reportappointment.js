window.addEventListener('load',()=>{


    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/appointment");

    doctors = ajaxRequestHere("/doctor/showall");
    fillDataIntoSelect(selectDoctor,'Select a Doctor',doctors,'fullname');

    
    //appointmentStatus = ajaxRequestHere("/appointmentstatus/showAppStatus");
    //fillDataIntoSelect(selectAppointmentStatus,'Select a Status',appointmentStatus,'name');

    //appointments =ajaxRequestHere("/appointment/showall");

    //refreshAppointmentTable(); //call table refresh function

    
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
                              {dataType:'text',propertyName:'starttime'},
                              {dataType:'function',propertyName:getAppointmentStatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithoutModify(tableReportAppointment, appointments, displayproperty);
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

//create function get record status 
const getAppointmentStatus=(ob)=>{
    
    if(ob.appointmentstatus_id.name == 'Pending'){

        return '<p class="status-Pending">'+ ob.appointmentstatus_id.name +'</p>'

    }
    if(ob.appointmentstatus_id.name == 'Confirm'){

        return '<p class="status-Confirm">'+ ob.appointmentstatus_id.name +'</p>'

    }

}

const generateReport=()=> {

    const doctorId = JSON.parse(selectDoctor.value).id;
    const selectedDate = slctStartDate.value;

    appointments =ajaxRequestHere("/appointment/appointmentByDateandDoctor?doctorId=" + doctorId + "&dateofappointment=" + selectedDate);
    refreshAppointmentTable();   

}


