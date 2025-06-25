/* package com.cuddlesandtails.supplier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SupplierHadVaccineController {
    
    @Autowired
    private SupplierHadVaccineRepository dao; 

    @GetMapping(value = "/order_has_vaccine/showOrderHadVaccine", produces = "application/json")
    public List<showOrderHadVaccine> showAllData(){
        return dao.findAll();
    } 
}
 */