import React from "react";
import { NavLink } from "react-router-dom";
import { Search, Bell, ChevronRight, CircleUser } from "lucide-react";
import logo from "../assets/taiwanLogo.png";

const Header: React.FC = () => {
  const nav = [
    { to: "/", label: "Home", end: true },
    { to: "/vote", label: "Vote" },
    { to: "/form", label: "Form" },
    { to: "/video", label: "Video" },
    { to: "/visa", label: "Visa" },
    // { to: '/lottery', label: 'Lottery' },
  ];

  return (
    <header className="header header--primary">
      <div className="header__inner">
        <img
          className="header__brand"
          src={logo}
          alt="Taiwan Portal"
          width={223}
          height={53}
        />

        <nav className="header__nav" aria-label="Primary">
          <ul className="header__list">
            {nav.map((item, idx) => (
              <li key={item.to} className="header__item">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `header__link${isActive ? " header__link--active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>

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
