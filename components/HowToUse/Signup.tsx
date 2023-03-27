import { useState } from 'react'
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from '../../styles/videos.module.css'

export default function Signup(){
  const [height, setHeight] = useState<number>(0)

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    const { width } = event.target.getSize();
    setHeight(width / 4 * 3)
    event.target.playVideo();
  }

  const opts: YouTubeProps['opts'] = {
    height: `${height}`,
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <YouTube videoId="63KCrIxdTbA" opts={opts} onReady={onPlayerReady} />
      </div>
    </div>
  )
}
