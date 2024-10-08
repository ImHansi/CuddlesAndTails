package com.cuddlesandtails.appointment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RecordstatusController {

     @Autowired
    private RecordstatusRepository dao;

    @GetMapping(value = "/recordstatus/showRecordstatus", produces = "application/json")
    public List<Recordstatus> showAllData(){
        return dao.findAll();
    }
    
}
