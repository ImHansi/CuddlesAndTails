package com.cuddlesandtails.supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierRepository extends JpaRepository<Supplier, Integer>{

    @Query(value = "SELECT lpad(max(i.supplier_no)+1,5,0) as supplier_no FROM cuddlesandtails.supplier as i;", nativeQuery = true)
    public String getNextSupplierNumber();
    
}
