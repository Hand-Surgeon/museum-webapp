import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            국립중앙박물관
          </Link>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">홈</Link></li>
              <li><Link to="/gallery">소장품</Link></li>
              <li><a href="#about">관람안내</a></li>
              <li><a href="#exhibitions">전시</a></li>
              <li><a href="#programs">교육</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header