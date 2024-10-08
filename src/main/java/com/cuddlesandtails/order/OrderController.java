package com.cuddlesandtails.order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.appointment.Recordstatus;
import com.cuddlesandtails.appointment.RecordstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

@RestController
@RequestMapping(value = "/order")
public class OrderController {
    @Autowired // inject module repository object into dao variable
    private OrderRepository dao; // create module dao object

    @Autowired
    private UserRepository userDao;

    @Autowired
    private RecordstatusRepository recordstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping()
    public ModelAndView orderUI() {

        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView orderView = new ModelAndView();
        orderView.addObject("logusername", auth.getName());
        orderView.addObject("title", "Order Management : BIT Project 2024");
        orderView.setViewName("order.html");
        return orderView;
    }

    @GetMapping(value = "/showorder", produces = "application/json")
    public List<Order> showAll() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
        // check privilege
        if (!logUserPrivi.get("select")) {
            return new ArrayList<Order>();
        }
        return dao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // create post mapping for save employee record
    @PostMapping // @RequestBody --> get request body value set in POST ajax call
    public String saveOrder(@RequestBody Order order) {

        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "order");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Order save not completed : You don't have permission";
        }

        try {
            // set auto generate values
            // set added date time
            order.setRecordstatus_id(recordstatusDao.getReferenceById(1));
            order.setAdded_date(LocalDateTime.now());
            order.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            // set employee number
            String nextOrderNo = dao.getNextOrderNumber();
            if (nextOrderNo.equals(null) || nextOrderNo.equals("")) {
                order.setInvoiceno("00001");
            } else {
                order.setInvoiceno(nextOrderNo);
            }

            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (OrderHadProduct orhpro : order.getOrderhasproductsList()) {
                orhpro.setOrder_id(order);
            }

            dao.save(order);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }
    }

    @DeleteMapping
    public String deleteFunc(@RequestBody Order order) {
        // user authentication and authurization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try {
            // delete
            Order extOrder = dao.getReferenceById(order.getId());
            if (extOrder == null) {
                return "Delete not completed!";
            }

            // hard delete
            // dao.delete(employee;
            // EmployeeDao.delete(EmployeeDao.getReferenceById(employee.getId()));

            // soft delete

            // EmployeeStatus deleteStatus = employeeStatusDao.getReferenceById(3);

            extOrder.setDeletedatetime(LocalDateTime.now());
            extOrder.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            Recordstatus deleteStatus = recordstatusDao.getReferenceById(2);
            extOrder.setRecordstatus_id(deleteStatus);

            dao.save(extOrder);

            return "Ok";

        } catch (Exception e) {
            return "Delete not completed!" + e.getMessage();
        }

    }

    // create put mapping for update order
    @PutMapping
    public String updateOrder(@RequestBody Order order) {
        // authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        // check existing
        Order extOrder = dao.getReferenceById(order.getId());
        if (extOrder == null) {
            return "Update not completed : order does not exist..!";
        }

        // check duplicate

        try {
            order.setLastmodifydatetime(LocalDateTime.now());
            order.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());

            // mek dann isslla purchaceorder_id ek block krnonh infinity recursion ekk ena
            // nisa, ek block krlm tibila hariyann naa save krgnnd ek required nisa, itim me
            // widihata ek dala save krgnnd oni
            for (OrderHadProduct orhpro : order.getOrderhasproductsList()) {
                orhpro.setOrder_id(order);
            }
            
            dao.save(order);

            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }

}
