import React, { useState, useEffect, useRef } from 'react'
import styles from './Navbar.module.css';
import Frame from '../assets/Frame.svg';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import CreateModal from '../modals/CreateModal';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [greetings, setGreetings] = useState("morning");
    const [greetIcon, setGreetIcon] = useState("🌤️");
    const [islogout, setIsLogout] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchRef = useRef(null);
    const handleSearchClick = () => {
        navigate("/links", { state: { focusSearch: true } }); 
        setTimeout(() => {
            if (searchRef.current) {
                searchRef.current.focus(); 
            }
        }, 1000);
    };
    const initials = (name) => {
        const words = name.split(" ");
        if (words.length === 1) {
          return words[0].slice(0, 2).toUpperCase();
        } else {
          return words
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        }
    };
    const date = new Date(Date.now());
    const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
    const handleLogout = () =>{
        localStorage.removeItem("token");
        toast.info("Logged Out Successfully!!!");
        navigate('/login');
    };
    const getuser = () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const data = jwtDecode(token);
            setUser(data);
            
            const hours = new Date().getHours();
            if (hours >= 0 && hours < 12) {
                setGreetings("morning");
                setGreetIcon("🌤️");
            } else if (hours >= 12 && hours < 17) {
                setGreetings("afternoon");
                setGreetIcon("🌞");
            } else {
                setGreetings("evening");
                setGreetIcon("🌃");
            }
          } catch (error) {
            console.log("Failed to decode token:", error);
          }
        }
    };

    useEffect(() => {
        getuser();
    }, []);

  return (
    <>
        <div className={styles.main}>
            <div className={styles.greet}>
                <div>
                    <span className={styles.sun}>{greetIcon}
                    </span>
                </div>
                <div className={styles.gm}>
                    <span>Good {greetings}, {user? user.name:""}</span>
                    <br/>
                    <span className={styles.fDate}>{formattedDate}</span>
                </div>
            </div>
            <div className={styles.searchdiv}>
                <div className={styles.createBtn}>
                    <button onClick={()=>setIsModalOpen(true)}><span className={styles.plusbtn}>+</span>Create new</button>
                </div>
                <div className={styles.search}>
                    <img src={Frame} alt='search icon' />
                    <input ref={searchRef} type='search' onClick={handleSearchClick} placeholder='Search by remarks'/>
                </div>
            </div>
            <div className={styles.logout}>
                <button onClick={()=>setIsLogout(!islogout)}>
                    {initials(user ? user.name:"")}
                </button>
            </div>
            {islogout && (
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            )}
        </div>
        {isModalOpen && <CreateModal onClose={()=>setIsModalOpen(false)}/>}
   </> 
  )
}

export default Navbar