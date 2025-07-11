package com.cuddlesandtails.doctor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AvailabilityRepository extends JpaRepository<Availability, Integer>{

    //select ab from Availability ab -- all entries of the Availability entity as ab
    //where ab.date=?1 -- gets the filtered records related to the date which was entered in the date field of the Availability entity matches to the first method parameter
    //(select dab.id from Doctoravailability dab where dab.doctor_id.id=?2) -- get all the Doctoravailability Ids that belong to a specific doctor
    //and ab.doctoravailability_id.id in() -- check whether the doctoravailability_id is in the list return by the subquery
    @Query(value = "select ab from Availability ab where ab.date=?1 and ab.doctoravailability_id.id in (select dab.id from Doctoravailability dab where dab.doctor_id.id=?2)")
    List<Availability> doctorAvailabilityByDateAndDoctor(LocalDate date, Integer doctorid);


    //to the report
    @Query("SELECT a FROM Availability a " +"JOIN a.doctoravailability_id da " +"JOIN da.doctor_id d " +"WHERE d.specialization_id IN (" +"  SELECT s FROM Service se JOIN se.specializations s WHERE se.id = :serviceId" +") AND a.date = :date " +"AND d.employeestatus_id.id = 1")
    List<Availability> findDoctorAvailabilityByServiceAndDate(@Param("serviceId") Integer serviceId, @Param("date") LocalDate date);


    
}
