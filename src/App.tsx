import BackendStatus from './components/BackendStatus'
import StyleGuide from './components/StyleGuide'
import './App.css'

export default function App() {
  return (
    <>
      <StyleGuide />
      <div className="app__status">
        <BackendStatus />
      </div>
    </>
  )
}
