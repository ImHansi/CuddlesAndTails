package com.cuddlesandtails.appointment;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.payment.Payment;
import com.cuddlesandtails.payment.PaymentRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value = "/quickappointment")
public class QuickappointmentController {

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


    @GetMapping()
    public ModelAndView quickappointmentUI() {

        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView quickappointmentView = new ModelAndView();
        quickappointmentView.addObject("logusername", auth.getName());
        quickappointmentView.addObject("title", "Appointment Management : BIT Project 2024");
        quickappointmentView.setViewName("quickappointment.html");
        return quickappointmentView;
    }

    // create post mapping for save payment record
    @PostMapping // @RequestBody --> get request body value set in POST ajax call
    public String savePayment(@RequestBody Payment payment) {

        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "payment");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Payment save not completed : You don't have permission";
        }

        /*
         * Payment extPaymentInvoice =
         * PaymentDao.getInvoiceNoByOrderId(payment.getOrder_id().getId());
         * if (extPaymentInvoice != null) {
         * 
         * return "Save not completed : This Invoice is already existing..!";
         * 
         * }
         */

        // String extPaymentVaccineNo =
        // PaymentDao.getVaccineNoByVaccinationrecordId(payment.getVaccinationrecord_id().getId());
        // if (extPaymentVaccineNo != null) {

        // return "Save not completed : This Vaccination No is already existing..!";

        // }

        try {
            // set auto generate values
            // set added date time
            payment.setAddeddatetime(LocalDateTime.now());
            payment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            Appointment appointment = payment.getAppointment_id();
            appointment.setAddeddatetime(LocalDateTime.now());
            appointment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            // set channeling number
            List<Appointment> nextChannelingNo = new ArrayList<>();
            if (appointment.getDoctor_id() != null) {
                nextChannelingNo = appointmentDao.getAppinmentByDateServiceDoctor(appointment.getDateofappointment(),
                        appointment.getService_id().getId(), appointment.getDoctor_id().getId());
            } else {
                nextChannelingNo = appointmentDao.getAppinmentByDateService(appointment.getDateofappointment(),
                        appointment.getService_id().getId());
            }

            appointment.setChannelingno(nextChannelingNo.size() + 1);
            int timeMin = nextChannelingNo.size() * appointment.getService_id().getDuration();

            appointment.setStarttime(appointment.getStarttime().plusMinutes(timeMin));
            appointment.setEndtime(
                    appointment.getEndtime().plusMinutes(timeMin + appointment.getService_id().getDuration()));

            appointment.setAppointmentstatus_id(appointmentstatusDao.getReferenceById(2));
           Appointment newAppoinment = appointmentDao.save(appointment);

           payment.setAppointment_id(newAppoinment);
           payment.setOwner_id(appointment.getOwner_id());

            // set nextPaymentNo
            String nextPaymentNo = PaymentDao.getNextPaymentNo();
            if (nextPaymentNo.equals(null) || nextPaymentNo.equals("")) {
                payment.setPaymentno("00001");
            } else {
                payment.setPaymentno(nextPaymentNo);
            }

            PaymentDao.save(payment);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }
    }

}
