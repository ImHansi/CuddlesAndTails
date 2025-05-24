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
@RequestMapping(value = "/productinventory")
public class ProductinventoryController {

    @Autowired
    private ProductinventoryRepository ProductinventoryDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/productinventory -- return productinventory UI]
    @GetMapping()
    public ModelAndView productinventoryUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView productinventoryView = new ModelAndView();
        productinventoryView.addObject("logusername", auth.getName());
        productinventoryView.addObject("title","Product Inventory Management : BIT Project 2024");
        productinventoryView.setViewName("productin.html");
        return productinventoryView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Productinventory> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Product");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Productinventory>();
        }
        return ProductinventoryDao.findAll(Sort.by(Direction.DESC,"id"));
    }
    
}
