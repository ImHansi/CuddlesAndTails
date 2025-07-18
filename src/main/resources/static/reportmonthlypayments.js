window.addEventListener('load', () => {
    // Load user privileges for the payment module
    userPrivilege = ajaxRequestHere("/privilege/bylogedusermodule/payment");
});

// Function to refresh the monthly payments table
const refreshReportMonthlyPayments = () => {
    const displayproperty = [
        { dataType: 'text', propertyName: 'paymentno' },
        { dataType: 'function', propertyName: getOwnerName },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'paidamount' },
        { dataType: 'text', propertyName: 'balanceamount' },
    ];

    fillDataIntoTableWithoutModify(tableReportMonthlyPayments, payments, displayproperty);
};

const getOwnerName = (ob) => {
    return ob.owner_id.name; 
};

//Function to generate the report
const generateMonthlyReport = () => {
    const selectedMonth = document.getElementById("reportMonth").value;
    const selectedYear = document.getElementById("reportYear").value;

    if (!selectedMonth || !selectedYear) {
        alert("Please select both month and year");
        return;
    }

    //Fetch the data from backend
    payments = ajaxRequestHere("/payment/monthlypayments?month=" + selectedMonth + "&year=" + selectedYear);


    //Refresh the table with new data
    refreshReportMonthlyPayments();

    //Calculate the total of totalamount
    let total = 0;
    payments.forEach(p => {
        if (p.totalamount) {
            total += parseFloat(p.totalamount);
        }
    });

    // Update the total amount field
    document.getElementById("textMonthlyTotal").value = total.toFixed(2);
};
