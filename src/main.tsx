import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Disk from './Disk.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Disk radius={500}/>
  </StrictMode>,
)
