package com.cuddlesandtails.payment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.transaction.Transactional;
import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.appointment.RecordstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value="/payment")
public class PaymentController {

    @Autowired
    private PaymentRepository PaymentDao;

    @Autowired
    private RecordstatusRepository recordStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;
    

    //create mapping UI service [/payment -- return payment UI]
    @GetMapping()
    public ModelAndView paymentUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView paymentView = new ModelAndView();
        paymentView.addObject("logusername", auth.getName());
        paymentView.addObject("title","Payment Management : BIT Project 2024");
        paymentView.setViewName("payment.html");
        return paymentView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Payment> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"payment");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Payment>();
        }
        return PaymentDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create post mapping for save payment record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String savePayment(@RequestBody Payment payment){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "payment");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Payment save not completed : You don't have permission";
        }

        Payment extPaymentInvoice = PaymentDao.getInvoiceNoByOrderId(payment.getOrder_id().getId());
        if (extPaymentInvoice != null) {

            return "Save not completed : This Invoice is already existing..!";
            
        }

        Payment extPaymentVaccineNo = PaymentDao.getVaccineNoByVaccinationrecordId(payment.getVaccinationrecord_id().getId());
        if (extPaymentVaccineNo != null) {

            return "Save not completed : This Vaccination No is already existing..!";
            
        }

        Payment extPaymentConsulNo = PaymentDao.getConsulNoByConsultationId(payment.getConsultation_id().getId());
        if (extPaymentConsulNo != null) {

            return "Save not completed : This Consultation No is already existing..!";
            
        }

        try{
            //set auto generate values
            //set added date time
           payment.setAddeddatetime(LocalDateTime.now());
           payment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set nextPaymentNo 
           String nextPaymentNo = PaymentDao.getNextPaymentNo();
           if (nextPaymentNo.equals(null) || nextPaymentNo.equals("")){
           payment.setPaymentno("00001");
           }else{
            payment.setPaymentno(nextPaymentNo);
           }

            PaymentDao.save(payment);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Payment payment){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "payment");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Payment extPayment =PaymentDao.getReferenceById(payment.getId());
        if(extPayment== null){
            return"Delete not completed!";
        }
        

            extPayment.setRecordstatus_id(recordStatusDao.getReferenceById(2));
            extPayment.setDeletedatetime(LocalDateTime.now());
            payment.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            PaymentDao.save(extPayment);



            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    //create put mapping for update payment
    @Transactional
    @PutMapping
    public String updatePayment(@RequestBody Payment payment){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "payment");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Payment extPayment = PaymentDao.getReferenceById(payment.getId());
        if (extPayment == null) {
            return "Update not completed : Payment does not exist..!";
        }

        //check duplicate
        Payment extPaymentInvoive = PaymentDao.getInvoiceNoByOrderId(payment.getOrder_id().getId());
        if (extPaymentInvoive != null && extPaymentInvoive.getOrder_id().getInvoiceno().equals(extPaymentInvoive)) {

            return "Update not completed : Invoice is already existing..!";
            
        }

        Payment extPaymentVaccineNo = PaymentDao.getVaccineNoByVaccinationrecordId(payment.getVaccinationrecord_id().getId());
        if (extPaymentVaccineNo != null && extPaymentVaccineNo.getVaccinationrecord_id().getVaccino().equals(extPaymentVaccineNo)) {

            return "Update not completed : Vaccination No is already existing..!";
            
        }

        Payment extPaymentConsulNo = PaymentDao.getConsulNoByConsultationId(payment.getConsultation_id().getId());
        if (extPaymentConsulNo != null && extPaymentConsulNo.getConsultation_id().getConsulno().equals(extPaymentConsulNo)) {

            return "Update not completed : Consultation No is already existing..!";
            
        }

        try {
            payment.setLastmodifydatetime(LocalDateTime.now());
            payment.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            PaymentDao.save(payment);


            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    




}
