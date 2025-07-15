window.addEventListener('load',()=>{


    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/doctor");

    services = ajaxRequestHere("/service/serviceswithspecialization");
    fillDataIntoSelect(selectService,'Select Service',services,'name');
    console.log(services);

});

//create function refresh appointment table
const refreshReportDocAvailability = () => {

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'doctorName'},
                              {dataType:'text',propertyName:'strat_time'},
                              {dataType:'text',propertyName:'end_time'},
                              {dataType:'function',propertyName:getNoofAppointments},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithoutModify(tableReportDocAvailability, doctors, displayproperty);

}

//create functon to get no of appointments
const getNoofAppointments=(ob)=>{

    
} 

//create function get record status 


const generateReport=()=> {


    const selectedDate = dateOfAppointment.value;
    const serviceId = JSON.parse(selectService.value).id;

    doctors = ajaxRequestHere("/availability/availabilityByServiceAndDate?serviceId=" + serviceId + "&date=" + selectedDate);

    refreshReportDocAvailability();   

}
