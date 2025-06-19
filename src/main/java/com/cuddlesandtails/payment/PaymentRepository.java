package com.cuddlesandtails.payment;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;



public interface PaymentRepository extends JpaRepository<Payment , Integer>{

    @Query(value = "SELECT lpad(max(p.paymentno)+1,5,0) as paymentno FROM cuddlesandtails.payment as p;", nativeQuery = true)
    public String getNextPaymentNo();


    //@Query(value = "select p from Payment p where p.order_id=:order_id")
    //public Payment getPaymentByOrderId(@Param("order_id")Integer order_id);


    //@Query(value = "select p from Payment p where p.vaccinationrecord_id=:vaccinationrecord_id")
    //public Payment getPaymentByVaccineNo(@Param("vaccinationrecord_id") Integer vaccinationrecord_id);

    // @Query(value = "select v.vaccino from Vaccinationrecord v where v.id=:vaccinationrecord_id")
    // public String getVaccineNoByVaccinationrecordId(@Param("vaccinationrecord_id") Integer vaccinationrecord_id);

    
}
