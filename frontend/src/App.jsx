import { Routes, Route } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Operations from './pages/Operations'
import Charts from './pages/Charts'

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
        </Routes>
      </main>
    </SidebarProvider>
  )
}