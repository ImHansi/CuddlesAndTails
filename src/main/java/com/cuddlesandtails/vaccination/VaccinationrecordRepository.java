package com.cuddlesandtails.vaccination;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VaccinationrecordRepository extends JpaRepository<Vaccinationrecord,Integer>{
    
    
    @Query(value = "SELECT lpad(max(v.vaccino)+1,5,0) as vaccino FROM cuddlesandtails.vaccinationrecord as v;", nativeQuery = true)
    public String getNextVaccineNo();

    //create query to get pending Vaccination Records
    @Query(value = "select v from Vaccinationrecord v where v.recordstatus_id.id=3")
    List<Vaccinationrecord> getPendingVaccinationRecord();
}
