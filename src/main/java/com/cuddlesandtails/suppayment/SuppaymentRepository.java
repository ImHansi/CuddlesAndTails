package com.cuddlesandtails.suppayment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SuppaymentRepository extends JpaRepository<Suppayment, Integer> {

    @Query(value = "SELECT lpad(max(s.paymentno)+1,10,0) as paymentno FROM cuddlesandtails.supplierpayment as s;", nativeQuery = true)
    public String getNextSupPaymentNo();
    
}
