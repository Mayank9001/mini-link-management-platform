import React, { useEffect, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import { getAllLinks } from "../services/link.services";
import { jwtDecode } from "jwt-decode";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiCaretUpDown } from "react-icons/pi";
import { MdEdit } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCopy } from "react-icons/rx";
import styles from "./Links.module.css";
import Frame from "../assets/Frame.svg";
import CreateModal from "../modals/CreateModal";
import EditModal from "../modals/EditModal";
import DeleteModal from "../modals/DeleteModal";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
const URL = import.meta.env.VITE_BACKEND_URL + "/visit/";

const Links = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [greetings, setGreetings] = useState("morning");
  const [greetIcon, setGreetIcon] = useState("🌤️");
  const [islogout, setIsLogout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [allLinks, setAllLinks] = useState([]);
  const [linkId, setLinkId] = useState(null);
  const [sortIndex, setSortIndex] = useState(-1);
  const [status, setStatus] = useState("Active");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const searchRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const location = useLocation();
  useEffect(() => {
    if (location.state?.focusSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [location]);
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
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
  const handleLogout = () => {
    localStorage.removeItem("token");
    // console.log("Logged Out Successfully!!!");
    toast.info("Logged Out Successfully!!!");
    navigate("/login");
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
  const isActive = {
    dashboard: false,
    links: true,
    analytics: false,
    settings: false,
  };
  const getLinks = async () => {
    setLoading(true);
    const res = await getAllLinks();
    const data = await res.json();
    setAllLinks(data.links);
    setLoading(false);
  };
  useEffect(() => {
    getLinks();
  }, [isEditModalOpen, isDeleteModalOpen]);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleCopyLink = (index) => {
    if (!allLinks || !allLinks[index]) {
      console.error("Invalid link ID:", index);
      return;
    }
    navigator.clipboard
      .writeText(URL + allLinks[index].shortLink)
      .then(() => {
        console.log(`Copied: ${allLinks[index].shortLink}`);
        toast("Link Copied", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      })
      .catch((err) => console.error("Failed to copy:", err));
  };
  const handleDateSorting = () => {
    setAllLinks(
      sortIndex === 1
        ? [...allLinks].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
          })
        : [...allLinks].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          })
    );
  };
  const handleStatusSorting = () => {
    setAllLinks(
      [...allLinks].sort((a, b) => {
        return status === "Inactive"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      })
    );
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = allLinks.slice(startIndex, startIndex + itemsPerPage);
  const getPaginationNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage, "...", totalPages];
      }
    }
  };
  return (
    <>
      <div className={styles.main}>
        <div className={styles.greet}>
          <div>
            <span className={styles.sun}>{greetIcon}</span>
          </div>
          <div className={styles.gm}>
            <span>
              Good {greetings}, {user ? user.name : ""}
            </span>
            <br />
            <span className={styles.fDate}>{formattedDate}</span>
          </div>
        </div>
        <div className={styles.searchdiv}>
          <div className={styles.createBtn}>
            <button onClick={() => setIsModalOpen(true)}>
              <span className={styles.plusbtn}>+</span>
              <p>Create new</p>
            </button>
          </div>
          <div className={styles.search}>
            <img src={Frame} alt="search icon" />
            <input
              ref={searchRef}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="search"
              placeholder="Search by remarks"
            />
          </div>
        </div>
        <div className={styles.logout}>
          <button onClick={() => setIsLogout(!islogout)}>
            {initials(user ? user.name : "")}
          </button>
        </div>
        {islogout && (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <SideBar
        isDashboard={isActive.dashboard}
        isSettings={isActive.settings}
        isLinks={isActive.links}
        isAnalytics={isActive.analytics}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.content}>
          <div className={styles.tablecontainer}>
            <table
              className={styles.linkstable}
              style={{ borderRight: "none" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      display: "flex",
                      height: "5vh",
                      gap: "5vw",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Date{" "}
                    <PiCaretUpDown
                      onClick={() => {
                        setSortIndex((prev) => -1 * prev);
                        handleDateSorting();
                      }}
                    />
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Remarks</th>
                  <th>Clicks</th>
                  <th
                    style={{
                      display: "flex",
                      gap: "1vw",
                      justifyContent: "center",
                      paddingTop: "2.7vh",
                    }}
                  >
                    Status
                    <PiCaretUpDown
                      onClick={() => {
                        setStatus(
                          status === "Inactive" ? "Active" : "Inactive"
                        );
                        handleStatusSorting();
                      }}
                    />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLinks.length > 0 ? (
                  paginatedLinks
                    .filter((link) => {
                      return (
                        search.toLowerCase() === "" ||
                        link.remarks.toLowerCase().includes(search) ||
                        link.originalLink.toLowerCase().includes(search)
                      );
                    })
                    .map((link, index) => (
                      <tr key={link._id} className={styles.tablerow}>
                        <td
                          style={{
                            width: "10vw",
                            maxWidth: "10vw",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {formatDate(link.createdAt)}
                        </td>
                        <td
                          style={{
                            width: "10vw",
                          }}
                        >
                          <span
                            style={
                              isMobile
                                ? {
                                    maxWidth: "15vw",
                                  }
                                : {
                                    display: "block",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "clip",
                                    maxWidth: "10vw",
                                  }
                            }
                          >
                            {link.originalLink}
                          </span>
                        </td>
                        <td
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            widht: "10vw",
                            paddingRight: "0",
                          }}
                        >
                          <span
                            style={{
                              width: "10vw",
                              maxWidth: "8vw",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {URL}
                            {link.shortLink}
                          </span>
                          <span
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                              marginRight: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "5px",
                              overflow: "hidden",
                              position: "relative",
                              cursor: "pointer",
                            }}
                          >
                            <RxCopy
                              size={20}
                              onClick={() => handleCopyLink(startIndex + index)}
                            />
                          </span>
                        </td>
                        <td style={{ width: "7vw" }}>{link.remarks}</td>
                        <td style={{ textAlign: "center" }}>{link.clicks}</td>
                        <td
                          style={{
                            color:
                              link.status === "Active" ? "#1EB036" : "#B0901E",
                          }}
                        >
                          {link.status}
                        </td>
                        <td
                          className={styles.actions}
                          style={{ borderBottom: "none", borderRight: "none" }}
                        >
                          <MdEdit
                            className={styles.editicon}
                            size={20}
                            onClick={() => {
                              setLinkId(link._id);
                              setIsEditModalOpen(true);
                            }}
                          />
                          <RiDeleteBin6Line
                            className={styles.deleteicon}
                            size={20}
                            onClick={() => {
                              setLinkId(link._id);
                              setIsDeleteModalOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr className={styles.tablerow2}>
                    <td
                      style={{
                        border: "none",
                      }}
                    >
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 ? (
            <div className={styles.footer}>
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
                {getPaginationNumbers().map((num, index) => (
                  <button
                    key={index}
                    className={`${styles.pageButton} ${
                      num === currentPage ? styles.activePage : ""
                    }`}
                    onClick={() =>
                      typeof num === "number" && setCurrentPage(num)
                    }
                    disabled={num === "..."}
                  >
                    {num}
                  </button>
                ))}

                <button
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.footer}>
              <div className={styles.pagination}>
                <button className={styles.pageButton} disabled>
                  {"<"}
                </button>
                <button className={`${styles.pageButton} ${styles.activePage}`}>
                  {1}
                </button>
                <button className={styles.pageButton} disabled>
                  {">"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {isDeleteModalOpen && (
        <DeleteModal id={linkId} onClose={() => setIsDeleteModalOpen(false)} />
      )}
      {isEditModalOpen && (
        <EditModal id={linkId} onClose={() => setIsEditModalOpen(false)} />
      )}
      {isModalOpen && <CreateModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Links;
