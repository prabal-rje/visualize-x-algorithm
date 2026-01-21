import { ATTRIBUTION } from '../../data/attribution';
import styles from '../../styles/marquee.module.css';

export default function Marquee() {
  return (
    <div className={styles.container} data-testid="marquee">
      <div className={styles.content}>
        <a
          className={styles.link}
          data-testid="marquee-github"
          href={ATTRIBUTION.links.github}
          rel="noreferrer"
          target="_blank"
        >
          STAR THIS PROJECT ON GITHUB
        </a>
        <span className={styles.separator}>|</span>
        <a
          className={styles.link}
          data-testid="marquee-twitter"
          href={ATTRIBUTION.links.twitter}
          rel="noreferrer"
          target="_blank"
        >
          FOLLOW {ATTRIBUTION.creator.twitterHandle}
        </a>
      </div>
    </div>
  );
}
