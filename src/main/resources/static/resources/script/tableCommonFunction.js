//create function fill data into table 
const fillDataIntoTable = (tableID, dataList,columnList,editFunc,deleteFunc,printFunc, buttonVisibility = true, privilegeOb = null) =>{

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    //dataList.forEach((element,index) => {

    ////const employeeTable = document.querySelector('#tableEmployee');
    //const tableBody = employeeTable.children[1];
    //tableBody.innerHTML='';

    dataList.forEach((element,index ) => {
        
        const tr = document.createElement('tr');

        const tdindex = document.createElement('td');
        tdindex.innerText = index + 1;
        tr.appendChild(tdindex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if(column.dataType =='text'){
                td.innerText = element[column.propertyName];
            }
            if(column.dataType =='function'){
                td.innerHTML = column.propertyName(element);
            }
            if(column.dataType == 'imagearray'){
                let img = document.createElement('img');
                img.style.width = "50px";
                img.style.height = "70px";
                if(element[column.propertyName] !=null){
                    img.src="/resources/images/petadopevent.png";
                }
            }

            tr.appendChild(td);
        });
        
    


        const tdButton = document.createElement('td');


        const buttonEdit = document.createElement('button');
        buttonEdit.className ='btn btn-success fw-bold me-2';
        buttonEdit.innerHTML = '<i class="fa-solid fa-pen-nib"></i>';
       // tdButton.appendChild(buttonEdit);
        buttonEdit.onclick = function (){
            editFunc(element , index);
        }

        const buttonDelete = document.createElement('button');
        buttonDelete.className ='btn btn-danger fw-bold me-2';
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
       // tdButton.appendChild(buttonDelete);
        buttonDelete.onclick = function (){
            deleteFunc(element , index);
        }

        const buttonPrint = document.createElement('button');
        buttonPrint.className ='btn btn-info fw-bold me-2';
        buttonPrint.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        tdButton.appendChild(buttonPrint);
        buttonPrint.onclick = function (){
            printFunc(element , index);
        }

        

        if(buttonVisibility){
            if (privilegeOb != null && privilegeOb.update) {
                tdButton.appendChild(buttonEdit);
            }
            
            if (privilegeOb != null && privilegeOb.delete) {
                tdButton.appendChild(buttonDelete);
            }
            
            // tdButton.appendChild(printFunc);
            tr.appendChild(tdButton);
        }


        tableBody.appendChild(tr);
        

    });
        
    //});
}

const fillDataIntoTable2 = (tableId, dataList, columnList, editfunction, deleteFuction, printFunction) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        /* const tdIndex = document.createElement('td');
        const tdCallingName = document.createElement('td');
        const tdFullName = document.createElement('td');
        const tdNic = document.createElement('td');
        const tdMobile = document.createElement('td');
        const tdStatus = document.createElement('td');
        const tdModify = document.createElement('td');
        */

        const tdButton = document.createElement('td'); 

        const dropDownDiv = document.createElement('div');
        dropDownDiv.className = 'dropdown';

        const dropdownI = document.createElement('i');
        dropdownI.className = 'fa-solid fa-ellipsis-vertical';
        dropdownI.setAttribute("data-bs-toggle","dropdown");
        dropdownI.setAttribute('aria-expanded','false');

        const dropdownUl = document.createElement('ul');
        dropdownUl.className = 'dropdown-menu';

        const dropdownMenuLiEdit = document.createElement('li');
        dropdownMenuLiEdit.className = 'dropdown-item';
        const buttonEdit  =document.createElement ('button');
        buttonEdit.className ='btn','custom-btn','bg-warning';
        buttonEdit.innerHTML = '<i class = "fa-solid fa-pen-to-square fa-beat"></i>';
        buttonEdit.onclick = function(){
            editfunctionFunction(element,index);
        }
        dropdownMenuLiEdit.appendChild(buttonEdit);



        const dropdownMenuLiDelete = document.createElement('li');
        dropdownMenuLiDelete.className = 'dropdown-item';
        const buttonDelete  =document.createElement ('button');
        buttonDelete.className='btn','custom-btn','bg-danger','ms-2';
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';
        buttonDelete.onclick = function(){
            deleteFuctionFunction(element,index);
        }
        dropdownMenuLiDelete.appendChild(buttonDelete);





        const dropdownMenuLiPrint = document.createElement('li');
        dropdownMenuLiPrint.className = 'dropdown-item';
        const buttonPrint  =document.createElement ('button');
        buttonPrint.className='btn','custom-btn','bg-success','ms-2';
        buttonPrint.innerHTML = '<i class = "fa-solid fa-eye fa-beat"></i>';
        buttonPrint.onclick = function(){
            printFunction(element,index);
        }


        dropdownMenuLiPrint.appendChild(buttonPrint);
        dropdownUl.appendChild(dropdownMenuLiEdit);
        dropdownUl.appendChild(dropdownMenuLiDelete);
        dropdownUl.appendChild(dropdownMenuLiPrint);

        dropDownDiv.appendChild(dropdownI);
        dropDownDiv.appendChild(dropdownUl);

        tdButton.appendChild(dropDownDiv);
        tr.appendChild(tdButton);

        /*   tdIndex.innerText = index+1;
          tdCallingName.innerText= element.callingName;
          tdFullName.innerText=element.fullName;
          tdNic.innerText = element.nic;
          tdMobile.innerText= element.mobile;
          
      
          tdStatus.innerText = element.employeestatus_id.name; */

        /* tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);
        tdButton.appendChild(buttonPrint); */

        const tdButton2 = document.createElement('td');



        /*   tr.appendChild(tdIndex);        
          tr.appendChild(tdCallingName);        
          tr.appendChild(tdFullName);        
          tr.appendChild(tdNic);        
          tr.appendChild(tdMobile);        
          tr.appendChild(tdStatus);  
          tr.appendChild(tdModify);  */

        tr.appendChild(tdButton);
        tableBody.appendChild(tr);


    });


}

