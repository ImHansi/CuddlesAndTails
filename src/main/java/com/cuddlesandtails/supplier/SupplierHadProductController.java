/* package com.cuddlesandtails.supplier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SupplierHadProductController {
    
    @Autowired
    private SupplierHadProductRepository dao; 

    @GetMapping(value = "/order_has_product/showOrderHadProduct", produces = "application/json")
    public List<showOrderHadProduct> showAllData(){
        return dao.findAll();
    } 
}
 */