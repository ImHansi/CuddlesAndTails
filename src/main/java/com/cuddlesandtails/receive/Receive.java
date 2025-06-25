package com.cuddlesandtails.receive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.order.Order;
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
@Table(name = "receive") //for map with given table
@Data //generate setters and getters
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Receive {
    
    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "receivednotecode")
    @NotNull
    @Length(max = 10)
    private String receivednotecode;

    @Column(name = "received_date")
    private LocalDate received_date;
    
    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;
    
    @Column(name = "note")
    private String note;
    
    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;
    
    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;
    
    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;
    
    @Column(name = "addeduser_id")
    @NotNull
    private Integer addeduser_id;
    
    @Column(name = "lastmodifyuser_id")
    private Integer lastmodifyuser_id;
    
    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;
    
    @Column(name = "discount")
    @NotNull
    private BigDecimal discount;
    
    @Column(name = "netamount")
    @NotNull
    private BigDecimal netamount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;
    
    @Column(name = "supplierbillno")
    @NotNull
    private String supplierbillno;

    @ManyToOne
    @JoinColumn(name = "rnstatus_id",referencedColumnName = "id")
    private Rnstatus rnstatus_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "order_id",referencedColumnName = "id")
    private Order order_id;

    @OneToMany(mappedBy = "receive_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReceiveHadVaccine> receivehasvaccinesList;


}
