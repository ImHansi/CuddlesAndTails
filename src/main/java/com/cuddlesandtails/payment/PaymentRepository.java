package com.cuddlesandtails.payment;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;




public interface PaymentRepository extends JpaRepository<Payment , Integer>{

    @Query(value = "SELECT lpad(max(p.paymentno)+1,5,0) as paymentno FROM cuddlesandtails.payment as p;", nativeQuery = true)
    public String getNextPaymentNo();

    //to the report daily payments
    @Query("SELECT p FROM Payment p WHERE DATE(p.addeddatetime) = :date")
    List<Payment> findDailyPayments(@Param("date") LocalDate date);

    //to the report monthly payments to the given month
    @Query("SELECT p FROM Payment p WHERE FUNCTION('MONTH', p.addeddatetime) = :month AND FUNCTION('YEAR', p.addeddatetime) = :year")
    List<Payment> findMonthlyPayments(@Param("month") int month, @Param("year") int year);

    //to the report to get the sum of all the payments and vaccination payments
    @Query(value = """
    SELECT (IFNULL(payment_sum, 0) + IFNULL(vaccine_sum, 0)) AS total_monthly_income
    FROM (SELECT(SELECT SUM(p.totalamount)FROM payment p WHERE MONTH(p.addeddatetime) = MONTH(CURRENT_DATE())AND YEAR(p.addeddatetime) = YEAR(CURRENT_DATE())) AS payment_sum,
            (SELECT SUM(v.totalamount) FROM vaccinationrecord v WHERE MONTH(v.addeddatetime) = MONTH(CURRENT_DATE()) AND YEAR(v.addeddatetime) = YEAR(CURRENT_DATE())) AS vaccine_sum) AS sums""", nativeQuery = true)
        Double getTotalMonthlyIncome();

    //to the monthly income report to get the full income this month from the services
    @Query(value = "SELECT IFNULL(SUM(totalamount), 0) FROM payment WHERE MONTH(addeddatetime) = MONTH(CURRENT_DATE()) AND YEAR(addeddatetime) = YEAR(CURRENT_DATE())", nativeQuery = true)
    Double getTotalIncomeThisMonth();
    



    /* //to get payments by service and date
    //sql way --> SELECT * FROM payment p JOIN appointment a ON p.appointment_id = a.id WHERE a.service_id = 7 AND DATE(a.dateofappointment) = '2025-07-17';
    @Query(value = "SELECT p.* FROM payment p JOIN appointment a ON p.appointment_id = a.id WHERE a.service_id = :serviceId AND DATE(a.dateofappointment) = :date", nativeQuery = true)
    List<Payment> findPaymentsByServiceAndDate(@Param("serviceId") Integer serviceId,@Param("date") LocalDate date);
 */

    /* //to get the payments to given service , doctor and date
    @Query(value = "SELECT p.* FROM payment p JOIN appointment a ON p.appointment_id = a.id WHERE a.service_id = :serviceId AND DATE(a.dateofappointment) = :date AND a.doctor_id = :doctorId", nativeQuery = true)
    List<Payment> findPaymentsByServiceDateAndDoctor(@Param("serviceId") Integer serviceId,@Param("date") LocalDate date,@Param("doctorId") Integer doctorId);
 */
}
