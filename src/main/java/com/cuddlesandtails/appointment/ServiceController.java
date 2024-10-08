package com.cuddlesandtails.appointment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class ServiceController {

    @Autowired
    private ServiceRepository dao;

    @GetMapping(value = "/service/showService", produces = "application/json")
    public List<Service> showAllData(){
        return dao.findAll();
    }
    
}
