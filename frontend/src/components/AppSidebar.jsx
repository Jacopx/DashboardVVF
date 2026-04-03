import { Flame, LayoutDashboard, List, BarChart2, Github } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'

const items = [
  { title: 'Dashboard',  url: '/',            icon: LayoutDashboard },
  { title: 'Operations', url: '/operations',  icon: List },
  { title: 'Charts',     url: '/charts',      icon: BarChart2 },
]

export default function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <Flame className="text-red-500 shrink-0" size={24} />
        <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">VVF Dashboard</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    onClick={() => navigate(item.url)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="group-data-[collapsible=icon]:hidden space-y-1">
          <a href="https://github.com/jacopx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Github size={12} />
            github.com/jacopx
          </a>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Jacopx</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}