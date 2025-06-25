package com.cuddlesandtails.receive;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ReceiveRepository extends JpaRepository<Receive, Integer> {

    @Query(value = "SELECT lpad(max(r.receivednotecode)+1,10,0) as receivednotecode FROM cuddlesandtails.receive as r;", nativeQuery = true)
    public String getNextRNCode();

    @Query(value = "SELECT concat('SB',year(current_date()), lpad(substring(max(r.supplierbillno),8)+1,4,0)) FROM cuddlesandtails.receive as r where year(r.addeddatetime) = year(current_date());", nativeQuery = true)
    public String getNextSupBillNumber();
    
    //to get receive note according to the given supplier in suppayment
    @Query(value = "select r from Receive r where r.supplier_id.id = :supplierId and r.netamount <> r.paidamount")
    public List<Receive> getReceiveBySupplier(@Param("supplierId") Integer supplierId);

    
}
