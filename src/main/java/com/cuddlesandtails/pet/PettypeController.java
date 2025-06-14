package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping(value = "/pettype")
public class PettypeController {
    @Autowired
    private PettypeRepository dao;

    @GetMapping(value = "/showPettype" , produces = "application/json")
    public List<Pettype> showAllData() {
        return dao.findAll();
    }

    //create post mapping for save pettype record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String savePettype(@RequestBody Pettype pettype){


        //check duplicate
         Pettype extPettype = dao.getByName(pettype.getName());
        if (extPettype != null) {

            return "Save not completed : This Pettype is already existing..!";
            
        } 

        try{ 
            dao.save(pettype);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    
    
}
