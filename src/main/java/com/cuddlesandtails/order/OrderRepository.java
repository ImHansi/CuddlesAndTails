package com.cuddlesandtails.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


//creating repository for the Order entity and the primary key of Order is Integer
public interface OrderRepository extends JpaRepository<Order , Integer>{

    //This query looks for the ordercode column in the order table and then finds the maximum existing code and adds a 1 to it 
    //and pads it with leading 0 s to make it 10 digits
    @Query(value = "SELECT lpad(max(i.ordercode)+1,10,0) as ordercode FROM cuddlesandtails.order as i;", nativeQuery = true)
    public String getNextOrderNumber();


    //create query to get pending order by given supplier id
    @Query("select o from Order o where o.supplier_id.id = :supplierId and o.orderstatus_id.id = 1")
    List<Order> getBySupplier(@Param("supplierId") Integer supplierId);

    

    
}
