import { useState } from 'react'
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from '../../styles/videos.module.css'

export default function Order(){
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
      <YouTube videoId="IFZUwVl-DQA" opts={opts} onReady={onPlayerReady} />
    </div>
  )
}
