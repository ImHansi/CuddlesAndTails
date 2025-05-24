package com.cuddlesandtails.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//creating repository for the Order entity and the primary key of Order is Integer
public interface OrderRepository extends JpaRepository<Order , Integer>{

    //This query looks for the ordercode column in the order table and then finds the maximum existing code and adds a 1 to it 
    //and pads it with leading 0 s to make it 10 digits
    @Query(value = "SELECT lpad(max(i.ordercode)+1,10,0) as ordercode FROM cuddlesandtails.order as i;", nativeQuery = true)
    public String getNextOrderNumber();

    
}
