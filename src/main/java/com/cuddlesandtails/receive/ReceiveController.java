package com.cuddlesandtails.receive;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.privilege.PrivilegeController;

@RestController
public class ReceiveController {
    @Autowired
    private ReceiveRepository ReceiveDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/receive -- return product UI]
    @GetMapping()
    public ModelAndView receiveUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView receiveView = new ModelAndView();
        receiveView.addObject("logusername", auth.getName());
        receiveView.addObject("title","Receive note Management : BIT Project 2024");
        receiveView.setViewName("receive.html");
        return receiveView; 
    }

    @GetMapping(value = "/receive/showall" , produces = "application/json")
    public List<Receive> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Receive");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Receive>();
        }
        return ReceiveDao.findAll(Sort.by(Direction.DESC,"id"));
    }
    
}
