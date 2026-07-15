window.addEventListener('load',()=>{

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/vaccinationrecord");

});

//create function refresh appointment table
const refreshReportDailyVacPayments = () => {

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'vaccino'},
                              {dataType:'function',propertyName:getOwnerName},
                              {dataType:'text',propertyName:'totalamount'},
                              {dataType:'text',propertyName:'paidamount'},
                              {dataType:'text',propertyName:'balanceamount'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithoutModify(tableReportDailyVaccination, payments, displayproperty);

}

//create function to get owners
const getOwnerName=(ob)=>{
    return ob.owner_id.name;

}

//create function get record status 
const generateReport=()=> {


    const selectedDate = reportDate.value;

    payments = ajaxRequestHere("/vaccinationrecord/dailyvaccinationpayments?date=" + selectedDate);

    refreshReportDailyVacPayments();   

    //Calculate total of totalamount
    let total = 0;
    payments.forEach(p => {
        if (p.totalamount) {
            total += parseFloat(p.totalamount);
        }
    });

    //Update total amount field
    document.getElementById("textTotalFee").value = total.toFixed(2);

}

//to set the date range from todays date to next 6 days

const setAppointmentDateRange = () => {
  const dateInput = document.getElementById("reportDate");
  const today = new Date();

  const toDateString = (date) => date.toISOString().split('T')[0];

  const minDate = toDateString(today);

  const maxDateObj = new Date(today);
  maxDateObj.setDate(today.getDate() + 6);
  const maxDate = toDateString(maxDateObj);

  dateInput.min = minDate;
  dateInput.max = maxDate;
};