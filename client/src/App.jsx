import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Login from './component/Login'
import { Provider } from 'react-redux'
import store from './store'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home'
import FileUploadForm from './component/FileUplode'
import FileUploadButton from './component/FileUploadButton'
import ImageRetrive from './component/ImageRetrive'
import FileTransferComponent from './component/FileTransfer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/transfer' element={ <FileTransferComponent/>}/>
        </Routes>
        {/* <FileUploadForm/> */}
        {/* <FileUploadButton/> */}
        {/* <ImageRetrive/> */}
        {/* <Login/> */}
        {/* <FileTransferComponent/> */}
      </Provider>

    </>
  )
}

export default App
