package com.cuddlesandtails.vaccination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VaccinationrecordRepository extends JpaRepository<Vaccinationrecord,Integer>{
    
    
    @Query(value = "SELECT lpad(max(v.vaccino)+1,5,0) as vaccino FROM cuddlesandtails.vaccinationrecord as v;", nativeQuery = true)
    public String getNextVaccineNo();
}
