import { Routes, Route } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Operations from './pages/Operations'
import Charts from './pages/Charts'
import Staff from './pages/Staff'
import Vehicles from './pages/Vehicles'

export default function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <SidebarTrigger />
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/operations"  element={<Operations />} />
          <Route path="/charts"      element={<Charts />} />
          <Route path="/staff"      element={<Staff />} />
          <Route path="/vehicles"    element={<Vehicles />} />
        </Routes>
      </main>
    </SidebarProvider>
  )
}