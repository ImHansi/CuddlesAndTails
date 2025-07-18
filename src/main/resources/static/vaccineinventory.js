window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/vaccine");

    refreshVaccineinventoryTable(); //call table refresh function

});

//create function refresh vaccine inventory table
const refreshVaccineinventoryTable = () => {

    //create array to store employee data list
    vaccineinventory = [];
    vaccineinventorys =ajaxRequestHere("/vaccineinventory/showall");

    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'function',propertyName:getVaccinename},
                              {dataType:'text',propertyName:'manufactureddate'},
                              {dataType:'text',propertyName:'expiredate'},
                              {dataType:'text',propertyName:'totalqty'},
                              {dataType:'text',propertyName:'availableqty'},
                              {dataType:'text',propertyName:'removeqty'},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTableWithPrint(tableVaccineInventory, vaccineinventorys,displayproperty,printFunc,true, userPrivilege);

   $('#tableVaccineInventory').dataTable();


}

//create function to get vaccine name
const getVaccinename=(ob)=>{
    return ob.vaccine_id.name;

}

//function for print inventory record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

    //open view modal
    $('#paymentViewModal').modal('show');

    viewPaymentNo.innerHTML = ob.paymentno;
    viewOwner.innerHTML = ob.owner_id.name;
    viewTotal.innerHTML = ob.totalamount;
    viewPaid.innerHTML = ob.paidamount;
    viewBalance.innerHTML = ob.balanceamount;
    viewAddedDate.innerHTML = ob.addeddatetime;

} 

//function for print
/* function printpage() { 
    let modalContent = document.getElementById('paymentViewModal').innerHTML;
    
    let newWindow = window.open('', '', 'width=800,height=600');

    newWindow.document.write(`
        <html>
            <head>
                <link rel='stylesheet' href='resources/bootstrap-5.3.1-dist/bootstrap-5.3.1-dist/css/bootstrap.min.css'></link>
                <title>Payment Details</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                </style>
            </head>
            <body>
                ${modalContent}
            </body>
        </html>
    `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
} */