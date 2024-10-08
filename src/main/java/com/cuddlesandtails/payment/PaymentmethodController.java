package com.cuddlesandtails.payment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentmethodController {

    @Autowired //inject module repository object into dao variable
    private PaymentmethodRepository dao; //create module dao object

    @GetMapping(value = "/paymentmethod/showspaymentmethod", produces = "application/JSON")
    public List<com.cuddlesandtails.payment.Paymentmethod> getAllData(){
        return dao.findAll();
    }
    
}
