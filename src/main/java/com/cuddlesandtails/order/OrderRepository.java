package com.cuddlesandtails.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order , Integer>{

    @Query(value = "SELECT lpad(max(i.invoiceno)+1,5,0) as invoiceno FROM cuddlesandtails.order as i;", nativeQuery = true)
    public String getNextOrderNumber();

    
}
