package com.cuddlesandtails.employee;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DesignationController {


    @Autowired
    private DesignationRepository dao;

    @GetMapping(value = "/designation/showDesignation", produces = "application/json")
    public List<Designation> showAllData(){
        return dao.findAll();
    }

    //create post mapping for save designation record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveDesignation(@RequestBody Designation designation){

        try{
            

            dao.save(designation);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


}
