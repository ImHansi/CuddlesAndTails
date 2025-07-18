package com.cuddlesandtails.vaccination;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface VaccinationrecordRepository extends JpaRepository<Vaccinationrecord,Integer>{
    
    
    @Query(value = "SELECT lpad(max(v.vaccino)+1,5,0) as vaccino FROM cuddlesandtails.vaccinationrecord as v;", nativeQuery = true)
    public String getNextVaccineNo();

    //create query to get pending Vaccination Records
    @Query(value = "select v from Vaccinationrecord v where v.recordstatus_id.id=3")
    List<Vaccinationrecord> getPendingVaccinationRecord();

    //for the dashboard card
    @Query("SELECT COUNT(v) FROM Vaccinationrecord v WHERE MONTH(v.dateofvaccination) = MONTH(CURRENT_DATE) AND YEAR(v.dateofvaccination) = YEAR(CURRENT_DATE)")
    long countVaccinationsThisMonth();

    //for the bar chart
    @Query("SELECT FUNCTION('MONTHNAME', v.dateofvaccination), COUNT(v) FROM Vaccinationrecord v GROUP BY FUNCTION('MONTHNAME', v.dateofvaccination)")
    List<Object[]> getMonthlyVaccinationCount();

    //for the vaccination report get vaccination records to the given owner and pet
    @Query(value = "SELECT v FROM Vaccinationrecord v WHERE v.pet_id.id = :petId AND v.owner_id.id = :ownerId")
    public List<Vaccinationrecord> findVrecordsByOwnerAndPet(@Param("ownerId") Integer ownerId, @Param("petId") Integer petId);


    //to the report daily vaccination payments
    @Query("SELECT v FROM Vaccinationrecord v WHERE DATE(v.addeddatetime) = :date")
    List<Vaccinationrecord> findDailyVacPayments(@Param("date") LocalDate date);

    //to the monthly income report
    @Query(value = "SELECT IFNULL(SUM(totalamount), 0) FROM vaccinationrecord WHERE MONTH(addeddatetime) = MONTH(CURRENT_DATE()) AND YEAR(addeddatetime) = YEAR(CURRENT_DATE())", nativeQuery = true)
    Double getTotalVaccinationIncomeThisMonth();

}
