package com.cuddlesandtails.supplier;

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
import com.cuddlesandtails.user.UserRepository;

@RestController
@RequestMapping(value = "/supplier")
public class SupplierController {
    @Autowired //inject module repository object onto doa variable
    private SupplierRepository dao; //create module dao object

    @Autowired
    private UserRepository userDao;
    
    @Autowired
    private SupplierstatusRepository supplierstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping()
    public ModelAndView supplierUI() {
        
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView supplierView = new ModelAndView();
        supplierView.addObject("logusername", auth.getName());
        supplierView.addObject("title", "Supplier Management : BIT Project 2024");
        supplierView.setViewName("supplier.html");
        return supplierView;
    }
    
    @GetMapping(value = "/showsupplier", produces = "application/json")
    public List<Supplier> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Supplier");
        //check privilege
        if (!logUserPrivi.get("select")){
            return new ArrayList<Supplier>();
        }
        return dao.findAll(Sort.by(Direction.DESC,"id"));
    }
}
