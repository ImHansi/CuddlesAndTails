package com.cuddlesandtails.vaccine;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping(value="/brand")
public class BrandController {

    private final BrandRepository dao;

    BrandController(BrandRepository dao) {
        this.dao = dao;
    }

    @GetMapping(value="/showBrand",produces = "application/json")
    public List<Brand> showAll(){
        return dao.findAll();
    }
    
    
    
}
