import React, { lazy, useState, useEffect } from 'react';
import './App.scss';
import bandcamp from 'bandcamp-scraper';

const OtherComponent = lazy(() => import('./OtherComponent'));

const brands = {
  SPOTIFY: 'spotify',
  APPLE: 'apple',
  AMAZON: 'amazon'
}

const sanitizeFromAmazonUrl = ['albums','playlists','artist','song']

const cleanAmazonUrl = (string) => {
  sanitizeFromAmazonUrl.forEach((itemToSanitize) => {
    string = string.replace(itemToSanitize, '')
  })
  return string
}

function App() {

  const [url, setUrl] = useState(null)
  const [brand, setBrand] = useState(null)

  const saveSpotifyUrl = (e) => {
    const unformedUrl = e.target.value
    if (!unformedUrl.includes('https://open.spotify.com/')) {
      return console.error(`Please supply an ${brands.SPOTIFY} url.`)
    }
    const domain = unformedUrl.slice(0,25)
    const remainder = unformedUrl.slice(25)
    const formedUrl = `${domain}embed/${remainder}`
    setUrl(formedUrl)

  }

  const saveAppleUrl = (e) => {
    const unformedUrl = e.target.value
    if (!unformedUrl.includes('https://music.apple.com/')) {
      return console.error(`Please supply an ${brands.APPLE} url.`)
    }
    const domain = unformedUrl.slice(0,8)
    const remainder = unformedUrl.slice(8)
    const formedUrl = `${domain}embed.${remainder}`
    setUrl(formedUrl)

  }

  const saveAmazonUrl = (e) => {
    const domainRef = 'https://music.amazon.com/'
    const unformedUrl = e.target.value
    if (!unformedUrl.includes(domainRef)) {
      return console.error(`Please supply an ${brands.AMAZON} url.`)
    }
    const remainder = cleanAmazonUrl(unformedUrl.slice(domainRef.length))
    let remainders
    if (remainder.includes('?')) {
      remainders = remainder.split('?') 
      remainders.pop()// get rid of querystring
    } else {
      remainders = [remainder]
    }
    
    let idsUrlArray = remainders[0].split('/') // get all identifiers
    idsUrlArray.shift() // get rid of '/'

    const trimmedUrl = idsUrlArray[0]
    const formedUrl = `${domainRef}embed/${trimmedUrl}`
    console.log(formedUrl)
    setUrl(formedUrl)
  }

  // const saveBandcampUrl = (e) => {
  //   const unformedUrl = e.target.value
  //   bandcamp.getAlbumInfo(unformedUrl, function(error, albumInfo) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log(albumInfo);
  //       const formedUrl = `https://bandcamp.com/EmbeddedPlayer/album=594604747/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`
  //       setUrl(formedUrl)
  //     }
  //   });
    
  // }

  const createLinksButtons = () => {
    if (!url) {
      return null
    } else {
      return (
        <button target="_blank" onClick={() => {window.location.href = url}}>
          Open on {brands[brand]}
        </button>
      )  
    }
  }

  const reset = () => {
    setBrand(null)
    setUrl(null)
  }

  const createBrandSpecificView = () => {
    let iframe = null
    let onChange = () => {}
    let imgSrc =''
    if (brand === 'AMAZON') {
      iframe = (<iframe id='AmazonMusicEmbedB00B7TZNXW' src={url} width='100%' height='550px' style={{border:'1px solid rgba(0, 0, 0, 0.12)'}}></iframe>)
      onChange = saveAmazonUrl
      imgSrc = "./images/amazon.png"
    }
    if (brand === 'APPLE') {
      iframe = (<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style={{width: '100%', maxWidth: '660px', overflow: 'hidden', background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src={url}></iframe>)
      onChange = saveAppleUrl
      imgSrc = "./images/apple.png"
    }
    if (brand === 'SPOTIFY') {
      iframe = (<iframe className="player" src={url} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>)
      onChange = saveSpotifyUrl
      imgSrc = "./images/spotify-green.png"
    }
    // if (brand === 'BANDCAMP') {
    //   iframe = (<iframe style="border: 0; width: 350px; height: 786px;" src={url} seamless></iframe>)
    //   onChange = saveBandcampUrl
    //   imgSrc = "./images/bandcamp.png"
    // }
    return (
      <div className="container">
        <div className="grid-item left">
          <p>My Music Section on My Website</p>
          {url && iframe}
          {!url && <div className="dummy-player"> 
              <p className="dummy-player-text">Your Music Player Here</p>
            </div>
          }
          { createLinksButtons() }  
        </div>
        <div className="grid-item right">
          <img src="./images/back.png" onClick={()=>{reset()}} className="back-button"/>
          <img className="grid-item-stack logo" src={imgSrc} />
          <p>Create your {brand.toLowerCase()} music player.</p>
          <form>
            <p className="secondary-text">Paste a link to your {brand.toLowerCase()} artist, song, album, or playlist page</p>
            <input className="w3-input" onChange={onChange} />
          </form>
        </div>
      </div>
    );
  }

  if (brand) {
    return createBrandSpecificView()
  } 

  return (
      <div className="container">
        <div className="grid-item left">
          <p>My Music Section on My Website</p>
          <div className="dummy-player"> 
            <p className="dummy-player-text">Your Music Player Here</p>
          </div>
        </div>
        <div className="grid-item right">
          <div className="select-logos">
            <img className="grid-item-stack logo" src="./images/spotify-green.png" onClick={() => {setBrand("SPOTIFY")}}/>
            <img className="grid-item-stack logo" src="./images/apple.png" onClick={() => {setBrand("APPLE")}} />
            <img className="grid-item-stack logo" src="./images/amazon.png" onClick={() => {setBrand("AMAZON")}} />
          </div>
          <p className="select-prompt">Select The Type of Player You Want To Create</p>
        </div>
      </div>
    )
  
}

export default App;


/*

REFERENCE 

//apple link generator
//https://tools.applemusic.com/en-us/details/1470770165?country=us&media=all&term=mowgli+on+the+wind&type=album

//spotify link generator
//https://developer.spotify.com/documentation/widgets/generate/play-button/

//amazon link generator
//(in amazon, share music, embed)

MISCELLEANEOUS

<iframe src="https://open.spotify.com/embed/playlist/0u92xsoT9AVNlVwpAhvw4Q" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

//https://open.spotify.com/embed/playlist/0u92xsoT9AVNlVwpAhvw4Q
//https://open.spotify.com/playlist/0u92xsoT9AVNlVwpAhvw4Q

//https://music.amazon.com/albums/B00B7TZNXW?ref=dm_sh_e33d-cdf6-dmcp-0a0d-99712&musicTerritory=US&marketplaceId=ATVPDKIKX0DER
//https://music.amazon.com/embed/B00B7TZNXW/

<iframe id='AmazonMusicEmbedB00B7TZNXW' src='https://music.amazon.com/embed/B00B7TZNXW/?id=83KNJBNuB5&marketplaceId=ATVPDKIKX0DER&musicTerritory=US' width='100%' height='550px' style='border:1px solid rgba(0, 0, 0, 0.12);max-width:'></iframe>

<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/on-the-wind-single/1470770165?app=music"></iframe>

<iframe style="border: 0; width: 350px; height: 786px;" src="https://bandcamp.com/EmbeddedPlayer/album=594604747/size=large/bgcol=ffffff/linkcol=0687f5/transparent=true/" seamless><a href="http://stashwyslouch.bandcamp.com/album/stash">Stash! by Stash Wyslouch</a></iframe>

*/