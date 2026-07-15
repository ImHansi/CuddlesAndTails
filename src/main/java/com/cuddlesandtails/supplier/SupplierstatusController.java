package com.cuddlesandtails.supplier;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SupplierstatusController {

    private final SupplierstatusRepository dao;

    SupplierstatusController(SupplierstatusRepository dao) {
        this.dao = dao;
    }

    @GetMapping(value = "supplierstatus/showSupplierstatus", produces = "application/json")
    public List<Supplierstatus> showAllData(){
        return dao.findAll();
    }
    
}
