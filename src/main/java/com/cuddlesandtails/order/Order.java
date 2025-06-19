package com.cuddlesandtails.order;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.supplier.Supplier;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //apply as an entity class
@Table(name = "`order`") //for map with given table //`order` has declared using `` because order is considered as a keyword.
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Order {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "ordercode", unique = true)
    @NotNull
    @Length(max = 10)
    private String ordercode;

    @Column(name = "requiredate")
    private LocalDate requiredate;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;


    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "note")
    private String note;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;
    
    @Column(name = "lastupdateduser_id")
    private Integer lastupdateduser_id;
    
    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "orderstatus_id",referencedColumnName = "id")
    private Orderstatus orderstatus_id;
    
    @OneToMany(mappedBy = "order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderHadProduct> orderhasproductsList;
 

}
