package com.cuddlesandtails.receive;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.vaccine.Vaccine;
import com.cuddlesandtails.vaccine.VaccineRepository;
import com.cuddlesandtails.vaccine.Vaccineinventory;
import com.cuddlesandtails.vaccine.VaccineinventoryRepository;

@RestController
@RequestMapping(value = "/receive")
public class ReceiveController {
    @Autowired
    private ReceiveRepository ReceiveDao;

    @Autowired
    private VaccineinventoryRepository vinventoryDao;

    @Autowired
    private VaccineRepository vaccineDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private RnstatusRepository rnstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/receive -- return receive UI]
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

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Receive> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"receive");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Receive>();
        }
        return ReceiveDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    // create post mapping for save receive record
    @PostMapping // @RequestBody --> get request body value set in POST ajax call
    public String saveReceive(@RequestBody Receive receive) {

        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "receive");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Receive note save not completed : You don't have permission";
        }

        try {
            // set auto generate values
            // set added date time
            receive.setRnstatus_id(rnstatusDao.getReferenceById(1));
            receive.setAddeddatetime(LocalDateTime.now());
            receive.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());
            receive.setPaidamount(BigDecimal.ZERO);

            // set receive code
            String nextReceiveNo = ReceiveDao.getNextRNCode();
            if (nextReceiveNo == null || nextReceiveNo.equals("")) {
                receive.setReceivednotecode("0000000001");
            } else {
                receive.setReceivednotecode(nextReceiveNo);
            }

            //set next supplier bill no
            String nextSBillNo = ReceiveDao.getNextSupBillNumber();
            if (nextSBillNo == null || nextSBillNo.equals("")) {
                receive.setSupplierbillno("SB20250001");
            } else {
                receive.setSupplierbillno(nextSBillNo);
            }

            // mek dann isslla receive_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (ReceiveHadVaccine orhpro : receive.getReceivehasvaccinesList()) {
                orhpro.setReceive_id(receive);
            }

            // irn ekt payment ekk krama mek auto fill wenn oni
            //receive.setPaidamount(BigDecimal.ZERO);

            Receive newReceive = ReceiveDao.save(receive);

            //need to update vaccine inventory
            //get vaccine details in receive note
            for (ReceiveHadVaccine newreceivevaccine : newReceive.getReceivehasvaccinesList()) {

                Vaccineinventory extInventory = vinventoryDao.getByVaccine(newreceivevaccine.getVaccine_id().getId());

                // vaccine eke unit price ek update krnn oni anthimata api IRN ekt daana Unit price ekt adaalawa
                Vaccine receivedVaccines = vaccineDao.getReferenceById(newreceivevaccine.getVaccine_id().getId());
                receivedVaccines.setPurchaseprice(newreceivevaccine.getPrice());
                vaccineDao.save(receivedVaccines);

                //
                if (extInventory == null) {
                    Vaccineinventory newInventory = new Vaccineinventory();
                    // mekata value set krnnd oni
                    newInventory.setVaccine_id(newreceivevaccine.getVaccine_id());
                    newInventory.setManufactureddate(newReceive.getReceived_date());
                    newInventory.setExpiredate(newreceivevaccine.getExpiredate());
                    newInventory.setBatch_no(newreceivevaccine.getBatchno());
                    newInventory.setTotalqty(newreceivevaccine.getQuantity());
                    newInventory.setReceive_id(newReceive);
                    newInventory.setAvailableqty(newreceivevaccine.getQuantity());
                    newInventory.setRemoveqty(BigDecimal.ZERO);

                    vinventoryDao.save(newInventory);
                } else {
                    // bigdecimal wl kawadawath +,-,/,* baa -- ekt .add,.multiple wge ewa tiyanava
                    extInventory.setAvailableqty(extInventory.getAvailableqty().add(newreceivevaccine.getQuantity()));
                    extInventory.setTotalqty(extInventory.getTotalqty().add(newreceivevaccine.getQuantity())); // adu wena ewath me wge hadann
                    vinventoryDao.save(extInventory);
                }
            }

            
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }
    }

    @GetMapping(value = "/getReceivebysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Receive> getReceiveBySupplier(@RequestParam  Integer supplierid){
        return ReceiveDao.getReceiveBySupplier(supplierid);
    }

    /* @DeleteMapping
    public String deleteFunc(@RequestBody Receive receive) {
        // user authentication and authurization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Receive");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try {
            // delete
            Receive extReceive = ReceiveDao.getReferenceById(receive.getId());
            if (extReceive == null) {
                return "Delete not completed!";
            }

            // hard delete
            // dao.delete(employee;
            // EmployeeDao.delete(EmployeeDao.getReferenceById(employee.getId()));

            // soft delete
            extReceive.setDeletedatetime(LocalDateTime.now());
            extReceive.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            extReceive.setRnstatus_id(rnstatusDao.getReferenceById(3));
            

            ReceiveDao.save(extReceive);

            return "Ok";

        } catch (Exception e) {
            return "Delete not completed!" + e.getMessage();
        }

    }
 */
    // create put mapping for update receive
    /* @PutMapping
    public String updateReceive(@RequestBody Receive receive) {
        // authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Receive");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you don't have permission..!";
        }

        // check existing
        Receive extReceive = ReceiveDao.getReferenceById(receive.getId());
        if (extReceive == null) {
            return "Update not completed : receive note does not exist..!";
        }

        // check duplicate

        try {
            receive.setUpdatedatetime(LocalDateTime.now());
            receive.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());

            // mek dann isslla receive_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (ReceiveHadVaccine orhpro : receive.getReceivehasvaccinesList()) {
                orhpro.setReceive_id(receive);
            }
            
            ReceiveDao.save(receive);

            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
 */
    



    
}
