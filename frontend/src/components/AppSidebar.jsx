import { Flame, LayoutDashboard, List, BarChart2, Github, Car } from 'lucide-react'
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

import { useQuery } from '@tanstack/react-query'
import { fetchLastUpdate } from '@/api/operations'

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Interventi', url: '/operations', icon: List },
  { title: 'Grafici', url: '/charts', icon: BarChart2 },
  { title: 'Personale', url: '/staff', icon: Github },
  { title: 'Mezzi', url: '/vehicles', icon: Car },
]

export default function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const { data: lastUpdate } = useQuery({
    queryKey: ['last-update'],
    queryFn: fetchLastUpdate,
  })

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
        <div className="group-data-[collapsible=icon]:hidden space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Update: {lastUpdate?.last_update ?? '—'}</span>
            <span>v1.4.0</span>
          </div>

          <a
            href="https://github.com/jacopx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github size={12} />
            github.com/jacopx
          </a>

          <p className="pt-1">© {new Date().getFullYear()} Jacopx</p>
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}