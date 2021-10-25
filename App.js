import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { Input, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function App() {
  // const classes = style();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //when the user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else {
        //when the user has logged out 
        setUser(null);
      }
    })

    return () => {
      //performing some cleanup before running the whole code
      unsubscribe();
    }

  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time a new post is added, this part of code gets executed
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false)
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        {/* <div id="modal-modal-title" variant="h6" component="h2">
          <h2>I am a Modal</h2>
        </div> */}
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <center>
              <img
                className="app__headerImage"
                src="	https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className="app__signup">
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>SignUp</Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        {/* <div id="modal-modal-title" variant="h6" component="h2">
          <h2>I am a Modal</h2>
        </div> */}
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <center>
              <img
                className="app__headerImage"
                src="	https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className="app__signup">
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>SignIn</Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="	https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
            <Button onClick={() => setOpen(true)}> Sign Up </Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="appPosts__right">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username}
                caption={post.caption} imageUrl={post.imageUrl}>
              </Post>
            ))
          }
        </div>
        <div className="appPosts__left">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>



      </div>

      {/* <InstagramEmbed
        className="floating"
        url="https://instagr.am/p/CAX8psZMEdL_Lkto_rA_8oIhfVE1IJNLUobpkc0/"
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => { }}
        onSuccess={() => { }}
        onAfterRender={() => { }}
        onFailure={() => { }}
      /> */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Please login to upload or comment 🔥🔥</h3>
      )}

    </div>
  );
}

export default App;
