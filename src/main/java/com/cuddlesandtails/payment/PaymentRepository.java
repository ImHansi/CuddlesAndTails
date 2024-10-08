package com.cuddlesandtails.payment;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface PaymentRepository extends JpaRepository<Payment , Integer>{

    @Query(value = "SELECT lpad(max(p.paymentno)+1,5,0) as paymentno FROM cuddlesandtails.payment as p;", nativeQuery = true)
    public String getNextPaymentNo();


    //@Query(value = "select p from Payment p where p.order_id=:order_id")
    //public Payment getPaymentByOrderId(@Param("order_id")Integer order_id);

    @Query(value = "select o.invoiceno from Order o where o.id = :order_id")
    public Payment getInvoiceNoByOrderId(@Param("order_id")Integer order_id);


    //@Query(value = "select p from Payment p where p.vaccinationrecord_id=:vaccinationrecord_id")
    //public Payment getPaymentByVaccineNo(@Param("vaccinationrecord_id") Integer vaccinationrecord_id);

    @Query(value = "select v.vaccino from Vaccinationrecord v where v.id=:vaccinationrecord_id")
    public Payment getVaccineNoByVaccinationrecordId(@Param("vaccinationrecord_id") Integer vaccinationrecord_id);


    @Query(value = "select c.consulno from Consultation c where c.id=:consultation_id")
    public Payment getConsulNoByConsultationId(@Param("consultation_id") Integer consultation_id);

    
}
