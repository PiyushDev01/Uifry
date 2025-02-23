import { useState } from 'react';
import Leftcontent from './Leftcontent';
import Rightcontect from './Rightcontect';
import {getAllOrders, getAllUsers} from './Firebase_admin/read.js';
import { Dashcontext } from './contex/DashContext.jsx'; 
import { useContext, useEffect } from 'react';
import loader from "../assets/loader.json";
import Lottie from "lottie-react";
import {checkAdmin} from '../Firebase/CURDfunc/read.js';
import UserContext from '../Context/UserContex.js';
import { useNavigate } from 'react-router';
import './style.css';

function AdminDash() {
  const { refresh, settotalorder, setAdminOrders, setAdminUsers,setAdminPayments, setTotaluser, setTotalpays, setTotalrevnue} = useContext(Dashcontext);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    
    // console.log(user);
    async function check() {
      if (user) {
        const check = await checkAdmin(user.uid);
        if (!check) {
          navigate("/");
        }
      }else
      {
        navigate("/");
      }
    }
    check();
  }, [user]);
  

  // FIXME: quick status description should be added

 
  // TODO: ADD USER DETAILS SECTION


  useEffect(() => {
 
    const fetchData = async () => {
      setLoading(true);
      const orders = await getAllOrders();
      const users = await getAllUsers();
      setAdminOrders(orders);
      // console.log(orders)
      settotalorder(orders.length);
      setAdminUsers(users);
      setTotaluser(users.length);

      const allpays = [];

      let totalamt = 0;

      orders.map((transaction) => {
        if (transaction.payment==='PAID') {
          allpays.push(transaction);
        }
      });
      for (let i = 0; i < allpays.length; i++) {
        totalamt += allpays[i].price + allpays[i].shipping;
      }
      setAdminPayments(allpays);
      setTotalpays(allpays.length);
      setTotalrevnue(totalamt);
      setLoading(false);
    };
    fetchData();
  }, [refresh]);



  return (
    <div className="containerz  min-h-[100vh] h-fit  flex items-center justify-center bg-slate-50">
      <div className="leftaside   h-[100%] pt-[6rem] px-4 w-[20%] hidden md:flex justify-center">
        <Leftcontent />
      </div>
      <h1 className=" md:hidden">OPEN ON DESKTOP MODE</h1>
      <div className="rightaside  pt-[6rem] hidden px-4 w-full md:flex items-center justify-center ">
        {loading ? (
          //   <Lottie
          //   animationData={loader}
          //   style={{ width: "45px", height: "30px" }}
          //   className=" scale-[500%] "
          // />

          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        ) : (
          <Rightcontect />
        )}
      </div>
    </div>
  );
}

export default AdminDash