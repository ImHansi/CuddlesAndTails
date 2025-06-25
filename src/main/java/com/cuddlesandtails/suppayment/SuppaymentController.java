package com.cuddlesandtails.suppayment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.receive.Receive;
import com.cuddlesandtails.receive.ReceiveHadVaccine;
import com.cuddlesandtails.receive.ReceiveRepository;
import com.cuddlesandtails.receive.Rnstatus;
import com.cuddlesandtails.receive.RnstatusRepository;
import com.cuddlesandtails.user.UserRepository;

@RestController
@RequestMapping(value = "/supplierpayment")
public class SuppaymentController {

    @Autowired
    private SuppaymentRepository SuppaymentDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private ReceiveRepository receiveDao;

    @Autowired
    private RnstatusRepository rnstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/suppayment -- return supplierpayment UI]
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

    //create post mapping for save supplier payment record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveSuppayment(@RequestBody Suppayment suppayment){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Suppayment");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Payment save not completed : You don't have permission";
        }

        

        try{
            //set auto generate values
            //set added date time
           suppayment.setAddeddatetime(LocalDateTime.now());
           suppayment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set nextPaymentNo 
           String nextSupPaymentNo = SuppaymentDao.getNextSupPaymentNo();
           if (nextSupPaymentNo.equals(null) || nextSupPaymentNo.equals("")){
           suppayment.setPaymentno("0000000001");
           }else{
            suppayment.setPaymentno(nextSupPaymentNo);
           }

           // mek dann isslla supplier_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd ona.
            for (SupplierpaymentHadReceive suppayreceive : suppayment.getSupplierpaymenthasreceivesList()) {
                suppayreceive.setSupplierpayment_id(suppayment);
                ;
            }

            Suppayment newSupPay = SuppaymentDao.save(suppayment);
            // dependency
            for (SupplierpaymentHadReceive newSupPayReceive : newSupPay.getSupplierpaymenthasreceivesList()) {

                // Receive eke paid amount ek update krnnd oni krn paymet ekt adalawa
                Receive paidReceive = receiveDao.getReferenceById(newSupPayReceive.getReceive_id().getId());
                paidReceive.setPaidamount(paidReceive.getPaidamount().add(newSupPayReceive.getPaidamount()));

                //change receive status to received
                if (paidReceive.getNetamount().compareTo(paidReceive.getPaidamount())== 0 ) {
                    Rnstatus completeStatus = rnstatusDao.getReferenceById(2);
                    paidReceive.setRnstatus_id(completeStatus);
                }
                // mek dann isslla receive_id ek block krnonh infinity recursion ekk ena
                // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
                // widihata ek dala save krgnnd oni
                for (ReceiveHadVaccine receivevaccine : paidReceive.getReceivehasvaccinesList()) {
                    receivevaccine.setReceive_id(paidReceive);
                }
                receiveDao.save(paidReceive);
            }

            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    
    
}
