import React from "react";
import { Search, Bell, ChevronRight, CircleUser } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import logo from "../assets/taiwanLogo.png";

const Header: React.FC = () => {
  const location = useLocation();

  const navLanding = [
    { href: "/", label: "Home" },
    { href: "vote", label: "Vote" },
    { href: "form", label: "Form" },
    { href: "video", label: "Video" },
    { href: "/visa", label: "Visa" },
  ];

  const navVisa = [
    { href: "/", label: "Home" },
    { href: "/visa", label: "Visa" },
  ];

  const nav = location.pathname === "/" ? navLanding : navVisa;

  return (
    <header className="header header--primary">
      <div className="header__inner">
        <NavLink to="/" className="header__brand-link">
          <img
            className="header__brand"
            src={logo}
            alt="Taiwan Portal"
            width={223}
            height={53}
          />
        </NavLink>

        <nav className="header__nav" aria-label="Primary">
          <ul className="header__list">
            {nav.map((item, idx) => (
              <li key={item.href} className="header__item">
                {item.href.startsWith("/") ? (
                  <NavLink 
                    to={item.href} 
                    className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <Link 
                    to={item.href} 
                    smooth={true} 
                    duration={500} 
                    className="header__link"
                  >
                    {item.label}
                  </Link>
                )}

                {idx < nav.length - 1 && (
                  <ChevronRight
                    className="header__divider"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button className="header__icon-btn" aria-label="Search">
            <Search size={24} />
          </button>
          <button className="header__icon-btn" aria-label="Notifications">
            <Bell size={24} />
          </button>
          <button className="header__icon-btn" aria-label="Account">
            <CircleUser size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
