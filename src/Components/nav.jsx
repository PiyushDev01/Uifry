import { useContext, useEffect, useState } from "react";
import Button from "./button";
import "./nav.css";
import logo from "../assets/logo.webp";
import googleIcon from "../assets/google.svg";
import facebookIcon from "../assets/facebook.svg";
import signout from "../assets/signout.png";
import { motion } from "framer-motion";
import { fadeIn } from "../Framer/fadein";
import Login from "./Login";
import LoginGoogle from "../Firebase/googleAuth";
import { IoMdCart } from "react-icons/io";
import { signOut, getAuth } from "firebase/auth";
import app from "../Firebase/firbase";
import { HiOutlineLogout } from "react-icons/hi";
import { pending } from "./Login";
import { Link } from "react-router-dom";
import UserContext from "../Context/UserContex";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "../Firebase/CURDfunc/read";
import toast, { Toaster } from 'react-hot-toast';
import { getOrders } from "../Firebase/CURDfunc/read";
import Detailcontext from "../Pages/Orders/OrderformSection/DetailContext/Detailcontext";
import { or } from "firebase/firestore";



const auth = getAuth(app);

export default function Nav() {
  const [toggle, settoggle] = useState(false);
  const [box, setbox] = useState({ width: 0 });
  const [textbox, settextbox] = useState({ display: "none" });
  const [fadebg, setfadebg] = useState({ display: "none" });
  const [hide, sethide] = useState(false);
  const [droplogout, setdroplogout] = useState(false);

  const [loading, setLoading] = useState(true);
  const {setOrderArray, orderArray } = useContext(Detailcontext);

  const handleMouseOver = () => setdroplogout(true);
    const handleMouseOut = () => setdroplogout(false);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      hide && sethide(false);
    }
    // console.log(user);
    async function check() {
      if (user) {
        const check = await checkAdmin(user.uid);
        setcheckadmin(check);
      }
    }
    check();
  }, [user]);







  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(user.uid);
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrderArray(sortedData);
        localStorage.setItem('orders', JSON.stringify(sortedData)); // Save orders
        setLoading(false);
      } catch (e) {
        console.log("Error: " + e);
        setLoading(false);
      }
    };
  
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrderArray(JSON.parse(savedOrders)); // Load orders from storage
      // console.log(orderArray);
    } else {
      fetchOrders();
    }
  }, [user]);
  






  const handleTog = () => {
    if (!toggle) {
      settoggle(true);
      setbox({ width: "60%" });
      settextbox({ display: "flex" });
      setfadebg({ display: "flex" });
      document.getElementById("checkbox").checked = true;
    } else {
      settoggle(false);
      setbox({ width: 0 });
      settextbox({ display: "none" });
      setfadebg({ display: "none" });
      document.getElementById("checkbox").checked = false;
    }
  };

  const togglelgn = () => {
    sethide(!hide);
    // console.log(hide);
  };

  const SignOut = () => {
    signOut(auth);
    navigate("/");
    window.location.reload();
  };

  const notavail=()=>{
    toast.error(' This feature is under development', {
      position: 'bottom-center',
    } )
  }

  const { isUserlogged, uDetails } = useContext(UserContext);
  const [checkadmin, setcheckadmin] = useState(false);

  return (
    <>
      <nav className=" flex fles-row h-fit w-screen p-3 md:px-40 md:p-0 justify-between md:bg-none bg-white/25 backdrop-blur-sm  items-center fixed md:shadow-lg shadow-md rounded-b-3xl md:rounded-none z-20">
        <div className=" flex items-center gap-2">
          <a href="/">
            <img src={logo} className=" md:w-28  w-24" alt="" />
          </a>
          {checkadmin && (
            <p
              onClick={() => navigate("/admin")}
              className=" cursor-pointer hover:text-indigo-500 border-l-[1px] px-2 border-slate-500 "
            >
              Admin
            </p>
          )}
        </div>
        <div
          className=" p-3 px-10 shadow-sm rounded-full hidden md:block bg-white/30 backdrop-blur-lg"
          id="blurnav"
        >
          <ul className="flex flex-row gap-10 font-sans transition-all text-xl">
            <Link to="/">
              {" "}
              <li id="li">Home</li>
            </Link>
           
            <Link to="/aboutus">
              {" "}
              <li id="li">About</li>
            </Link>
            <a href="https://wa.me/+916392802689">
              {" "}
              <li id="li">Contact</li>
            </a>
          </ul>
        </div>
        
    <div className=" flex items-center gap-4" >
    <Link to="/order">
              {" "}
              <button id="exbtn" className=" md:flex items-center gap-1 hidden hover:text-slate-100 px-4 py-2 rounded-full text-white "><IoMdCart />
              Order</button>
            </Link>
        <div
          className=" flex flex-row relative items-center  gap-5 py-3 "
          onClick={() => {
            !isUserlogged && togglelgn();
          }}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
         

          {uDetails.image != null ? (
            <div className="profile relative ">
              <img
                src={uDetails.image}
                alt="user"
                className="md:w-16 md:p-2 w-10 h-10 md:h-16 md:block hidden"
                style={{ borderRadius: "100px" }}
              />
            </div>
          ) : (
            <Button name="Login" display="none"></Button>
          )}



          <div
            className={`absolute md:flex hidden items-center justify-center -left-[50%] top-[100%] w-fit ${
              !droplogout ? "max-h-0" : "max-h-40"
            } transition-all duration-200 px-4 overflow-hidden min-w-[6rem] rounded-b-2xl drop-shadow-lg bg-slate-200`}
          >
            {isUserlogged && (
              <h1
                className=" m-4 cursor-pointer hover:text-indigo-600 text-slate-700 transition-all text-md hidden md:flex items-center gap-2"
                id="lgh1"
                onClick={SignOut}
              >
                <HiOutlineLogout /> Logout
              </h1>
            )}
          </div>
        </div>
    </div>


  {/* mobile view */}
        
        <div
          style={fadebg}
          onClick={handleTog}
          className=" gap-5 pb-28 flex flex-col justify-end items-center w-full h-screen  absolute top-0 left-0 md:none "
          id="fadebg"
        >
          
        </div>

        <div className="block md:hidden" onClick={handleTog}>
          {isUserlogged ? (
            <img
              src={uDetails.image}
              className="md:w-16 rounded-full m-2 w-10 h-10 md:h-16 md:hidden block"
            />
          ) : (
            <div className="hamburger">
              <input id="checkbox" className="checkbox" type="checkbox" />
              <svg fill="none" viewBox="0 0 50 50" height="40" width="40">
                <path
                  className="lineTop line"
                  strokeLinecap="round"
                  strokeWidth="4"
                  stroke="black"
                  d="M6 11L44 11"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeWidth="4"
                  stroke="black"
                  d="M6 24H43"
                  className="lineMid line"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeWidth="4"
                  stroke="black"
                  d="M6 37H43"
                  className="lineBottom line"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <div
          style={box}
          className=" h-fit absolute right-0 top-20 md:hidden justify-center py-8 rounded-l-xl flex flex-col items-center gap-3 overflow-hidden z-20"
          id="mobblurnav"
        >
          <ul
            style={{ textbox }}
            className="flex flex-col gap-6  transition-all text-slate-200 text-lg overflow-hidden"
            onClick={handleTog}
          >
            <Link to="/">
              {" "}
              <li id="li">Home</li>
            </Link>
            <Link to="/order">
              {" "}
              <li id="li">Order</li>
            </Link>
            <Link to="/aboutus">
              {" "}
              <li id="li">About</li>
            </Link>
            <a href="https://wa.me/+916392802689">
              {" "}
              <li id="li">Contact</li>
            </a>
          </ul>
          <motion.h1
            variants={fadeIn("no", 0.05)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className=" text-zinc-300 text-center mt-16 "
          >
            {isUserlogged ? "Sign out" : "Login or Sign Up"} <br />{" "}
            {isUserlogged ? "" : "with"}
          </motion.h1>

          {isUserlogged ? (
            <motion.div
              onClick={SignOut}
              variants={fadeIn("no", 0.05)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
            >
              <img src={signout} className=" w-8" />
            </motion.div>
          ) : (
            <div className=" flex flex-row gap-8">
              <a
                onClick={() => {
                  LoginGoogle(handleTog);
                }}
              >
                {" "}
                <motion.div
                  variants={fadeIn("up", 0.07)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.3 }}
                  className=" p-2 w-14 h-14 backdrop-blur-sm bg-white/20 rounded-lg shadow-lg"
                >
                  <img src={googleIcon} alt="" />
                </motion.div>
              </a>

              <a onClick={notavail}>
                <motion.div
                  variants={fadeIn("up", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.3 }}
                  className=" p-2 w-14 h-14 backdrop-blur-sm bg-white/20 rounded-lg shadow-lg "
                >
                  <img src={facebookIcon} alt="" />
                </motion.div>
              </a>
             
            </div>
          )}
        </div>

        {hide && <Login handlelgn={togglelgn} />}
      </nav>
      <Toaster />
    </>
  );
}
