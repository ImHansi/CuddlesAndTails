package com.cuddlesandtails.appointment;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.payment.Payment;
import com.cuddlesandtails.payment.PaymentRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
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

       

        try {
            // set auto generate values
            // set added date time
            payment.setAddeddatetime(LocalDateTime.now());
            payment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            Appointment appointment = payment.getAppointment_id();
            appointment.setAddeddatetime(LocalDateTime.now());
            appointment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            // Get existing appointments for the same service and date
        List<Appointment> nextChannelingNo = new ArrayList<>();
        if (appointment.getDoctor_id() != null) {
            nextChannelingNo = appointmentDao.getAppinmentByDateServiceDoctor(
                appointment.getDateofappointment(),
                appointment.getService_id().getId(),
                appointment.getDoctor_id().getId()
            );
        } else {
            nextChannelingNo = appointmentDao.getAppinmentByDateService(
                appointment.getDateofappointment(),
                appointment.getService_id().getId()
            );
        }

            // Set channeling number
        appointment.setChannelingno(nextChannelingNo.size() + 1);
        int timeMin = nextChannelingNo.size() * appointment.getService_id().getDuration();
        int duration = appointment.getService_id().getDuration();

        if (appointment.getDoctor_id() == null) {
            // Start at 8:00 AM if no doctor
            LocalTime baseTime = LocalTime.of(8, 0);
            LocalTime calculatedStart = baseTime.plusMinutes(timeMin);
            LocalTime calculatedEnd = calculatedStart.plusMinutes(duration);

            // Ensure appointment does not exceed 4:00 PM
            if (calculatedEnd.isAfter(LocalTime.of(16, 0))) {
                return "Appointment save not completed: Appointment cannot be scheduled after 4:00 PM";
            }

            appointment.setStarttime(calculatedStart);
            appointment.setEndtime(calculatedEnd);
        } else {
            //here we firstly get the starttime of the doctor for a specific service then add the timeMin which is the sum of time of past appointments
            appointment.setStarttime(appointment.getStarttime().plusMinutes(timeMin));
            //after that we add the duration of that service to the starttime of the appointment
            appointment.setEndtime(appointment.getStarttime().plusMinutes(duration));
            //appointment.setEndtime(appointment.getEndtime().plusMinutes(timeMin + duration)); // this way is wrong cuz here it takes end time as the doctors endtime not last appintment end time
        }
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
