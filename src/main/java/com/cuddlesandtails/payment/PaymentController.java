package com.cuddlesandtails.payment;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.appointment.Appointment;
import com.cuddlesandtails.appointment.AppointmentRepository;
import com.cuddlesandtails.appointment.AppointmentstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(value= "/payment")
public class PaymentController {

    @Autowired
    private PaymentRepository PaymentDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private AppointmentRepository appointmentDao;

    @Autowired
    private AppointmentstatusRepository appointmentstatusDao;

    //@Autowired
    //private VaccinationrecordRepository vaccinationrecordDao;

    //@Autowired
    //private RecordstatusRepository recordstatusDao;
    

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

        /* Payment extPaymentInvoice = PaymentDao.getInvoiceNoByOrderId(payment.getOrder_id().getId());
        if (extPaymentInvoice != null) {

            return "Save not completed : This Invoice is already existing..!";
            
        } */

        // String extPaymentVaccineNo = PaymentDao.getVaccineNoByVaccinationrecordId(payment.getVaccinationrecord_id().getId());
        // if (extPaymentVaccineNo != null) {

        //     return "Save not completed : This Vaccination No is already existing..!";
            
        // }

        try{
            //set auto generate values
            //set added date time
           payment.setAddeddatetime(LocalDateTime.now());
           payment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set appointmentstatus as confirmed id=2
           if (payment.getAppointment_id() != null) {
            Appointment appointment = appointmentDao.getReferenceById(payment.getAppointment_id().getId());
            appointment.setAppointmentstatus_id(appointmentstatusDao.getReferenceById(2));
            appointmentDao.save(appointment);
           }

           //set vaccination recordstatus as complete id=4
           /* if (payment.getVaccinationrecord_id() != null) {
            Vaccinationrecord vr = vaccinationrecordDao.getReferenceById(payment.getVaccinationrecord_id().getId());
            vr.setRecordstatus_id(recordstatusDao.getReferenceById(4)); 
            vaccinationrecordDao.save(vr);
            } */

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


    //for the report daily pyaments
    @GetMapping("/dailypayments")
    public List<Payment> getDailypayments(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    return PaymentDao.findDailyPayments(date);

    }

    //for the report monthly payments
    @GetMapping("/monthlypayments")
    public List<Payment> getMonthlyPayments(@RequestParam int month, @RequestParam int year) {
        return PaymentDao.findMonthlyPayments(month, year);
    }

    //for the report to get the sum
    @GetMapping("/monthlyincome")
    public Double getMonthlyIncome() {
        return PaymentDao.getTotalMonthlyIncome();
    }


    //for the monthly income report
    @GetMapping("/monthlyserviceincome")
    public Double getMonthlyServiceIncome() {
       return PaymentDao.getTotalIncomeThisMonth();
    }



    /* //end point to get payents to given service and date
    @GetMapping("/paymentrecords")
    public List<Payment> getPaymentsByServiceAndDate(@RequestParam Integer serviceId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return PaymentDao.findPaymentsByServiceAndDate(serviceId, date);
    }  */


   /*  //end point to get payemnt to given service , doctor and date
    @GetMapping("/paymentrecords/filter")
    public List<Payment> getPaymentsByServiceDateAndDoctor(@RequestParam Integer serviceId,@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,@RequestParam Integer doctorId) {
        return PaymentDao.findPaymentsByServiceDateAndDoctor(serviceId, date, doctorId);
    } */


}