const fillDataIntoTable3 = (tableId, dataList, columnList, buttonVisibility = true) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');
        tdButton.className='text-center';

        const inputRadio = document.createElement('input');
        inputRadio.className = 'form-check-input-mt-3';
        inputRadio.name= 'modify'
        inputRadio.type = 'radio';

        tr.onchange = function(){
            window['editOb'] = element;
            window['editRow'] = index;
            divModify.className = 'd-block';
        }

        tdButton.appendChild(inputRadio);





        /* const tdIndex = document.createElement('td');
        const tdCallingName = document.createElement('td');
        const tdFullName = document.createElement('td');
        const tdNic = document.createElement('td');
        const tdMobile = document.createElement('td');
        const tdStatus = document.createElement('td');
        const tdModify = document.createElement('td');
        */
 /*        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');
        const buttonDelete = document.createElement('button');
        const buttonPrint = document.createElement('button');

        buttonEdit.className = 'btn', 'custom-btn', 'bg-warning';
        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';
        buttonPrint.className = 'btn', 'custom-btn', 'bg-success', 'ms-2';

        buttonEdit.innerHTML = '<i class = "fa-solid fa-pen-to-square fa-beat"></i>';
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';
        buttonPrint.innerHTML = '<i class = "fa-solid fa-eye fa-beat"></i>';

        buttonEdit.onclick = function () {
            editfunction(element, index);
        }

        buttonDelete.onclick = function () {
            //conform ('are you sure to delete following employee')
            deleteFuction(element, index);
        }

        buttonPrint.onclick = function () {
            printFunction(element, index);
        }

        tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);
        tdButton.appendChild(buttonPrint); */

        if (buttonVisibility){
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);


        /*   tdIndex.innerText = index+1;
          tdCallingName.innerText= element.callingName;
          tdFullName.innerText=element.fullName;
          tdNic.innerText = element.nic;
          tdMobile.innerText= element.mobile;
          
      
          tdStatus.innerText = element.employeestatus_id.name; */

        /*   tr.appendChild(tdIndex);        
          tr.appendChild(tdCallingName);        
          tr.appendChild(tdFullName);        
          tr.appendChild(tdNic);        
          tr.appendChild(tdMobile);        
          tr.appendChild(tdStatus);  
          tr.appendChild(tdModify);  */

    });
}

