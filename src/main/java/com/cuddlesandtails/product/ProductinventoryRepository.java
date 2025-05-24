package com.cuddlesandtails.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductinventoryRepository extends JpaRepository<Productinventory, Integer> {
    
    @Query(value = "SELECT lpad(max(a.batch_no)+1,5,0) as batch_no FROM cuddlesandtails.productinventory as a;", nativeQuery = true)
    public String getNextBatchNumber();
}
