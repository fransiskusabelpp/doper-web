const APP_ID = "df02c6b4fd1b47a8bb14e29d75a5ea48"
const TOKEN = "007eJxTYLjPtr+ma8YKp8e+TF0dm/SCalZuPPHA6ue7eIZ9O04ueSauwJCSZmCUbJZkkpZimGRinmiRlGRokmpkmWJummiammhiYbfzSXJDICMD54rfzIwMEAjiszKk5BekFjEwAAAq+CLC"
const CHANNEL = "doper"

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    
    client.on('user-left', handleUserLeft)
    
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`

    let grid = `<div id="button-wrapper">
    <div class="flex-container">
        <table>
            <tr>
                <th><button class="nav-btn">1</button></th>
                <th><button class="nav-btn">2</button></th>
                <th><button class="nav-btn">3</button></th>
                <th><button class="nav-btn">4</button></th>
                <th><button class="nav-btn">5</button></th>
            </tr>
            <tr>
                <th><button class="nav-btn">6</button></th>
                <th><button class="nav-btn">7</button></th>
                <th><button class="nav-btn">8</button></th>
                <th><button class="nav-btn">9</button></th>
                <th><button class="nav-btn">10</button></th>
              </tr>
              <tr>
                <th><button class="nav-btn">11</button></th>
                <th><button class="nav-btn">12</button></th>
                <th><button class="nav-btn">13</button></th>
                <th><button class="nav-btn">14</button></th>
                <th><button class="nav-btn">15</button></th>
              </tr>
              <tr>
                <th><button class="nav-btn">16</button></th>
                <th><button class="nav-btn">17</button></th>
                <th><button class="nav-btn">18</button></th>
                <th><button class="nav-btn">19</button></th>
                <th><button class="nav-btn">20</button></th>
              </tr>
              <tr>
                <th><button class="nav-btn">21</button></th>
                <th><button class="nav-btn">22</button></th>
                <th><button class="nav-btn">23</button></th>
                <th><button class="nav-btn">24</button></th>
                <th><button class="nav-btn">25</button></th>
              </tr>
          </table>
      </div>
</div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', grid)

    localTracks[1].play(`user-${UID}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
    document.getElementById('button-wrapper').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
    document.getElementById('button-wrapper').style.display = 'none'
}

let toggleMic = async (e) => {
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)