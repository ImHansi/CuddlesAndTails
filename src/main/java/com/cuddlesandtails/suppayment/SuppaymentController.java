package com.cuddlesandtails.suppayment;

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
@RequestMapping(value = "/supplierpayment")
public class SuppaymentController {

    @Autowired
    private SuppaymentRepository SuppaymentDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/suppayment -- return product UI]
    @GetMapping()
    public ModelAndView suppaymentUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView suppaymentView = new ModelAndView();
        suppaymentView.addObject("logusername", auth.getName());
        suppaymentView.addObject("title","Supplier Payment Management : BIT Project 2024");
        suppaymentView.setViewName("suppayment.html");
        return suppaymentView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Suppayment> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Suppayment");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Suppayment>();
        }
        return SuppaymentDao.findAll(Sort.by(Direction.DESC,"id"));
    }
    
    
}
