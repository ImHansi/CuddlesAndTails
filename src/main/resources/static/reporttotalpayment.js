window.addEventListener('load', () => {
    // Load user privileges for the payment module
    userPrivilege = ajaxRequestHere("/privilege/bylogedusermodule/payment");

    //services total fee + vaccination total fee = total income
    sum = ajaxRequestHere("/payment/monthlyincome");
    textTotal.value = parseFloat(sum).toFixed(2);

    //services total income
    sumservices = ajaxRequestHere("/payment/monthlyserviceincome");
    textAppTotal.value = parseFloat(sumservices).toFixed(2);

    //vaccinations total income
    sumvaccination = ajaxRequestHere("/vaccinationrecord/monthlyvaccinationincome");
    textVaccTotal.value = parseFloat(sumvaccination).toFixed(2);
});


/* 
//Function to generate the report
const generateMonthlyReport = () => {
    const selectedMonth = document.getElementById("reportMonth").value;
    const selectedYear = document.getElementById("reportYear").value;

    if (!selectedMonth || !selectedYear) {
        alert("Please select both month and year");
        return;
    }

    //Fetch the data from backend
    


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
}; */