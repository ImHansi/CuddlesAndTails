package com.cuddlesandtails.product;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


import com.cuddlesandtails.privilege.PrivilegeController;

@RestController
@RequestMapping(value = "/product")
public class ProductController {
    @Autowired
    private ProductRepository ProductDao;

     @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/product -- return product UI]
    @GetMapping()
    public ModelAndView productUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView productView = new ModelAndView();
        productView.addObject("logusername", auth.getName());
        productView.addObject("title","Product Management : BIT Project 2024");
        productView.setViewName("product.html");
        return productView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Product> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Product");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Product>();
        }
        return ProductDao.findAll(Sort.by(Direction.DESC,"id"));
    }
    
}
