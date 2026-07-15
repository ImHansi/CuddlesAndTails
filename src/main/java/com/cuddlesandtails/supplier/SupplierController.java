package com.cuddlesandtails.supplier;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

@RestController
@RequestMapping(value = "/supplier")
public class SupplierController {
    //inject module repository object onto doa variable
    private final SupplierRepository dao; //create module dao object

    private final UserRepository userDao;
    
    private final SupplierstatusRepository supplierstatusDao;

    private final PrivilegeController privilegeController;

    SupplierController(SupplierRepository dao, UserRepository userDao, SupplierstatusRepository supplierstatusDao, PrivilegeController privilegeController) {
        this.dao = dao;
        this.userDao = userDao;
        this.supplierstatusDao = supplierstatusDao;
        this.privilegeController = privilegeController;
    }

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
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"supplier");
        //check privilege
        if (!logUserPrivi.get("select")){
            return new ArrayList<Supplier>();
        }
        return dao.findAll(Sort.by(Direction.DESC,"id"));
    }

    // create post mapping for save supplier record
    @PostMapping // @RequestBody --> get request body value set in POST ajax call
    public String saveSupplier(@RequestBody Supplier supplier) {

        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "supplier");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Supplier save not completed : You don't have permission";
        }

        try {
            // set auto generate values
            // set added date time
            supplier.setSupplierstatus_id(supplierstatusDao.getReferenceById(1));
            supplier.setAddeddatetime(LocalDateTime.now());
            supplier.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            // set supplier number
            String nextSupplierNo = dao.getNextSupplierNumber();
            if (nextSupplierNo.equals(null) || nextSupplierNo.equals("")) {
                supplier.setSupplier_no("00001");
            } else {
                supplier.setSupplier_no(nextSupplierNo);
            }

            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (SupplierHadVaccine orhpro : supplier.getSupplierhasvaccinesList()) {
                orhpro.setSupplier_id(supplier);
            }

            dao.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }
    }


    @DeleteMapping
    public String deleteFunc(@RequestBody Supplier supplier) {
        // user authentication and authurization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "supplier");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try {
            // delete
            Supplier extSupplier = dao.getReferenceById(supplier.getId());
            if (extSupplier == null) {
                return "Delete not completed!";
            }

            // soft delete
            extSupplier.setDeletedatetime(LocalDateTime.now());
            extSupplier.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            extSupplier.setSupplierstatus_id(supplierstatusDao.getReferenceById(2));
            

            dao.save(extSupplier);

            return "Ok";

        } catch (Exception e) {
            return "Delete not completed!" + e.getMessage();
        }

    }


    // create put mapping for update supplier
    @PutMapping
    public String updateSupplier(@RequestBody Supplier supplier) {
        // authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "supplier");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        // check existing
        Supplier extSupplier = dao.getReferenceById(supplier.getId());
        if (extSupplier == null) {
            return "Update not completed : supplier does not exist..!";
        }

        // check duplicate

        try {
            supplier.setLastmodifydatetime(LocalDateTime.now());
            supplier.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());

            // mek dann isslla supplier_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (SupplierHadVaccine orhpro : supplier.getSupplierhasvaccinesList()) {
                orhpro.setSupplier_id(supplier);
            }
            
            dao.save(supplier);

            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }





}
