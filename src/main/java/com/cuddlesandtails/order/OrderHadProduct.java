package com.cuddlesandtails.order;

import java.math.BigDecimal;

import com.cuddlesandtails.product.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //apply as an entity class
@Table(name = "order_has_product") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class OrderHadProduct {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "price")
    @NotNull
    private BigDecimal price;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;

    @ManyToOne(optional = true)
    @JoinColumn(name = "order_id",referencedColumnName = "id")
    @JsonIgnore
    private Order order_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "product_id",referencedColumnName = "id")
    private Product product_id;
 
}
