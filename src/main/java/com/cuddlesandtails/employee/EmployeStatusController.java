package com.cuddlesandtails.employee;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class EmployeStatusController {

    private final EmployeeStatusRepository dao;

    EmployeStatusController(EmployeeStatusRepository dao) {
        this.dao = dao;
    }

    @GetMapping(value ="employeestatus/showStatus", produces= "application/json")
    public List<EmployeeStatus>ShowAll(){
        return dao.findAll();
    }
}
