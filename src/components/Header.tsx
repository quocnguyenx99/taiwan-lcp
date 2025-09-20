import React, { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import logo from "../assets/taiwanLogo.png";

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLanding = [
    { href: "/", label: "Trang chủ" },
    { href: "vote", label: "Bình chọn" },
    { href: "terms", label: "Thể lệ" },
    { href: "video", label: "Video" },
    { href: "/visa", label: "Visa" },
    { href: "/rewards", label: "Kết quả" },
  ];

  const navVisa = [
    { href: "/", label: "Trang chủ" },
    { href: "/visa", label: "Visa" },
    { href: "/rewards", label: "Kết quả" },
  ];

  const nav = location.pathname === "/" ? navLanding : navVisa;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
                    className={({ isActive }) =>
                      `header__link ${isActive ? "header__link--active" : ""}`
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <Link
                    to={item.href}
                    smooth={true}
                    duration={500}
                    className="header__link"
                    onClick={closeMenu}
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

        <button
          className="header__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Background overlay */}
      {isMenuOpen && (
        <div className="header__overlay" onClick={closeMenu}></div>
      )}

      {/* Mobile menu overlay */}
      <div className={`header__menu-overlay ${isMenuOpen ? "open" : ""}`}>
        <button
          className="header__menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <nav className="header__menu-nav" aria-label="Mobile">
          <ul className="header__menu-list">
            {nav.map((item) => (
              <li key={item.href} className="header__menu-item">
                {item.href.startsWith("/") ? (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `header__menu-link ${isActive ? "header__menu-link--active" : ""}`
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <Link
                    to={item.href}
                    smooth={true}
                    duration={500}
                    className="header__menu-link"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;