package com.cuddlesandtails.logerrrdash;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cuddlesandtails.vaccination.VaccinationrecordRepository;

@RestController
public class ChartController {

    private final VaccinationrecordRepository vaccinationrecordDao;

    ChartController(VaccinationrecordRepository vaccinationrecordDao) {
        this.vaccinationrecordDao = vaccinationrecordDao;
    }

    @GetMapping("/monthly-count")
    public List<Object[]> getMonthlyVaccinationCounts() {
    // Each Object[] should have: [0] = month name, [1] = count
    return vaccinationrecordDao.getMonthlyVaccinationCount(); 
    }
    
}
