// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column about">
          <h4>Hostly</h4>
          <p>
            Proporcionando elegância atemporal e hospitalidade inesquecível. Sua
            experiência de luxo começa aqui.
          </p>
        </div>

        <div className="footer-column links">
          <h4>Navegação</h4>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/rooms">Quartos</Link>
            </li>
            <li>
              <Link to="/about">Sobre Nós</Link>
            </li>
            <li>
              <Link to="/contact">Contato</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column contact">
          <h4>Contato</h4>
          <p>
            Av. Atlântica, 1702
            <br />
            Rio de Janeiro, RJ, Brasil
          </p>
          <p>
            Email: <a href="mailto:contato@hostly.com">contato@hostly.com</a>
          </p>
          <p>Telefone: (21) 99999-8888</p>
        </div>

        <div className="footer-column social">
          <h4>Siga-nos</h4>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Hostly. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
