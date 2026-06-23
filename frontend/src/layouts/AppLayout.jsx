import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function AppLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="elitex-3d-bg min-h-screen w-full overflow-x-hidden text-white">
      <div className="elitex-3d-content min-h-screen">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="min-h-screen min-w-0 px-3 py-3 sm:px-4 md:px-6 lg:ml-80 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Topbar onMenuClick={() => setMobileOpen(true)} />

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="min-w-0"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}