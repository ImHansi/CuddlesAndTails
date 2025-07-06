window.addEventListener('load',()=>{


    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/doctor");

    services = ajaxRequestHere("/service/showService");
    fillDataIntoSelect(selectService,'Select Service',services,'name');
    console.log(services);

});

//create function refresh appointment table
const refreshReportDocAvailability = () => {

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getDoctor},
                              {dataType:'text',propertyName:'strat_time'},
                              {dataType:'text',propertyName:'end_time'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithoutModify(tableReportDocAvailability, doctors, displayproperty);

}

//create functon to get doctors
const getDoctor=(ob)=>{
    console.log(ob);
    return ob.id.doctor_id.fullname;

} 

//create function get record status 


const generateReport=()=> {


    const selectedDate = dateOfAppointment.value;
    const serviceId = JSON.parse(selectService.value).id;

    doctors = ajaxRequestHere("/availability/availabilityByServiceAndDate?serviceId=" + serviceId + "&date=" + selectedDate);

    refreshReportDocAvailability();   

}
