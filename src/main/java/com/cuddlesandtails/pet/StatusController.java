package com.cuddlesandtails.pet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class StatusController {

    @Autowired
    private StatusRepository dao;

    @GetMapping(value = "/status/showStatus", produces = "application/json")
    public List<Status> showAllData(){
        return dao.findAll();
    }
    
}
