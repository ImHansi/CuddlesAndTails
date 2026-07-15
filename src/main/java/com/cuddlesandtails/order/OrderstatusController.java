package com.cuddlesandtails.order;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderstatusController {

    //inject module repository object into dao variable
    private final OrderstatusRepository dao;

    OrderstatusController(OrderstatusRepository dao) {
        this.dao = dao;
    }

    @GetMapping(value = "/orderstatus/showOrderstatus", produces = "application/json")
    public List<Orderstatus> showAllData(){
        return dao.findAll();
    }
    
}
