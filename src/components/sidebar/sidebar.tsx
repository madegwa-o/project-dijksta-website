// components/sidebar/sidebar.tsx
import styles from './sidebar.module.css';
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <h3>Available Homes</h3>
                <ul>
                    <li>
                        <Link to="/homes/popular" className={styles.navLink}>Popular</Link>
                    </li>
                    <li>
                        <Link to="/homes/all" className={styles.navLink}>All</Link>
                    </li>
                    <li>
                        <Link to="/homes/new" className={styles.navLink}>New</Link>
                    </li>
                </ul>
            </div>
            <div className={styles.section}>
                <h3>Maps</h3>
                <ul>
                    <li>
                        <Link to="/maps/directions" className={styles.navLink}>Directions</Link>
                    </li>
                    <li>
                        <Link to="/maps/plots" className={styles.navLink}>Plots</Link>
                    </li>
                    <li>
                        <Link to="/maps/roads" className={styles.navLink}>Roads</Link>
                    </li>
                </ul>
            </div>
            <div className={styles.section}>
                <h3>Account</h3>
                <ul>
                    <li>
                        <Link to="/profile" className={styles.navLink}>Profile</Link>
                    </li>
                    <li>
                        <Link to="/cash" className={styles.navLink}>My cash</Link>
                    </li>
                    <li>
                        <Link to="/settings" className={styles.navLink}>Settings</Link>
                    </li>
                    <li>
                        <Link to="/login" className={styles.navLink}>Login/out</Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}