//create function fill data into table - - row onclick
const fillDataIntoTable4 = (tableID , dataList , columnsList , buttonVisibility = true) =>{

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;   tr.appendChild(tdIndex);

        columnsList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }
           
            tr.appendChild(td);
        });   

        
        if (buttonVisibility) {
            tr.onclick = function () {

                window['editOb'] = element;
                window['editRow'] = index;
                divModify.className = 'd-block';
            }
    
        }
        
      
        tableBody.appendChild(tr);

    });

}
//online eken blgen meka hariytm type krnn
const fillDataIntoTable5 = (tableId, dataList, columnList, buttonVisibility = true) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');
        tdButton.className='text-center';

        const inputRadio = document.createElement('input');
        inputRadio.className = 'form-check-input-mt-3';
        inputRadio.name= 'modify'
        inputRadio.type = 'radio';

        tr.onchange = function(){
            window['editOb'] = element;
            window['editRow'] = index;
            divModify.className = 'd-block';
        }

        tdButton.appendChild(inputRadio);





        /* const tdIndex = document.createElement('td');
        const tdCallingName = document.createElement('td');
        const tdFullName = document.createElement('td');
        const tdNic = document.createElement('td');
        const tdMobile = document.createElement('td');
        const tdStatus = document.createElement('td');
        const tdModify = document.createElement('td');
        */
 /*        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');
        const buttonDelete = document.createElement('button');
        const buttonPrint = document.createElement('button');

        buttonEdit.className = 'btn', 'custom-btn', 'bg-warning';
        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';
        buttonPrint.className = 'btn', 'custom-btn', 'bg-success', 'ms-2';

        buttonEdit.innerHTML = '<i class = "fa-solid fa-pen-to-square fa-beat"></i>';
        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';
        buttonPrint.innerHTML = '<i class = "fa-solid fa-eye fa-beat"></i>';

        buttonEdit.onclick = function () {
            editfunction(element, index);
        }

        buttonDelete.onclick = function () {
            //conform ('are you sure to delete following employee')
            deleteFuction(element, index);
        }

        buttonPrint.onclick = function () {
            printFunction(element, index);
        }

        tdButton.appendChild(buttonEdit);
        tdButton.appendChild(buttonDelete);
        tdButton.appendChild(buttonPrint); */

        if (buttonVisibility){
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);


        /*   tdIndex.innerText = index+1;
          tdCallingName.innerText= element.callingName;
          tdFullName.innerText=element.fullName;
          tdNic.innerText = element.nic;
          tdMobile.innerText= element.mobile;
          
      
          tdStatus.innerText = element.employeestatus_id.name; */

        /*   tr.appendChild(tdIndex);        
          tr.appendChild(tdCallingName);        
          tr.appendChild(tdFullName);        
          tr.appendChild(tdNic);        
          tr.appendChild(tdMobile);        
          tr.appendChild(tdStatus);  
          tr.appendChild(tdModify);  */

    });
}


const fillDataIntoInnerTable = (tableId, dataList, columnList, deleteFuction, buttonVisibility = true) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });
        
        const tdButton = document.createElement('td');

        const buttonDelete = document.createElement('button');

        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';

        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';

        buttonDelete.onclick = function () {
            //conform ('are you sure to delete following employee')
            deleteFuction(element, index);
        }

        //frontend eken permission naththm disabled krnn mehem(mek nathath aniwaren backend eken disabled krn widiha tiyennm oni)

 /*        buttonEdit.style.pointerEvents = "all";//mek dmme naththm not allowed ek penn naa 
        if (!userPrivilege.priviupdate) {
           buttonEdit.disabled= true;
           buttonEdit.style.cursor="not-allowed";
        }

        buttonDelete.style.pointerEvents = "all";
        if (!userPrivilege.prividelete) {
            buttonDelete.disabled= true;
            buttonDelete.style.cursor="not-allowed";
        } */

        tdButton.appendChild(buttonDelete);

        if (buttonVisibility){
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

    });


}

const fillDataIntoTableWithDelete = (tableId, dataList, columnList, deleteFuction, buttonVisibility = true) => {

    //const table = document.querySelector('#tableEmployee');
    const tableBody = tableId.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });
        
        const tdButton = document.createElement('td');

        const buttonDelete = document.createElement('button');

        buttonDelete.className = 'btn', 'custom-btn', 'bg-danger', 'ms-2';

        buttonDelete.innerHTML = '<i class = "fa-solid fa-trash fa-beat"></i>';

        buttonDelete.onclick = function () {
            //conform ('are you sure to delete following employee')
            deleteFuction(element, index);
        }

        //frontend eken permission naththm disabled krnn mehem(mek nathath aniwaren backend eken disabled krn widiha tiyennm oni)

 /*        buttonEdit.style.pointerEvents = "all";//mek dmme naththm not allowed ek penn naa 
        if (!userPrivilege.priviupdate) {
           buttonEdit.disabled= true;
           buttonEdit.style.cursor="not-allowed";
        }

        buttonDelete.style.pointerEvents = "all";
        if (!userPrivilege.prividelete) {
            buttonDelete.disabled= true;
            buttonDelete.style.cursor="not-allowed";
        } */

        tdButton.appendChild(buttonDelete);

        if (buttonVisibility){
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

    });


}