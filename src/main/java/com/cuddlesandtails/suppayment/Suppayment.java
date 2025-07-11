package com.cuddlesandtails.suppayment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.payment.Paymentmethod;
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
@Table(name = "supplierpayment") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Suppayment {
    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "paymentno")
    @NotNull
    @Length(max = 10)
    private String paymentno;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    @NotNull
    private BigDecimal balanceamount;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;
    
    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name ="referenceno")
    private String referenceno;

    @Column(name = "chequeno")
    private String chequeno;

    @Column(name = "chequedate")
    private LocalDate chequedate;

    @Column(name = "transferdatetime")
    private LocalDateTime transferdatetime;

    @Column(name = "transferid")
    private String transferid;

    @ManyToOne
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private Paymentmethod paymentmethod_id;

    @OneToMany(mappedBy = "supplierpayment_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierpaymentHadReceive> supplierpaymenthasreceivesList;

}
