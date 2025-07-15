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

    //services that doesnt involve doctors
    @GetMapping(value = "/service/serviceswithoutspecialization", produces = "application/json")
    public List<Service> getservicewithoutspecialization() {
        return dao.getServicesWithoutSpecialization();
    }

    //services that involves doctors
    @GetMapping(value = "/service/serviceswithspecialization", produces = "application/json")
    public List<Service> getservicewithspecialization() {
        return dao.getServicesWithSpecialization();
    }
    
}
