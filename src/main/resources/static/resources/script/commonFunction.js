//create function for get request mapping
const ajaxRequestHere = (url) => {
    let servicesResponce;

    $.ajax(url,{
        async: false,
        type:"GET",
        contentType:'json',
        success: function (data){
            console.log("success" + data);
            console.log(url);
            servicesResponce = data;
        },
        error: function(resOb){
            console.log("error"+ resOb);
            console.log(url);
            servicesResponce=[];
        }
    });

    return servicesResponce;
}

//create function for ajax request (POST, PUT, DELETE)
const ajaxRequestBody =(url, method, object)=>{

    let serverResponce;
//jquery ajax ("URL", {option})
    $.ajax(url,{
        async: false,//syncronization -->this function has to pause and wait until the success and error functions send a response.
        type: method,//method
        data: JSON.stringify(object),//data convert into json string
        contentType:'application/json',//data type
        success: function(data){
            console.log(url+ "\n"+"success" + data);
            serverResponce =data;
        },
        error:function (errormsg){
            console.log(url+ "\n Fail "+ errormsg);
            serverResponce ="Error: " + errormsg;
       /*  success: function(data,status,ahr){
            console.log(url+ "\n"+"success"+ status +""+ ahr);
            serverResponce =data;
        },
        error:function (ahr,status, errormsg){
            console.log(url+ "\n Fail "+ errormsg + ""+ status+""+ahr);
            serverResponce = errormsg; */
        }
    });
    return serverResponce;
}

//create function for fill data into select element 
const fillDataIntoSelect = (feildId,message,dataList, property,selectedValue) => {
    feildId.innerHTML="";

    if (message != "") {

        const optionMsgES = document.createElement('option');
        optionMsgES.innerText= message;
        optionMsgES.selected= "selected";
        optionMsgES.disabled= "disabled";
    
        //optionMsgES.setAttribute('attributeName','value');

        feildId.appendChild(optionMsgES);
        
    }

    dataList.forEach(element => {
        const option = document.createElement('option');
        option.innerText=element[property];
        option.value = JSON.stringify(element);

        if(selectedValue == element[property]){
            option.selected = "selected";
        }


        feildId.appendChild(option);
        
    });
} 

/* const fillDataIntoSelectTwo = (feildId,message,dataList, property,propertyTwo) => {
    feildId.innerHTML="";

    if (message != '') {

        const optionMsgES = document.createElement('option');
        optionMsgES.innerText= message;
        optionMsgES.selected= 'Selected';
        optionMsgES.disabled= 'disabled';

    //optionMsgES.setAttribute('attributeName','value');

    feildId.appendChild(optionMsgES);
        
    }

    dataList.forEach(element => {
        const option = document.createElement('option');
        option.innerText= element[property] +"(" + element[propertyTwo]+ ")";
        option.value = JSON.stringify(element);

        if(selectedValue == element[property]){
            option.selected = "selected";
        }


        feildId.appendChild(option);
        
    });
} */

const fillDataIntoSelectTwo = (feildId, message, dataList, property, propertyTwo, selectedValue) => {

    //feildId eke athule tiyen ek null krno
    feildId.innerHTML = '';

    //create option tag
    const optionMsg = document.createElement("option");
    //put a message into that 
    optionMsg.innerText = message;
    //ek selected disabled krnw
    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    feildId.appendChild(optionMsg);

    //foreach eken datalist ekt value tika gannw 
    dataList.forEach(element => {
        //Isslama opton tag ekk hadagnnw 
        const option = document.createElement('option');
        //ita psse element eke property ek genn gannwa tag eke innertext ek athulata
        option.innerText =  element[property] + " (" + element[propertyTwo] + ")";
        //meka dynamic drop down ekk,json string ekk create krgnn oni nisa (convert javascript object into json string -> option element value type is string)
        option.value = JSON.stringify(element);

        //refill ekedi select krl tibba data ek pirenn meken 
        if (selectedValue == element[property]) {
            option.selected = "selected";
        }
        feildId.appendChild(option);
    });
}

const fillDataIntoDataList = (feildId,dataList, property,propertyTwo,selectedValue) => {
    feildId.innerHTML="";



    dataList.forEach(element => {
        const option = document.createElement('option');
        option.value= element[property] +" " + element[propertyTwo];


        feildId.appendChild(option);
        
    });
}