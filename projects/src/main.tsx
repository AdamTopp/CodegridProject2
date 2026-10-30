import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProjectTwo from './projects/project2-cube/projectTwoReact.tsx';
import ProjectThree from './projects/project3-cutout/projectThree2.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ProjectOne /> */}
    {/* <ProjectTwo /> */}
    <ProjectThree />
  </StrictMode>,
)
