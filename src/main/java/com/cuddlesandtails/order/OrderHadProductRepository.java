package com.cuddlesandtails.order;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderHadProductRepository extends JpaRepository<OrderHadProduct, Integer>{
    
}
