package com.cuddlesandtails.vaccine;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.privilege.PrivilegeController;

@RestController
@RequestMapping(value = "/vaccineinventory")
public class VaccineinventoryController {

    @Autowired
    private VaccineinventoryRepository vaccineinventoryDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/vaccineinventory -- return vaccineinventory UI]
    @GetMapping()
    public ModelAndView vaccineinventoryUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView vaccineinventoryView = new ModelAndView();
        vaccineinventoryView.addObject("logusername", auth.getName());
        vaccineinventoryView.addObject("title","Vaccine Inventory Management : BIT Project 2024");
        vaccineinventoryView.setViewName("vaccinein.html");
        return vaccineinventoryView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Vaccineinventory> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Vaccine");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Vaccineinventory>();
        }
        return vaccineinventoryDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    @GetMapping(value = "/byvaccine/{vaccinesid}")
    public BigDecimal getAvtQtyByVac(@PathVariable Integer vaccinesid){
        return vaccineinventoryDao.getAvtQtyByVaccine(vaccinesid);
    }
    
}
