package com.cuddlesandtails.logerrrdash;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cuddlesandtails.appointment.AppointmentRepository;
import com.cuddlesandtails.pet.PetRepository;
import com.cuddlesandtails.vaccination.VaccinationrecordRepository;

@RestController
public class CardController {
    @Autowired
    private PetRepository petDao;

    @Autowired
    private AppointmentRepository appointmentDao;

    @Autowired
    private VaccinationrecordRepository vaccinationDao;

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalPets = petDao.count();
        long confirmedAppointmentsThisMonth = appointmentDao.countConfirmedAppointmentsThisMonth();
        long vaccinationsThisMonth = vaccinationDao.countVaccinationsThisMonth();

        summary.put("pets", totalPets);
        summary.put("appointments", confirmedAppointmentsThisMonth);
        summary.put("vaccinations", vaccinationsThisMonth);

        return summary;
    }
    
}
