package com.cuddlesandtails.doctor;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoctoravailabilityRepository extends JpaRepository<Doctoravailability, Integer>{

    //to check the duplicate date range from doctor when setting the doctor availability
    @Query("SELECT da FROM Doctoravailability da WHERE da.doctor_id = :doctor AND " +"((:startDate BETWEEN da.startdate AND da.enddate) OR (:endDate BETWEEN da.startdate AND da.enddate))")
    Doctoravailability findOverlapping(@Param("doctor") Doctor doctor, @Param("startDate") LocalDate startDate,@Param("endDate") LocalDate endDate);
    
}
