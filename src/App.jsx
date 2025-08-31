import Login from "./components/Profile Related/Login"
import Body from "./components/Body"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Profile from "./components/Profile Related/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import ErrorPage from "./components/ErrorPage"
import Connections from "./components/Connection Related/Connections.jsx"
import Requests from "./components/Connection Related/Requests"
import Chat from "./components/Chat.jsx"



function App() {

  return (
    <div className="min-h-screen bg-gray-900">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
            </Route>
            <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for 404 */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  )
}
export default App