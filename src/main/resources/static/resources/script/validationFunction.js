//create funtion for validate text value.
const textValidator=(element,pattern,object,property) =>{

    if (element.value != '') {
       if (new RegExp(pattern).test(element.value)) {
         element.style.border = '4px solid green';
         window[object][property]= element.value;
       } else {
         element.style.border = '4px solid red';
         window[object][property]=null;
       }
    } else {

        window[object][property]=null;

        if (element.required) {
            element.style.border = '4px solid red';
        } else {
            element.style.border = '4px solid #ced4da';
        }
    }
}

//create function for validate text value
const theValidator =(element,pattern)=>{
    if (element.value != ''){
        if(new RegExp(pattern).test(element.value)){
            element.style.border = '4px solid yellow';
        }else{
            element.style.border = '4px solid red';
        }
    }else{
        if(element.required){
            element.style.border = '4px solid red';
        }else{
            element.style.border = '4px solid yellow';
        }
    }
} 

//create function for validate select static element

const selectStaticValidator = (element, pattern, object, property) => {

    if (element.value !='') {
        element.style.border = '4px solid green';
        window[object][property]=element.value;
    }else{
        element.style.border = '4px solid red';
        window[object][property]=null;
    }
}

//create function for validate select d element
const selectDValidator = (feildId, pattern, object, property) => {

    if (feildId.value !='') {
        feildId.style.border = '4px solid green';
        window[object][property]=JSON.parse(feildId.value);

    }else{

        feildId.style.border = '4px solid red';
        window[object][property]= null;
    }
}


//create function for validate select d element
const dataListdValidator = (feildId, dataListName, object, property,oldobject, displayproperty) => {

    let dataList = window[dataListName];
    let extIndex = dataList.map(data =>data[displayproperty]).indexOf(feildId.value.split(" ")[0]);

    if (extIndex != -1){

        window[object][property] = dataList[extIndex];


     if(feildId.value !=''){
            feildId.style.border = '4px solid green';
            window[object][property]=JSON.parse(feildId.value);
        }
    }else{

        feildId.style.border = '4px solid red';
        window[object][property]= null;
    }
}



//create function of validate radio element
const radioValidator = (element,pattern,object,property,labelOne,labelTwo)=> {
    if (element.checked) {
        window[object][property]=element.value;
        labelOne.style.color ='green';
        labelTwo.style.color ='black';
    } else {
        window[object][property]=null
        labelTwo.style.color ='black';
        labelOne.style.color ='black';
        
    }

}

//create function for checkbox field validator
const checkBoxValidator =(fieldId, pattern, object, property, trueValue, falseValue, labelId, labelTrueValue, labelFalseValue )=>{
    if(fieldId.checked){
        window[object][property]= trueValue;
        labelId.innerText = labelTrueValue;

    }else {
        window[object][property]= falseValue;
        labelId.innerText = labelFalseValue;
    }
}


//have to check again
//define fn for password retype
const retypePasswordVali = ()=> {
    if (textPassword.value == textRePassword.value) {
        textRePassword.style.border = "4px solid green";
        userAdd.password = textPassword.value;
    } else {
        textRePassword.style.border = "4px solid red";
        userAdd.password = null;
    }
}

//create function validate fullname and generate calling name 
const textNameVali = (feildId) => {
    const fullnamePattern = '^([A-Z][a-z]{2,15}[\\s]){1,10}([A-Z][a-z]{2,15}){1}$';
    const regPattern = new RegExp(fullnamePattern);

    if (feildId.value != '') {
        if (regPattern.test(feildId.value)) {
            feildId.style.border = '4px solid green';

            employee.fullname = feildId.value;
            //generate calling name list

            //const callingNameDataList = feildId.value.split(' ');
            callingNameDataList = feildId.value.split(' ');
            //console.log(callingNameDataList);
            callingNameList.innerHTML = '';

            callingNameDataList.forEach(element => {
                const option = document.createElement('option');
                option.value = element;
                callingNameList.appendChild(option);
            });

        } else {
            employee.fullname = null;
            feildId.style.border = '4px solid yellow';
        }

    } else {
        employee.fullname = null;
        feildId.style.border = '4px solid red';
    }
}

//create function validate calling name
const callingNameVali = (feildId) => {
    const callingNameValue = feildId.value;
    //let extCN 

    const index = callingNameDataList.map(element => element).indexOf(callingNameValue);
    console.log(index);
    if (index != -1) {
        feildId.style.border = '4px solid green';
    } else {
        feildId.style.border = '4px solid red';
    }

}